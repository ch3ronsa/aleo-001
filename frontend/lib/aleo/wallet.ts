'use client'

import { useWallet as useAleoWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { useCallback } from 'react'

import { WalletName } from '@demox-labs/aleo-wallet-adapter-base'

// Adapts the @demox-labs/aleo-wallet-adapter-react hook to match the API used in the app
export const useWallet = () => {
    const { wallet, publicKey, connected, select, disconnect, requestTransaction } = useAleoWallet()

    const connect = useCallback(async () => {
        // Select Leo Wallet (this should trigger the wallet connection dialog)
        select('Leo Wallet' as WalletName)
        // Note: The actual connection happens when the user approves in the wallet extension
        // The connected state will update automatically via the adapter
    }, [select])

    return {
        // Map adapter fields to what our app expects
        account: publicKey ? { address: () => ({ to_string: () => publicKey }) } : null,
        address: publicKey,
        isConnected: connected,
        isConnecting: false, // The adapter handles connection state internally
        connect,
        disconnect,
        requestTransaction,
        // Expose original adapter values just in case
        adapter: { wallet, publicKey, connected, select, disconnect, requestTransaction }
    }
}
