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
        decrypt,
        signMessage,
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
        decrypt,
        signMessage,
        // Unified account object compatible with all app patterns:
        // - account.address (string property)
        // - account.address() (function call - via Proxy)
        // - account.address().to_string() (Leo wallet adapter pattern - via Proxy)
        account: publicKey ? new Proxy({ address: publicKey }, {
            get(target, prop) {
                if (prop === 'address') {
                    // Return a callable string-like object
                    const addressFn = () => publicKey
                    // Support .to_string() chain
                    addressFn.to_string = () => publicKey
                    addressFn.toString = () => publicKey
                    // Allow direct string comparison
                    Object.defineProperty(addressFn, Symbol.toPrimitive, {
                        value: () => publicKey
                    })
                    return addressFn
                }
                return target[prop as keyof typeof target]
            }
        }) : null,
    }
}
