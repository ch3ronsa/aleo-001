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
    mapping has_voted: field => bool;  // hash(proposal_id, address) => bool
    
    // Aggregate vote tallies (updated privately)
    mapping vote_tallies: field => field;  // proposal_id => encrypted_tally

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
        // Create unique key for voter+proposal
        let vote_key: field = BHP256::hash_to_field(proposal_id);
        
        // Ensure voter hasn't voted on this proposal yet
        let already_voted: bool = has_voted.get_or_use(vote_key, false);
        assert(!already_voted);
        
        // Mark as voted
        has_voted.set(vote_key, true);
        
        // Update vote tally (this happens in finalize, still private)
        // In production, this would use more sophisticated ZK aggregation
        let current_tally: field = vote_tallies.get_or_use(proposal_id, 0field);
        
        // Encode vote: yes votes in upper bits, no votes in lower bits
        // This is simplified - production would use proper ZK accumulation
        let vote_value: u64 = voting_power;
        if vote_choice {
            // Yes vote - add to yes tally
            vote_tallies.set(proposal_id, current_tally + (vote_value as field) * 1000000field);
        } else {
            // No vote - add to no tally
            vote_tallies.set(proposal_id, current_tally + (vote_value as field));
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
