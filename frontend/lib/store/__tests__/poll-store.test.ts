import { describe, it, expect, beforeEach } from 'vitest'
import { usePollStore } from '../poll-store'

describe('poll-store', () => {
    beforeEach(() => {
        usePollStore.setState({
            polls: [],
            votes: [],
        })
    })

    it('createPoll creates a new poll', () => {
        const { createPoll } = usePollStore.getState()
        const poll = createPoll({
            daoId: 'dao_001',
            title: 'Test Poll',
            description: 'A test poll',
            options: [
                { id: 'opt_1', text: 'Option A', votes: 0 },
                { id: 'opt_2', text: 'Option B', votes: 0 },
            ],
            creator: 'aleo1creator',
            deadline: Date.now() + 86400000,
            isActive: true,
            isPrivate: true,
        })

        expect(poll.title).toBe('Test Poll')
        expect(poll.totalVotes).toBe(0)
        expect(poll.options).toHaveLength(2)
    })

    it('castVote records voter without storing option (privacy)', async () => {
        const { createPoll, castVote } = usePollStore.getState()
        const poll = createPoll({
            daoId: 'dao_001',
            title: 'Privacy Test',
            description: 'Testing privacy',
            options: [
                { id: 'opt_1', text: 'A', votes: 0 },
                { id: 'opt_2', text: 'B', votes: 0 },
            ],
            creator: 'aleo1creator',
            deadline: Date.now() + 86400000,
            isActive: true,
            isPrivate: true,
        })

        await usePollStore.getState().castVote(poll.id, 'aleo1voter', 'opt_1', 1)

        const { votes } = usePollStore.getState()
        expect(votes).toHaveLength(1)
        expect(votes[0].voter).toBe('aleo1voter')
        // Privacy: vote should NOT contain optionId
        expect(votes[0]).not.toHaveProperty('optionId')
    })

    it('hasVoted detects double voting', async () => {
        const { createPoll, castVote } = usePollStore.getState()
        const poll = createPoll({
            daoId: 'dao_001',
            title: 'Double Vote Test',
            description: 'Test',
            options: [
                { id: 'opt_1', text: 'A', votes: 0 },
                { id: 'opt_2', text: 'B', votes: 0 },
            ],
            creator: 'aleo1creator',
            deadline: Date.now() + 86400000,
            isActive: true,
            isPrivate: true,
        })

        await usePollStore.getState().castVote(poll.id, 'aleo1voter', 'opt_1', 1)

        const { hasVoted } = usePollStore.getState()
        expect(hasVoted(poll.id, 'aleo1voter')).toBe(true)
        expect(hasVoted(poll.id, 'aleo1other')).toBe(false)
    })

    it('updatePollResults increments option votes', () => {
        const { createPoll, updatePollResults } = usePollStore.getState()
        const poll = createPoll({
            daoId: 'dao_001',
            title: 'Results Test',
            description: 'Test',
            options: [
                { id: 'opt_1', text: 'A', votes: 0 },
                { id: 'opt_2', text: 'B', votes: 0 },
            ],
            creator: 'aleo1creator',
            deadline: Date.now() + 86400000,
            isActive: true,
            isPrivate: true,
        })

        usePollStore.getState().updatePollResults(poll.id, 'opt_1', 5)

        const updated = usePollStore.getState().getPoll(poll.id)
        expect(updated!.totalVotes).toBe(5)
        expect(updated!.options[0].votes).toBe(5)
        expect(updated!.options[1].votes).toBe(0)
    })
})
