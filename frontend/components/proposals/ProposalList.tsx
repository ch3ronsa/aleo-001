'use client'

import { ProposalCard } from './ProposalCard'

// Mock data - will be replaced with actual contract data
const mockProposals = [
    {
        id: '1',
        daoId: '1',
        daoName: 'Aleo Builders DAO',
        title: 'Fund zkML Research Initiative',
        description: 'Allocate 50,000 tokens to research zero-knowledge machine learning applications',
        status: 'active',
        votingStart: Date.now() / 1000 - 86400,
        votingEnd: Date.now() / 1000 + 86400 * 6,
        yesVotes: 12500,
        noVotes: 3200,
        totalVotes: 15700,
        quorum: 5000,
        createdAt: Date.now() / 1000 - 86400 * 2,
    },
    {
        id: '2',
        daoId: '2',
        daoName: 'Privacy First Fund',
        description: 'Invest in privacy-focused DeFi protocol building on Aleo',
        title: 'Investment: DeFi Protocol XYZ',
        status: 'active',
        votingStart: Date.now() / 1000 - 86400 * 3,
        votingEnd: Date.now() / 1000 + 86400 * 4,
        yesVotes: 8900,
        noVotes: 2100,
        totalVotes: 11000,
        quorum: 6000,
        createdAt: Date.now() / 1000 - 86400 * 4,
    },
    {
        id: '3',
        daoId: '1',
        daoName: 'Aleo Builders DAO',
        title: 'Update Voting Period to 10 Days',
        description: 'Extend voting period from 7 to 10 days to allow more time for deliberation',
        status: 'succeeded',
        votingStart: Date.now() / 1000 - 86400 * 15,
        votingEnd: Date.now() / 1000 - 86400 * 8,
        yesVotes: 25000,
        noVotes: 5000,
        totalVotes: 30000,
        quorum: 5000,
        createdAt: Date.now() / 1000 - 86400 * 16,
    },
    {
        id: '4',
        daoId: '3',
        daoName: 'ZK Research Collective',
        title: 'Grant Program for ZK Developers',
        description: 'Launch quarterly grant program to support ZK research and development',
        status: 'pending',
        votingStart: Date.now() / 1000 + 86400,
        votingEnd: Date.now() / 1000 + 86400 * 8,
        yesVotes: 0,
        noVotes: 0,
        totalVotes: 0,
        quorum: 5000,
        createdAt: Date.now() / 1000,
    },
]

export function ProposalList() {
    return (
        <div className="space-y-4">
            {mockProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
        </div>
    )
}
