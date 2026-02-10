import { describe, it, expect, beforeEach } from 'vitest'
import { useVoteStore, VOTE_CHOICE_MAP } from '../vote-store'

describe('vote-store', () => {
    beforeEach(() => {
        useVoteStore.setState({
            votes: [],
            receipts: [],
            isLoading: false,
            isGeneratingProof: false,
            pendingTxId: null,
        })
    })

    it('VOTE_CHOICE_MAP maps correctly', () => {
        expect(VOTE_CHOICE_MAP['for']).toBe(0)
        expect(VOTE_CHOICE_MAP['against']).toBe(1)
        expect(VOTE_CHOICE_MAP['abstain']).toBe(2)
    })

    it('castVote creates a vote record', async () => {
        const { castVote } = useVoteStore.getState()
        const vote = await castVote('prop_001', 'aleo1voter', 'for', 1)

        expect(vote.proposalId).toBe('prop_001')
        expect(vote.voter).toBe('aleo1voter')
        expect(vote.txId).toBeNull()
    })

    it('castVote does NOT store vote choice (privacy)', async () => {
        const { castVote } = useVoteStore.getState()
        const vote = await castVote('prop_001', 'aleo1voter', 'for', 100)

        // Vote record should NOT have a 'choice' or 'votingPower' property
        expect(vote).not.toHaveProperty('choice')
        expect(vote).not.toHaveProperty('votingPower')
    })

    it('hasVoted returns true after voting', async () => {
        const { castVote } = useVoteStore.getState()
        await castVote('prop_001', 'aleo1voter', 'for', 1)

        const { hasVoted } = useVoteStore.getState()
        expect(hasVoted('prop_001', 'aleo1voter')).toBe(true)
    })

    it('hasVoted returns false for unvoted proposal', () => {
        const { hasVoted } = useVoteStore.getState()
        expect(hasVoted('prop_999', 'aleo1voter')).toBe(false)
    })

    it('getProposalVotes returns all votes for a proposal', async () => {
        const { castVote } = useVoteStore.getState()
        await castVote('prop_001', 'aleo1a', 'for', 1)
        await castVote('prop_001', 'aleo1b', 'against', 1)
        await castVote('prop_002', 'aleo1c', 'for', 1)

        const { getProposalVotes } = useVoteStore.getState()
        expect(getProposalVotes('prop_001')).toHaveLength(2)
        expect(getProposalVotes('prop_002')).toHaveLength(1)
    })

    it('castVote stores txId when provided', async () => {
        const { castVote } = useVoteStore.getState()
        const vote = await castVote('prop_001', 'aleo1voter', 'for', 1, 'at1txhash123')

        expect(vote.txId).toBe('at1txhash123')
    })
})
