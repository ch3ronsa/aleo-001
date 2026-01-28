# 🗳️ AleoDAO - The Universal Privacy Layer

**The World's First Privacy-First Governance Platform on Aleo**

AleoDAO is a comprehensive technical infrastructure designed to protect the two most critical assets in decentralized communication: **Your Choice and Your Wealth.** Leveraging Aleo's Zero-Knowledge Proof (ZKP) architecture, it serves as a multi-purpose engine for confidential high-stakes interactions.

---

## 🌟 The Four Core Pillars

### 1. Anonymous Voting
*   **Encrypted Choices**: Your vote (Approve, Reject, or Abstain) is cryptographically hashed locally.
*   **ZK-Proof Submission**: Submit a proof of validity without ever revealing the underlying choice.
*   **Whall Protection**: Prevents strategic voting and "whale watching" by keeping individual ballots secret.

### 2. Private DAO Governance
*   **Confidential Holdings**: Prove you meet the threshold for participation without revealing your exact token balance.
*   **Private Membership**: Join and interact with organizations while keeping your financial footprint hidden from other members.

### 3. Whistleblower Protection
*   **Safe Signaling**: Report critical issues or "signal" within an organization with absolute cryptographic anonymity.
*   **Coercion Resistance**: Because the whistleblower's identity is never revealed on-chain, retaliation becomes technically impossible.

### 4. Private Polls & Surveys
*   **Unbiased Data**: Gather honest community feedback without the pressure of surveillance.
*   **Integrity Verified**: Results are publicly verifiable via ZK-Rollups while individual responses remain confidential.

---

## 🛠️ How It Works (The ZK-Workflow)

AleoDAO transforms traditional transparent communication into a secure, private engine:

1.  **Local Proof Generation**: When you take an action (vote or report), your **Leo Wallet** generates a Zero-Knowledge Proof locally on your device. Your sensitive data never leaves your machine.
2.  **Private Transition**: Only the mathematical proof is sent to the Aleo network. No observer or "watcher" can link the transaction to your choice or your balance.
3.  **Cryptographic Validation**: The AleoDAO smart contracts verify the proof is sound and aggregate it into the final results. Results are verified publicly; individual data is private forever.

---

## 🔍 Technical Highlights

- **Blockchain**: Built natively on **Aleo Testnet**.
- **Wallet**: Real-world integration with **Leo Wallet** for secure transaction signing.
- **UI Architecture**: High-fidelity frontend matching the official `vote.aleo.org` (ARC-0009) aesthetic.
- **Privacy Model**: Fully decentralized ZK-proving (no central server or relayers needed).

---

## 🚀 Live Demo & Deployed Contracts

### Frontend
- **Live Demo**: [https://aleodao.vercel.app](https://aleodao.vercel.app)

### Deployed Contracts (Aleo Testnet)
> **Note**: Update these after deployment via `leo deploy --network testnet`

| Contract | Program ID | Status |
|----------|------------|--------|
| DAO Registry | `dao_registry_XXXXX.aleo` | 🟡 Pending |
| Proposal | `proposal_XXXXX.aleo` | 🟡 Pending |
| Private Vote | `private_vote_XXXXX.aleo` | 🟡 Pending |

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Leo CLI (via WSL on Windows)
- Leo Wallet browser extension

### Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Smart Contracts
```bash
# Install Leo (in WSL)
curl -L https://raw.githubusercontent.com/ProvableHQ/leo/mainnet/install.sh | bash

# Build contracts
cd programs/dao_registry
leo build

# Deploy to testnet
leo deploy --network testnet
```

---

## 👥 Team

| Name | Role | Discord | Wallet |
|------|------|---------|--------|
| [Your Name] | Lead Developer | [Discord Handle] | `aleo1...` |

---

## 📄 Documentation

- [Implementation Plan](./IMPLEMENTATION_PLAN.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Submission Details](./SUBMISSION.md)
- [Quick Start Guide](./QUICKSTART.md)

---

**Built with ❤️ for the Aleo Buildathon**

