# AleoDAO Smart Contract Documentation

## Contract Overview

AleoDAO consists of three core smart contracts that work together to provide privacy-preserving DAO governance:

1. **dao_registry.aleo** - DAO creation and member management
2. **proposal.aleo** - Proposal lifecycle management
3. **private_vote.aleo** - Private voting with ZK-proofs

---

## 1. DAO Registry Contract

### Purpose
Manages DAO creation, member registration, and settings updates. Member records are **private** to protect token balances.

### Key Structures

#### DAO
```leo
struct DAO {
    id: field,                      // Unique identifier
    creator: address,               // Creator address
    voting_period: u32,             // Voting duration in blocks
    quorum: u32,                    // Minimum votes (basis points)
    proposal_threshold: u64,        // Min tokens to propose
    created_at: u32,                // Creation block height
}
```

#### Member (Private Record)
```leo
record Member {
    owner: address,                 // Member address
    dao_id: field,                  // DAO membership
    joined_at: u32,                 // Join timestamp
    voting_power: u64,              // Token balance (PRIVATE!)
}
```

### Functions

#### create_dao
Creates a new DAO organization.

**Parameters:**
- `name_hash: field` - Hash of DAO name
- `voting_period: u32` - Voting duration (e.g., 100800 ≈ 7 days)
- `quorum: u32` - Quorum percentage in basis points (5000 = 50%)
- `proposal_threshold: u64` - Minimum tokens to create proposals

**Returns:** `DAO` struct

**Example:**
```bash
leo run create_dao 12345field 100800u32 5000u32 1000u64
```

#### register_member
Registers a member with private voting power.

**Parameters:**
- `dao_id: field` - Which DAO to join
- `initial_voting_power: u64` - Token balance (kept private)

**Returns:** Private `Member` record

**Privacy:** Member's token balance is **never revealed publicly**

#### update_dao_settings
Updates DAO parameters (only creator can call).

**Parameters:**
- `dao_id: field`
- `new_voting_period: u32`
- `new_quorum: u32`
- `new_proposal_threshold: u64`

**Access Control:** Only DAO creator can update

---

## 2. Proposal Contract

### Purpose
Manages proposal creation, voting lifecycle, and result finalization.

### Key Structures

#### Proposal
```leo
struct Proposal {
    id: field,
    dao_id: field,
    proposer: address,
    title_hash: field,
    description_hash: field,
    voting_start: u32,
    voting_end: u32,
    status: u8,                     // 0=Pending, 1=Active, 2=Succeeded, 3=Failed, 4=Executed
    created_at: u32,
}
```

### Proposal Lifecycle

```
Pending (0) → Active (1) → Succeeded/Failed (2/3) → Executed (4)
```

### Functions

#### create_proposal
Creates a new proposal for voting.

**Parameters:**
- `dao_id: field`
- `title_hash: field` - Hash of title
- `description_hash: field` - Hash of description
- `voting_start_delay: u32` - Blocks until voting starts
- `voting_duration: u32` - How long voting lasts

**Example:**
```bash
leo run create_proposal 12345field 98765field 11111field 100u32 14400u32
```

#### activate_proposal
Activates a proposal once voting period starts.

**Requirements:** Current block ≥ `voting_start`

#### finalize_proposal
Finalizes voting and determines if proposal passed.

**Parameters:**
- `proposal_id: field`
- `quorum: u32` - Quorum from DAO settings

**Logic:**
- Checks if quorum met
- Calculates yes/no percentage
- Sets status to Succeeded (2) or Failed (3)

#### mark_executed
Marks a succeeded proposal as executed.

**Access Control:** Only proposer can mark as executed

---

## 3. Private Vote Contract

### Purpose
**THE CORE PRIVACY FEATURE**: Enables completely anonymous voting while maintaining verifiable results.

### Privacy Guarantees

✅ **Vote choice is private** - No one knows how you voted  
✅ **Voting power is private** - Token balance stays hidden  
✅ **Vote receipt proves participation** - Without revealing choice  
✅ **Results are verifiable** - ZK-proofs ensure integrity  

### Key Structures

#### Vote (Private Record)
```leo
record Vote {
    owner: address,
    proposal_id: field,
    vote_choice: bool,              // PRIVATE! true=yes, false=no
    voting_power: u64,              // PRIVATE! Amount of votes
    voted_at: u32,
}
```

