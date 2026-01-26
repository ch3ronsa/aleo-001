'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DAO {
    id: string
    name: string
    description: string
    creator: string
    memberCount: number
    proposalCount: number
    treasuryBalance: number
    votingPeriod: number
    quorumPercentage: number
    createdAt: number
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
    createDAO: (dao: Omit<DAO, 'id' | 'createdAt' | 'memberCount' | 'proposalCount' | 'treasuryBalance'>) => DAO
    getDAO: (id: string) => DAO | undefined
    joinDAO: (daoId: string, address: string, votingPower: number) => void
    getDAOMembers: (daoId: string) => Member[]
    getUserDAOs: (address: string) => DAO[]
}

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useDAOStore = create<DAOState>()(
    persist(
        (set, get) => ({
            daos: [
                // Sample DAOs for demo
                {
                    id: 'dao_001',
                    name: 'Aleo Privacy Guild',
                    description: 'A community focused on privacy-preserving technologies and zero-knowledge applications on Aleo.',
                    creator: 'aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc',
                    memberCount: 128,
                    proposalCount: 5,
                    treasuryBalance: 50000,
                    votingPeriod: 7,
                    quorumPercentage: 51,
                    createdAt: Date.now() - 86400000 * 30, // 30 days ago
                },
                {
                    id: 'dao_002',
                    name: 'ZK Developers Collective',
                    description: 'Building the future of private computation. Join us to collaborate on cutting-edge ZK research.',
                    creator: 'aleo1yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy3s7v2vh',
                    memberCount: 64,
                    proposalCount: 3,
                    treasuryBalance: 25000,
                    votingPeriod: 5,
                    quorumPercentage: 60,
                    createdAt: Date.now() - 86400000 * 14, // 14 days ago
                },
            ],
            members: [],
            isLoading: false,

            createDAO: (daoData) => {
                const newDAO: DAO = {
                    ...daoData,
                    id: `dao_${generateId()}`,
                    memberCount: 1, // Creator is first member
                    proposalCount: 0,
                    treasuryBalance: 0,
                    createdAt: Date.now(),
                }

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
        }),
        {
            name: 'aleodao-storage',
            partialize: (state) => ({ daos: state.daos, members: state.members }),
        }
    )
)
