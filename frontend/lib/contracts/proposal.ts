'use client'

import { PROGRAMS, FEES } from '../aleo/config'

// Proposal types
export type ProposalStatus = 'active' | 'passed' | 'rejected' | 'pending'

export interface Proposal {
    id: string
    daoId: string
    title: string
    description: string
    creator: string
    status: ProposalStatus
    votesFor: number
    votesAgainst: number
    votesAbstain: number
    startBlock: number
    endBlock: number
    createdAt: number
}

// Mock proposals for MVP demo
const MOCK_PROPOSALS: Proposal[] = [
    {
        id: '1field',
        daoId: '1field',
        title: 'Treasury Allocation Q1 2025',
        description: 'Allocate 50,000 ALEO from treasury for developer grants program.',
        creator: 'aleo1qnr4dkkvkgfqph0vzc3y6z2eu975wnpz2925ntjccd5cfqxu8g8s7465sm',
        status: 'active',
        votesFor: 234,
        votesAgainst: 45,
        votesAbstain: 12,
        startBlock: 1500000,
        endBlock: 1600800,
        createdAt: 1500000
    },
    {
        id: '2field',
        daoId: '1field',
        title: 'Update Voting Period to 14 Days',
        description: 'Extend the default voting period from 7 days to 14 days for better participation.',
        creator: 'aleo1qnr4dkkvkgfqph0vzc3y6z2eu975wnpz2925ntjccd5cfqxu8g8s7465sm',
        status: 'active',
        votesFor: 156,
        votesAgainst: 89,
        votesAbstain: 23,
        startBlock: 1520000,
        endBlock: 1620800,
        createdAt: 1520000
    },
    {
        id: '3field',
        daoId: '2field',
        title: 'Privacy Research Initiative',
        description: 'Fund a research initiative to explore new ZK-proof mechanisms for enhanced privacy.',
        creator: 'aleo1qnr4dkkvkgfqph0vzc3y6z2eu975wnpz2925ntjccd5cfqxu8g8s7465sm',
        status: 'passed',
        votesFor: 412,
        votesAgainst: 28,
        votesAbstain: 5,
        startBlock: 1400000,
        endBlock: 1500800,
        createdAt: 1400000
    },
    {
        id: '4field',
        daoId: '1field',
        title: 'Community Ambassador Program',
        description: 'Launch a community ambassador program to increase awareness and adoption.',
        creator: 'aleo1qnr4dkkvkgfqph0vzc3y6z2eu975wnpz2925ntjccd5cfqxu8g8s7465sm',
        status: 'pending',
        votesFor: 0,
        votesAgainst: 0,
        votesAbstain: 0,
        startBlock: 1600000,
        endBlock: 1700800,
        createdAt: 1590000
    }
]

/**
 * Get all proposals for a DAO
 */
export async function getProposals(daoId?: string): Promise<Proposal[]> {
    if (daoId) {
        return MOCK_PROPOSALS.filter(p => p.daoId === daoId)
    }
    return MOCK_PROPOSALS
}

/**
 * Get a single proposal by ID
 */
export async function getProposal(proposalId: string): Promise<Proposal | null> {
    return MOCK_PROPOSALS.find(p => p.id === proposalId) || null
}

/**
 * Get active proposals (for voting)
 */
export async function getActiveProposals(): Promise<Proposal[]> {
    return MOCK_PROPOSALS.filter(p => p.status === 'active')
}

/**
 * Build transaction to create a new proposal
 */
export function buildCreateProposalTransaction(
    daoId: string,
    titleHash: string,
    descriptionHash: string
) {
    return {
        address: PROGRAMS.PROPOSAL,
        chainId: 'testnet',
        functionName: 'create_proposal',
        inputs: [
            daoId,           // dao_id: field
            titleHash,       // title_hash: field
            descriptionHash  // description_hash: field
        ],
        fee: FEES.CREATE_PROPOSAL,
        feePrivate: false
    }
}