#### VoteReceipt (Public Proof)
```leo
record VoteReceipt {
    owner: address,
    proposal_id: field,
    voted_at: u32,
    // Note: NO vote_choice or voting_power!
}
```

### Functions

#### cast_vote
Casts a private vote on a proposal.

**Parameters:**
- `member_record: Member` - Proves voting eligibility
- `proposal_id: field`
- `vote_choice: bool` - true = yes, false = no (PRIVATE!)

**Returns:**
- Original `Member` record (unchanged)
- Private `Vote` record
- Public `VoteReceipt` (proves you voted, not HOW you voted)

**Privacy Mechanism:**
1. Vote choice stored in private record
2. Tally updated in encrypted form
3. Receipt proves participation without revealing vote
4. ZK-proofs ensure vote validity

**Anti-Double-Voting:**
Uses `has_voted` mapping to prevent duplicate votes per proposal.

#### verify_eligibility
Checks if member can vote without revealing balance.

**Parameters:**
- `member_record: Member`
- `proposal_id: field`
- `minimum_power: u64`

**Returns:** `bool` - eligible or not (without revealing actual balance)

#### reveal_tally
Reveals vote results after voting ends.

**Parameters:**
- `proposal_id: field`

**Returns:** `(yes_votes: u64, no_votes: u64)`

**When to call:** After proposal voting period ends

---

## Usage Flow Example

### Complete Governance Flow

```bash
# 1. Create DAO
leo run create_dao 12345field 100800u32 5000u32 1000u64

# 2. Register members (each member runs this)
leo run register_member 12345field 5000u64

# 3. Create proposal
leo run create_proposal 12345field 98765field 11111field 100u32 14400u32

# 4. Activate proposal (after delay)
leo run activate_proposal 98765field

# 5. Members vote (PRIVATELY!)
leo run cast_vote <member_record> 98765field true   # Vote YES
leo run cast_vote <member_record> 98765field false  # Vote NO

# 6. Finalize after voting ends
leo run finalize_proposal 98765field 5000u32

# 7. Reveal results
leo run reveal_tally 98765field

# 8. Execute if passed
leo run mark_executed 98765field
```

---

## Privacy Model

### What's Public
- DAO exists with settings
- Proposals exist with metadata
- Vote receipts (who voted, not how)
- Final vote tallies (after voting ends)

### What's Private
- Individual vote choices ✅
- Member token balances ✅
- Voting power amounts ✅
- How much each person voted ✅

### How Privacy Works
1. **Private Records**: Vote choices stored in user's private records
2. **ZK-Proofs**: Prove vote validity without revealing content
3. **Encrypted Tallies**: Votes aggregated in encrypted form
4. **Receipt System**: Prove participation without revealing choice

---

## Security Considerations

### Sybil Resistance
- Members must prove token ownership
- Voting power tied to token balance
- One vote per address per proposal

### Double-Voting Prevention
- `has_voted` mapping tracks participation
- Enforced in `finalize` block

### Access Control
- Only DAO creator can update settings
- Only proposer can mark as executed
- Members vote with their own power

---

## Testing

### Unit Tests

Each contract includes test inputs in `inputs/` directory.

**Run tests:**
```bash
cd programs/dao_registry
leo build
leo test

cd ../proposal
leo build
leo test

cd ../private_vote
leo build
leo test
```

### Integration Testing

Test full flow from DAO creation through voting:
```bash
./scripts/test.sh
```

---

## Deployment

### Testnet Deployment

```bash
# Deploy DAO registry first
cd programs/dao_registry
leo deploy --network testnet

# Deploy proposal contract
cd ../proposal
leo deploy --network testnet

# Deploy private vote contract (requires others deployed)
cd ../private_vote
leo deploy --network testnet
```

### Mainnet Deployment

```bash
leo deploy --network mainnet
```

---

## Future Enhancements (Wave 2)

- ✨ Quadratic voting
- ✨ Private delegation
- ✨ Multi-sig proposals
- ✨ Time-locked voting
- ✨ Governance token distribution
- ✨ Snapshot voting
- ✨ Gasless voting via relayers

---

## Support

- **Documentation**: [docs/](./docs/)
- **Issues**: GitHub Issues
- **Discord**: [Your Discord Handle]

**Built with ❤️ on Aleo**
