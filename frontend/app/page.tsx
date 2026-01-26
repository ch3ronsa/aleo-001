import Link from 'next/link'
import { ArrowRight, Shield, Vote, Lock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="container relative mx-auto px-4 py-24 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="font-medium">Built on Aleo</span>
                        </div>

                        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                            Private DAO Governance
                            <span className="aleo-text-gradient block">Without Compromise</span>
                        </h1>

                        <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
                            Vote anonymously. Prove integrity. Build the future of democratic governance
                            with zero-knowledge proofs on Aleo.
                        </p>

                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Link href="/dashboard">
                                <Button size="lg" className="w-full sm:w-auto">
                                    Launch App
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/docs">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    View Documentation
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                        Why AleoDAO?
                    </h2>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        The first DAO platform that puts privacy first without sacrificing transparency
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <Vote className="mb-2 h-8 w-8 text-primary" />
                            <CardTitle>Anonymous Voting</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Cast your vote without revealing your choice. Zero-knowledge proofs ensure integrity.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Lock className="mb-2 h-8 w-8 text-primary" />
                            <CardTitle>Private Holdings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Your token balance stays confidential. No whale watching, no manipulation.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Shield className="mb-2 h-8 w-8 text-primary" />
                            <CardTitle>Verifiable Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Cryptographic proofs ensure every vote is counted correctly and transparently.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Zap className="mb-2 h-8 w-8 text-primary" />
                            <CardTitle>No Coercion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Can't prove how you voted. Eliminates vote buying and voter intimidation.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* How It Works */}
            <section className="border-t bg-muted/50">
                <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                            How It Works
                        </h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            Simple governance, powered by advanced cryptography
                        </p>
                    </div>

                    <div className="mx-auto max-w-3xl space-y-8">
                        {[
                            {
                                step: '1',
                                title: 'Create or Join a DAO',
                                description: 'Set up your organization with custom voting parameters and governance rules.',
                            },
                            {
                                step: '2',
                                title: 'Submit Proposals',
                                description: 'Anyone with sufficient voting power can propose changes to the DAO.',
                            },
                            {
                                step: '3',
                                title: 'Vote Privately',
                                description: 'Cast your vote using zero-knowledge proofs. Your choice remains secret forever.',
                            },
                            {
                                step: '4',
                                title: 'Verify Results',
                                description: 'Results are publicly verifiable while individual votes stay private.',
                            },
                        ].map((item) => (
                            <div key={item.step} className="flex gap-6">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    <span className="text-xl font-bold">{item.step}</span>
                                </div>
                                <div>
                                    <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
                        Ready to Build Private Governance?
                    </h2>
                    <p className="mb-10 text-lg text-muted-foreground">
                        Join the privacy revolution. Start your DAO today.
                    </p>
                    <Link href="/dashboard">
                        <Button size="lg" className="aleo-gradient">
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t">
                <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="text-sm text-muted-foreground">
                            © 2026 AleoDAO. Built with ❤️ on Aleo.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                                Docs
                            </Link>
                            <Link href="https://github.com" className="text-muted-foreground hover:text-foreground">
                                GitHub
                            </Link>
                            <Link href="/docs/PRIVACY.md" className="text-muted-foreground hover:text-foreground">
                                Privacy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
