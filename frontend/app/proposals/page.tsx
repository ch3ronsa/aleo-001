'use client'

import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConnectWallet } from '@/components/wallet/ConnectWallet'
import { useWallet } from '@/lib/aleo/wallet'
import { ProposalList } from '@/components/proposals/ProposalList'

export default function ProposalsPage() {
    const { isConnected } = useWallet()

    if (!isConnected) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Connect Your Wallet</CardTitle>
                        <CardDescription>
                            Connect your Aleo wallet to view proposals
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ConnectWallet />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-xl font-bold aleo-text-gradient">
                            AleoDAO
                        </Link>
                        <nav className="hidden md:flex gap-6">
                            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Dashboard
                            </Link>
                            <Link href="/proposals" className="text-sm font-medium text-foreground">
                                Proposals
                            </Link>
                        </nav>
                    </div>
                    <ConnectWallet />
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">All Proposals</h1>
                            <p className="text-muted-foreground">
                                View and vote on proposals across all DAOs
                            </p>
                        </div>
                        <Link href="/proposals/create">
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Create Proposal
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Proposal List */}
                <ProposalList />
            </div>
        </div>
    )
}
