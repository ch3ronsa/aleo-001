'use client'

import { Transaction } from '@demox-labs/aleo-wallet-adapter-base'
import { PROGRAMS, FEES, ALEO_NETWORK } from './config'

// Re-export the wallet adapter's AleoTransaction type
export type { AleoTransaction } from '@demox-labs/aleo-wallet-adapter-base'

/**
 * Simple hash function for generating deterministic field values from strings.
 * Uses a numeric hash to avoid name collisions (unlike string-length approach).
 */
export function hashStringToField(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & 0x7FFFFFFF // Keep positive 31-bit integer
    }
    return hash.toString()
}

// Chain ID for testnet
const CHAIN_ID = ALEO_NETWORK === 'mainnet' ? 'aleo-mainnet' : 'aleo-testnet'

/**
 * create_dao(public name_hash: field, public voting_period: u32, public quorum: u32, public proposal_threshold: u64) -> Future
 */
export function buildCreateDAOTx(
    address: string,
    nameHash: string,
    votingPeriod: number,
    quorum: number,
    proposalThreshold: number
) {
    return Transaction.createTransaction(
        address,
        CHAIN_ID,
        PROGRAMS.DAO_REGISTRY,
        'create_dao',
        [
            `${nameHash}field`,
            `${votingPeriod}u32`,
            `${quorum}u32`,
            `${proposalThreshold}u64`,
        ],
        FEES.CREATE_DAO,
    )
}

/**
 * register_member(public dao_id: field, private initial_voting_power: u64) -> (Member, Future)
 * NOTE: initial_voting_power is PRIVATE - the wallet handles encryption
 */
export function buildRegisterMemberTx(
    address: string,
    daoId: string,
    votingPower: number
) {
    return Transaction.createTransaction(
        address,
        CHAIN_ID,
        PROGRAMS.DAO_REGISTRY,
        'register_member',
        [
            `${daoId}field`,
            `${votingPower}u64`,
        ],
        FEES.CREATE_DAO,
    )
}

/**
 * create_proposal(public dao_id: field, public title_hash: field, public description_hash: field, public voting_start_delay: u32, public voting_duration: u32) -> Future
 */
export function buildCreateProposalTx(
    address: string,
    daoId: string,
    titleHash: string,
    descriptionHash: string,
    votingStartDelay: number,
    votingDuration: number
) {
    return Transaction.createTransaction(
        address,
        CHAIN_ID,
        PROGRAMS.PROPOSAL,
        'create_proposal',
        [
            `${daoId}field`,
            `${titleHash}field`,
            `${descriptionHash}field`,
            `${votingStartDelay}u32`,
            `${votingDuration}u32`,
        ],
        FEES.CREATE_PROPOSAL,
    )
}

/**
 * cast_vote(member_record: Member, public dao_id: field, public proposal_id: field, private vote_choice: u8)
 * -> (Member, PrivateVote, VoteReceipt, Future)
 *
 * vote_choice: 0 = yes, 1 = no, 2 = abstain
 * PRIVACY: vote_choice is private, never enters finalize scope
 * SECURITY: dao_id validates member belongs to the correct DAO
 */
export function buildCastVoteTx(
    address: string,
    memberRecordPlaintext: string,
    daoId: string,
    proposalId: string,
    voteChoice: number // 0=yes, 1=no, 2=abstain
) {
    return Transaction.createTransaction(
        address,
        CHAIN_ID,
        PROGRAMS.PRIVATE_VOTE,
        'cast_vote',
        [
            memberRecordPlaintext,
            `${daoId}field`,
            `${proposalId}field`,
            `${voteChoice}u8`,
        ],
        FEES.CAST_VOTE,
    )
}

/**
 * activate_proposal(public proposal_id: field) -> Future
 */
export function buildActivateProposalTx(address: string, proposalId: string) {
    return Transaction.createTransaction(
        address,
        CHAIN_ID,
        PROGRAMS.PROPOSAL,
        'activate_proposal',
        [`${proposalId}field`],
        FEES.CAST_VOTE,
    )
}

/**
 * finalize_proposal(public proposal_id: field, public quorum: u32) -> Future
 */
export function buildFinalizeProposalTx(address: string, proposalId: string, quorum: number) {
    return Transaction.createTransaction(
        address,
        CHAIN_ID,
        PROGRAMS.PROPOSAL,
        'finalize_proposal',
        [`${proposalId}field`, `${quorum}u32`],
        FEES.CAST_VOTE,
    )
}

// ============================================================
// POLL TRANSACTIONS
// ============================================================

/**
 * create_poll(public dao_id: field, public title_hash: field, public option_count: u8, public deadline_blocks: u32, public is_private: bool)
 */
export function buildCreatePollTx(
    address: string,
    daoId: string,
    titleHash: string,
    optionCount: number,
    deadlineBlocks: number,
    isPrivate: boolean
) {
    return Transaction.createTransaction(
        address,
        CHAIN_ID,
        PROGRAMS.PRIVATE_POLL,
        'create_poll',
        [
            `${daoId}field`,
            `${titleHash}field`,
            `${optionCount}u8`,
            `${deadlineBlocks}u32`,
            `${isPrivate}`,
        ],
        FEES.CREATE_POLL,
    )
}

/**
 * cast_poll_vote(member_record: Member, public dao_id: field, public poll_id: field, private selected_option: u8)
 * -> (Member, PollVote, PollReceipt, Future)
 *
 * PRIVACY: selected_option is private, never enters finalize scope
 * SECURITY: dao_id validates member belongs to the correct DAO
 */
export function buildCastPollVoteTx(
    address: string,
    memberRecordPlaintext: string,
    daoId: string,
    pollId: string,
    selectedOption: number // 0-indexed
) {
    return Transaction.createTransaction(
        address,
        CHAIN_ID,
        PROGRAMS.PRIVATE_POLL,
        'cast_poll_vote',
        [
            memberRecordPlaintext,
            `${daoId}field`,
            `${pollId}field`,
            `${selectedOption}u8`,
        ],
        FEES.CAST_POLL_VOTE,
    )
}
