'use client'

import React, { useMemo } from 'react'
import { WalletProvider as AleoWalletProvider } from '@demox-labs/aleo-wallet-adapter-react'
import { WalletModalProvider } from '@demox-labs/aleo-wallet-adapter-reactui'
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo'
import { DecryptPermission, WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base'
import { PuzzleWalletAdapter, FoxWalletAdapter, SoterWalletAdapter } from 'aleo-wallet-adapters'

// Import wallet adapter styles
import '@demox-labs/aleo-wallet-adapter-reactui/styles.css'

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const wallets = useMemo(
        () => [
            // Official ecosystem wallets (recommended)
            new PuzzleWalletAdapter({
                appName: 'AleoDAO',
            }),
            new FoxWalletAdapter({
                appName: 'AleoDAO',
            }),
            new SoterWalletAdapter({
                appName: 'AleoDAO',
            }),
            // Leo Wallet (legacy)
            new LeoWalletAdapter({
                appName: 'AleoDAO',
            }),
        ],
        []
    )

    return (
        <AleoWalletProvider
            wallets={wallets}
            decryptPermission={DecryptPermission.UponRequest}
            network={WalletAdapterNetwork.Testnet}
            autoConnect={true}
        >
            <WalletModalProvider>
                {children}
            </WalletModalProvider>
        </AleoWalletProvider>
    )
}
