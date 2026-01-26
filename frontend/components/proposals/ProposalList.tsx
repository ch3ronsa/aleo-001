'use client'

import { useProposalStore } from '@/lib/store/proposal-store'
import { useDAOStore } from '@/lib/store/dao-store'
import { ProposalCard } from './ProposalCard'

export function ProposalList() {
    const { proposals } = useProposalStore()
    const { daos } = useDAOStore()

    if (proposals.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No proposals yet. Create a DAO first, then submit a proposal!</p>
            </div>
        )
    }

    // Map proposals with DAO names
    const proposalsWithDAONames = proposals.map((proposal) => {
        const dao = daos.find((d) => d.id === proposal.daoId)
        return {
            ...proposal,
            daoName: dao?.name || 'Unknown DAO',
        }
    })

    return (
        <div className="space-y-4">
            {proposalsWithDAONames.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
        </div>
    )
}
