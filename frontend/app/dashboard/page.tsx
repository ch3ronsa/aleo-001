'use client'

import Link from 'next/link'
import { Plus, Users, FileText, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConnectWallet } from '@/components/wallet/ConnectWallet'
import { useWallet } from '@/lib/aleo/wallet'
import { DAOList } from '@/components/dao/DAOList'

export default function DashboardPage() {
    const { isConnected } = useWallet()

    if (!isConnected) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Connect Your Wallet</CardTitle>
                        <CardDescription>
                            Connect your Aleo wallet to access the dashboard
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
                            <Link href="/dashboard" className="text-sm font-medium text-foreground">
                                Dashboard
                            </Link>
                            <Link href="/proposals" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Proposals
                            </Link>
                        </nav>
                    </div>
                    <ConnectWallet />
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total DAOs
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">
                                +2 from last week
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Proposals
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting your vote
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Voting Power
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5,000</div>
                            <p className="text-xs text-muted-foreground">
                                Across all DAOs
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* DAO List */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Your DAOs</h2>
                        <p className="text-muted-foreground">
                            DAOs you're a member of or have created
                        </p>
                    </div>
                    <Link href="/dashboard/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create DAO
                        </Button>
                    </Link>
                </div>

                <DAOList />
            </div>
        </div>
    )
}
