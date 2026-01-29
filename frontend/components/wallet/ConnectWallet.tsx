'use client'

import React from 'react'
import { Wallet, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/lib/aleo/wallet'
import { formatAddress } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ConnectWallet() {
    const { address, isConnected, connect, disconnect } = useWallet()

    if (!isConnected || !address) {
        return (
            <Button
                onClick={async () => {
                    try {
                        await connect();
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
                    {formatAddress(address)}
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
