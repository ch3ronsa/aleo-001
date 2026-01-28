'use client'

import Link from 'next/link'
import { ArrowRight, Shield, Vote, Lock, Zap, ExternalLink, ChevronRight, MessageSquare, BarChart3 } from 'lucide-react'
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
                    <div className="mx-auto max-w-5xl text-center">
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/20 bg-[#3b82f6]/10 px-4 py-2 text-sm text-[#3b82f6]">
                            <Shield className="h-4 w-4" />
                            <span className="font-bold tracking-tight uppercase text-[11px]">Privacy-First Governance Engine</span>
                        </div>

                        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-8xl leading-[1.1]">
                            The Universal
                            <span className="aleo-text-gradient block">Privacy Layer</span>
                        </h1>

                        <p className="mb-10 text-lg text-zinc-400 sm:text-xl max-w-2xl mx-auto leading-relaxed">
                            Protecting the two most critical assets in decentralized communication:
                            <strong> Your Choice</strong> and <strong>Your Wealth</strong>.
                            The complete 3-in-1 privacy platform built on Aleo's ZK-architecture.
                        </p>

                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center items-center">
                            <Link href="/proposals">
                                <Button size="lg" className="h-14 px-8 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-lg rounded-xl">
                                    Launch App
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button size="lg" variant="outline" className="h-14 px-8 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-white font-bold text-lg rounded-xl">
                                    Quick Dashboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* The 3 Core Features */}
            <section className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 border-b border-zinc-900">
                <div className="mb-20 text-center">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#3b82f6] mb-4">3-in-1 DAO System</h2>
                    <h3 className="text-4xl font-bold text-white mb-6">Three Core Privacy Features</h3>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Everything you need for privacy-first governance in one unified platform
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                    {/* 1. Anonymous Voting */}
                    <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#0a0a0a] to-black border border-zinc-900 relative overflow-hidden group">
                        <div className="absolute -right-8 -top-8 h-32 w-32 bg-[#3b82f6]/10 blur-3xl rounded-full group-hover:bg-[#3b82f6]/20 transition-all" />
                        <div className="h-14 w-14 bg-[#3b82f6]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#3b82f6]/20">
                            <Lock className="h-7 w-7 text-[#3b82f6]" />
                        </div>
                        <h4 className="text-2xl font-bold mb-4">Anonymous Voting</h4>
                        <p className="text-zinc-500 leading-relaxed mb-4">
                            Your ballot choice is encrypted locally. Only a ZK-proof of validity is submitted on-chain,
                            ensuring zero coercion and total democratic freedom.
                        </p>
                        <Link href="/proposals" className="text-[#3b82f6] hover:text-[#2563eb] text-sm font-semibold inline-flex items-center">
                            Vote on Proposals <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>

                    {/* 2. Private DAOs */}
                    <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#0a0a0a] to-black border border-zinc-900 relative overflow-hidden group">
                        <div className="absolute -right-8 -top-8 h-32 w-32 bg-[#22c55e]/10 blur-3xl rounded-full group-hover:bg-[#22c55e]/20 transition-all" />
                        <div className="h-14 w-14 bg-[#22c55e]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#22c55e]/20">
                            <Shield className="h-7 w-7 text-[#22c55e]" />
                        </div>
                        <h4 className="text-2xl font-bold mb-4">Private DAOs</h4>
                        <p className="text-zinc-500 leading-relaxed mb-4">
                            Governance where member holdings and voting power remain 100% confidential.
                            Participate securely without exposing your personal wealth.
                        </p>
                        <Link href="/dashboard" className="text-[#22c55e] hover:text-[#16a34a] text-sm font-semibold inline-flex items-center">
                            Explore DAOs <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>

                    {/* 3. Private Polls & Surveys */}
                    <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#0a0a0a] to-black border border-zinc-900 relative overflow-hidden group">
                        <div className="absolute -right-8 -top-8 h-32 w-32 bg-[#a855f7]/10 blur-3xl rounded-full group-hover:bg-[#a855f7]/20 transition-all" />
                        <div className="h-14 w-14 bg-[#a855f7]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#a855f7]/20">
                            <BarChart3 className="h-7 w-7 text-[#a855f7]" />
                        </div>
                        <h4 className="text-2xl font-bold mb-4">Private Polls & Surveys</h4>
                        <p className="text-zinc-500 leading-relaxed mb-4">
                            Multi-choice polls with ZK-proof privacy. Gather honest, unbiased opinions
                            without surveillance. Perfect for community sentiment and consensus building.
                        </p>
                        <Link href="/polls" className="text-[#a855f7] hover:text-[#9333ea] text-sm font-semibold inline-flex items-center">
                            Browse Polls <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works - The ZK-Workflow */}
            <section className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 border-b border-zinc-900">
                <div className="mb-20 text-center">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#3b82f6] mb-4">The ZK-Workflow</h2>
                    <h3 className="text-4xl font-bold text-white mb-6">How It Works</h3>
                </div>

                <div className="max-w-4xl mx-auto">
                    {[
                        {
                            step: '01',
                            title: 'Local Proof Generation',
                            desc: 'When you take an action (vote or report), the Leo Wallet generates a Zero-Knowledge Proof on your machine. Your private data never touches the internet.'
                        },
                        {
                            step: '02',
                            title: 'Private Transmission',
                            desc: 'Only the mathematical proof is sent to the Aleo network. No observer can link the transaction to your choices or your wallet balance.'
                        },
                        {
                            step: '03',
                            title: 'Cryptographic Validation',
                            desc: 'The smart contract verifies the proof is mathematically sound and aggregates it into the final result. Verification is public; data is private.'
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="flex gap-8 mb-16 last:mb-0 group">
                            <div className="text-4xl font-black text-zinc-800 group-hover:text-[#3b82f6]/30 transition-colors pt-1">
                                {item.step}
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-2xl font-bold text-white">{item.title}</h4>
                                <p className="text-zinc-500 leading-relaxed max-w-2xl">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Live Governance Preview */}
            <section className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h3 className="text-3xl font-bold text-white mb-6">Latest Private Proposals</h3>
                    <p className="mx-auto max-w-2xl text-zinc-400">
                        Explore real-time governance activity with high-fidelity media support.
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
                                    <CardFooter className="px-6 py-4 bg-zinc-900/30 border-t border-zinc-900 flex justify-between items-center group-hover:bg-[#3b82f6]/5 transition-all text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-[#3b82f6]">
                                        Explore Ballot
                                        <ChevronRight className="h-4 w-4" />
                                    </CardFooter>
                                </Card>
                            </Link>
                        )
                    })}
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
