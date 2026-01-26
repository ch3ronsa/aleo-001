'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ProposalStatus = 'pending' | 'active' | 'passed' | 'rejected' | 'executed'

export interface Proposal {
    id: string
    daoId: string
    title: string
    description: string
    imageUrl?: string
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
}

interface ProposalState {
    proposals: Proposal[]
    isLoading: boolean

    // Actions
    createProposal: (proposal: Omit<Proposal, 'id' | 'createdAt' | 'status' | 'forVotes' | 'againstVotes' | 'abstainVotes' | 'totalVoters'>) => Proposal
    getProposal: (id: string) => Proposal | undefined
    getDAOProposals: (daoId: string) => Proposal[]
    getActiveProposals: () => Proposal[]
    updateProposalVotes: (proposalId: string, voteType: 'for' | 'against' | 'abstain', votingPower: number) => void
    updateProposalStatus: (proposalId: string, status: ProposalStatus) => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useProposalStore = create<ProposalState>()(
    persist(
        (set, get) => ({
            proposals: [
                // Sample proposals for demo
                {
                    id: 'prop_001',
                    daoId: 'dao_001',
                    title: 'Treasury Allocation for Developer Grants',
                    description: 'Allocate 10,000 tokens from the treasury to fund developer grants for privacy-preserving applications. This will help grow our ecosystem and attract new talent.',
                    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
                    proposer: 'aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc',
                    status: 'active',
                    forVotes: 75,
                    againstVotes: 20,
                    abstainVotes: 5,
                    totalVoters: 45,
                    quorumRequired: 51,
                    startTime: Date.now() - 86400000 * 2,
                    endTime: Date.now() + 86400000 * 5,
                    createdAt: Date.now() - 86400000 * 2,
                },
                {
                    id: 'prop_002',
                    daoId: 'dao_001',
                    title: 'Update Voting Period to 5 Days',
                    description: 'Reduce the default voting period from 7 days to 5 days to speed up governance decisions while maintaining sufficient time for member participation.',
                    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000',
                    proposer: 'aleo1yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy3s7v2vh',
                    status: 'active',
                    forVotes: 45,
                    againstVotes: 35,
                    abstainVotes: 10,
                    totalVoters: 32,
                    quorumRequired: 51,
                    startTime: Date.now() - 86400000,
                    endTime: Date.now() + 86400000 * 6,
                    createdAt: Date.now() - 86400000,
                },
                {
                    id: 'prop_003',
                    daoId: 'dao_002',
                    title: 'Community Ambassador Program',
                    description: 'Launch a community ambassador program to increase awareness of ZK technology. Budget: 5,000 tokens for rewards and marketing.',
                    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1000',
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
                },
            ],
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
                }

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
                            updates.abstainVotes = p.abstainVotes + votingPower
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
        }),
        {
            name: 'aleodao-proposals',
            partialize: (state) => ({ proposals: state.proposals }),
        }
    )
)
