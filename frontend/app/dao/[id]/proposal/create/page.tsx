'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// Using native textarea element - no separate Textarea component needed
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useWallet } from '@/lib/aleo/wallet'
import { useDAOStore } from '@/lib/store/dao-store'
import { useProposalStore } from '@/lib/store/proposal-store'
import { hashStringToField } from '@/lib/aleo/transaction-builder'
import { Header } from '@/components/layout/Header'

export default function CreateProposalPage() {
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const { isConnected, account, requestTransaction } = useWallet()
    const { getDAO } = useDAOStore()
    const { createProposal, buildCreateProposalTransaction } = useProposalStore()

    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [dao, setDao] = useState<ReturnType<typeof getDAO>>(undefined)

    const daoId = params.id as string

    const [formData, setFormData] = useState({
        title: '',
        description: '',
    })

    useEffect(() => {
        const foundDao = getDAO(daoId)
        if (foundDao) {
            setDao(foundDao)
        }
        setIsLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [daoId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isConnected || !account) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your wallet to submit a proposal.",
                variant: "destructive",
            })
            return
        }

        if (!dao) return

        // Input validation
        if (formData.title.length < 5 || formData.title.length > 100) {
            toast({ title: "Validation Error", description: "Title must be 5-100 characters.", variant: "destructive" })
            return
        }
        if (formData.description.length < 20 || formData.description.length > 2000) {
            toast({ title: "Validation Error", description: "Description must be 20-2000 characters.", variant: "destructive" })
            return
        }

        setIsCreating(true)

        try {
            const address = String(account.address)
            let txId: string | undefined

            // Try real wallet transaction
            if (requestTransaction) {
                try {
                    const titleHash = hashStringToField(formData.title)
                    const descHash = hashStringToField(formData.description)
                    const votingStartDelay = 0 // Start immediately
                    const votingDuration = dao.votingPeriod > 100 ? dao.votingPeriod : dao.votingPeriod * 14400 // blocks
                    const transaction = buildCreateProposalTransaction(address, daoId, titleHash, descHash, votingStartDelay, votingDuration)
                    txId = await requestTransaction(transaction)
                } catch (txError) {
                    console.warn("Wallet transaction failed:", txError)
                }
            }

            // Optimistic local update
            createProposal({
                daoId: dao.id,
                title: formData.title,
                description: formData.description,
                proposer: address,
                quorumRequired: dao.quorumPercentage,
                startTime: Date.now(),
                endTime: Date.now() + (dao.votingPeriod > 100 ? dao.votingPeriod / 14400 * 86400000 : dao.votingPeriod * 86400000),
            })

            toast({
                title: txId ? "Proposal Submitted On-Chain" : "Proposal Created",
                description: txId
                    ? "Your proposal has been submitted to Aleo network."
                    : "Proposal created locally. Connect wallet for on-chain submission.",
            })

            router.push(`/dao/${daoId}`)
        } catch (error) {
            console.error("Proposal creation failed:", error)
            toast({
                title: "Error",
                description: "Failed to create proposal. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsCreating(false)
        }
    }

    if (isLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>
    }

    if (!dao) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
                <h2 className="text-xl font-bold">DAO Not Found</h2>
                <Link href="/dashboard"><Button>Return to Dashboard</Button></Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-zinc-100 font-sans">
            <Header />

            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-2xl">
                <div className="mb-6">
                    <Link href={`/dao/${daoId}`} className="text-sm text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to {dao.name}
                    </Link>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Create Proposal</h1>
                    <p className="text-zinc-400">Submit a new governance proposal for {dao.name}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="bg-[#111111] border-zinc-900">
                        <CardHeader>
                            <CardTitle>Proposal Details</CardTitle>
                            <CardDescription>Define what you want to change or enact</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Update Community Guidelines"
                                    className="bg-black border-zinc-800 focus:ring-[#3b82f6]"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea // Using raw textarea if Textarea component isn't robust
                                    id="description"
                                    placeholder="Describe your proposal in detail..."
                                    className="flex min-h-[120px] w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-end pt-4 border-t border-zinc-900">
                            <Button type="submit" disabled={isCreating} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                                {isCreating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Proposal'
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    )
}
