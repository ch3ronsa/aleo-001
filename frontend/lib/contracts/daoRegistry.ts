'use client'

import { PROGRAMS, FEES } from '../aleo/config'

// DAO types matching the Leo contract
export interface DAOContract {
    id: string
    creator: string
    votingPeriod: number
    quorum: number
    proposalThreshold: number
    createdAt: number
}

// Mock DAOs for MVP demo (matching store IDs)
const MOCK_DAOS: DAOContract[] = [
    {
        id: 'dao_001',
        creator: 'aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc',
        votingPeriod: 100800,
        quorum: 5000,
        proposalThreshold: 1000,
        createdAt: Date.now() - 86400000 * 30,
    },
    {
        id: 'dao_002',
        creator: 'aleo1yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy3s7v2vh',
        votingPeriod: 72000,
        quorum: 6000,
        proposalThreshold: 500,
        createdAt: Date.now() - 86400000 * 14,
    },
]

/**
 * Get all DAOs
 */
export async function getDAOs(): Promise<DAOContract[]> {
    return MOCK_DAOS
}

/**
 * Get a single DAO by ID
 */
export async function getDAOById(daoId: string): Promise<DAOContract | null> {
    return MOCK_DAOS.find(d => d.id === daoId) || null
}

/**
 * Build transaction to create a new DAO
 */
export function buildCreateDAOTransaction(
    nameHash: string,
    votingPeriod: number,
    quorum: number,
    proposalThreshold: number
) {
    return {
        address: PROGRAMS.DAO_REGISTRY,
        chainId: 'testnet',
        functionName: 'create_dao',
        inputs: [
            nameHash,                    // name_hash: field
            `${votingPeriod}u32`,       // voting_period: u32
            `${quorum}u32`,             // quorum: u32
            `${proposalThreshold}u64`,  // proposal_threshold: u64
        ],
        fee: FEES.CREATE_DAO,
        feePrivate: false,
    }
}

/**
 * Build transaction to register as a DAO member
 */
export function buildRegisterMemberTransaction(
    daoId: string,
    votingPower: number
) {
    return {
        address: PROGRAMS.DAO_REGISTRY,
        chainId: 'testnet',
        functionName: 'register_member',
        inputs: [
            daoId,                      // dao_id: field
            `${votingPower}u64`,        // initial_voting_power: u64
        ],
        fee: FEES.CREATE_DAO,
        feePrivate: false,
    }
}
