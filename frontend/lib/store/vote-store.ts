'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { buildCastVoteTx } from '../aleo/transaction-builder'
import { PROGRAMS } from '../aleo/config'

export type VoteChoice = 'for' | 'against' | 'abstain'

// Map frontend choice to contract u8 values
export const VOTE_CHOICE_MAP: Record<VoteChoice, number> = {
    'for': 0,
    'against': 1,
    'abstain': 2,
}

export interface Vote {
    id: string
    proposalId: string
    voter: string
    timestamp: number
    txId: string | null
    // NOTE: choice and votingPower are NOT stored to protect privacy
}

export interface VoteReceipt {
    receiptHash: string
    proposalId: string
    voter: string
    timestamp: number
    verified: boolean
    txId: string | null
}

interface VoteState {
    votes: Vote[]
    receipts: VoteReceipt[]
    isLoading: boolean
    isGeneratingProof: boolean
    pendingTxId: string | null

    // Actions
    castVote: (proposalId: string, voter: string, choice: VoteChoice, votingPower: number, txId?: string) => Promise<Vote>
    hasVoted: (proposalId: string, voter: string) => boolean
    getVoteReceipt: (proposalId: string, voter: string) => VoteReceipt | undefined
    getUserVotes: (voter: string) => Vote[]
    getProposalVotes: (proposalId: string) => Vote[]
    setPendingTx: (txId: string | null) => void
    buildVoteTransaction: (memberRecordPlaintext: string, proposalId: string, voteChoice: number) => ReturnType<typeof buildCastVoteTx>
    getMemberRecordProgram: () => string
}

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useVoteStore = create<VoteState>()(
    persist(
        (set, get) => ({
            votes: [],
            receipts: [],
            isLoading: false,
            isGeneratingProof: false,
            pendingTxId: null,

            castVote: async (proposalId, voter, _choice, _votingPower, txId) => {
                set({ isGeneratingProof: true })

                // PRIVACY: We do NOT store the vote choice or voting power
                const vote: Vote = {
                    id: `vote_${generateId()}`,
                    proposalId,
                    voter,
                    timestamp: Date.now(),
                    txId: txId || null,
                }

                const receipt: VoteReceipt = {
                    receiptHash: txId || `local_${generateId()}`,
                    proposalId,
                    voter,
                    timestamp: vote.timestamp,
                    verified: !!txId,
                    txId: txId || null,
                }

                set((state) => ({
                    votes: [...state.votes, vote],
                    receipts: [...state.receipts, receipt],
                    isGeneratingProof: false,
                    pendingTxId: null,
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

            setPendingTx: (txId) => {
                set({ pendingTxId: txId })
            },

            buildVoteTransaction: (memberRecordPlaintext, proposalId, voteChoice) => {
                return buildCastVoteTx(memberRecordPlaintext, proposalId, voteChoice)
            },

            getMemberRecordProgram: () => PROGRAMS.DAO_REGISTRY,
        }),
        {
            name: 'aleodao-votes',
            partialize: (state) => ({ votes: state.votes, receipts: state.receipts }),
        }
    )
)
