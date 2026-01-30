'use client'

import { useConnect, useAccount, useDisconnect } from '@puzzlehq/sdk'
import { useCallback } from 'react'

// Wrapper hook that provides a consistent wallet API for the app
// Now uses Puzzle SDK instead of demox-labs adapter
export const useWallet = () => {
    const { connect } = useConnect()
    const { account, isConnected: connected } = useAccount()
    const { disconnect: puzzleDisconnect } = useDisconnect()

    const connectWallet = useCallback(async () => {
        try {
            await connect()
        } catch (error) {
            console.error('Failed to connect:', error)
            throw error
        }
    }, [connect])

    const disconnectWallet = useCallback(async () => {
        try {
            await puzzleDisconnect()
        } catch (error) {
            console.error('Failed to disconnect:', error)
        }
    }, [puzzleDisconnect])

    return {
        // Map Puzzle SDK fields to what our app expects
        account: account ? { address: () => ({ to_string: () => account.address }) } : null,
        address: account?.address || null,
        publicKey: account?.address || null, // Alias for compatibility
        isConnected: connected,
        connected, // Alias for compatibility
        isConnecting: false,
        connect: connectWallet,
        disconnect: disconnectWallet,
        // For transaction support (placeholder - needs Puzzle SDK transaction API)
        requestTransaction: async (tx: any) => {
            console.log('Transaction request:', tx)
            throw new Error('Use Puzzle SDK transaction API directly')
        },
    }
}
