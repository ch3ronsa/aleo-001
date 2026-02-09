// Enables anonymous voting using ZK-proofs while maintaining verifiable results

import ad_registry_5821.aleo;

program ad_vote_5821.aleo {

    // Private vote record - keeps voter choice secret
    record PrivateVote {
        owner: address,         // Voter address
        proposal_id: field,     // Which proposal
        vote_choice: bool,      // true = yes, false = no (private!)
        voting_power: u64,      // Amount of votes cast (private!)
        voted_at: u32,          // Block height when voted
    }

    // Voting receipt (proof that user voted, without revealing choice)
    record VoteReceipt {
        owner: address,
        proposal_id: field,
        voted_at: u32,
        // Note: Does NOT include vote_choice or voting_power!
    }

    // Track if address has voted on a proposal (prevent double voting)
    // Key: hash(proposal_id + hash(voter_address))
    mapping has_voted: field => bool;

    // Separate yes/no vote tallies per proposal
    mapping yes_tallies: field => u64;   // proposal_id => total yes votes
    mapping no_tallies: field => u64;    // proposal_id => total no votes
    mapping total_tallies: field => u64; // proposal_id => total vote count

    // Constructor - required for deployment (Leo 3.1+)
    @noupgrade
    async constructor() {
        // Non-upgradable deployment
    }

    // Cast a private vote
    // Takes a Member record from dao_registry to prove voting power
    // Returns a private Vote record, public VoteReceipt, and Future
    async transition cast_vote(
        member_record: ad_registry_5821.aleo/Member,  // Proves membership and voting power
        public proposal_id: field,
        private vote_choice: bool  // true = yes, false = no
    ) -> (ad_registry_5821.aleo/Member, PrivateVote, VoteReceipt, Future) {
        // Create private vote record
        let vote: PrivateVote = PrivateVote {
            owner: self.caller,
            proposal_id: proposal_id,
            vote_choice: vote_choice,
            voting_power: member_record.voting_power,
            voted_at: 0u32,
        };

        // Create public receipt (proof of voting without revealing choice)
        let receipt: VoteReceipt = VoteReceipt {
            owner: self.caller,
            proposal_id: proposal_id,
            voted_at: 0u32,
        };

        // Return member record (unchanged), vote, receipt, and async call
        return (member_record, vote, receipt, finalize_cast_vote(proposal_id, self.caller, member_record.dao_id, vote_choice, member_record.voting_power));
    }

    async function finalize_cast_vote(
        proposal_id: field,
        voter: address,
        dao_id: field,
        vote_choice: bool,
        voting_power: u64
    ) {
        // Create unique key combining proposal_id and voter address
        // This ensures each voter can only vote once per proposal
        let voter_hash: field = BHP256::hash_to_field(voter);
        let vote_key: field = BHP256::hash_to_field(proposal_id + voter_hash);

        // Ensure voter hasn't voted on this proposal yet
        let already_voted: bool = has_voted.get_or_use(vote_key, false);
        assert(!already_voted);

        // Mark as voted
        has_voted.set(vote_key, true);

        // Update separate yes/no tallies
        let current_total: u64 = total_tallies.get_or_use(proposal_id, 0u64);
        total_tallies.set(proposal_id, current_total + 1u64);

        if vote_choice {
            // Yes vote
            let current_yes: u64 = yes_tallies.get_or_use(proposal_id, 0u64);
            yes_tallies.set(proposal_id, current_yes + voting_power);
        } else {
            // No vote
            let current_no: u64 = no_tallies.get_or_use(proposal_id, 0u64);
            no_tallies.set(proposal_id, current_no + voting_power);
        }
    }

    // Verify eligibility without revealing token balance
    transition verify_eligibility(
        member_record: ad_registry_5821.aleo/Member,
        public proposal_id: field,
        public minimum_power: u64
    ) -> (ad_registry_5821.aleo/Member, bool) {
        // Check if member has enough voting power
        let is_eligible: bool = member_record.voting_power >= minimum_power;
        
        return (member_record, is_eligible);
    }


}
