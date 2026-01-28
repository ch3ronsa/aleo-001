# AleoDAO Demo Video Script

## 1. Intro (0:00 - 0:20)
**Visual:** Landing Page (Hero Section)

"Hi everyone. Welcome to **AleoDAO**, the first comprehensive Privacy-First Governance Platform on Aleo.

Traditional DAOs have a major problem: Transparenc is great for the *process*, but terrible for the *participants*. Public voting often leads to voter apathy, whale watching, and even coercion.

AleoDAO solves this with a **3-in-1 System** powered by Zero-Knowledge Proofs:
1. Private DAOs
2. Anonymous Voting
3. and Private Polls."

---

## 2. Feature 1: Private DAOs (0:20 - 0:50)
**Visual:** Dashboard -> Create DAO / View DAO

"Let's start with Private DAOs.
*(Click 'Dashboard')*

Here, anyone can launch a decentralized organization. But unlike Ethereum DAOs, here your membership is privacy-preserving.

*(Show DAO details)*
While the DAO itself is public, individual member holdings—your **Voting Power**—are stored in private records. This means I can participate in governance without revealing my entire financial status to the world."

---

## 3. Feature 2: Anonymous Voting (0:50 - 1:30)
**Visual:** Proposals Page -> Voting on a Proposal

"Now, the core feature: **Anonymous Voting**.
*(Go to 'Proposals' -> Click on a Proposal)*

I want to vote on this proposal using my private tokens.
*(Select 'Approve' -> Click 'Confirm')*

Notice what happens here. The system is generating a **Zero-Knowledge Proof**.
*(Wait for 'Generating Proof...' animation)*

My vote choice—'True' or 'False'—is encrypted within the transaction. No one on the network can see *how* I voted, but everyone can verify that the final tally is correct. This is the power of Aleo."

---

## 4. Feature 3: Private Polls (1:30 - 2:00)
**Visual:** Polls Page -> Create Poll / Vote

"Finally, we have **Private Polls**—our newest feature.
*(Go to 'Polls' -> Create new poll)*

This is perfect for community sentiment. I can create a multi-choice poll where responses are encrypted.
*(Show voting on a poll)*

Users can answer honestly, knowing their individual response is linked only to a cryptographic proof, not their public identity."

---

## 5. Deployment Note & Outro (2:00 - 2:30)
**Visual:** Landing Page or GitHub Repo showing contracts

"A quick technical note: Due to instability on the Aleo Testnet 3 during the hackathon, we are demonstrating this on our **Demo Mode**, which simulates the exact ZK-flow defined in our Leo smart contracts.

You can find our full `dao_registry`, `proposal`, and `private_vote` Leo contracts in our repository, ready for mainnet.

AleoDAO is bringing true privacy to governance. Thank you for watching!"
