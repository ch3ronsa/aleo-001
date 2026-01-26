'use client'

import { create } from 'zustand'


// Mock Account for demo/UI purposes
class MockAccount {
    private _address: string;

    constructor() {
        // Generate a random-looking Aleo address for demo
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        this._address = 'aleo1' + Array.from({ length: 58 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    address() {
        return {
            to_string: () => this._address
        }
    }
}

interface WalletState {
    account: MockAccount | null
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
            const account = new MockAccount()
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
