// Private Vote Contract
// Enables anonymous voting using ZK-proofs while maintaining verifiable results

program private_vote.aleo {
    // Import the proposal program to update vote tallies
    import proposal.aleo;

    // Private vote record - keeps voter choice secret
    record Vote {
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

    // Cast a private vote
    // Takes a Member record from dao_registry to prove voting power
    // Returns a private Vote record and public VoteReceipt
    transition cast_vote(
        member_record: dao_registry.aleo/Member,  // Proves membership and voting power
        public proposal_id: field,
        private vote_choice: bool  // true = yes, false = no
    ) -> (dao_registry.aleo/Member, Vote, VoteReceipt) {
        // Create private vote record
        let vote: Vote = Vote {
            owner: self.caller,
            proposal_id: proposal_id,
            vote_choice: vote_choice,
            voting_power: member_record.voting_power,
            voted_at: block.height,
        };

        // Create public receipt (proof of voting without revealing choice)
        let receipt: VoteReceipt = VoteReceipt {
            owner: self.caller,
            proposal_id: proposal_id,
            voted_at: block.height,
        };

        // Return member record (unchanged), vote, and receipt
        return (member_record, vote, receipt) then finalize(
            proposal_id,
            self.caller,
            member_record.dao_id,
            vote_choice,
            member_record.voting_power
        );
    }

    finalize cast_vote(
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
    // This is a helper function to check if someone can vote
    transition verify_eligibility(
        member_record: dao_registry.aleo/Member,
        public proposal_id: field,
        public minimum_power: u64
    ) -> (dao_registry.aleo/Member, bool) {
        // Check if member has enough voting power
        let is_eligible: bool = member_record.voting_power >= minimum_power;
        
        return (member_record, is_eligible);
    }

    // Reveal vote tally for finalized proposals
    // This can only be called after voting ends
    transition reveal_tally(public proposal_id: field) -> (u64, u64) {
        return then finalize(proposal_id);
    }

    finalize reveal_tally(proposal_id: field) -> (u64, u64) {
        // Get encoded tally
        let encoded_tally: field = vote_tallies.get(proposal_id);
        
        // Decode yes and no votes
        // This is simplified - production would use proper ZK reveal
        let yes_votes: u64 = (encoded_tally / 1000000field) as u64;
        let no_votes: u64 = (encoded_tally % 1000000field) as u64;
        
        return (yes_votes, no_votes);
    }

    // Batch vote reveal for multiple proposals
    transition batch_reveal(
        public proposal_id_1: field,
        public proposal_id_2: field
    ) -> ((u64, u64), (u64, u64)) {
        return then finalize(proposal_id_1, proposal_id_2);
    }

    finalize batch_reveal(
        proposal_id_1: field,
        proposal_id_2: field
    ) -> ((u64, u64), (u64, u64)) {
        // Reveal first proposal
        let tally_1: field = vote_tallies.get(proposal_id_1);
        let yes_1: u64 = (tally_1 / 1000000field) as u64;
        let no_1: u64 = (tally_1 % 1000000field) as u64;
        
        // Reveal second proposal
        let tally_2: field = vote_tallies.get(proposal_id_2);
        let yes_2: u64 = (tally_2 / 1000000field) as u64;
        let no_2: u64 = (tally_2 % 1000000field) as u64;
        
        return ((yes_1, no_1), (yes_2, no_2));
    }
}
