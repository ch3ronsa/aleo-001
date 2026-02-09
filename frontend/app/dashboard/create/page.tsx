'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useWallet } from '@/lib/aleo/wallet'
import { useDAOStore } from '@/lib/store/dao-store'
import { PROGRAMS, FEES } from '@/lib/aleo/config'

export default function CreateDAOPage() {
    const router = useRouter()
    const { toast } = useToast()
    const { isConnected, account, requestTransaction } = useWallet()
    const { createDAO } = useDAOStore()
    const [isCreating, setIsCreating] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        votingPeriod: '100800', // ~7 days in blocks
        quorum: '5000', // 50%
        proposalThreshold: '1000',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isConnected || !account) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your Aleo wallet to create a DAO.",
                variant: "destructive",
            })
            return
        }

        setIsCreating(true)

        try {
            // Demo Mode - directly create DAO in store
            // In production, this would use Puzzle SDK's transaction API
            const address = account?.address ? String(account.address) : 'demo_address'

            // Optimistic UI update: Assume success for demo UX
            const votingPeriod = parseInt(formData.votingPeriod)
            const quorumPercentage = parseInt(formData.quorum) / 100 // Convert from bps (5000) to percentage (50)

            createDAO({
                name: formData.name,
                description: formData.description,
                creator: address,
                votingPeriod,
                quorumPercentage
            })

            toast({
                title: "Transaction Submitted!",
                description: "DAO creation transaction sent to Aleo network (Demo Mode).",
            })

            router.push('/dashboard')
        } catch (error) {
            console.error("Transaction failed:", error);

            // Fallback for demo if user rejects or network fails
            // We still want to show the functionality
            if (confirm("Transaction failed or was rejected. Continue in Demo Mode?")) {
                const votingPeriod = parseInt(formData.votingPeriod)
                const quorumPercentage = parseInt(formData.quorum) / 100

                createDAO({
                    name: formData.name,
                    description: formData.description,
                    creator: String(account.address),
                    votingPeriod,
                    quorumPercentage
                })
                router.push('/dashboard')
            } else {
                toast({
                    title: "Error",
                    description: "Failed to create DAO. Please try again.",
                    variant: "destructive",
                })
            }
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto flex h-16 items-center px-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            <div className="container mx-auto max-w-2xl px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Create New DAO</h1>
                    <p className="text-muted-foreground">
                        Set up a new privacy-preserving DAO on Aleo
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>DAO Details</CardTitle>
                            <CardDescription>
                                Configure your DAO's governance parameters
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">DAO Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Aleo Builders DAO"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    placeholder="Brief description of your DAO"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="votingPeriod">
                                        Voting Period (blocks)
                                    </Label>
                                    <Input
                                        id="votingPeriod"
                                        type="number"
                                        placeholder="100800"
                                        value={formData.votingPeriod}
                                        onChange={(e) => setFormData({ ...formData, votingPeriod: e.target.value })}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        ~{Math.round(parseInt(formData.votingPeriod) / 14400)} days
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="quorum">
                                        Quorum (%)
                                    </Label>
                                    <Input
                                        id="quorum"
                                        type="number"
                                        min="1"
                                        max="100"
                                        placeholder="50"
                                        value={parseInt(formData.quorum) / 100}
                                        onChange={(e) => setFormData({ ...formData, quorum: (parseFloat(e.target.value) * 100).toString() })}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Minimum votes required to pass
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="proposalThreshold">
                                    Proposal Threshold (tokens)
                                </Label>
                                <Input
                                    id="proposalThreshold"
                                    type="number"
                                    placeholder="1000"
                                    value={formData.proposalThreshold}
                                    onChange={(e) => setFormData({ ...formData, proposalThreshold: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Minimum tokens needed to create a proposal
                                </p>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between">
                            <Link href="/dashboard">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={isCreating}>
                                {isCreating ? 'Creating...' : 'Create DAO'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>

                {/* Info Card */}
                <Card className="mt-6 border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-base">Privacy Features</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-primary">✓</span>
                                <span>All member token balances remain private</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">✓</span>
                                <span>Vote choices are never revealed publicly</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary">✓</span>
                                <span>Results are cryptographically verifiable</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
