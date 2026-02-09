'use client'

import { getMappingValue } from './api'
import { parseAleoNumber } from './parsers'
import { PROGRAMS } from './config'

/**
 * Fetch yes/no/abstain/total tallies from the private_vote contract
 */
export async function fetchVoteTallies(proposalId: string) {
    const [yesRaw, noRaw, abstainRaw, totalRaw] = await Promise.all([
        getMappingValue(PROGRAMS.PRIVATE_VOTE, 'yes_tallies', `${proposalId}field`),
        getMappingValue(PROGRAMS.PRIVATE_VOTE, 'no_tallies', `${proposalId}field`),
        getMappingValue(PROGRAMS.PRIVATE_VOTE, 'abstain_tallies', `${proposalId}field`),
        getMappingValue(PROGRAMS.PRIVATE_VOTE, 'total_tallies', `${proposalId}field`),
    ])

    return {
        yesVotes: yesRaw ? parseAleoNumber(yesRaw) : 0,
        noVotes: noRaw ? parseAleoNumber(noRaw) : 0,
        abstainVotes: abstainRaw ? parseAleoNumber(abstainRaw) : 0,
        totalVoters: totalRaw ? parseAleoNumber(totalRaw) : 0,
    }
}
