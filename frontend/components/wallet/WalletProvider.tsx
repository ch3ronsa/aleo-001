'use client'

import React, { useState, useEffect } from 'react'
import WalletProviderInner from './WalletProviderInner'

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // During SSR (mounted=false), we still wrap in WalletProviderInner but mark it as isSSR
    // This provides the context so children calling useWallet() don't crash the build/SSR.
    // Once mounted, we re-render with full wallet functionality.
    return (
        <WalletProviderInner isSSR={!mounted}>
            {children}
        </WalletProviderInner>
    )
}
