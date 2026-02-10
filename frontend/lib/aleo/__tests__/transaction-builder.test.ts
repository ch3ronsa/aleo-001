import { describe, it, expect } from 'vitest'
import { hashStringToField, buildCreateDAOTx, buildCastVoteTx, buildCreatePollTx, buildCastPollVoteTx } from '../transaction-builder'

// Helper to extract transition from Transaction object
function getTransition(tx: any) {
    return tx.transitions[0]
}

describe('hashStringToField', () => {
    it('returns a numeric string', () => {
        const result = hashStringToField('test')
        expect(result).toMatch(/^\d+$/)
    })

    it('returns different values for different strings', () => {
        const hash1 = hashStringToField('hello')
        const hash2 = hashStringToField('world')
        expect(hash1).not.toBe(hash2)
    })

    it('returns same value for same string (deterministic)', () => {
        const hash1 = hashStringToField('consistent')
        const hash2 = hashStringToField('consistent')
        expect(hash1).toBe(hash2)
    })

    it('avoids collision for same-length strings', () => {
        const hash1 = hashStringToField('abc')
        const hash2 = hashStringToField('xyz')
        expect(hash1).not.toBe(hash2)
    })

    it('handles empty string', () => {
        const result = hashStringToField('')
        expect(result).toBe('0')
    })
})

describe('buildCreateDAOTx', () => {
    it('creates a transaction with correct program and function', () => {
        const tx = buildCreateDAOTx('aleo1test', '12345', 7, 51, 100)
        const t = getTransition(tx)
        expect(t.program).toBe('ad_registry_5821.aleo')
        expect(t.functionName).toBe('create_dao')
    })

    it('formats inputs with correct Leo types', () => {
        const tx = buildCreateDAOTx('aleo1test', '999', 7, 5100, 100)
        const t = getTransition(tx)
        expect(t.inputs).toContain('999field')
        expect(t.inputs).toContain('7u32')
        expect(t.inputs).toContain('5100u32')
        expect(t.inputs).toContain('100u64')
    })

    it('sets the correct fee', () => {
        const tx = buildCreateDAOTx('aleo1test', '12345', 7, 51, 100)
        expect(tx.fee).toBe(5_000_000)
    })
})

describe('buildCastVoteTx', () => {
    it('creates transaction with dao_id for cross-DAO prevention', () => {
        const tx = buildCastVoteTx('aleo1test', 'member_record_plaintext', 'dao123', 'prop456', 0)
        const t = getTransition(tx)
        expect(t.inputs).toContain('dao123field')
        expect(t.inputs).toContain('prop456field')
        expect(t.inputs).toContain('0u8')
    })

    it('correctly maps vote choices 0, 1, 2', () => {
        const txYes = buildCastVoteTx('aleo1test', 'record', 'dao1', 'prop1', 0)
        const txNo = buildCastVoteTx('aleo1test', 'record', 'dao1', 'prop1', 1)
        const txAbstain = buildCastVoteTx('aleo1test', 'record', 'dao1', 'prop1', 2)
        expect(getTransition(txYes).inputs).toContain('0u8')
        expect(getTransition(txNo).inputs).toContain('1u8')
        expect(getTransition(txAbstain).inputs).toContain('2u8')
    })

    it('uses the PRIVATE_VOTE program', () => {
        const tx = buildCastVoteTx('aleo1test', 'record', 'dao1', 'prop1', 0)
        const t = getTransition(tx)
        expect(t.program).toBe('ad_vote_5821.aleo')
        expect(t.functionName).toBe('cast_vote')
    })

    it('includes member record as first input', () => {
        const tx = buildCastVoteTx('aleo1test', 'my_record_plaintext', 'dao1', 'prop1', 0)
        const t = getTransition(tx)
        expect(t.inputs[0]).toBe('my_record_plaintext')
    })
})

describe('buildCreatePollTx', () => {
    it('creates transaction with correct program', () => {
        const tx = buildCreatePollTx('aleo1test', 'dao1', '12345', 4, 14400, true)
        const t = getTransition(tx)
        expect(t.program).toBe('ad_poll_5821.aleo')
        expect(t.functionName).toBe('create_poll')
    })

    it('formats option_count as u8', () => {
        const tx = buildCreatePollTx('aleo1test', 'dao1', '12345', 4, 14400, true)
        const t = getTransition(tx)
        expect(t.inputs).toContain('4u8')
    })
})

describe('buildCastPollVoteTx', () => {
    it('includes dao_id for cross-DAO prevention', () => {
        const tx = buildCastPollVoteTx('aleo1test', 'record', 'dao1', 'poll1', 2)
        const t = getTransition(tx)
        expect(t.inputs).toContain('dao1field')
        expect(t.inputs).toContain('poll1field')
        expect(t.inputs).toContain('2u8')
    })

    it('uses correct program and function', () => {
        const tx = buildCastPollVoteTx('aleo1test', 'record', 'dao1', 'poll1', 0)
        const t = getTransition(tx)
        expect(t.program).toBe('ad_poll_5821.aleo')
        expect(t.functionName).toBe('cast_poll_vote')
    })
})
