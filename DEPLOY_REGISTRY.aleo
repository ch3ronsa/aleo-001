program ad_registry_5821.aleo;

struct DAO:
    id as field;
    creator as address;
    voting_period as u32;
    quorum as u32;
    proposal_threshold as u64;
    created_at as u32;

record Member:
    owner as address.private;
    dao_id as field.private;
    joined_at as u32.private;
    voting_power as u64.private;

function create_dao:
    input r0 as field.public;
    input r1 as u32.public;
    input r2 as u32.public;
    input r3 as u64.public;
    hash.bhp256 r0 into r4 as field;
    async create_dao r4 self.caller r1 r2 r3 into r5;
    output r5 as ad_registry_5821.aleo/create_dao.future;

finalize create_dao:
    input r0 as field.public;
    input r1 as address.public;
    input r2 as u32.public;
    input r3 as u32.public;
    input r4 as u64.public;
    contains daos[r0] into r5;
    not r5 into r6;
    assert.eq r6 true;
    cast r0 r1 r2 r3 r4 block.height into r7 as DAO;
    set r7 into daos[r0];
    set 0u32 into member_count[r0];

function register_member:
    input r0 as field.public;
    input r1 as u64.public;
    cast self.caller r0 0u32 r1 into r2 as Member.record;
    async register_member r0 into r3;
    output r2 as Member.record;
    output r3 as ad_registry_5821.aleo/register_member.future;

finalize register_member:
    input r0 as field.public;
    contains daos[r0] into r1;
    assert.eq r1 true;
    get.or_use member_count[r0] 0u32 into r2;
    add r2 1u32 into r3;
    set r3 into member_count[r0];

function update_dao_settings:
    input r0 as field.public;
    input r1 as u32.public;
    input r2 as u32.public;
    input r3 as u64.public;
    async update_dao_settings r0 self.caller r1 r2 r3 into r4;
    output r4 as ad_registry_5821.aleo/update_dao_settings.future;

finalize update_dao_settings:
    input r0 as field.public;
    input r1 as address.public;
    input r2 as u32.public;
    input r3 as u32.public;
    input r4 as u64.public;
    get daos[r0] into r5;
    assert.eq r5.creator r1;
    cast r5.id r5.creator r2 r3 r4 r5.created_at into r6 as DAO;
    set r6 into daos[r0];

function verify_voting_power:
    input r0 as Member.record;
    input r1 as field.public;
    assert.eq r0.dao_id r1;
    output r0 as Member.record;
    output r0.voting_power as u64.private;

function initialize:
    async initialize into r0;
    output r0 as ad_registry_5821.aleo/initialize.future;

finalize initialize:
    contains daos[0field] into r0;
    not r0 into r1;
    branch.eq r1 true to end_then_0_0;
    branch to end_otherwise_0_1;
    position end_then_0_0;
    cast 0field aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc 0u32 0u32 0u64 0u32 into r2 as DAO;
    set r2 into daos[0field];
    position end_otherwise_0_1;
