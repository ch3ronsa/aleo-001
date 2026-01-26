'use client'

import React, { useMemo } from 'react'
import { WalletProvider as AleoWalletProvider } from '@demox-labs/aleo-wallet-adapter-react'
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo'
import { DecryptPermission, WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base'

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
            {children}
        </AleoWalletProvider>
    )
}
