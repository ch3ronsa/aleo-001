'use client'

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
    const { address, isConnected, isConnecting, connect, disconnect } = useWallet()

    if (!isConnected) {
        return (
            <Button
                onClick={connect}
                disabled={isConnecting}
                className="gap-2"
            >
                <Wallet className="h-4 w-4" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Wallet className="h-4 w-4" />
                    {formatAddress(address || '')}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnect} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Disconnect
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
