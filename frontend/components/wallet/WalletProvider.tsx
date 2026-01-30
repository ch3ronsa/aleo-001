'use client'

import dynamic from 'next/dynamic'
import React, { useState, useEffect } from 'react'

const WalletProviderInner = dynamic(
    () => import('./WalletProviderInner'),
    { ssr: false }
)

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <>{children}</>
    }

    return <WalletProviderInner>{children}</WalletProviderInner>
}
