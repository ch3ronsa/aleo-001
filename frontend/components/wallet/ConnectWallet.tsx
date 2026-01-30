'use client'

import React, { useState, useEffect } from 'react'
import { Wallet, LogOut, Copy, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConnect, useAccount, useDisconnect } from '@puzzlehq/sdk'
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
    const { connect, isConnecting } = useConnect()
    const { account, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const { toast } = useToast()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleConnect = async () => {
        try {
            await connect()
        } catch (e: any) {
            console.error("Failed to connect wallet:", e)
            toast({
                title: "Connection Failed",
                description: e?.message || "Make sure Puzzle Wallet extension is installed.",
                variant: "destructive"
            })
        }
    }

    const copyAddress = () => {
        if (account?.address) {
            navigator.clipboard.writeText(account.address)
            toast({
                title: "Address Copied",
                description: "Wallet address copied to clipboard"
            })
        }
    }

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <Button disabled className="gap-2">
                <Wallet className="h-4 w-4" />
                Loading...
            </Button>
        )
    }

    if (!isConnected || !account?.address) {
        return (
            <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="gap-2"
            >
                {isConnecting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting...
                    </>
                ) : (
                    <>
                        <Wallet className="h-4 w-4" />
                        Connect Wallet
                    </>
                )}
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <Wallet className="h-4 w-4" />
                    {formatAddress(account.address)}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Connected via Puzzle</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={copyAddress} className="gap-2 cursor-pointer">
                    <Copy className="h-4 w-4" />
                    Copy Address
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => window.open(`https://explorer.aleo.org/address/${account.address}`, '_blank')}
                    className="gap-2 cursor-pointer"
                >
                    <ExternalLink className="h-4 w-4" />
                    View on Explorer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => disconnect()}
                    className="gap-2 text-red-500 cursor-pointer focus:text-red-500"
                >
                    <LogOut className="h-4 w-4" />
                    Disconnect
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
