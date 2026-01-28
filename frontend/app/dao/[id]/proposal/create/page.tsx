'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea' // Assuming we have this, or fallback to standard textarea
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { useWallet } from '@/lib/aleo/wallet'
import { useDAOStore } from '@/lib/store/dao-store'
import { useProposalStore } from '@/lib/store/proposal-store'
import { PROGRAMS, FEES } from '@/lib/aleo/config'
import { Transaction, WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base'
import { Header } from '@/components/layout/Header'

export default function CreateProposalPage() {
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const { isConnected, account, requestTransaction } = useWallet()
    const { getDAO } = useDAOStore()
    const { createProposal } = useProposalStore()

    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [dao, setDao] = useState<any>(null)

    const daoId = params.id as string

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
    })

    useEffect(() => {
        const foundDao = getDAO(daoId)
        if (foundDao) {
            setDao(foundDao)
        }
        setIsLoading(false)
    }, [daoId, getDAO])

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

        setIsCreating(true)

        try {
            // Demo Mode Transaction Construction
            // In a real app, this would be a call to proposal.aleo/propose
            const transaction = Transaction.createTransaction(
                account.address().to_string(),
                WalletAdapterNetwork.Testnet,
                PROGRAMS.PROPOSAL,
                'propose',
                [
                    // Mock args for demo
                    // dao_id, title_hash, etc.
                    "123field", // mock id
                    "123field", // mock title hash
                ],
                FEES.PROPOSE
            )

            if (requestTransaction) {
                await requestTransaction(transaction)
            }

            // Create Proposal in Store
            createProposal({
                daoId: dao.id,
                title: formData.title,
                description: formData.description,
                imageUrl: formData.imageUrl || undefined,
                proposer: account.address().to_string(),
                quorumRequired: dao.quorumPercentage,
                startTime: Date.now(),
                endTime: Date.now() + (dao.votingPeriod * 10 * 1000), // Mock conversion of blocks to likely ms for demo
            })

            toast({
                title: "Proposal Created",
                description: "Your proposal is now active and ready for voting.",
            })

            router.push(`/dao/${daoId}`)
        } catch (error) {
            console.error("Proposal creation failed:", error)
            // Fallback for demo
            if (confirm("Transaction failed. Continue in Demo Mode?")) {
                createProposal({
                    daoId: dao.id,
                    title: formData.title,
                    description: formData.description,
                    imageUrl: formData.imageUrl || undefined,
                    proposer: account.address().to_string(),
                    quorumRequired: dao.quorumPercentage,
                    startTime: Date.now(),
                    endTime: Date.now() + (dao.votingPeriod * 10 * 1000),
                })
                router.push(`/dao/${daoId}`)
            }
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

                            <div className="space-y-2">
                                <Label htmlFor="image" className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    Cover Image URL (Optional)
                                </Label>
                                <Input
                                    id="image"
                                    placeholder="https://..."
                                    className="bg-black border-zinc-800"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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
