'use client'

import React from 'react'
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react'
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
import { useToast } from '@/components/ui/use-toast'

export function ConnectWallet() {
    const { publicKey, connected, select, disconnect, connecting } = useWallet()
    const { toast } = useToast()

    const handleConnect = async () => {
        try {
            // Select Leo Wallet - this triggers the wallet connection popup
            await select('Leo Wallet' as any)
        } catch (e) {
            console.error("Failed to connect wallet:", e)
            toast({
                title: "Connection Failed",
                description: "Could not connect to Leo Wallet. Make sure the extension is installed.",
                variant: "destructive"
            })
        }
    }

    const copyAddress = () => {
        if (publicKey) {
            navigator.clipboard.writeText(publicKey)
            toast({
                title: "Address Copied",
                description: "Wallet address copied to clipboard"
            })
        }
    }

    if (!connected || !publicKey) {
        return (
            <Button
                onClick={handleConnect}
                disabled={connecting}
                className="gap-2"
            >
                <Wallet className="h-4 w-4" />
                {connecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <Wallet className="h-4 w-4" />
                    {formatAddress(publicKey)}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={copyAddress} className="gap-2">
                    <Copy className="h-4 w-4" />
                    Copy Address
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => window.open(`https://explorer.aleo.org/address/${publicKey}`, '_blank')}
                    className="gap-2"
                >
                    <ExternalLink className="h-4 w-4" />
                    View on Explorer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => disconnect()} className="gap-2 text-red-500">
                    <LogOut className="h-4 w-4" />
                    Disconnect
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
