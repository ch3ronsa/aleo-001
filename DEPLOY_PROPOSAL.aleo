program ad_proposal_5821.aleo;

struct Proposal:
    id as field;
    dao_id as field;
    proposer as address;
    title_hash as field;
    description_hash as field;
    voting_start as u32;
    voting_end as u32;
    status as u8;
    created_at as u32;

struct VoteTally:
    proposal_id as field;
    yes_votes as u64;
    no_votes as u64;
    total_votes as u64;

function create_proposal:
    input r0 as field.public;
    input r1 as field.public;
    input r2 as field.public;
    input r3 as u32.public;
    input r4 as u32.public;
    hash.bhp256 r1 into r5 as field;
    async create_proposal r0 r5 self.caller r1 r2 r3 r4 into r6;
    output r6 as ad_proposal_5821.aleo/create_proposal.future;

finalize create_proposal:
    input r0 as field.public;
    input r1 as field.public;
    input r2 as address.public;
    input r3 as field.public;
    input r4 as field.public;
    input r5 as u32.public;
    input r6 as u32.public;
    add block.height r5 into r7;
    add r7 r6 into r8;
    contains proposals[r1] into r9;
    not r9 into r10;
    assert.eq r10 true;
    cast r1 r0 r2 r3 r4 r7 r8 0u8 block.height into r11 as Proposal;
    set r11 into proposals[r1];
    set 0u8 into proposal_status[r1];
    cast r1 0u64 0u64 0u64 into r12 as VoteTally;
    set r12 into vote_tallies[r1];
    get.or_use proposal_count[r0] 0u32 into r13;
    add r13 1u32 into r14;
    set r14 into proposal_count[r0];

function activate_proposal:
    input r0 as field.public;
    async activate_proposal r0 into r1;
    output r1 as ad_proposal_5821.aleo/activate_proposal.future;

finalize activate_proposal:
    input r0 as field.public;
    get proposals[r0] into r1;
    gte block.height r1.voting_start into r2;
    assert.eq r2 true;
    get proposal_status[r0] into r3;
    assert.eq r3 0u8;
    set 1u8 into proposal_status[r0];

function finalize_proposal:
    input r0 as field.public;
    input r1 as u32.public;
    async finalize_proposal r0 r1 into r2;
    output r2 as ad_proposal_5821.aleo/finalize_proposal.future;

finalize finalize_proposal:
    input r0 as field.public;
    input r1 as u32.public;
    get proposals[r0] into r2;
    gt block.height r2.voting_end into r3;
    assert.eq r3 true;
    get vote_tallies[r0] into r4;
    add r4.yes_votes r4.no_votes into r5;
    mul r4.yes_votes 10000u64 into r6;
    div r6 r5 into r7;
    gt r4.total_votes 0u64 into r8;
    gte r7 5000u64 into r9;
    and r8 r9 into r10;
    ternary r10 2u8 3u8 into r11;
    set r11 into proposal_status[r0];

function mark_executed:
    input r0 as field.public;
    async mark_executed r0 self.caller into r1;
    output r1 as ad_proposal_5821.aleo/mark_executed.future;

finalize mark_executed:
    input r0 as field.public;
    input r1 as address.public;
    get proposals[r0] into r2;
    assert.eq r2.proposer r1;
    get proposal_status[r0] into r3;
    assert.eq r3 2u8;
    set 4u8 into proposal_status[r0];
