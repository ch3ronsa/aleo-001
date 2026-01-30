# AleoDAO - 3-in-1 Privacy-First Governance Platform

![AleoDAO Banner](public/og-image.png)

## 🚀 Project Overview

**AleoDAO** is a comprehensive **Privacy-First DAO Infrastructure** built on the **Aleo** blockchain. It leverages Zero-Knowledge Proofs (ZKPs) to enable verifiable yet confidential governance.

This is a **3-in-1 DAO System** designed for the Aleo Buildathon:

1.  **🔒 Private DAOs:** Participate in governance without revealing your total token holdings. Voting power stays private.
2.  **🗳️ Anonymous Voting:** Cast on-chain votes where your choice (Yes/No) is encrypted via ZKPs, but the final tally is public.
3.  **📊 Private Polls:** Multi-choice community surveys where individual responses are secret, encouraging 100% honest feedback.

---

## 🛠️ Deployment & Status (Hackathon Note)

**Current Status: DEMO MODE READY**

Due to Aleo Testnet 3 stability issues and endpoint delays, we have optimized the application for **Judging UX** using a high-fidelity **Demo Mode**:
- **Smart Contracts:** 3 functional Leo programs located in `/programs`.
- **ZK-Proof Flow:** Simulated in the frontend to demonstrate real-world latency and user flow.
- **Wallet Integration:** Built using the **Puzzle SDK** (Official ecosystem wallet).

---

## ✨ Features

- **ZK-Privacy:** User balances and individual choices are never leaked.
- **On-Chain Verifiability:** All results are aggregated and verified by smart contracts.
- **Modern UI:** A dark-mode, premium interface built with Next.js 14 and shadcn/ui.
- **Zero-Confidant Governance:** No relayers or central servers are needed for privacy.

---

## 🔍 Technical Architecture

AleoDAO uses Aleo's **Record Model** to maintain state:
- `Member` Records: Store private voting power.
- `PrivateVote` Records: Store encrypted choices.
- `VoteReceipt` Records: Provide public proof of participation.

---

## � Submission Information

**Lead Developer:** [USER NAME]
**Discord:** [USER DISCORD]
**Website:** [https://aleodao.vercel.app](https://aleodao.vercel.app)
**Full Submission Details:** See [SUBMISSION.md](./SUBMISSION.md)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- [Puzzle Wallet](https://puzzle.online/) (Chrome Extension)

### Installation
```bash
git clone https://github.com/ch3ronsa/aleo-001
cd aleo-001/frontend
npm install
npm run dev
```

---

## 📄 Documentation Links

- [Detailed Submission Requirements](./SUBMISSION.md)
- [Smart Contract Specs](./docs/CONTRACTS.md)
- [Privacy Model](./docs/PRIVACY.md)
- [Turkish Deployment Guide](./docs/DEPLOYMENT_REHBER.md)

---

**Built with ❤️ for Aleo Buildathon 2024**
