// Proposal Contract
// Manages proposal creation, lifecycle, and status

program proposal.aleo {
    // Proposal status enumeration
    // 0 = Pending, 1 = Active, 2 = Succeeded, 3 = Failed, 4 = Executed
    
    // Proposal structure
    struct Proposal {
        id: field,              // Unique proposal ID
        dao_id: field,          // DAO this proposal belongs to
        proposer: address,      // Proposal creator
        title_hash: field,      // Hash of proposal title
        description_hash: field, // Hash of proposal description
        voting_start: u32,      // Block height when voting starts
        voting_end: u32,        // Block height when voting ends
        status: u8,             // Current proposal status
        created_at: u32,        // Creation timestamp
    }

    // Vote tally for a proposal (updated by vote contract)
    struct VoteTally {
        proposal_id: field,
        yes_votes: u64,
        no_votes: u64,
        total_votes: u64,
    }

    // Public proposal registry
    mapping proposals: field => Proposal;
    
    // Proposal count per DAO
    mapping proposal_count: field => u32;
    
    // Vote tallies
    mapping vote_tallies: field => VoteTally;
    
    // Proposal status tracking
    mapping proposal_status: field => u8;

    // Create a new proposal
    transition create_proposal(
        public dao_id: field,
        public title_hash: field,
        public description_hash: field,
        public voting_start_delay: u32,  // Blocks until voting starts
        public voting_duration: u32      // Duration of voting period
    ) -> Proposal {
        // Calculate voting period
        let voting_start: u32 = block.height + voting_start_delay;
        let voting_end: u32 = voting_start + voting_duration;
        
        // Generate unique proposal ID
        let proposal_id: field = BHP256::hash_to_field(title_hash);
        
        // Create proposal struct
        let new_proposal: Proposal = Proposal {
            id: proposal_id,
            dao_id: dao_id,
            proposer: self.caller,
            title_hash: title_hash,
            description_hash: description_hash,
            voting_start: voting_start,
            voting_end: voting_end,
            status: 0u8,  // Pending
            created_at: block.height,
        };

        return new_proposal then finalize(dao_id, proposal_id, new_proposal);
    }

    finalize create_proposal(dao_id: field, proposal_id: field, proposal: Proposal) {
        // Ensure proposal doesn't already exist
        assert(!proposals.contains(proposal_id));
        
        // Register proposal
        proposals.set(proposal_id, proposal);
        proposal_status.set(proposal_id, 0u8);  // Pending
        
        // Initialize vote tally
        let initial_tally: VoteTally = VoteTally {
            proposal_id: proposal_id,
            yes_votes: 0u64,
            no_votes: 0u64,
            total_votes: 0u64,
        };
        vote_tallies.set(proposal_id, initial_tally);
        
        // Increment proposal count for DAO
        let current_count: u32 = proposal_count.get_or_use(dao_id, 0u32);
        proposal_count.set(dao_id, current_count + 1u32);
    }

    // Activate proposal (moves from Pending to Active)
    transition activate_proposal(public proposal_id: field) {
        return then finalize(proposal_id);
    }

    finalize activate_proposal(proposal_id: field) {
        // Get proposal
        let proposal: Proposal = proposals.get(proposal_id);
        
        // Verify voting has started
        assert(block.height >= proposal.voting_start);
        
        // Verify proposal is pending
        let current_status: u8 = proposal_status.get(proposal_id);
        assert_eq(current_status, 0u8);
        
        // Update status to Active
        proposal_status.set(proposal_id, 1u8);
    }

    // Finalize proposal (called after voting ends)
    transition finalize_proposal(
        public proposal_id: field,
        public quorum: u32  // Required quorum from DAO settings
    ) {
        return then finalize(proposal_id, quorum);
    }

    finalize finalize_proposal(proposal_id: field, quorum: u32) {
        // Get proposal
        let proposal: Proposal = proposals.get(proposal_id);
        
        // Verify voting has ended
        assert(block.height > proposal.voting_end);
        
        // Get vote tally
        let tally: VoteTally = vote_tallies.get(proposal_id);
        
        // Calculate if quorum met and proposal succeeded
        // Note: In production, we'd get total possible votes from DAO
        let yes_percentage: u64 = (tally.yes_votes * 10000u64) / (tally.yes_votes + tally.no_votes);
        let quorum_met: bool = tally.total_votes > 0u64;  // Simplified quorum check
        
        // Determine final status
        let final_status: u8 = 3u8;  // Failed by default
        if quorum_met && yes_percentage >= 5000u64 {  // 50% threshold
            final_status = 2u8;  // Succeeded
        }
        
        proposal_status.set(proposal_id, final_status);
    }

    // Mark proposal as executed
    transition mark_executed(public proposal_id: field) {
        return then finalize(proposal_id, self.caller);
    }

    finalize mark_executed(proposal_id: field, caller: address) {
        // Get proposal
        let proposal: Proposal = proposals.get(proposal_id);
        
        // Verify caller is proposer (or could be DAO executor role)
        assert_eq(proposal.proposer, caller);
        
        // Verify proposal succeeded
        let current_status: u8 = proposal_status.get(proposal_id);
        assert_eq(current_status, 2u8);
        
        // Mark as executed
        proposal_status.set(proposal_id, 4u8);
    }

    // Get proposal status (helper)
    inline get_status(proposal_id: field) -> u8 {
        return proposal_status.get(proposal_id);
    }
}
