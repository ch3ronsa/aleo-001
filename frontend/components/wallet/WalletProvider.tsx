'use client'

import { useEffect } from 'react'
import { useWallet } from '@/lib/aleo/wallet'

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const { connect } = useWallet()

    useEffect(() => {
        // Auto-reconnect if previously connected
        if (typeof window !== 'undefined') {
            const wasConnected = localStorage.getItem('aleo_wallet_connected')
            if (wasConnected === 'true') {
                connect()
            }
        }
    }, [connect])

    return <>{children}</>
}
