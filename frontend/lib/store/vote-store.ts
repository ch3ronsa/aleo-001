'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type VoteChoice = 'for' | 'against' | 'abstain'

export interface Vote {
    id: string
    proposalId: string
    voter: string
    choice: VoteChoice
    votingPower: number
    timestamp: number
    // ZK proof hash - in production this would be a real proof
    proofHash: string
    // Vote receipt - proves participation without revealing choice
    receiptHash: string
}

export interface VoteReceipt {
    receiptHash: string
    proposalId: string
    voter: string
    timestamp: number
    // This is public and verifiable
    verified: boolean
}

interface VoteState {
    votes: Vote[]
    receipts: VoteReceipt[]
    isLoading: boolean
    isGeneratingProof: boolean

    // Actions
    castVote: (proposalId: string, voter: string, choice: VoteChoice, votingPower: number) => Promise<Vote>
    hasVoted: (proposalId: string, voter: string) => boolean
    getVoteReceipt: (proposalId: string, voter: string) => VoteReceipt | undefined
    getUserVotes: (voter: string) => Vote[]
    getProposalVotes: (proposalId: string) => Vote[]
}

const generateHash = () => {
    const chars = '0123456789abcdef'
    return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const generateId = () => Math.random().toString(36).substring(2, 15)

// Simulate ZK proof generation delay
const simulateProofGeneration = () => new Promise<void>((resolve) => setTimeout(resolve, 2000))

export const useVoteStore = create<VoteState>()(
    persist(
        (set, get) => ({
            votes: [],
            receipts: [],
            isLoading: false,
            isGeneratingProof: false,

            castVote: async (proposalId, voter, choice, votingPower) => {
                // Set loading state
                set({ isGeneratingProof: true })

                // Simulate ZK proof generation (takes time in real implementation)
                await simulateProofGeneration()

                const vote: Vote = {
                    id: `vote_${generateId()}`,
                    proposalId,
                    voter,
                    choice,
                    votingPower,
                    timestamp: Date.now(),
                    proofHash: generateHash(),
                    receiptHash: generateHash(),
                }

                const receipt: VoteReceipt = {
                    receiptHash: vote.receiptHash,
                    proposalId,
                    voter,
                    timestamp: vote.timestamp,
                    verified: true,
                }

                set((state) => ({
                    votes: [...state.votes, vote],
                    receipts: [...state.receipts, receipt],
                    isGeneratingProof: false,
                }))

                return vote
            },

            hasVoted: (proposalId, voter) => {
                return get().votes.some((v) => v.proposalId === proposalId && v.voter === voter)
            },

            getVoteReceipt: (proposalId, voter) => {
                return get().receipts.find((r) => r.proposalId === proposalId && r.voter === voter)
            },

            getUserVotes: (voter) => {
                return get().votes.filter((v) => v.voter === voter)
            },

            getProposalVotes: (proposalId) => {
                return get().votes.filter((v) => v.proposalId === proposalId)
            },
        }),
        {
            name: 'aleodao-votes',
            partialize: (state) => ({ votes: state.votes, receipts: state.receipts }),
        }
    )
)
