'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { fetchProposal, fetchVoteTally } from '../aleo/proposal-service'
import { fetchVoteTallies } from '../aleo/vote-service'
import { storeProposalMetadata, getProposalMetadata, getDAOProposalIds } from '../aleo/metadata-store'
import { buildCreateProposalTx } from '../aleo/transaction-builder'

export type ProposalStatus = 'pending' | 'active' | 'passed' | 'rejected' | 'executed'

export interface Proposal {
    id: string
    daoId: string
    title: string
    description: string
    proposer: string
    status: ProposalStatus
    forVotes: number
    againstVotes: number
    abstainVotes: number
    totalVoters: number
    quorumRequired: number
    startTime: number
    endTime: number
    createdAt: number
    isOnChain: boolean
}

interface ProposalState {
    proposals: Proposal[]
    isLoading: boolean

    // Actions
    createProposal: (proposal: Omit<Proposal, 'id' | 'createdAt' | 'status' | 'forVotes' | 'againstVotes' | 'abstainVotes' | 'totalVoters' | 'isOnChain'>) => Proposal
    getProposal: (id: string) => Proposal | undefined
    getDAOProposals: (daoId: string) => Proposal[]
    getActiveProposals: () => Proposal[]
    updateProposalVotes: (proposalId: string, voteType: 'for' | 'against' | 'abstain', votingPower: number) => void
    updateProposalStatus: (proposalId: string, status: ProposalStatus) => void
    buildCreateProposalTransaction: (daoId: string, titleHash: string, descHash: string, startDelay: number, duration: number) => ReturnType<typeof buildCreateProposalTx>
    refreshProposalFromChain: (proposalId: string) => Promise<void>
    loadProposals: (daoId: string) => Promise<void>
}

const generateId = () => Math.random().toString(36).substring(2, 15)

// Seed proposals for demonstration
const SEED_PROPOSALS: Proposal[] = [
    {
        id: 'prop_001',
        daoId: 'dao_001',
        title: 'Treasury Allocation for Developer Grants',
        description: 'Allocate 10,000 ALEO tokens from the DAO treasury to fund privacy-preserving application development grants. Individual vote choices remain encrypted via ZK-proofs.',
        proposer: 'aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc',
        status: 'active',
        forVotes: 0,
        againstVotes: 0,
        abstainVotes: 0,
        totalVoters: 12,
        quorumRequired: 51,
        startTime: Date.now() - 86400000 * 2,
        endTime: Date.now() + 86400000 * 5,
        createdAt: Date.now() - 86400000 * 2,
        isOnChain: false,
    },
    {
        id: 'prop_002',
        daoId: 'dao_001',
        title: 'Governance Parameter Update',
        description: 'Reduce the default voting period from 7 days to 5 days to accelerate governance while maintaining privacy. Prevents whale manipulation by hiding intermediate results.',
        proposer: 'aleo1yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy3s7v2vh',
        status: 'active',
        forVotes: 0,
        againstVotes: 0,
        abstainVotes: 0,
        totalVoters: 8,
        quorumRequired: 51,
        startTime: Date.now() - 86400000,
        endTime: Date.now() + 86400000 * 6,
        createdAt: Date.now() - 86400000,
        isOnChain: false,
    },
    {
        id: 'prop_003',
        daoId: 'dao_002',
        title: 'Community Ambassador Program',
        description: 'Launch a ZK-powered community ambassador program with confidential reward distribution. Budget: 5,000 ALEO tokens for privacy-preserving marketing initiatives.',
        proposer: 'aleo1zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz45x7wl',
        status: 'passed',
        forVotes: 85,
        againstVotes: 10,
        abstainVotes: 5,
        totalVoters: 50,
        quorumRequired: 60,
        startTime: Date.now() - 86400000 * 10,
        endTime: Date.now() - 86400000 * 3,
        createdAt: Date.now() - 86400000 * 10,
        isOnChain: false,
    },
]

export const useProposalStore = create<ProposalState>()(
    persist(
        (set, get) => ({
            proposals: SEED_PROPOSALS,
            isLoading: false,

            createProposal: (proposalData) => {
                const newProposal: Proposal = {
                    ...proposalData,
                    id: `prop_${generateId()}`,
                    status: 'active',
                    forVotes: 0,
                    againstVotes: 0,
                    abstainVotes: 0,
                    totalVoters: 0,
                    createdAt: Date.now(),
                    isOnChain: false,
                }

                // Store metadata for future chain lookups
                storeProposalMetadata({
                    proposalId: newProposal.id,
                    daoId: proposalData.daoId,
                    title: proposalData.title,
                    description: proposalData.description,
                    titleHash: newProposal.id,
                    createdAt: newProposal.createdAt,
                })

                set((state) => ({
                    proposals: [...state.proposals, newProposal],
                }))

                return newProposal
            },

            getProposal: (id) => {
                return get().proposals.find((p) => p.id === id)
            },

            getDAOProposals: (daoId) => {
                return get().proposals.filter((p) => p.daoId === daoId)
            },

            getActiveProposals: () => {
                return get().proposals.filter((p) => p.status === 'active')
            },

            updateProposalVotes: (proposalId, voteType, votingPower) => {
                set((state) => ({
                    proposals: state.proposals.map((p) => {
                        if (p.id !== proposalId) return p

                        const updates: Partial<Proposal> = {
                            totalVoters: p.totalVoters + 1,
                        }

                        if (voteType === 'for') {
                            updates.forVotes = p.forVotes + votingPower
                        } else if (voteType === 'against') {
                            updates.againstVotes = p.againstVotes + votingPower
                        } else {
                            updates.abstainVotes = (p.abstainVotes || 0) + votingPower
                        }

                        return { ...p, ...updates }
                    }),
                }))
            },

            updateProposalStatus: (proposalId, status) => {
                set((state) => ({
                    proposals: state.proposals.map((p) =>
                        p.id === proposalId ? { ...p, status } : p
                    ),
                }))
            },

            buildCreateProposalTransaction: (daoId, titleHash, descHash, startDelay, duration) => {
                return buildCreateProposalTx(daoId, titleHash, descHash, startDelay, duration)
            },

            refreshProposalFromChain: async (proposalId: string) => {
                try {
                    const [onChainProposal, tallies] = await Promise.all([
                        fetchProposal(proposalId),
                        fetchVoteTallies(proposalId),
                    ])

                    if (onChainProposal) {
                        const metadata = getProposalMetadata(proposalId)
                        set((state) => ({
                            proposals: state.proposals.map((p) =>
                                p.id === proposalId
                                    ? {
                                        ...p,
                                        proposer: onChainProposal.creator,
                                        forVotes: tallies.yesVotes,
                                        againstVotes: tallies.noVotes,
                                        totalVoters: tallies.totalVoters,
                                        isOnChain: true,
                                        title: metadata?.title || p.title,
                                        description: metadata?.description || p.description,
                                    }
                                    : p
                            ),
                        }))
                    }
                } catch (error) {
                    console.warn('Failed to refresh proposal from chain:', error)
                }
            },

            loadProposals: async (daoId: string) => {
                set({ isLoading: true })
                try {
                    const knownIds = getDAOProposalIds(daoId)
                    for (const proposalId of knownIds) {
                        await get().refreshProposalFromChain(proposalId)
                    }
                } catch (error) {
                    console.warn('Failed to load proposals:', error)
                } finally {
                    set({ isLoading: false })
                }
            },
        }),
        {
            name: 'aleodao-proposals',
            partialize: (state) => ({ proposals: state.proposals }),
        }
    )
)
