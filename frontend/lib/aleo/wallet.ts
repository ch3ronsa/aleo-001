'use client'

import { useWallet as useAleoWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useCallback } from 'react'

// Wrapper hook that provides a consistent wallet API for the app
// Now uses @demox-labs adapter instead of Puzzle SDK
export const useWallet = () => {
    const {
        publicKey,
        connected,
        connecting,
        disconnect: aleoDisconnect,
        select,
        requestTransaction,
        requestRecords,
        requestBulkRecords,
        decrypt,
        sign
    } = useAleoWallet()

    const connect = useCallback(async () => {
        try {
            // By default select Leo Wallet, but WalletMultiButton handles this better in the UI
            await select('Leo Wallet' as any)
        } catch (error) {
            console.error('Failed to connect:', error)
            throw error
        }
    }, [select])

    const disconnect = useCallback(async () => {
        try {
            await aleoDisconnect()
        } catch (error) {
            console.error('Failed to disconnect:', error)
        }
    }, [aleoDisconnect])

    return {
        // Map adapter fields to what our app expects
        // publicKey is already the address string in the adapter
        address: publicKey || null,
        publicKey: publicKey || null,
        isConnected: connected,
        connected,
        isConnecting: connecting,
        connecting,
        connect,
        disconnect,
        // Aleo specific methods
        requestTransaction,
        requestRecords,
        requestBulkRecords,
        decrypt,
        sign,
        // For compatibility with some older parts of the app that might expect account.address()
        account: publicKey ? { address: () => publicKey } : null,
    }
}
