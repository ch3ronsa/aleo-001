// DAO Registry Contract
// Handles DAO creation, member registration, and settings management

program dao_registry.aleo {
    // DAO structure containing core settings
    struct DAO {
        id: field,              // Unique DAO identifier
        creator: address,       // DAO creator address
        voting_period: u32,     // Voting duration in blocks
        quorum: u32,            // Minimum votes required (in basis points, e.g., 5000 = 50%)
        proposal_threshold: u64, // Minimum tokens to create proposal
        created_at: u32,        // Creation timestamp
    }

    // Member record (private)
    record Member {
        owner: address,         // Member address
        dao_id: field,          // DAO they belong to
        joined_at: u32,         // Join timestamp
        voting_power: u64,      // Token balance (private)
    }

    // Public DAO registry mapping
    mapping daos: field => DAO;
    
    // Member count per DAO
    mapping member_count: field => u32;
    
    // DAO settings
    mapping dao_settings: field => field;

    // Create a new DAO
    // Returns a DAO struct that gets stored in public mapping
    transition create_dao(
        public name_hash: field,           // Hash of DAO name
        public voting_period: u32,         // Voting duration (e.g., 100800 blocks ≈ 7 days)
        public quorum: u32,                // Quorum percentage (e.g., 5000 = 50%)
        public proposal_threshold: u64     // Min tokens to create proposal
    ) -> DAO {
        // Generate unique DAO ID from name and creator
        let dao_id: field = BHP256::hash_to_field(name_hash);
        
        // Create DAO struct
        let new_dao: DAO = DAO {
            id: dao_id,
            creator: self.caller,
            voting_period: voting_period,
            quorum: quorum,
            proposal_threshold: proposal_threshold,
            created_at: block.height,
        };

        return new_dao then finalize(dao_id, new_dao);
    }

    finalize create_dao(dao_id: field, dao: DAO) {
        // Ensure DAO doesn't already exist
        assert(!daos.contains(dao_id));
        
        // Register DAO
        daos.set(dao_id, dao);
        member_count.set(dao_id, 0u32);
    }

    // Register as a member of a DAO (private)
    // Returns a private Member record
    transition register_member(
        public dao_id: field,
        public initial_voting_power: u64
    ) -> Member {
        // Create private member record
        let member: Member = Member {
            owner: self.caller,
            dao_id: dao_id,
            joined_at: block.height,
            voting_power: initial_voting_power,
        };

        return member then finalize(dao_id);
    }

    finalize register_member(dao_id: field) {
        // Verify DAO exists
        assert(daos.contains(dao_id));
        
        // Increment member count
        let current_count: u32 = member_count.get_or_use(dao_id, 0u32);
        member_count.set(dao_id, current_count + 1u32);
    }

    // Update DAO settings (only creator can update)
    transition update_dao_settings(
        public dao_id: field,
        public new_voting_period: u32,
        public new_quorum: u32,
        public new_proposal_threshold: u64
    ) -> DAO {
        // Retrieve and update DAO
        return then finalize(dao_id, self.caller, new_voting_period, new_quorum, new_proposal_threshold);
    }

    finalize update_dao_settings(
        dao_id: field,
        caller: address,
        new_voting_period: u32,
        new_quorum: u32,
        new_proposal_threshold: u64
    ) {
        // Get existing DAO
        let dao: DAO = daos.get(dao_id);
        
        // Verify caller is creator
        assert_eq(dao.creator, caller);
        
        // Update DAO with new settings
        let updated_dao: DAO = DAO {
            id: dao.id,
            creator: dao.creator,
            voting_period: new_voting_period,
            quorum: new_quorum,
            proposal_threshold: new_proposal_threshold,
            created_at: dao.created_at,
        };
        
        daos.set(dao_id, updated_dao);
    }

    // Get member voting power (helper function)
    // In production, this would verify token balance from a token contract
    transition verify_voting_power(
        member_record: Member,
        public dao_id: field
    ) -> (Member, u64) {
        // Verify member belongs to the DAO
        assert_eq(member_record.dao_id, dao_id);
        
        // Return member record and their voting power
        return (member_record, member_record.voting_power);
    }
}
