// Network configuration
export const ALEO_NETWORK = process.env.NEXT_PUBLIC_ALEO_NETWORK || 'testnet'

// Deployed Program IDs
// UPDATE these after deploying contracts to testnet via:
//   cd programs/dao_registry && leo deploy --network testnet
// Or set via environment variables in Vercel
export const PROGRAMS = {
    DAO_REGISTRY: process.env.NEXT_PUBLIC_DAO_REGISTRY || 'ad_registry_5821.aleo',
    PROPOSAL: process.env.NEXT_PUBLIC_PROPOSAL || 'ad_proposal_5821.aleo',
    PRIVATE_VOTE: process.env.NEXT_PUBLIC_PRIVATE_VOTE || 'ad_vote_5821.aleo',
    TOKEN: process.env.NEXT_PUBLIC_TOKEN || 'ad_token_v1.aleo'
}

// Transaction fees (in microcredits)
export const FEES = {
    CREATE_DAO: 5_000_000, // 5 credits
    CREATE_PROPOSAL: 2_000_000, // 2 credits
    CAST_VOTE: 500_000, // 0.5 credits
}

// Aleo Explorer URL for transaction links
export const EXPLORER_URL = 'https://explorer.aleo.org'

