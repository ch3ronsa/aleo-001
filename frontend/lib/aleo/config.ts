export const ALEO_NETWORK = 'testnet3'

// TODO: Replace these with your actual deployed program IDs
// If you haven't deployed yet, use these placeholders but transactions will fail on-chain
export const PROGRAMS = {
    DAO_REGISTRY: 'aleodao_registry_v1.aleo',
    PROPOSAL: 'aleodao_proposal_v1.aleo',
    PRIVATE_VOTE: 'aleodao_vote_v1.aleo',
    TOKEN: 'aleodao_token_v1.aleo'
}

export const FEES = {
    CREATE_DAO: 5_000_000, // 5 credits
    CREATE_PROPOSAL: 2_000_000, // 2 credits
    CAST_VOTE: 500_000, // 0.5 credits
}
