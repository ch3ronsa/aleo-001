'use client'

import React, { useMemo } from 'react'
import { WalletProvider as AleoWalletProvider } from '@demox-labs/aleo-wallet-adapter-react'
import { WalletModalProvider } from '@demox-labs/aleo-wallet-adapter-reactui'
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo'
import { DecryptPermission, WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base'

// Import wallet adapter styles
import '@demox-labs/aleo-wallet-adapter-reactui/styles.css'

export default function WalletProviderInner({
    children,
    isSSR = false
}: {
    children: React.ReactNode,
    isSSR?: boolean
}) {
    // Only initialize LeoWalletAdapter. 
    // We removed aleo-wallet-adapters (Puzzle/Fox/Soter) because it caused build crashes 
    // due to conflicting React versions in its dependencies (Puzzle SDK).
    const wallets = useMemo(
        () => isSSR ? [] : [
            new LeoWalletAdapter({
                appName: 'AleoDAO',
            }),
        ],
        [isSSR]
    )

    return (
        <AleoWalletProvider
            wallets={wallets}
            decryptPermission={DecryptPermission.UponRequest}
            network={WalletAdapterNetwork.Testnet}
            autoConnect={!isSSR}
        >
            <WalletModalProvider>
                {children}
            </WalletModalProvider>
        </AleoWalletProvider>
    )
}
