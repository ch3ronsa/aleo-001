'use client'

import Link from 'next/link'
import { ArrowRight, Shield, Vote, Lock, Zap, ExternalLink, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Header } from '@/components/layout/Header'
import { useProposalStore } from '@/lib/store/proposal-store'
import { useDAOStore } from '@/lib/store/dao-store'
import { formatAddress, calculatePercentage } from '@/lib/utils'

export default function HomePage() {
    const { proposals } = useProposalStore()
    const { daos } = useDAOStore()

    // Get a few active proposals for the feature section
    const featuredProposals = proposals.filter(p => p.status === 'active').slice(0, 2)

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#3b82f6]/30">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#000000] border-b border-zinc-900">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="container relative mx-auto px-4 py-24 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/20 bg-[#3b82f6]/10 px-4 py-2 text-sm text-[#3b82f6]">
                            <Shield className="h-4 w-4" />
                            <span className="font-bold tracking-tight uppercase text-[11px]">Real Aleo Testnet Live</span>
                        </div>

                        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-8xl leading-[1.1]">
                            Private DAO Governance
                            <span className="aleo-text-gradient block">Redesigned for Aleo</span>
                        </h1>

                        <p className="mb-10 text-lg text-zinc-400 sm:text-xl max-w-2xl mx-auto leading-relaxed">
                            Experience the official Aleo Governance aesthetic. Vote anonymously using ZK-proofs
                            with real Leo Wallet integration.
                        </p>

                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center items-center">
                            <Link href="/proposals">
                                <Button size="lg" className="h-14 px-8 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-lg rounded-xl">
                                    Explore Proposals
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button size="lg" variant="outline" className="h-14 px-8 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-white font-bold text-lg rounded-xl">
                                    Launch Dashboard
                                </Button>
                            </Link>
                        </div>

                        {/* Direct Links for Quick Review */}
                        <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-zinc-500">
                            <span className="text-zinc-600">Quick Access:</span>
                            <Link href="/vote/prop_001" className="hover:text-[#3b82f6] transition-colors flex items-center gap-1.5">
                                <ExternalLink className="h-3 w-3" />
                                Redesigned Vote Page
                            </Link>
                            <Link href="/proposals" className="hover:text-[#3b82f6] transition-colors flex items-center gap-1.5">
                                <ExternalLink className="h-3 w-3" />
                                Visual Proposal List
                            </Link>
                            <Link href="/dashboard" className="hover:text-[#3b82f6] transition-colors flex items-center gap-1.5">
                                <ExternalLink className="h-3 w-3" />
                                Member Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Designs Section */}
            <section className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 border-b border-zinc-900">
                <div className="mb-16 text-center">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#3b82f6] mb-4">Live Governance</h2>
                    <h3 className="text-4xl font-bold text-white mb-6">Experience the New UI</h3>
                    <p className="mx-auto max-w-2xl text-zinc-400">
                        We've implemented a high-fidelity redesign matching the official Aleo Governance platform.
                        Browse real proposals with rich media support.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
                    {featuredProposals.map((proposal) => {
                        const dao = daos.find(d => d.id === proposal.daoId)
                        const totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes
                        const forPercentage = calculatePercentage(proposal.forVotes, totalVotes)

                        return (
                            <Link key={proposal.id} href={`/vote/${proposal.id}`}>
                                <Card className="group bg-[#0a0a0a] border-zinc-900 hover:border-[#3b82f6]/50 transition-all duration-300 overflow-hidden rounded-2xl h-full flex flex-col">
                                    {proposal.imageUrl && (
                                        <div className="relative aspect-video w-full overflow-hidden">
                                            <img
                                                src={proposal.imageUrl}
                                                alt={proposal.title}
                                                className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                            />
                                            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#22c55e]/90 text-white text-[10px] font-bold uppercase">
                                                Active
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{dao?.name}</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#3b82f6] transition-colors">{proposal.title}</h4>
                                        <p className="text-zinc-400 text-sm line-clamp-2 mb-6 flex-1">
                                            {proposal.description}
                                        </p>

                                        <div className="space-y-4 pt-4 border-t border-zinc-900">
                                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                                                <span className="text-zinc-500">Approval Rate</span>
                                                <span className="text-white">{forPercentage}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                                <div className="h-full bg-white transition-all duration-1000" style={{ width: `${forPercentage}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                    <CardFooter className="px-6 py-4 bg-zinc-900/30 border-t border-zinc-900 flex justify-between items-center group-hover:bg-[#3b82f6]/5 transition-all">
                                        <span className="text-[10px] font-bold uppercase text-zinc-500">View Proposal</span>
                                        <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-[#3b82f6] group-hover:translate-x-1 transition-all" />
                                    </CardFooter>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </section>

            {/* Features Stats Section */}
            <section className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 bg-[#050505]">
                <div className="grid gap-12 md:grid-cols-3 text-center max-w-5xl mx-auto">
                    <div className="space-y-4">
                        <div className="h-16 w-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto border border-zinc-800">
                            <Vote className="h-8 w-8 text-[#3b82f6]" />
                        </div>
                        <h4 className="text-xl font-bold">Anonymous</h4>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Choices are encrypted using ZK-proofs. Only the final result is public.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="h-16 w-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto border border-zinc-800">
                            <Lock className="h-8 w-8 text-[#3b82f6]" />
                        </div>
                        <h4 className="text-xl font-bold">Verifiable</h4>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Cryptographic integrity ensures every vote is counted accurately.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="h-16 w-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto border border-zinc-800">
                            <Zap className="h-8 w-8 text-[#3b82f6]" />
                        </div>
                        <h4 className="text-xl font-bold">Instant</h4>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Fast signature aggregation using Aleo's optimized blockchain.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-900 bg-black">
                <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
                        <div className="flex flex-col gap-2">
                            <span className="text-xl font-bold aleo-text-gradient">AleoDAO</span>
                            <p className="text-xs text-zinc-600 font-medium">© 2026 Built for the Aleo Ecosystem.</p>
                        </div>
                        <div className="flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em]">
                            <Link href="/proposals" className="text-zinc-500 hover:text-[#3b82f6] transition-colors">Proposals</Link>
                            <Link href="/dashboard" className="text-zinc-500 hover:text-[#3b82f6] transition-colors">Dashboard</Link>
                            <Link href="https://github.com/ch3ronsa/aleo-001" className="text-zinc-500 hover:text-[#3b82f6] transition-colors">Source</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
