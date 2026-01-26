'use client'

import Link from 'next/link'
import { Plus, Users, FileText, TrendingUp, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConnectWallet } from '@/components/wallet/ConnectWallet'
import { useWallet } from '@/lib/aleo/wallet'
import { DAOList } from '@/components/dao/DAOList'
import { useDAOStore } from '@/lib/store/dao-store'
import { useProposalStore } from '@/lib/store/proposal-store'
import { formatNumber } from '@/lib/utils'

export default function DashboardPage() {
    const { isConnected, account } = useWallet()
    const { daos } = useDAOStore()
    const { getActiveProposals } = useProposalStore()

    if (!isConnected) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Welcome to AleoDAO</CardTitle>
                        <CardDescription>
                            Connect your privacy-preserving wallet to access the dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-8">
                        <ConnectWallet />
                    </CardContent>
                </Card>
            </div>
        )
    }

    const activeProposals = getActiveProposals()
    const totalMembers = daos.reduce((acc, dao) => acc + dao.memberCount, 0)
    const totalTreasury = daos.reduce((acc, dao) => acc + dao.treasuryBalance, 0)

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
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
                            <div className="text-2xl font-bold">{daos.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {totalMembers} total members
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
                            <div className="text-2xl font-bold">{activeProposals.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Across all DAOs
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Value Locked
                            </CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(totalTreasury)}</div>
                            <p className="text-xs text-muted-foreground">
                                Tokens in DAO treasuries
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* DAO List */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">Explore DAOs</h2>
                        <p className="text-muted-foreground">
                            Join decentralized communities built on privacy
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
