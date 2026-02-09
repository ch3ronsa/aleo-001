'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, FileText, Plus, Calendar, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Header } from '@/components/layout/Header'
import { useDAOStore } from '@/lib/store/dao-store'
import { useProposalStore } from '@/lib/store/proposal-store'
import { ProposalCard } from '@/components/proposals/ProposalCard'
import { formatNumber, formatDate, formatAddress } from '@/lib/utils'

export default function DAODetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { getDAO } = useDAOStore()
    const { proposals } = useProposalStore()

    const daoId = params.id as string
    const dao = getDAO(daoId) // This is a sync call in our store but might need handling if undefined

    // Determine the DAO's proposals
    const daoProposals = proposals.filter((p) => p.daoId === daoId)
    // Add daoName to proposals for the card
    const proposalsWithDAONames = daoProposals.map(p => ({
        ...p,
        daoName: dao?.name || 'Unknown'
    }))

    if (!dao) {
        return (
            <div className="min-h-screen bg-[#000000] text-white">
                <Header />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h2 className="text-2xl font-bold mb-4">DAO Not Found</h2>
                    <p className="text-zinc-400 mb-8">The DAO you are looking for does not exist.</p>
                    <Link href="/dashboard">
                        <Button>Return to Dashboard</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#000000] text-[#e5e5e5] font-sans selection:bg-[#3b82f6]/30">
            <Header />

            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
                {/* Back Button */}
                <div className="mb-6">
                    <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* DAO Header / Banner */}
                <div className="relative rounded-3xl overflow-hidden border border-zinc-900 bg-[#111111] mb-10">
                    {/* Cover Gradient */}
                    <div className="h-32 bg-gradient-to-r from-zinc-900 to-[#111111]" />

                    <div className="px-8 pb-8 -mt-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                        <div className="flex items-end gap-6">
                            {/* DAO Icon Placeholder */}
                            <div className="h-24 w-24 rounded-2xl bg-zinc-950 border-4 border-[#111111] flex items-center justify-center shadow-xl">
                                <Shield className="h-10 w-10 text-zinc-600" />
                            </div>

                            <div className="mb-1">
                                <h1 className="text-3xl font-bold text-white mb-1">{dao.name}</h1>
                                <div className="flex items-center gap-3 text-sm text-zinc-400">
                                    <span className="flex items-center gap-1">
                                        <Users className="h-3.5 w-3.5" />
                                        {formatNumber(dao.memberCount)} Members
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Est. {formatDate(dao.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Add Member / Join Button if needed */}
                            <Button disabled variant="outline" className="opacity-50 cursor-not-allowed">
                                Join DAO (Private)
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Proposals */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Proposals</h2>
                            <Link href={`/dao/${daoId}/proposal/create`}>
                                <Button size="sm" className="gap-2 bg-white text-black hover:bg-zinc-200">
                                    <Plus className="h-4 w-4" />
                                    New Proposal
                                </Button>
                            </Link>
                        </div>

                        {proposalsWithDAONames.length > 0 ? (
                            <div className="space-y-4">
                                {proposalsWithDAONames.map((proposal) => (
                                    <ProposalCard key={proposal.id} proposal={proposal} />
                                ))}
                            </div>
                        ) : (
                            <Card className="items-center justify-center flex flex-col py-12 bg-[#111111] border-zinc-900 border-dashed">
                                <FileText className="h-12 w-12 text-zinc-700 mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">No proposals yet</h3>
                                <p className="text-zinc-500 text-sm max-w-sm text-center mb-6">
                                    This DAO hasn't had any governance proposals yet. Be the first to start a discussion.
                                </p>
                                <Link href={`/dao/${daoId}/proposal/create`}>
                                    <Button variant="outline">Create Proposal</Button>
                                </Link>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar: Details & Treasury */}
                    <div className="space-y-6">
                        <Card className="bg-[#111111] border-zinc-900">
                            <CardHeader>
                                <CardTitle className="text-lg">About</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                    {dao.description}
                                </p>
                                <div className="space-y-4 pt-4 border-t border-zinc-900">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Creator</span>
                                        <span className="font-mono text-zinc-300">{formatAddress(dao.creator)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Network</span>
                                        <span className="text-zinc-300">Aleo Testnet</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#111111] border-zinc-900">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-[#3b82f6]" />
                                    Governance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Quorum</span>
                                        <span className="text-zinc-300">{dao.quorumPercentage}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Voting Period</span>
                                        <span className="text-zinc-300">{dao.votingPeriod > 100 ? `${Math.round(dao.votingPeriod / 14400)}d` : `${dao.votingPeriod}d`}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Proposals</span>
                                        <span className="text-zinc-300">{dao.proposalCount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Privacy</span>
                                        <span className="text-[#3b82f6] font-medium">ZK-Proof Verified</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
