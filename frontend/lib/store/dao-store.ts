'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { fetchDAO, fetchMemberCount } from '../aleo/dao-service'
import { storeDAOMetadata, getDAOMetadata, getAllDAOMetadata, getKnownDAOIds, registerKnownDAOId } from '../aleo/metadata-store'
import { buildCreateDAOTx, buildRegisterMemberTx } from '../aleo/transaction-builder'

export interface DAO {
    id: string
    name: string
    description: string
    creator: string
    memberCount: number
    proposalCount: number
    votingPeriod: number
    quorumPercentage: number
    createdAt: number
    // On-chain status
    isOnChain: boolean
}

export interface Member {
    address: string
    daoId: string
    votingPower: number
    joinedAt: number
}

interface DAOState {
    daos: DAO[]
    members: Member[]
    isLoading: boolean

    // Actions
    createDAO: (dao: Omit<DAO, 'id' | 'createdAt' | 'memberCount' | 'proposalCount' | 'isOnChain'>) => DAO
    getDAO: (id: string) => DAO | undefined
    joinDAO: (daoId: string, address: string, votingPower: number) => void
    getDAOMembers: (daoId: string) => Member[]
    getUserDAOs: (address: string) => DAO[]
    // New: blockchain integration
    buildCreateDAOTransaction: (nameHash: string, votingPeriod: number, quorum: number, proposalThreshold: number) => ReturnType<typeof buildCreateDAOTx>
    buildJoinDAOTransaction: (daoId: string, votingPower: number) => ReturnType<typeof buildRegisterMemberTx>
    refreshDAOFromChain: (daoId: string) => Promise<void>
    loadDAOs: () => Promise<void>
}

const generateId = () => Math.random().toString(36).substring(2, 15)

// Seed DAOs shown before any on-chain data is available
const SEED_DAOS: DAO[] = [
    {
        id: 'dao_001',
        name: 'Aleo Privacy Guild',
        description: 'A community focused on privacy-preserving technologies and zero-knowledge applications on Aleo.',
        creator: 'aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc',
        memberCount: 128,
        proposalCount: 5,
        votingPeriod: 7,
        quorumPercentage: 51,
        createdAt: Date.now() - 86400000 * 30,
        isOnChain: false,
    },
    {
        id: 'dao_002',
        name: 'ZK Developers Collective',
        description: 'Building the future of private computation. Join us to collaborate on cutting-edge ZK research.',
        creator: 'aleo1yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy3s7v2vh',
        memberCount: 64,
        proposalCount: 3,
        votingPeriod: 5,
        quorumPercentage: 60,
        createdAt: Date.now() - 86400000 * 14,
        isOnChain: false,
    },
]

export const useDAOStore = create<DAOState>()(
    persist(
        (set, get) => ({
            daos: SEED_DAOS,
            members: [],
            isLoading: false,

            createDAO: (daoData) => {
                const newDAO: DAO = {
                    ...daoData,
                    id: `dao_${generateId()}`,
                    memberCount: 1,
                    proposalCount: 0,
                    createdAt: Date.now(),
                    isOnChain: false,
                }

                // Store metadata for future chain lookups
                storeDAOMetadata({
                    daoId: newDAO.id,
                    name: daoData.name,
                    description: daoData.description,
                    nameHash: newDAO.id,
                    createdAt: newDAO.createdAt,
                })

                set((state) => ({
                    daos: [...state.daos, newDAO],
                    members: [
                        ...state.members,
                        {
                            address: daoData.creator,
                            daoId: newDAO.id,
                            votingPower: 100,
                            joinedAt: Date.now(),
                        },
                    ],
                }))

                return newDAO
            },

            getDAO: (id) => {
                return get().daos.find((dao) => dao.id === id)
            },

            joinDAO: (daoId, address, votingPower) => {
                set((state) => ({
                    members: [
                        ...state.members,
                        {
                            address,
                            daoId,
                            votingPower,
                            joinedAt: Date.now(),
                        },
                    ],
                    daos: state.daos.map((dao) =>
                        dao.id === daoId ? { ...dao, memberCount: dao.memberCount + 1 } : dao
                    ),
                }))
            },

            getDAOMembers: (daoId) => {
                return get().members.filter((m) => m.daoId === daoId)
            },

            getUserDAOs: (address) => {
                const memberDAOIds = get().members
                    .filter((m) => m.address === address)
                    .map((m) => m.daoId)
                return get().daos.filter((dao) => memberDAOIds.includes(dao.id))
            },

            // Build transaction for wallet submission
            buildCreateDAOTransaction: (nameHash, votingPeriod, quorum, proposalThreshold) => {
                return buildCreateDAOTx(nameHash, votingPeriod, quorum, proposalThreshold)
            },

            buildJoinDAOTransaction: (daoId, votingPower) => {
                return buildRegisterMemberTx(daoId, votingPower)
            },

            // Refresh DAO data from chain
            refreshDAOFromChain: async (daoId: string) => {
                try {
                    const [onChainDAO, memberCount] = await Promise.all([
                        fetchDAO(daoId),
                        fetchMemberCount(daoId),
                    ])

                    if (onChainDAO) {
                        const metadata = getDAOMetadata(daoId)
                        set((state) => ({
                            daos: state.daos.map((dao) =>
                                dao.id === daoId
                                    ? {
                                        ...dao,
                                        creator: onChainDAO.creator,
                                        votingPeriod: onChainDAO.votingPeriod,
                                        quorumPercentage: onChainDAO.quorum / 100,
                                        memberCount: memberCount,
                                        isOnChain: true,
                                        name: metadata?.name || dao.name,
                                        description: metadata?.description || dao.description,
                                    }
                                    : dao
                            ),
                        }))
                    }
                } catch (error) {
                    console.warn('Failed to refresh DAO from chain:', error)
                }
            },

            // Load all known DAOs
            loadDAOs: async () => {
                set({ isLoading: true })
                try {
                    const knownIds = getKnownDAOIds()
                    for (const daoId of knownIds) {
                        await get().refreshDAOFromChain(daoId)
                    }
                } catch (error) {
                    console.warn('Failed to load DAOs:', error)
                } finally {
                    set({ isLoading: false })
                }
            },
        }),
        {
            name: 'aleodao-storage',
            partialize: (state) => ({ daos: state.daos, members: state.members }),
        }
    )
)
