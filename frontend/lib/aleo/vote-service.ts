'use client'

import { getMappingValue } from './api'
import { parseAleoNumber } from './parsers'
import { PROGRAMS } from './config'

/**
 * Fetch yes/no/total tallies from the private_vote contract
 */
export async function fetchVoteTallies(proposalId: string) {
    const [yesRaw, noRaw, totalRaw] = await Promise.all([
        getMappingValue(PROGRAMS.PRIVATE_VOTE, 'yes_tallies', `${proposalId}field`),
        getMappingValue(PROGRAMS.PRIVATE_VOTE, 'no_tallies', `${proposalId}field`),
        getMappingValue(PROGRAMS.PRIVATE_VOTE, 'total_tallies', `${proposalId}field`),
    ])

    return {
        yesVotes: yesRaw ? parseAleoNumber(yesRaw) : 0,
        noVotes: noRaw ? parseAleoNumber(noRaw) : 0,
        totalVoters: totalRaw ? parseAleoNumber(totalRaw) : 0,
    }
}
