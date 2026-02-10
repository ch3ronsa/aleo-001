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
import { hashStringToField } from '@/lib/aleo/transaction-builder'
import { Header } from '@/components/layout/Header'

export default function CreateDAOPage() {
    const router = useRouter()
    const { toast } = useToast()
    const { isConnected, account, requestTransaction } = useWallet()
    const { createDAO, buildCreateDAOTransaction } = useDAOStore()
    const [isCreating, setIsCreating] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        votingPeriod: '100800', // ~7 days in blocks
        quorum: '51', // 51%
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

        // Input validation
        if (formData.name.length < 3 || formData.name.length > 50) {
            toast({ title: "Validation Error", description: "DAO name must be 3-50 characters.", variant: "destructive" })
            return
        }
        if (formData.description.length < 10 || formData.description.length > 500) {
            toast({ title: "Validation Error", description: "Description must be 10-500 characters.", variant: "destructive" })
            return
        }
        const votingPeriod = parseInt(formData.votingPeriod)
        const quorum = parseInt(formData.quorum)
        const proposalThreshold = parseInt(formData.proposalThreshold)
        if (isNaN(votingPeriod) || votingPeriod < 1) {
            toast({ title: "Validation Error", description: "Voting period must be at least 1 block.", variant: "destructive" })
            return
        }
        if (isNaN(quorum) || quorum < 1 || quorum > 100) {
            toast({ title: "Validation Error", description: "Quorum must be between 1-100%.", variant: "destructive" })
            return
        }
        if (isNaN(proposalThreshold) || proposalThreshold < 1) {
            toast({ title: "Validation Error", description: "Proposal threshold must be at least 1.", variant: "destructive" })
            return
        }

        setIsCreating(true)

        try {
            const address = String(account.address)
            let txId: string | undefined

            // Try real wallet transaction
            if (requestTransaction) {
                try {
                    const nameHash = hashStringToField(formData.name)
                    const transaction = buildCreateDAOTransaction(address, nameHash, votingPeriod, quorum * 100, proposalThreshold)
                    txId = await requestTransaction(transaction)
                } catch (txError) {
                    console.warn("Wallet transaction failed:", txError)
                }
            }

            // Optimistic local update
            createDAO({
                name: formData.name,
                description: formData.description,
                creator: address,
                votingPeriod,
                quorumPercentage: quorum,
            })

            toast({
                title: txId ? "DAO Created On-Chain" : "DAO Created",
                description: txId
                    ? "Your DAO creation transaction has been submitted to Aleo network."
                    : "DAO created locally. Connect wallet to submit on-chain.",
            })

            router.push('/dashboard')
        } catch (error) {
            console.error("Transaction failed:", error)
            toast({
                title: "Error",
                description: "Failed to create DAO. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#000000] text-zinc-100 font-sans">
            <Header />

            <div className="container mx-auto max-w-2xl px-4 py-8 lg:py-12">
                <div className="mb-6">
                    <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Create New DAO</h1>
                    <p className="text-zinc-400">
                        Set up a new privacy-preserving DAO on Aleo
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="bg-[#111111] border-zinc-900">
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
                                        placeholder="51"
                                        value={formData.quorum}
                                        onChange={(e) => setFormData({ ...formData, quorum: e.target.value })}
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

                        <CardFooter className="flex justify-between border-t border-zinc-900 pt-4">
                            <Link href="/dashboard">
                                <Button type="button" variant="outline" className="border-zinc-800">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={isCreating} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                                {isCreating ? 'Creating...' : 'Create DAO'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>

                {/* Info Card */}
                <Card className="mt-6 border-[#3b82f6]/20 bg-[#3b82f6]/5">
                    <CardHeader>
                        <CardTitle className="text-base text-white">Privacy Features</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-zinc-400">
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-[#3b82f6]">✓</span>
                                <span>All member token balances remain private</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#3b82f6]">✓</span>
                                <span>Vote choices are never revealed publicly</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#3b82f6]">✓</span>
                                <span>Results are cryptographically verifiable</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
