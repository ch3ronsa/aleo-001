export interface AleoConfig {
    network: 'testnet' | 'mainnet'
    nodeUrl: string
    programIds: {
        daoRegistry: string
        proposal: string
        privateVote: string
    }
}

export const ALEO_CONFIG: AleoConfig = {
    network: process.env.NEXT_PUBLIC_ALEO_NETWORK as 'testnet' || 'testnet',
    nodeUrl: process.env.NEXT_PUBLIC_ALEO_NODE_URL || 'https://api.explorer.provable.com/v1',
    programIds: {
        daoRegistry: process.env.NEXT_PUBLIC_DAO_REGISTRY_ID || 'dao_registry.aleo',
        proposal: process.env.NEXT_PUBLIC_PROPOSAL_ID || 'proposal.aleo',
        privateVote: process.env.NEXT_PUBLIC_PRIVATE_VOTE_ID || 'private_vote.aleo',
    },
}
