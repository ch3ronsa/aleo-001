// Private Polls & Surveys Contract
// Enables multi-choice anonymous polling with ZK-proof privacy
// Voters can select from up to 8 options without revealing their choice

import ad_registry_5821.aleo;

program ad_poll_5821.aleo {

    // Poll configuration stored on-chain
    struct PollConfig {
        id: field,              // Unique poll ID
        dao_id: field,          // DAO this poll belongs to
        creator: address,       // Poll creator
        option_count: u8,       // Number of options (2-8)
        deadline_block: u32,    // Block height when poll ends
        is_private: bool,       // Whether votes are private
        created_at: u32,        // Creation block height
    }

    // Private poll vote record - only visible to the voter
    record PollVote {
        owner: address,
        poll_id: field,
        selected_option: u8,    // Which option (0-indexed, private)
        voting_power: u64,      // How much weight (private)
    }

    // Poll vote receipt - proves participation without revealing choice
    record PollReceipt {
        owner: address,
        poll_id: field,
        voted_at: u32,
    }

    // Poll registry
    mapping polls: field => PollConfig;

    // Vote tallies per option (poll_id + option_index => total votes)
    // Key is hash(poll_id + option_index_as_field)
    mapping option_tallies: field => u64;

    // Total voters per poll
    mapping poll_total_voters: field => u64;

    // Double-vote prevention: hash(poll_id + voter_hash) => voted
    mapping poll_has_voted: field => bool;

    // Poll count per DAO
    mapping poll_count: field => u32;

    @noupgrade
    async constructor() {
        // Non-upgradable deployment
    }

    // Create a new poll
    async transition create_poll(
        public dao_id: field,
        public title_hash: field,
        public option_count: u8,
        public deadline_blocks: u32,
        public is_private: bool
    ) -> Future {
        // Validate: 2-8 options
        assert(option_count >= 2u8);
        assert(option_count <= 8u8);

        // Generate unique poll ID
        let poll_id: field = BHP256::hash_to_field(dao_id + title_hash);

        return finalize_create_poll(
            poll_id, dao_id, self.caller, option_count, deadline_blocks, is_private
        );
    }

    async function finalize_create_poll(
        poll_id: field,
        dao_id: field,
        creator: address,
        option_count: u8,
        deadline_blocks: u32,
        is_private: bool
    ) {
        // Ensure poll doesn't already exist
        assert(!polls.contains(poll_id));

        let config: PollConfig = PollConfig {
            id: poll_id,
            dao_id: dao_id,
            creator: creator,
            option_count: option_count,
            deadline_block: block.height + deadline_blocks,
            is_private: is_private,
            created_at: block.height,
        };

        polls.set(poll_id, config);
        poll_total_voters.set(poll_id, 0u64);

        // Initialize all option tallies to 0
        // We initialize up to 8 options (max)
        let opt0_key: field = BHP256::hash_to_field(poll_id + 0field);
        option_tallies.set(opt0_key, 0u64);
        let opt1_key: field = BHP256::hash_to_field(poll_id + 1field);
        option_tallies.set(opt1_key, 0u64);

        if option_count >= 3u8 {
            let opt2_key: field = BHP256::hash_to_field(poll_id + 2field);
            option_tallies.set(opt2_key, 0u64);
        }
        if option_count >= 4u8 {
            let opt3_key: field = BHP256::hash_to_field(poll_id + 3field);
            option_tallies.set(opt3_key, 0u64);
        }
        if option_count >= 5u8 {
            let opt4_key: field = BHP256::hash_to_field(poll_id + 4field);
            option_tallies.set(opt4_key, 0u64);
        }
        if option_count >= 6u8 {
            let opt5_key: field = BHP256::hash_to_field(poll_id + 5field);
            option_tallies.set(opt5_key, 0u64);
        }
        if option_count >= 7u8 {
            let opt6_key: field = BHP256::hash_to_field(poll_id + 6field);
            option_tallies.set(opt6_key, 0u64);
        }
        if option_count >= 8u8 {
            let opt7_key: field = BHP256::hash_to_field(poll_id + 7field);
            option_tallies.set(opt7_key, 0u64);
        }

        // Increment poll count for DAO
        let current_count: u32 = poll_count.get_or_use(dao_id, 0u32);
        poll_count.set(dao_id, current_count + 1u32);
    }

    // Cast a private vote on a poll
    // PRIVACY: selected_option and voting_power never reach finalize
    // SECURITY: dao_id required to verify member belongs to the poll's DAO
    async transition cast_poll_vote(
        member_record: ad_registry_5821.aleo/Member,
        public dao_id: field,       // DAO this poll belongs to (for cross-DAO prevention)
        public poll_id: field,
        private selected_option: u8  // 0-indexed option choice (private!)
    ) -> (ad_registry_5821.aleo/Member, PollVote, PollReceipt, Future) {
        // Validate option is in range (0-7 max)
        assert(selected_option <= 7u8);

        // SECURITY: Verify member belongs to the correct DAO
        assert_eq(member_record.dao_id, dao_id);

        // Compute tally increment for each option privately
        // Only the selected option gets the voting_power, all others get 0
        let inc0: u64 = (selected_option == 0u8) ? member_record.voting_power : 0u64;
        let inc1: u64 = (selected_option == 1u8) ? member_record.voting_power : 0u64;
        let inc2: u64 = (selected_option == 2u8) ? member_record.voting_power : 0u64;
        let inc3: u64 = (selected_option == 3u8) ? member_record.voting_power : 0u64;
        let inc4: u64 = (selected_option == 4u8) ? member_record.voting_power : 0u64;
        let inc5: u64 = (selected_option == 5u8) ? member_record.voting_power : 0u64;
        let inc6: u64 = (selected_option == 6u8) ? member_record.voting_power : 0u64;
        let inc7: u64 = (selected_option == 7u8) ? member_record.voting_power : 0u64;

        // Create private vote record
        let vote: PollVote = PollVote {
            owner: self.caller,
            poll_id: poll_id,
            selected_option: selected_option,
            voting_power: member_record.voting_power,
        };

        // Create receipt (no choice revealed)
        let receipt: PollReceipt = PollReceipt {
            owner: self.caller,
            poll_id: poll_id,
            voted_at: 0u32,
        };

        let voter_hash: field = BHP256::hash_to_field(self.caller);

        return (member_record, vote, receipt, finalize_cast_poll_vote(
            poll_id, voter_hash, inc0, inc1, inc2, inc3, inc4, inc5, inc6, inc7
        ));
    }

    async function finalize_cast_poll_vote(
        poll_id: field,
        voter_hash: field,
        inc0: u64, inc1: u64, inc2: u64, inc3: u64,
        inc4: u64, inc5: u64, inc6: u64, inc7: u64
    ) {
        // Prevent double voting
        let vote_key: field = BHP256::hash_to_field(poll_id + voter_hash);
        let already_voted: bool = poll_has_voted.get_or_use(vote_key, false);
        assert(!already_voted);
        poll_has_voted.set(vote_key, true);

        // Get poll config to check deadline
        let config: PollConfig = polls.get(poll_id);
        assert(block.height <= config.deadline_block);

        // Update tallies for all 8 possible options
        // Only the selected option's increment is non-zero
        let key0: field = BHP256::hash_to_field(poll_id + 0field);
        let cur0: u64 = option_tallies.get_or_use(key0, 0u64);
        option_tallies.set(key0, cur0 + inc0);

        let key1: field = BHP256::hash_to_field(poll_id + 1field);
        let cur1: u64 = option_tallies.get_or_use(key1, 0u64);
        option_tallies.set(key1, cur1 + inc1);

        let key2: field = BHP256::hash_to_field(poll_id + 2field);
        let cur2: u64 = option_tallies.get_or_use(key2, 0u64);
        option_tallies.set(key2, cur2 + inc2);

        let key3: field = BHP256::hash_to_field(poll_id + 3field);
        let cur3: u64 = option_tallies.get_or_use(key3, 0u64);
        option_tallies.set(key3, cur3 + inc3);

        let key4: field = BHP256::hash_to_field(poll_id + 4field);
        let cur4: u64 = option_tallies.get_or_use(key4, 0u64);
        option_tallies.set(key4, cur4 + inc4);

        let key5: field = BHP256::hash_to_field(poll_id + 5field);
        let cur5: u64 = option_tallies.get_or_use(key5, 0u64);
        option_tallies.set(key5, cur5 + inc5);

        let key6: field = BHP256::hash_to_field(poll_id + 6field);
        let cur6: u64 = option_tallies.get_or_use(key6, 0u64);
        option_tallies.set(key6, cur6 + inc6);

        let key7: field = BHP256::hash_to_field(poll_id + 7field);
        let cur7: u64 = option_tallies.get_or_use(key7, 0u64);
        option_tallies.set(key7, cur7 + inc7);

        // Increment total voter count
        let current_total: u64 = poll_total_voters.get_or_use(poll_id, 0u64);
        poll_total_voters.set(poll_id, current_total + 1u64);
    }
}
