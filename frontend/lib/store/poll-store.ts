'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { buildCreatePollTx, buildCastPollVoteTx, hashStringToField } from '../aleo/transaction-builder'
import { PROGRAMS } from '../aleo/config'

export type PollOption = {
    id: string
    text: string
    votes: number
}

export type Poll = {
    id: string
    daoId: string
    title: string
    description: string
    options: PollOption[]
    creator: string
    createdAt: number
    deadline: number
    totalVotes: number
    isActive: boolean
    isPrivate: boolean
    txId: string | null
}

export type PollVote = {
    pollId: string
    voter: string
    timestamp: number
    txId: string | null
    // NOTE: optionId and votingPower NOT stored to protect privacy
}

interface PollStore {
    polls: Poll[]
    votes: PollVote[]

    // Getters
    getPolls: () => Poll[]
    getPoll: (id: string) => Poll | undefined
    getPollsByDAO: (daoId: string) => Poll[]
    getActivePolls: () => Poll[]
    hasVoted: (pollId: string, voterAddress: string) => boolean

    // Actions
    createPoll: (poll: Omit<Poll, 'id' | 'createdAt' | 'totalVotes' | 'txId'>, txId?: string) => Poll
    castVote: (pollId: string, voterAddress: string, optionId: string, votingPower: number, txId?: string) => Promise<void>
    updatePollResults: (pollId: string, optionId: string, votingPower: number) => void

    // Transaction builders
    buildCreatePollTransaction: (daoId: string, title: string, optionCount: number, deadlineDays: number, isPrivate: boolean) => ReturnType<typeof buildCreatePollTx>
    buildCastPollVoteTransaction: (memberRecordPlaintext: string, pollId: string, selectedOption: number) => ReturnType<typeof buildCastPollVoteTx>
    getPollProgram: () => string
}

// Seed polls for demonstration
const SEED_POLLS: Poll[] = [
    {
        id: 'poll_1',
        daoId: 'dao_001',
        title: 'Which feature should we prioritize next?',
        description: 'Help us decide the next major feature for our DAO platform. Your vote is private and encrypted with ZK-proofs.',
        options: [
            { id: 'opt_1', text: 'Mobile App', votes: 0 },
            { id: 'opt_2', text: 'Advanced Analytics Dashboard', votes: 0 },
            { id: 'opt_3', text: 'Multi-sig Treasury', votes: 0 },
            { id: 'opt_4', text: 'NFT Governance', votes: 0 },
        ],
        creator: 'aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc',
        createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
        deadline: Date.now() + 5 * 24 * 60 * 60 * 1000,
        totalVotes: 0,
        isActive: true,
        isPrivate: true,
        txId: null,
    },
    {
        id: 'poll_2',
        daoId: 'dao_002',
        title: 'Community Event Preference',
        description: 'Vote on the type of community event you\'d like to attend. All votes are anonymous via ZK-proofs.',
        options: [
            { id: 'opt_5', text: 'Virtual Hackathon', votes: 0 },
            { id: 'opt_6', text: 'In-Person Meetup', votes: 0 },
            { id: 'opt_7', text: 'AMA Session', votes: 0 },
        ],
        creator: 'aleo1yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy3s7v2vh',
        createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
        deadline: Date.now() + 3 * 24 * 60 * 60 * 1000,
        totalVotes: 0,
        isActive: true,
        isPrivate: true,
        txId: null,
    },
]

export const usePollStore = create<PollStore>()(
    persist(
        (set, get) => ({
            polls: SEED_POLLS,
            votes: [],

            getPolls: () => get().polls,

            getPoll: (id: string) => get().polls.find(p => p.id === id),

            getPollsByDAO: (daoId: string) => get().polls.filter(p => p.daoId === daoId),

            getActivePolls: () => get().polls.filter(p => p.isActive && p.deadline > Date.now()),

            hasVoted: (pollId: string, voterAddress: string) => {
                return get().votes.some(v => v.pollId === pollId && v.voter === voterAddress)
            },

            createPoll: (pollData, txId) => {
                const newPoll: Poll = {
                    ...pollData,
                    id: `poll_${Date.now()}`,
                    createdAt: Date.now(),
                    totalVotes: 0,
                    txId: txId || null,
                }

                set(state => ({
                    polls: [newPoll, ...state.polls]
                }))

                return newPoll
            },

            castVote: async (pollId: string, voterAddress: string, _optionId: string, votingPower: number, txId?: string) => {
                // PRIVACY: We do NOT store the optionId to protect vote choice
                const vote: PollVote = {
                    pollId,
                    voter: voterAddress,
                    timestamp: Date.now(),
                    txId: txId || null,
                }

                set(state => ({
                    votes: [...state.votes, vote]
                }))

                // Update local poll results for UI feedback
                get().updatePollResults(pollId, _optionId, votingPower)
            },

            updatePollResults: (pollId: string, optionId: string, votingPower: number) => {
                set(state => ({
                    polls: state.polls.map(poll => {
                        if (poll.id !== pollId) return poll
                        return {
                            ...poll,
                            totalVotes: poll.totalVotes + votingPower,
                            options: poll.options.map(opt =>
                                opt.id === optionId
                                    ? { ...opt, votes: opt.votes + votingPower }
                                    : opt
                            )
                        }
                    })
                }))
            },

            buildCreatePollTransaction: (daoId, title, optionCount, deadlineDays, isPrivate) => {
                const titleHash = hashStringToField(title)
                const deadlineBlocks = deadlineDays * 14400 // ~14400 blocks per day
                return buildCreatePollTx(daoId, titleHash, optionCount, deadlineBlocks, isPrivate)
            },

            buildCastPollVoteTransaction: (memberRecordPlaintext, pollId, selectedOption) => {
                return buildCastPollVoteTx(memberRecordPlaintext, pollId, selectedOption)
            },

            getPollProgram: () => PROGRAMS.PRIVATE_POLL,
        }),
        {
            name: 'poll-storage',
            partialize: (state) => ({ polls: state.polls, votes: state.votes }),
        }
    )
)
