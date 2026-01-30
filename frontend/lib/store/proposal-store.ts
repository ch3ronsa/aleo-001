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
                // Sample proposals for demo - Privacy-focused examples
                {
                    id: 'prop_001',
                    daoId: 'dao_001',
                    title: 'Treasury Allocation for Developer Grants',
                    description: `Allocate 10,000 ALEO tokens from the DAO treasury to fund privacy-preserving application development grants.

**Privacy Protection:**
- Individual vote choices remain encrypted
- Treasury balance visible only to DAO members
- Grant recipient identities protected via ZK-proofs

This proposal demonstrates AleoDAO's "Anonymous Voting" feature where your ballot choice is encrypted locally and only a ZK-proof is submitted on-chain.`,
                    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
                    proposer: 'aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc',
                    status: 'active',
                    forVotes: 0, // Hidden during active voting
                    againstVotes: 0,
                    abstainVotes: 0,
                    totalVoters: 12, // Only total count visible
                    quorumRequired: 51,
                    startTime: Date.now() - 86400000 * 2,
                    endTime: Date.now() + 86400000 * 5,
                    createdAt: Date.now() - 86400000 * 2,
                },
                {
                    id: 'prop_002',
                    daoId: 'dao_001',
                    title: 'Confidential Governance Parameter Update',
                    description: `Reduce the default voting period from 7 days to 5 days to accelerate governance while maintaining privacy.

**Why Privacy Matters:**
- Prevents whale manipulation (large holders can't see current sentiment)
- Eliminates bandwagon voting (users vote based on conviction, not trends)
- Protects minority opinions from social pressure

This showcases how AleoDAO prevents "governance coercion" by hiding intermediate results.`,
                    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000',
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
                },
                {
                    id: 'prop_003',
                    daoId: 'dao_002',
                    title: 'Private Community Ambassador Program',
                    description: `Launch a ZK-powered community ambassador program with confidential reward distribution.

**Final Results (Voting Ended):**
This proposal has concluded and results are now public. During active voting, all vote choices were encrypted.

Budget: 5,000 ALEO tokens for privacy-preserving marketing initiatives.`,
                    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1000',
                    proposer: 'aleo1zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz45x7wl',
                    status: 'passed',
                    forVotes: 85, // Results revealed after voting ends
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
