'use client'

import Link from 'next/link'
import { Shield, Lock, Zap, MessageSquare, BarChart3, Fingerprint, Search, Database } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#3b82f6]/30">
            <Header />

            <main className="container mx-auto px-4 py-16 lg:py-24 max-w-5xl">
                {/* Hero section for the page */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        How <span className="aleo-text-gradient">AleoDAO Works</span>
                    </h1>
                    <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        AleoDAO transforms governance by moving sensitive data from the public blockchain
                        to your local device, using advanced Zero-Knowledge Proofs.
                    </p>
                </div>

                {/* The ZK-Workflow Section */}
                <section className="mb-32">
                    <h2 className="text-2xl font-bold mb-12 flex items-center gap-3">
                        <Zap className="h-6 w-6 text-[#3b82f6]" />
                        The ZK-Workflow
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                <Fingerprint className="h-6 w-6 text-[#3b82f6]" />
                            </div>
                            <h3 className="text-xl font-bold">1. Local Generation</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                When you vote or report, your device generates a Zero-Knowledge Proof locally.
                                Your choice and identity never leave your machine.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                <Search className="h-6 w-6 text-[#3b82f6]" />
                            </div>
                            <h3 className="text-xl font-bold">2. On-Chain Verification</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                Only the mathematical proof is sent to Aleo. The smart contract verifies
                                the proof is sound without seeing the underlying data.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                <Database className="h-6 w-6 text-[#3b82f6]" />
                            </div>
                            <h3 className="text-xl font-bold">3. Verifiable Tally</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                The results are aggregated and updated. Anyone can verify the total tally,
                                but no one can link individual votes to users.
                            </p>
                        </div>
                    </div>
                </section>

                {/* The 4 Use Cases Section */}
                <section className="space-y-16">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <Shield className="h-6 w-6 text-[#3b82f6]" />
                        Universal Privacy Use Cases
                    </h2>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Use Case 1 */}
                        <Card className="bg-zinc-900/30 border-zinc-800 rounded-[2rem] overflow-hidden">
                            <CardContent className="p-8 space-y-4">
                                <div className="h-12 w-12 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center border border-[#3b82f6]/20">
                                    <Lock className="h-6 w-6 text-[#3b82f6]" />
                                </div>
                                <h3 className="text-2xl font-bold">Anonymous Voting</h3>
                                <p className="text-zinc-500">
                                    Traditional voting is public and prone to coercion. AleoDAO uses ZKPs to ensure that
                                    while the outcome is public and verifiable, individual choices remain private.
                                    This prevents whale manipulation and ensures total democratic freedom.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Use Case 2 */}
                        <Card className="bg-zinc-900/30 border-zinc-800 rounded-[2rem] overflow-hidden">
                            <CardContent className="p-8 space-y-4">
                                <div className="h-12 w-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center border border-[#22c55e]/20">
                                    <Shield className="h-6 w-6 text-[#22c55e]" />
                                </div>
                                <h3 className="text-2xl font-bold">Private DAOs</h3>
                                <p className="text-zinc-500">
                                    In conventional DAOs, your holdings are public. In an AleoDAO, your token balance
                                    and membership details are stored in Private Records. You can prove your right
                                    to vote without exposing your wealth to the world.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Use Case 3 */}
                        <Card className="bg-zinc-900/30 border-zinc-800 rounded-[2rem] overflow-hidden">
                            <CardContent className="p-8 space-y-4">
                                <div className="h-12 w-12 rounded-xl bg-[#a855f7]/10 flex items-center justify-center border border-[#a855f7]/20">
                                    <BarChart3 className="h-6 w-6 text-[#a855f7]" />
                                </div>
                                <h3 className="text-2xl font-bold">Private Polls & Surveys</h3>
                                <p className="text-zinc-500">
                                    Gather unbiased community feedback. Perfect for sensitive topics where surveillance
                                    might influence opinions. Get honest results through decentralized, surveillance-free
                                    consensus gathering.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="mt-32 text-center p-12 rounded-[3rem] bg-gradient-to-br from-[#111111] to-black border border-zinc-900">
                    <h3 className="text-3xl font-bold mb-6 text-white">Ready to join the privacy revolution?</h3>
                    <p className="text-zinc-500 mb-8 max-w-xl mx-auto italic">
                        "Privacy is not a feature; it is the foundation of digital freedom."
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/proposals">
                            <Button size="lg" className="h-12 px-8 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold rounded-xl">
                                Explore Proposals
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button size="lg" variant="outline" className="h-12 px-8 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-white font-bold rounded-xl">
                                Join a DAO
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-900 bg-black mt-20">
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-xs text-zinc-600 font-medium">© 2026 AleoDAO. Built with Zero-Knowledge Proofs on Aleo.</p>
                </div>
            </footer>
        </div>
    )
}
