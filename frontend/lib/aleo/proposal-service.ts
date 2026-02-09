'use client'

import { getMappingValue } from './api'
import { parseAleoStruct, parseAleoNumber, parseAleoAddress } from './parsers'
import { PROGRAMS } from './config'

export interface OnChainProposal {
    id: string
    daoId: string
    proposer: string
    titleHash: string
    descriptionHash: string
    votingStart: number
    votingEnd: number
    status: number // 0=Pending, 1=Active, 2=Succeeded, 3=Failed, 4=Executed
    createdAt: number
}

export interface OnChainVoteTally {
    proposalId: string
    yesVotes: number
    noVotes: number
    totalVotes: number
}

/**
 * Fetch a proposal from on-chain mappings
 */
export async function fetchProposal(proposalId: string): Promise<OnChainProposal | null> {
    const raw = await getMappingValue(PROGRAMS.PROPOSAL, 'proposals', `${proposalId}field`)
    if (!raw) return null

    try {
        const parsed = parseAleoStruct(raw)
        return {
            id: proposalId,
            daoId: (parsed.dao_id || '').replace(/field$/, ''),
            proposer: parseAleoAddress(parsed.proposer || ''),
            titleHash: parsed.title_hash || '',
            descriptionHash: parsed.description_hash || '',
            votingStart: parseAleoNumber(parsed.voting_start || '0'),
            votingEnd: parseAleoNumber(parsed.voting_end || '0'),
            status: parseAleoNumber(parsed.status || '0'),
            createdAt: parseAleoNumber(parsed.created_at || '0'),
        }
    } catch (error) {
        console.warn('Failed to parse proposal:', error)
        return null
    }
}

/**
 * Fetch proposal status
 */
export async function fetchProposalStatus(proposalId: string): Promise<number> {
    const raw = await getMappingValue(PROGRAMS.PROPOSAL, 'proposal_status', `${proposalId}field`)
    if (!raw) return -1
    return parseAleoNumber(raw)
}

/**
 * Fetch vote tally from the proposal contract
 */
export async function fetchVoteTally(proposalId: string): Promise<OnChainVoteTally | null> {
    const raw = await getMappingValue(PROGRAMS.PROPOSAL, 'vote_tallies', `${proposalId}field`)
    if (!raw) return null

    try {
        const parsed = parseAleoStruct(raw)
        return {
            proposalId,
            yesVotes: parseAleoNumber(parsed.yes_votes || '0'),
            noVotes: parseAleoNumber(parsed.no_votes || '0'),
            totalVotes: parseAleoNumber(parsed.total_votes || '0'),
        }
    } catch (error) {
        console.warn('Failed to parse vote tally:', error)
        return null
    }
}

/**
 * Fetch proposal count for a DAO
 */
export async function fetchProposalCount(daoId: string): Promise<number> {
    const raw = await getMappingValue(PROGRAMS.PROPOSAL, 'proposal_count', `${daoId}field`)
    if (!raw) return 0
    return parseAleoNumber(raw)
}
