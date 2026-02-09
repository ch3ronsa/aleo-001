'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
}

export type PollVote = {
    pollId: string
    voter: string
    optionId: string
    votingPower: number
    timestamp: number
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
    getUserVote: (pollId: string, voterAddress: string) => PollVote | undefined

    // Actions
    createPoll: (poll: Omit<Poll, 'id' | 'createdAt' | 'totalVotes'>) => Poll
    castVote: (pollId: string, voterAddress: string, optionId: string, votingPower: number) => Promise<void>
    updatePollResults: (pollId: string, optionId: string, votingPower: number) => void
}

// Demo polls
const DEMO_POLLS: Poll[] = [
    {
        id: 'poll_1',
        daoId: 'dao_001',
        title: 'Which feature should we prioritize next?',
        description: 'Help us decide the next major feature for our DAO platform. Your vote is private and will not reveal your token holdings.',
        options: [
            { id: 'opt_1', text: 'Mobile App', votes: 450 },
            { id: 'opt_2', text: 'Advanced Analytics Dashboard', votes: 320 },
            { id: 'opt_3', text: 'Multi-sig Treasury', votes: 180 },
            { id: 'opt_4', text: 'NFT Governance', votes: 95 },
        ],
        creator: 'aleo1...',
        createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
        deadline: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days from now
        totalVotes: 1045,
        isActive: true,
        isPrivate: true,
    },
    {
        id: 'poll_2',
        daoId: 'dao_002',
        title: 'Community Event Preference',
        description: 'Vote on the type of community event you\'d like to attend. All votes are anonymous.',
        options: [
            { id: 'opt_5', text: 'Virtual Hackathon', votes: 280 },
            { id: 'opt_6', text: 'In-Person Meetup', votes: 195 },
            { id: 'opt_7', text: 'AMA Session', votes: 140 },
        ],
        creator: 'aleo1...',
        createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
        deadline: Date.now() + 3 * 24 * 60 * 60 * 1000,
        totalVotes: 615,
        isActive: true,
        isPrivate: true,
    },
    {
        id: 'poll_3',
        daoId: 'dao_001',
        title: 'Brand Color Scheme',
        description: 'Choose the new color scheme for our DAO\'s branding materials.',
        options: [
            { id: 'opt_8', text: 'Blue & Purple', votes: 520 },
            { id: 'opt_9', text: 'Green & Teal', votes: 380 },
            { id: 'opt_10', text: 'Orange & Red', votes: 145 },
        ],
        creator: 'aleo1...',
        createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
        deadline: Date.now() - 1 * 24 * 60 * 60 * 1000, // Ended 1 day ago
        totalVotes: 1045,
        isActive: false,
        isPrivate: true,
    },
]

export const usePollStore = create<PollStore>()(
    persist(
        (set, get) => ({
            polls: DEMO_POLLS,
            votes: [],

            getPolls: () => get().polls,

            getPoll: (id: string) => get().polls.find(p => p.id === id),

            getPollsByDAO: (daoId: string) => get().polls.filter(p => p.daoId === daoId),

            getActivePolls: () => get().polls.filter(p => p.isActive && p.deadline > Date.now()),

            hasVoted: (pollId: string, voterAddress: string) => {
                return get().votes.some(v => v.pollId === pollId && v.voter === voterAddress)
            },

            getUserVote: (pollId: string, voterAddress: string) => {
                return get().votes.find(v => v.pollId === pollId && v.voter === voterAddress)
            },

            createPoll: (pollData) => {
                const newPoll: Poll = {
                    ...pollData,
                    id: `poll_${Date.now()}`,
                    createdAt: Date.now(),
                    totalVotes: 0,
                }

                set(state => ({
                    polls: [newPoll, ...state.polls]
                }))

                return newPoll
            },

            castVote: async (pollId: string, voterAddress: string, optionId: string, votingPower: number) => {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500))

                const vote: PollVote = {
                    pollId,
                    voter: voterAddress,
                    optionId,
                    votingPower,
                    timestamp: Date.now(),
                }

                set(state => ({
                    votes: [...state.votes, vote]
                }))

                // Update poll results
                get().updatePollResults(pollId, optionId, votingPower)
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
        }),
        {
            name: 'poll-storage',
        }
    )
)
