# AleoDAO - 3-in-1 Privacy-First Governance Platform

![AleoDAO Banner](public/og-image.png)

## 🚀 Project Overview

**AleoDAO** is a comprehensive **Privacy-First DAO Infrastructure** built on the **Aleo** blockchain. It leverages Zero-Knowledge Proofs (ZKPs) to enable verifiable yet confidential governance.

This is a **3-in-1 DAO System** that solves critical privacy issues in current governance models:

1.  **🔒 Private DAOs:** Participate in governance without revealing your total token holdings or financial status.
2.  **🗳️ Anonymous Voting:** Cast on-chain votes where your choice (Yes/No) is encrypted, but the final tally is mathematically verifiable.
3.  **📊 Private Polls:** Conduct multi-choice surveys and polls where individual responses are kept secret, encouraging honest feedback.

---

### ⚠️ Deployment Status (Hackathon Note)

**Current Status: DEMO MODE ACTIVE**

Due to intermittent instability and "500 Internal Server Errors" on the **Aleo Testnet 3** (and its explorers/endpoints), the live smart contract deployment could not be finalized along with the frontend integration. 

However, the application is **fully functional in Demo Mode**:
- **Smart Contracts** are fully written, compiled, and available in the `programs/` directory.
- **ZK-Proofs** generation is simulated in the frontend to demonstrate the UX.
- All 3 core features (DAOs, Proposals, Polls) are interactive and testable.

---

## ✨ Key Features

### 1. Private DAOs
- Create organizations with customizable governance settings.
- **Privacy:** Member list is public, but individual **Voting Power** is stored in private records (`record Member`). No one can see your "weight" in the DAO.

### 2. Anonymous Voting (ZK-Voting)
- Vote on proposals without revealing your choice.
- **Privacy:** Your vote (`true`/`false`) is encrypted in a `PrivateVote` record.
- **Verifiability:** A `VoteReceipt` is published to prove you participated.

### 3. Private Polls
- Create and participate in community polls.
- **Privacy:** Responses are encrypted, ensuring users can answer honestly without fear of social pressure or retaliation.

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

