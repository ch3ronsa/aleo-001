'use client'

import React, { ReactNode } from 'react'
import { PuzzleWalletProvider } from '@puzzlehq/sdk'

interface WalletProviderProps {
    children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
    return (
        <PuzzleWalletProvider
            dAppName="AleoDAO"
            dAppDescription="Privacy-first DAO governance using zero-knowledge proofs"
            dAppUrl="https://aleodao.vercel.app"
            dAppIconURL="https://aleodao.vercel.app/icon.png"
        >
            {children}
        </PuzzleWalletProvider>
    )
}
