'use client'

import { PROGRAMS, FEES } from '../aleo/config'

// Vote choice enum (matches Leo contract)
export enum VoteChoice {
    FOR = 0,
    AGAINST = 1,
    ABSTAIN = 2
}

// Vote receipt (private record)
export interface VoteReceipt {
    id: string
    proposalId: string
    voter: string
    choice: VoteChoice
    votingPower: number
    timestamp: number
    isPrivate: boolean
}

// Mock vote receipts for demo
const MOCK_RECEIPTS: Map<string, VoteReceipt> = new Map()

/**
 * Build transaction to cast a private vote
 * This is the core privacy feature - vote choice is encrypted
 */
export function buildCastVoteTransaction(
    proposalId: string,
    choice: VoteChoice,
    votingPower: number
) {
    // Choice is encoded privately in Leo
    // 0u8 = FOR, 1u8 = AGAINST, 2u8 = ABSTAIN
    return {
        address: PROGRAMS.PRIVATE_VOTE,
        chainId: 'testnet',
        functionName: 'cast_vote',
        inputs: [
            proposalId,          // proposal_id: field
            `${choice}u8`,       // choice: u8 (PRIVATE!)
            `${votingPower}u64`  // voting_power: u64 (PRIVATE!)
        ],
        fee: FEES.CAST_VOTE,
        feePrivate: false
    }
}

/**
 * Simulate casting a vote (for demo purposes)
 * In production, this would submit to the chain
 */
export async function castVote(
    proposalId: string,
    choice: VoteChoice,
    votingPower: number,
    voterAddress: string
): Promise<VoteReceipt> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const receipt: VoteReceipt = {
        id: `receipt_${Date.now()}`,
        proposalId,
        voter: voterAddress,
        choice,
        votingPower,
        timestamp: Date.now(),
        isPrivate: true
    }

    // Store locally (in production, this comes from the chain)
    MOCK_RECEIPTS.set(receipt.id, receipt)

    return receipt
}

/**
 * Get vote receipt for a proposal (if user has voted)
 */
export async function getVoteReceipt(proposalId: string, voterAddress: string): Promise<VoteReceipt | null> {
    for (const receipt of MOCK_RECEIPTS.values()) {
        if (receipt.proposalId === proposalId && receipt.voter === voterAddress) {
            return receipt
        }
    }
    return null
}

/**
 * Check if user has voted on a proposal
 */
export async function hasVoted(proposalId: string, voterAddress: string): Promise<boolean> {
    const receipt = await getVoteReceipt(proposalId, voterAddress)
    return receipt !== null
}

/**
 * Get human-readable vote choice label
 */
export function getVoteChoiceLabel(choice: VoteChoice): string {
    switch (choice) {
        case VoteChoice.FOR:
            return 'For'
        case VoteChoice.AGAINST:
            return 'Against'
        case VoteChoice.ABSTAIN:
            return 'Abstain'
    }
}

/**
 * Privacy indicator component data
 */
export const PRIVACY_INFO = {
    title: '🔒 Private Vote',
    description: 'Your vote choice and token balance are encrypted using zero-knowledge proofs. No one can see how you voted, but the result is verifiable.',
    features: [
        'Vote choice hidden from all observers',
        'Token balance never revealed',
        'Cryptographically verifiable result',
        'Protection against vote buying'
    ]
}
