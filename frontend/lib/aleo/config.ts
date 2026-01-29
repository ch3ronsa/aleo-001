// Network configuration
export const ALEO_NETWORK = process.env.NEXT_PUBLIC_ALEO_NETWORK || 'testnet'
export const ALEO_NODE_URL = process.env.NEXT_PUBLIC_ALEO_NODE_URL || 'https://api.explorer.provable.com/v1'

// Deployed Program IDs (Testnet)
// Transaction IDs for reference:
// - DAO Registry: at1le2z5vjmwkkrzv64t0rzyw7l6lqa64d373vv7rrz5edk6chm9vqs4d6vs6
// - Proposal: at1tj4dnkyh5qw4wmd5f4s482dclm6qn9rd5r76hn2a8m04z6tzs5yqwtseqg
export const PROGRAMS = {
    DAO_REGISTRY: process.env.NEXT_PUBLIC_DAO_REGISTRY_ID || 'ad_registry_5821.aleo',
    PROPOSAL: process.env.NEXT_PUBLIC_PROPOSAL_ID || 'ad_proposal_5821.aleo',
    PRIVATE_VOTE: process.env.NEXT_PUBLIC_PRIVATE_VOTE_ID || 'ad_vote_5821.aleo',
}

// Transaction fees (in microcredits)
export const FEES = {
    CREATE_DAO: 5_000_000, // 5 credits
    CREATE_PROPOSAL: 2_000_000, // 2 credits
    CAST_VOTE: 500_000, // 0.5 credits
}

// Aleo Explorer URL for transaction links
export const EXPLORER_URL = 'https://explorer.aleo.org'

// Provable API endpoint
export const PROVABLE_API_URL = 'https://api.explorer.provable.com/v1'
