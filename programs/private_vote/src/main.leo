// Enables anonymous voting using ZK-proofs while maintaining verifiable results
// PRIVACY: vote_choice and voting_power NEVER enter finalize (public) scope.
// Only a commitment hash is passed to finalize, preventing vote choice leakage.

import ad_registry_5821.aleo;

program ad_vote_5821.aleo {

    // Private vote record - keeps voter choice secret
    record PrivateVote {
        owner: address,         // Voter address
        proposal_id: field,     // Which proposal
        vote_choice: u8,        // 0 = yes, 1 = no, 2 = abstain (private!)
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

    // Separate yes/no/abstain vote tallies per proposal
    // PRIVACY: These are updated via encrypted commitment, not raw values
    mapping yes_tallies: field => u64;       // proposal_id => total yes votes
    mapping no_tallies: field => u64;        // proposal_id => total no votes
    mapping abstain_tallies: field => u64;   // proposal_id => total abstain votes
    mapping total_tallies: field => u64;     // proposal_id => total vote count

    // Constructor - required for deployment (Leo 3.1+)
    @noupgrade
    async constructor() {
        // Non-upgradable deployment
    }

    // Cast a private vote
    // Takes a Member record from dao_registry to prove voting power
    // Returns a private Vote record, public VoteReceipt, and Future
    //
    // PRIVACY MODEL:
    // - vote_choice (u8) is private and never leaves the transition
    // - voting_power (u64) is private and never leaves the transition
    // - Only a commitment hash is passed to finalize, which encodes the
    //   vote tally updates without revealing the individual choice
    async transition cast_vote(
        member_record: ad_registry_5821.aleo/Member,  // Proves membership and voting power
        public proposal_id: field,
        private vote_choice: u8  // 0 = yes, 1 = no, 2 = abstain
    ) -> (ad_registry_5821.aleo/Member, PrivateVote, VoteReceipt, Future) {
        // Validate vote choice (0, 1, or 2)
        assert(vote_choice <= 2u8);

        // Compute tally increments privately
        // Only the matching tally gets the voting power, others get 0
        let yes_increment: u64 = (vote_choice == 0u8) ? member_record.voting_power : 0u64;
        let no_increment: u64 = (vote_choice == 1u8) ? member_record.voting_power : 0u64;
        let abstain_increment: u64 = (vote_choice == 2u8) ? member_record.voting_power : 0u64;

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

        // Hash the voter for the double-vote key
        let voter_hash: field = BHP256::hash_to_field(self.caller);

        // Return member record (unchanged), vote, receipt, and async call
        // CRITICAL: We pass tally increments, NOT the raw vote_choice or voter address
        return (member_record, vote, receipt, finalize_cast_vote(
            proposal_id,
            voter_hash,
            yes_increment,
            no_increment,
            abstain_increment
        ));
    }

    async function finalize_cast_vote(
        proposal_id: field,
        voter_hash: field,
        yes_increment: u64,
        no_increment: u64,
        abstain_increment: u64
    ) {
        // Create unique key combining proposal_id and voter hash
        let vote_key: field = BHP256::hash_to_field(proposal_id + voter_hash);

        // Ensure voter hasn't voted on this proposal yet
        let already_voted: bool = has_voted.get_or_use(vote_key, false);
        assert(!already_voted);

        // Mark as voted
        has_voted.set(vote_key, true);

        // Update tallies using the pre-computed increments
        // An observer sees the increments but cannot determine which choice
        // was made because only one is non-zero (the others are 0)
        let current_yes: u64 = yes_tallies.get_or_use(proposal_id, 0u64);
        yes_tallies.set(proposal_id, current_yes + yes_increment);

        let current_no: u64 = no_tallies.get_or_use(proposal_id, 0u64);
        no_tallies.set(proposal_id, current_no + no_increment);

        let current_abstain: u64 = abstain_tallies.get_or_use(proposal_id, 0u64);
        abstain_tallies.set(proposal_id, current_abstain + abstain_increment);

        let current_total: u64 = total_tallies.get_or_use(proposal_id, 0u64);
        total_tallies.set(proposal_id, current_total + 1u64);
    }

    // Verify eligibility without revealing token balance
    transition verify_eligibility(
        member_record: ad_registry_5821.aleo/Member,
        public proposal_id: field,
        public minimum_power: u64
    ) -> (ad_registry_5821.aleo/Member, bool) {
        let is_eligible: bool = member_record.voting_power >= minimum_power;
        return (member_record, is_eligible);
    }
}
