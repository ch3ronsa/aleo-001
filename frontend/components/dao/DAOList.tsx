'use client'

import { DAOCard } from './DAOCard'

// Mock data - will be replaced with actual contract data
const mockDAOs = [
    {
        id: '1',
        name: 'Aleo Builders DAO',
        description: 'Building the future of privacy-preserving apps',
        memberCount: 150,
        proposalCount: 12,
        votingPeriod: 100800,
        quorum: 5000,
        createdAt: Date.now() / 1000 - 86400 * 30,
    },
    {
        id: '2',
        name: 'Privacy First Fund',
        description: 'Investing in privacy tech startups',
        memberCount: 45,
        proposalCount: 5,
        votingPeriod: 151200,
        quorum: 6000,
        createdAt: Date.now() / 1000 - 86400 * 15,
    },
    {
        id: '3',
        name: 'ZK Research Collective',
        description: 'Funding zero-knowledge research initiatives',
        memberCount: 89,
        proposalCount: 8,
        votingPeriod: 100800,
        quorum: 5000,
        createdAt: Date.now() / 1000 - 86400 * 7,
    },
]

export function DAOList() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockDAOs.map((dao) => (
                <DAOCard key={dao.id} dao={dao} />
            ))}
        </div>
    )
}
