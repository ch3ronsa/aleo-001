# AleoDAO Submission

## 🌟 Project Overview
**AleoDAO** is a "3-in-1" generic privacy framework built on Aleo. It unifies three critical governance tools into a single, cohesive platform protected by Zero-Knowledge Proofs:
1.  **Private DAOs:** Governance with confidential voting power.
2.  **Anonymous Voting:** Encrypted on-chain ballots.
3.  **Private Polls:** Honest community sentiment analysis.

We believe that **privacy is the catalyst for honesty**. Current DAOs suffer from voter apathy and "whale watching" because everything is public. AleoDAO solves this by making the *process* transparent but the *participants* private.

---

## 🛠️ Technical Implementation

### Smart Contracts (Leo)
We implemented three core programs using Leo (v1.12.0 / v3.4.0 syntax):
*   `dao_registry.aleo`: Manages DAO creation and private membership (`record Member`).
*   `proposal.aleo`: Handles proposal lifecycle and state.
*   `private_vote.aleo`: Implements the ZK-voting mechanism using private records (`record PrivateVote`) and public receipts (`VoteReceipt`).

**Key Privacy Mechanism:**
We use Aleo's **Record Model** to store voting power privately. When a user votes:
1.  They consume their private `Member` record.
2.  They produce a new private `Member` record (unchanged power).
3.  They produce a private `PrivateVote` record (contains their choice).
4.  They produce a public `VoteReceipt` (proof of participation).

### Frontend (Next.js 14)
*   **Framework:** Next.js 14 (App Router)
*   **UI/UX:** TailwindCSS + shadcn/ui for a premium, dark-mode "crypto-native" feel.
*   **State Management:** Zustand for handling poll and vote states efficiently.
*   **ZK Simulation:** Due to testnet instability, we implemented a high-fidelity "Demo Mode" that simulates the ZK-proof generation delay and flow, providing a realistic user experience.

---

## 🚧 Challenges & Solutions

### The Deployment Challenge
During the hackathon, we faced persistent **"500 Internal Server Errors"** and **"Consensus Version"** issues with the Aleo Testnet 3 endpoints (`provable` and `aleoscan`). Despite using various deployment methods (Leo CLI, Aleo SDK, Online Deployer) and high priority fees, the network instability prevented a final live deployment.

### Our Solution: "Demo Mode" Architecture
Instead of submitting incomplete work, we pivoted to build a robust **Demo Mode**.
*   We mocked the contract interactions on the frontend to strictly follow the logic of our written Leo contracts.
*   This allows judges to experience the **full user flow**—from creating a DAO to casting a private vote—exactly as it would function on mainnet.
*   The actual Leo code is available in the `programs/` directory for technical review.

---

## 🔮 Future Roadmap
1.  **Mainnet Deployment:** Once the Aleo network stabilizes, deploying our validated contracts is the immediate next step.
2.  **Multi-Sig Integration:** Adding private multi-sig wallets for DAO treasuries.
3.  **Whistleblower Module:** Re-integrating the whistleblower feature as a standalone privacy tool.

---

## 📺 Video Demo
[Link to Demo Video] (Please see the uploaded video file)

## 🔗 Links
*   **Repository:** [GitHub Link]
*   **Leo Contracts:** `/programs` directory
