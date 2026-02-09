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
 * register_member(public dao_id: field, public initial_voting_power: u64) -> (Member, Future)
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
 * cast_vote(member_record: Member, public proposal_id: field, private vote_choice: bool)
 * -> (Member, PrivateVote, VoteReceipt, Future)
 *
 * IMPORTANT: member_record is a private record held by the wallet.
 * The wallet decrypts and provides it when requestRecords is called.
 */
export function buildCastVoteTx(
    memberRecordPlaintext: string,
    proposalId: string,
    voteChoice: boolean
): AleoTransaction {
    return {
        programId: PROGRAMS.PRIVATE_VOTE,
        functionName: 'cast_vote',
        inputs: [
            memberRecordPlaintext,
            `${proposalId}field`,
            `${voteChoice}`,
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
