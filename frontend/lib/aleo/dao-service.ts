'use client'

import { getMappingValue } from './api'
import { parseAleoStruct, parseAleoNumber, parseAleoAddress } from './parsers'
import { PROGRAMS } from './config'

export interface OnChainDAO {
    id: string
    creator: string
    votingPeriod: number
    quorum: number
    proposalThreshold: number
    createdAt: number
}

/**
 * Fetch a DAO from on-chain mappings
 */
export async function fetchDAO(daoId: string): Promise<OnChainDAO | null> {
    const raw = await getMappingValue(PROGRAMS.DAO_REGISTRY, 'daos', `${daoId}field`)
    if (!raw) return null

    try {
        const parsed = parseAleoStruct(raw)
        return {
            id: daoId,
            creator: parseAleoAddress(parsed.creator || ''),
            votingPeriod: parseAleoNumber(parsed.voting_period || '0'),
            quorum: parseAleoNumber(parsed.quorum || '0'),
            proposalThreshold: parseAleoNumber(parsed.proposal_threshold || '0'),
            createdAt: parseAleoNumber(parsed.created_at || '0'),
        }
    } catch (error) {
        console.warn('Failed to parse DAO:', error)
        return null
    }
}

/**
 * Fetch member count for a DAO
 */
export async function fetchMemberCount(daoId: string): Promise<number> {
    const raw = await getMappingValue(PROGRAMS.DAO_REGISTRY, 'member_count', `${daoId}field`)
    if (!raw) return 0
    return parseAleoNumber(raw)
}
