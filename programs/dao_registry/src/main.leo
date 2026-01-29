// DAO Registry Contract
// Handles DAO creation, member registration, and settings management

program ad_registry_5821.aleo {
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

    // Constructor - required for deployment (Leo 3.1+)
    // @noupgrade means this program cannot be upgraded after deployment
    @noupgrade
    async constructor() {
        // Constructor runs on deployment - no logic needed for non-upgradable programs
    }

    // Create a new DAO
    // Returns a Future that resolves when the DAO is stored on-chain
    async transition create_dao(
        public name_hash: field,
        public voting_period: u32,
        public quorum: u32,
        public proposal_threshold: u64
    ) -> Future {
        let dao_id: field = BHP256::hash_to_field(name_hash);
        
        return finalize_create_dao(dao_id, self.caller, voting_period, quorum, proposal_threshold);
    }

    async function finalize_create_dao(
        dao_id: field,
        creator: address,
        voting_period: u32,
        quorum: u32,
        proposal_threshold: u64
    ) {
        assert(!daos.contains(dao_id));
        
        let new_dao: DAO = DAO {
            id: dao_id,
            creator: creator,
            voting_period: voting_period,
            quorum: quorum,
            proposal_threshold: proposal_threshold,
            created_at: block.height,
        };
        
        daos.set(dao_id, new_dao);
        member_count.set(dao_id, 0u32);
    }

    // Register as a member of a DAO (private)
    // Returns a private Member record and a Future
    async transition register_member(
        public dao_id: field,
        public initial_voting_power: u64
    ) -> (Member, Future) {
        // Create private member record
        let member: Member = Member {
            owner: self.caller,
            dao_id: dao_id,
            joined_at: 0u32, // block.height unavailable in async transition
            voting_power: initial_voting_power,
        };

        return (member, finalize_register_member(dao_id));
    }

    async function finalize_register_member(dao_id: field) {
        // Verify DAO exists
        assert(daos.contains(dao_id));
        
        // Increment member count
        let current_count: u32 = member_count.get_or_use(dao_id, 0u32);
        member_count.set(dao_id, current_count + 1u32);
    }

    // Update DAO settings (only creator can update)
    async transition update_dao_settings(
        public dao_id: field,
        public new_voting_period: u32,
        public new_quorum: u32,
        public new_proposal_threshold: u64
    ) -> Future {
        // Retrieve and update DAO
        return finalize_update_dao_settings(dao_id, self.caller, new_voting_period, new_quorum, new_proposal_threshold);
    }

    async function finalize_update_dao_settings(
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
    // This stays as a regular transition because it reads no state and writes no state?
    // Actually, transition CAN read state? No, only finalize reads state.
    // This helper was processing a record. It doesn't need to be async if it doesn't touch mappings.
    transition verify_voting_power(
        member_record: Member,
        public dao_id: field
    ) -> (Member, u64) {
        // Verify member belongs to the DAO
        assert_eq(member_record.dao_id, dao_id);
        
        // Return member record and their voting power
        return (member_record, member_record.voting_power);
    }

    // Manual initialization (acts as constructor fix)
    async transition initialize() -> Future {
        return finalize_initialize();
    }

    async function finalize_initialize() {
        // Initialize mapping with a dummy value to ensure existence
        // (Optional but helps with some deployment checks)
        let initialized: bool = daos.contains(0field);
        if !initialized {
            // Reserve ID 0
            let zero_dao: DAO = DAO {
                id: 0field,
                creator: aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc, // burn address
                voting_period: 0u32,
                quorum: 0u32,
                proposal_threshold: 0u64,
                created_at: 0u32,
            };
            daos.set(0field, zero_dao);
        }
    }
}
