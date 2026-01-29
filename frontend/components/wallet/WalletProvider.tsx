'use client'

import React, { useMemo } from 'react'
import { WalletProvider as AleoWalletProvider } from '@demox-labs/aleo-wallet-adapter-react'
import { WalletModalProvider } from '@demox-labs/aleo-wallet-adapter-reactui'
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo'
import { DecryptPermission, WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base'

// Import wallet adapter styles
import '@demox-labs/aleo-wallet-adapter-reactui/styles.css'

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const wallets = useMemo(
        () => [
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
