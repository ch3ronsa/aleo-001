import { describe, it, expect, beforeEach } from 'vitest'
import { useDAOStore } from '../dao-store'

describe('dao-store', () => {
    beforeEach(() => {
        // Reset store to initial state
        useDAOStore.setState({
            daos: [],
            members: [],
            isLoading: false,
        })
    })

    it('creates a DAO and returns it', () => {
        const { createDAO } = useDAOStore.getState()
        const dao = createDAO({
            name: 'Test DAO',
            description: 'A test DAO',
            creator: 'aleo1test',
            votingPeriod: 7,
            quorumPercentage: 51,
        })

        expect(dao.name).toBe('Test DAO')
        expect(dao.memberCount).toBe(1)
        expect(dao.proposalCount).toBe(0)
        expect(dao.isOnChain).toBe(false)
    })

    it('getDAO returns the correct DAO', () => {
        const { createDAO, getDAO } = useDAOStore.getState()
        const dao = createDAO({
            name: 'Findable DAO',
            description: 'Can be found',
            creator: 'aleo1test',
            votingPeriod: 5,
            quorumPercentage: 60,
        })

        const found = getDAO(dao.id)
        expect(found).toBeDefined()
        expect(found!.name).toBe('Findable DAO')
    })

    it('joinDAO increments member count', () => {
        const { createDAO, joinDAO, getDAO } = useDAOStore.getState()
        const dao = createDAO({
            name: 'Growing DAO',
            description: 'Gets more members',
            creator: 'aleo1creator',
            votingPeriod: 7,
            quorumPercentage: 51,
        })

        joinDAO(dao.id, 'aleo1member1', 50)
        const updated = useDAOStore.getState().getDAO(dao.id)
        expect(updated!.memberCount).toBe(2)
    })

    it('getUserDAOs returns DAOs user is member of', () => {
        const { createDAO, joinDAO, getUserDAOs } = useDAOStore.getState()
        const dao1 = createDAO({
            name: 'DAO 1',
            description: 'First',
            creator: 'aleo1creator',
            votingPeriod: 7,
            quorumPercentage: 51,
        })
        createDAO({
            name: 'DAO 2',
            description: 'Second',
            creator: 'aleo1other',
            votingPeriod: 7,
            quorumPercentage: 51,
        })

        const userDaos = useDAOStore.getState().getUserDAOs('aleo1creator')
        expect(userDaos.length).toBe(1)
        expect(userDaos[0].id).toBe(dao1.id)
    })
})
