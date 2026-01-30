'use client'

import React, { useState, useEffect } from 'react'
import { Wallet, LogOut, Copy, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react'
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui'
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
    const { publicKey, connected, disconnect, connecting } = useWallet()
    const { toast } = useToast()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const copyAddress = () => {
        if (publicKey) {
            navigator.clipboard.writeText(publicKey)
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

    if (!connected || !publicKey) {
        return (
            <WalletMultiButton
                className="!bg-primary !text-primary-foreground !rounded-md !px-4 !py-2 !font-medium !text-sm hover:!bg-primary/90"
            />
        )
    }

    // If connected, show custom dropdown with address and options
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <Wallet className="h-4 w-4" />
                    {formatAddress(publicKey)}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Connected Wallet</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={copyAddress} className="gap-2 cursor-pointer">
                    <Copy className="h-4 w-4" />
                    Copy Address
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => window.open(`https://explorer.aleo.org/address/${publicKey}`, '_blank')}
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
