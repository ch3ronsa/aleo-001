# AleoDAO - Project Structure

```
leo/
├── README.md                      # Main project documentation
├── IMPLEMENTATION_PLAN.md         # Detailed development plan
├── .gitignore                     # Git ignore rules
│
├── programs/                      # Leo smart contracts
│   ├── dao_registry/              # DAO creation and management
│   │   ├── src/
│   │   │   └── main.leo          # Main contract code
│   │   ├── inputs/               # Test inputs
│   │   ├── build/                # Compiled contracts
│   │   └── program.json          # Program metadata
│   │
│   ├── proposal/                  # Proposal management
│   │   ├── src/
│   │   │   └── main.leo
│   │   ├── inputs/
│   │   └── program.json
│   │
│   ├── private_vote/              # Private voting mechanism
│   │   ├── src/
│   │   │   └── main.leo
│   │   ├── inputs/
│   │   └── program.json
│   │
│   ├── vote_counting/             # Vote tallying with ZK-proofs
│   │   ├── src/
│   │   │   └── main.leo
│   │   ├── inputs/
│   │   └── program.json
│   │
│   └── token_gate/                # Token ownership verification
│       ├── src/
│       │   └── main.leo
│       ├── inputs/
│       └── program.json
│
├── frontend/                      # Next.js frontend application
│   ├── app/                       # Next.js 14 app directory
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   ├── globals.css           # Global styles
│   │   │
│   │   ├── dashboard/            # DAO dashboard
│   │   │   ├── page.tsx
│   │   │   └── [daoId]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── proposals/            # Proposal management
│   │   │   ├── page.tsx
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [proposalId]/
│   │   │       └── page.tsx
│   │   │
│   │   └── vote/                 # Voting interface
│   │       └── [proposalId]/
│   │           └── page.tsx
│   │
│   ├── components/               # React components
│   │   ├── wallet/              # Wallet connection
│   │   │   ├── ConnectWallet.tsx
│   │   │   └── WalletProvider.tsx
│   │   │
│   │   ├── dao/                 # DAO components
│   │   │   ├── DAOCard.tsx
│   │   │   ├── CreateDAOForm.tsx
│   │   │   ├── DAOStats.tsx
│   │   │   └── DAOList.tsx
│   │   │
│   │   ├── proposals/           # Proposal components
│   │   │   ├── ProposalCard.tsx
│   │   │   ├── CreateProposalForm.tsx
│   │   │   ├── ProposalDetails.tsx
│   │   │   └── ProposalList.tsx
│   │   │
│   │   ├── voting/              # Voting components
│   │   │   ├── VoteForm.tsx
│   │   │   ├── VoteConfirmation.tsx
│   │   │   ├── ResultsChart.tsx
│   │   │   └── VotingPower.tsx
│   │   │
│   │   └── ui/                  # Shared UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...
│   │
│   ├── lib/                     # Utility libraries
│   │   ├── aleo/               # Aleo SDK integration
│   │   │   ├── wallet.ts
│   │   │   ├── account.ts
│   │   │   └── config.ts
│   │   │
│   │   ├── contracts/          # Contract interaction layer
│   │   │   ├── daoRegistry.ts
│   │   │   ├── proposal.ts
│   │   │   ├── voting.ts
│   │   │   └── types.ts
│   │   │
│   │   └── utils/              # Helper functions
│   │       ├── format.ts
│   │       └── validation.ts
│   │
│   ├── public/                 # Static assets
│   │   ├── logo.svg
│   │   └── images/
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md         # System architecture
│   ├── PRIVACY.md              # Privacy model explanation
│   ├── CONTRACTS.md            # Smart contract documentation
│   ├── API.md                  # API reference
│   └── USER_GUIDE.md           # User guide
│
└── scripts/                     # Utility scripts
    ├── deploy.sh               # Deployment script
    └── test.sh                 # Testing script
```

## 📁 Directory Descriptions

### `/programs`
Contains all Leo smart contracts. Each contract is a separate program with its own directory.

### `/frontend`
Next.js 14 application using App Router. Includes all UI components and Aleo SDK integration.

### `/docs`
Comprehensive documentation for the project, including architecture, privacy model, and user guides.

### `/scripts`
Helper scripts for deployment, testing, and development workflows.

## 🔧 Key Files

- **`programs/*/src/main.leo`**: Main Leo contract files
- **`frontend/app/layout.tsx`**: Root layout with wallet provider
- **`frontend/lib/contracts/*.ts`**: Contract interaction layer
- **`frontend/components/wallet/WalletProvider.tsx`**: Aleo wallet integration

## 🚀 Next Steps

1. Install Leo compiler
2. Create basic Leo program templates
3. Initialize Next.js frontend
4. Setup wallet integration
