'use client'

import { PROGRAMS, FEES } from '../aleo/config'
import { Transaction, WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base'

// DAO types
export interface DAO {
    id: string
    name: string
    creator: string
    votingPeriod: number
    quorum: number
    proposalThreshold: number
    memberCount: number
    createdAt: number
}

// Mock DAOs for MVP demo
const MOCK_DAOS: DAO[] = [
    {
        id: '1field',
        name: 'Aleo Builders DAO',
        creator: 'aleo1qnr4dkkvkgfqph0vzc3y6z2eu975wnpz2925ntjccd5cfqxu8g8s7465sm',
        votingPeriod: 100800,
        quorum: 5000,
        proposalThreshold: 100,
        memberCount: 42,
        createdAt: 1000000
    },
    {
        id: '2field',
        name: 'Privacy Advocates',
        creator: 'aleo1qnr4dkkvkgfqph0vzc3y6z2eu975wnpz2925ntjccd5cfqxu8g8s7465sm',
        votingPeriod: 50400,
        quorum: 3000,
        proposalThreshold: 50,
        memberCount: 128,
        createdAt: 1100000
    },
    {
        id: '3field',
        name: 'ZK Research Collective',
        creator: 'aleo1qnr4dkkvkgfqph0vzc3y6z2eu975wnpz2925ntjccd5cfqxu8g8s7465sm',
        votingPeriod: 201600,
        quorum: 6000,
        proposalThreshold: 200,
        memberCount: 23,
        createdAt: 1200000
    }
]

/**
 * Get list of DAOs
 * For MVP: Returns mock data + any on-chain DAOs
 */
export async function getDAOList(): Promise<DAO[]> {
    // For MVP, return mock data
    // In production, this would query on-chain mappings
    return MOCK_DAOS
}

/**
 * Get a single DAO by ID
 */
export async function getDAO(daoId: string): Promise<DAO | null> {
    const daos = await getDAOList()
    return daos.find(dao => dao.id === daoId) || null
}

/**
 * Create a new DAO
 * Builds a transaction for Leo Wallet to sign
 */
export function buildCreateDAOTransaction(
    name: string,
    votingPeriod: number,
    quorum: number,
    proposalThreshold: number
): Transaction {
    // Hash the name to a field (simplified for MVP)
    const nameHash = `${name.length}field`
    
    return {
        address: PROGRAMS.DAO_REGISTRY,
        chainId: 'testnet',
        functionName: 'create_dao',
        inputs: [
            nameHash,              // name_hash: field
            `${votingPeriod}u32`,  // voting_period: u32
            `${quorum}u32`,        // quorum: u32
            `${proposalThreshold}u64` // proposal_threshold: u64
        ],
        fee: FEES.CREATE_DAO,
        feePrivate: false
    } as Transaction
}

/**
 * Register as a member of a DAO
 */
export function buildRegisterMemberTransaction(
    daoId: string,
    votingPower: number
): Transaction {
    return {
        address: PROGRAMS.DAO_REGISTRY,
        chainId: 'testnet',
        functionName: 'register_member',
        inputs: [
            daoId,               // dao_id: field
            `${votingPower}u64`  // initial_voting_power: u64
        ],
        fee: 1_000_000,
        feePrivate: false
    } as Transaction
}
