'use client'

import Link from 'next/link'
import { Plus, Users, FileText, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConnectWallet } from '@/components/wallet/ConnectWallet'
import { useWallet } from '@/lib/aleo/wallet'
import { DAOList } from '@/components/dao/DAOList'
import { useDAOStore } from '@/lib/store/dao-store'
import { useProposalStore } from '@/lib/store/proposal-store'

import { Header } from '@/components/layout/Header'

export default function DashboardPage() {
    const { isConnected, account } = useWallet()
    const { daos } = useDAOStore()
    const { getActiveProposals } = useProposalStore()

    const activeProposals = getActiveProposals()
    const totalMembers = daos.reduce((acc, dao) => acc + dao.memberCount, 0)
    return (
        <div className="min-h-screen bg-[#000000] text-zinc-100 font-sans">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Intro if not connected */}
                {!isConnected && (
                    <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-[#111111] to-[#000000] border border-zinc-900 text-center">
                        <h1 className="text-3xl font-bold text-white mb-4">Welcome to AleoDAO</h1>
                        <p className="text-zinc-400 max-w-2xl mx-auto mb-6">
                            The first privacy-preserving governance platform built on Aleo.
                            Connect your wallet to participate in private voting and manage your DAOs.
                        </p>
                        <ConnectWallet />
                    </div>
                )}
                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <Card className="bg-[#111111] border-zinc-900">
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

                    <Card className="bg-[#111111] border-zinc-900">
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

                    <Card className="bg-[#111111] border-zinc-900">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Network
                            </CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Testnet</div>
                            <p className="text-xs text-muted-foreground">
                                Aleo ZK-Powered
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
