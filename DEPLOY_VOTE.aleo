import ad_registry_5821.aleo;

program ad_vote_5821.aleo;

record PrivateVote:
    owner as address.private;
    proposal_id as field.private;
    vote_choice as boolean.private;
    voting_power as u64.private;
    voted_at as u32.private;

record VoteReceipt:
    owner as address.private;
    proposal_id as field.private;
    voted_at as u32.private;

function cast_vote:
    input r0 as ad_registry_5821.aleo/Member.record;
    input r1 as field.public;
    input r2 as boolean.private;
    cast self.caller r1 r2 r0.voting_power 0u32 into r3 as PrivateVote.record;
    cast self.caller r1 0u32 into r4 as VoteReceipt.record;
    async cast_vote r1 self.caller r0.dao_id r2 r0.voting_power into r5;
    output r0 as ad_registry_5821.aleo/Member.record;
    output r3 as PrivateVote.record;
    output r4 as VoteReceipt.record;
    output r5 as ad_vote_5821.aleo/cast_vote.future;

finalize cast_vote:
    input r0 as field.public;
    input r1 as address.public;
    input r2 as field.public;
    input r3 as boolean.public;
    input r4 as u64.public;
    hash.bhp256 r0 into r5 as field;
    get.or_use has_voted[r5] false into r6;
    not r6 into r7;
    assert.eq r7 true;
    set true into has_voted[r5];
    get.or_use vote_tallies[r0] 0field into r8;
    branch.eq r3 true to then_0_0 otherwise to else_0_1;
    position then_0_0;
    mul r4 1000000u64 into r9;
    cast r9 into r10 as field;
    add r8 r10 into r11;
    set r11 into vote_tallies[r0];
    branch to end_if_0_2;
    position else_0_1;
    cast r4 into r12 as field;
    add r8 r12 into r13;
    set r13 into vote_tallies[r0];
    position end_if_0_2;

function verify_eligibility:
    input r0 as ad_registry_5821.aleo/Member.record;
    input r1 as field.public;
    input r2 as u64.public;
    gte r0.voting_power r2 into r3;
    output r0 as ad_registry_5821.aleo/Member.record;
    output r3 as boolean.private;
