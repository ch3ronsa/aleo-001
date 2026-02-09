'use client'

import { PROGRAMS, FEES } from './config'

/**
 * Transaction builder for Aleo Leo wallet adapter.
 * All inputs must match the exact Leo contract function signatures.
 */

export interface AleoTransaction {
    programId: string
    functionName: string
    inputs: any[]
    fee: number
}

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

/**
 * create_dao(public name_hash: field, public voting_period: u32, public quorum: u32, public proposal_threshold: u64) -> Future
 */
export function buildCreateDAOTx(
    nameHash: string,
    votingPeriod: number,
    quorum: number,
    proposalThreshold: number
): AleoTransaction {
    return {
        programId: PROGRAMS.DAO_REGISTRY,
        functionName: 'create_dao',
        inputs: [
            `${nameHash}field`,
            `${votingPeriod}u32`,
            `${quorum}u32`,
            `${proposalThreshold}u64`,
        ],
        fee: FEES.CREATE_DAO,
    }
}

/**
 * register_member(public dao_id: field, private initial_voting_power: u64) -> (Member, Future)
 * NOTE: initial_voting_power is PRIVATE - the wallet handles encryption
 */
export function buildRegisterMemberTx(
    daoId: string,
    votingPower: number
): AleoTransaction {
    return {
        programId: PROGRAMS.DAO_REGISTRY,
        functionName: 'register_member',
        inputs: [
            `${daoId}field`,
            `${votingPower}u64`,
        ],
        fee: FEES.CREATE_DAO,
    }
}

/**
 * create_proposal(public dao_id: field, public title_hash: field, public description_hash: field, public voting_start_delay: u32, public voting_duration: u32) -> Future
 */
export function buildCreateProposalTx(
    daoId: string,
    titleHash: string,
    descriptionHash: string,
    votingStartDelay: number,
    votingDuration: number
): AleoTransaction {
    return {
        programId: PROGRAMS.PROPOSAL,
        functionName: 'create_proposal',
        inputs: [
            `${daoId}field`,
            `${titleHash}field`,
            `${descriptionHash}field`,
            `${votingStartDelay}u32`,
            `${votingDuration}u32`,
        ],
        fee: FEES.CREATE_PROPOSAL,
    }
}

/**
 * cast_vote(member_record: Member, public proposal_id: field, private vote_choice: u8)
 * -> (Member, PrivateVote, VoteReceipt, Future)
 *
 * vote_choice: 0 = yes, 1 = no, 2 = abstain
 * PRIVACY: vote_choice is private, never enters finalize scope
 */
export function buildCastVoteTx(
    memberRecordPlaintext: string,
    proposalId: string,
    voteChoice: number // 0=yes, 1=no, 2=abstain
): AleoTransaction {
    return {
        programId: PROGRAMS.PRIVATE_VOTE,
        functionName: 'cast_vote',
        inputs: [
            memberRecordPlaintext,
            `${proposalId}field`,
            `${voteChoice}u8`,
        ],
        fee: FEES.CAST_VOTE,
    }
}

/**
 * activate_proposal(public proposal_id: field) -> Future
 */
export function buildActivateProposalTx(proposalId: string): AleoTransaction {
    return {
        programId: PROGRAMS.PROPOSAL,
        functionName: 'activate_proposal',
        inputs: [`${proposalId}field`],
        fee: FEES.CAST_VOTE,
    }
}

/**
 * finalize_proposal(public proposal_id: field, public quorum: u32) -> Future
 */
export function buildFinalizeProposalTx(proposalId: string, quorum: number): AleoTransaction {
    return {
        programId: PROGRAMS.PROPOSAL,
        functionName: 'finalize_proposal',
        inputs: [`${proposalId}field`, `${quorum}u32`],
        fee: FEES.CAST_VOTE,
    }
}

// ============================================================
// POLL TRANSACTIONS
// ============================================================

/**
 * create_poll(public dao_id: field, public title_hash: field, public option_count: u8, public deadline_blocks: u32, public is_private: bool)
 */
export function buildCreatePollTx(
    daoId: string,
    titleHash: string,
    optionCount: number,
    deadlineBlocks: number,
    isPrivate: boolean
): AleoTransaction {
    return {
        programId: PROGRAMS.PRIVATE_POLL,
        functionName: 'create_poll',
        inputs: [
            `${daoId}field`,
            `${titleHash}field`,
            `${optionCount}u8`,
            `${deadlineBlocks}u32`,
            `${isPrivate}`,
        ],
        fee: FEES.CREATE_POLL,
    }
}

/**
 * cast_poll_vote(member_record: Member, public poll_id: field, private selected_option: u8)
 * -> (Member, PollVote, PollReceipt, Future)
 *
 * PRIVACY: selected_option is private, never enters finalize scope
 */
export function buildCastPollVoteTx(
    memberRecordPlaintext: string,
    pollId: string,
    selectedOption: number // 0-indexed
): AleoTransaction {
    return {
        programId: PROGRAMS.PRIVATE_POLL,
        functionName: 'cast_poll_vote',
        inputs: [
            memberRecordPlaintext,
            `${pollId}field`,
            `${selectedOption}u8`,
        ],
        fee: FEES.CAST_POLL_VOTE,
    }
}
