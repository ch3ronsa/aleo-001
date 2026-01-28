'use client'

import React from 'react'
import { Wallet, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { formatAddress } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WalletAdapterNetwork, WalletName } from '@demox-labs/aleo-wallet-adapter-base'

export function ConnectWallet() {
    const { publicKey, wallet, requestTransaction, disconnect, select } = useWallet()

    // Function to handle connection
    const handleConnect = () => {
        // This brings up the wallet selection modal from the adapter if implemented,
        // or we can force select 'Leo Wallet'
        select('Leo Wallet' as WalletName)
    }

    if (!publicKey) {
        return (
            <Button
                onClick={() => {
                    try {
                        // Force selection of Leo Wallet as it's our primary supported wallet
                        select('Leo Wallet' as WalletName);
                    } catch (e) {
                        console.error("Failed to connect wallet:", e);
                    }
                }}
                className="gap-2"
            >
                <Wallet className="h-4 w-4" />
                Connect Wallet
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Wallet className="h-4 w-4" />
                    {formatAddress(publicKey)}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => disconnect()} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Disconnect
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
