import { describe, it, expect } from 'vitest'
import { parseAleoStruct, parseAleoNumber, parseAleoField, parseAleoAddress, parseAleoBool } from '../parsers'

describe('parseAleoStruct', () => {
    it('parses a simple struct string', () => {
        const result = parseAleoStruct('{ id: 123field, creator: aleo1abc }')
        expect(result).toEqual({ id: '123field', creator: 'aleo1abc' })
    })

    it('handles empty struct', () => {
        const result = parseAleoStruct('{}')
        expect(result).toEqual({})
    })

    it('handles whitespace', () => {
        const result = parseAleoStruct('  {  name: test , value: 42u32  }  ')
        expect(result.name).toBe('test')
        expect(result.value).toBe('42u32')
    })

    it('parses struct with multiple fields', () => {
        const result = parseAleoStruct('{ id: 1field, dao_id: 2field, proposer: aleo1xyz, voting_start: 100u32, voting_end: 200u32, status: 1u8 }')
        expect(Object.keys(result)).toHaveLength(6)
        expect(result.status).toBe('1u8')
    })
})

describe('parseAleoNumber', () => {
    it('parses u32 values', () => {
        expect(parseAleoNumber('100800u32')).toBe(100800)
    })

    it('parses u64 values', () => {
        expect(parseAleoNumber('5000u64')).toBe(5000)
    })

    it('parses field values', () => {
        expect(parseAleoNumber('500field')).toBe(500)
    })

    it('returns 0 for invalid input', () => {
        expect(parseAleoNumber('invalid')).toBe(0)
    })

    it('handles zero', () => {
        expect(parseAleoNumber('0u32')).toBe(0)
    })
})

describe('parseAleoField', () => {
    it('removes field suffix', () => {
        expect(parseAleoField('123field')).toBe('123')
    })

    it('handles value without suffix', () => {
        expect(parseAleoField('123')).toBe('123')
    })
})

describe('parseAleoAddress', () => {
    it('trims whitespace', () => {
        expect(parseAleoAddress('  aleo1abc  ')).toBe('aleo1abc')
    })
})

describe('parseAleoBool', () => {
    it('parses true', () => {
        expect(parseAleoBool('true')).toBe(true)
    })

    it('parses false', () => {
        expect(parseAleoBool('false')).toBe(false)
    })

    it('handles whitespace', () => {
        expect(parseAleoBool(' true ')).toBe(true)
    })
})
