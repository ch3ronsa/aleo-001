'use client'

import { create } from 'zustand'
import { Account } from '@provable/sdk'

interface WalletState {
    account: Account | null
    address: string | null
    isConnected: boolean
    isConnecting: boolean
    connect: () => Promise<void>
    disconnect: () => void
}

export const useWallet = create<WalletState>((set) => ({
    account: null,
    address: null,
    isConnected: false,
    isConnecting: false,

    connect: async () => {
        set({ isConnecting: true })
        try {
            // In production, use Leo Wallet or Puzzle Wallet
            // For now, create a demo account
            const account = new Account()
            const address = account.address().to_string()

            set({
                account,
                address,
                isConnected: true,
                isConnecting: false,
            })

            // Store in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('aleo_wallet_connected', 'true')
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error)
            set({ isConnecting: false })
        }
    },

    disconnect: () => {
        set({
            account: null,
            address: null,
            isConnected: false,
            isConnecting: false,
        })

        if (typeof window !== 'undefined') {
            localStorage.removeItem('aleo_wallet_connected')
        }
    },
}))
