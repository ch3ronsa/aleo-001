'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ThumbsUp, ThumbsDown, Lock, Shield, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { calculatePercentage } from '@/lib/utils'
import { useWallet } from '@/lib/aleo/wallet'
import { useProposalStore } from '@/lib/store/proposal-store'
import { useVoteStore, VoteChoice } from '@/lib/store/vote-store'
import { useDAOStore } from '@/lib/store/dao-store'

export default function VotePage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const { isConnected, account } = useWallet()
    const { getProposal, updateProposalVotes } = useProposalStore()
    const { getDAO } = useDAOStore()
    const { castVote, hasVoted, isGeneratingProof } = useVoteStore()

    const [voteChoice, setVoteChoice] = useState<VoteChoice | null>(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [isVoting, setIsVoting] = useState(false)

    // Load data
    const proposalId = params.id as string
    const proposal = getProposal(proposalId)
    const dao = proposal ? getDAO(proposal.daoId) : undefined

    // Check if user has already voted
    const userHasVoted = isConnected && account ? hasVoted(proposalId, account.address().to_string()) : false

    if (!proposal || !dao) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-lg font-semibold">Proposal Not Found</h2>
                    <Button variant="link" onClick={() => router.push('/proposals')}>
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    const totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes
    const yesPercentage = calculatePercentage(proposal.forVotes, totalVotes)
    const noPercentage = calculatePercentage(proposal.againstVotes, totalVotes)
    const abstainPercentage = calculatePercentage(proposal.abstainVotes, totalVotes)

    const handleVote = (choice: VoteChoice) => {
        if (!isConnected) {
            toast({
                title: "Connect Wallet",
                description: "Please connect your wallet to vote.",
                variant: "destructive",
            })
            return
        }

        if (userHasVoted) {
            toast({
                title: "Already Voted",
                description: "You have already cast your vote on this proposal.",
                variant: "destructive",
            })
            return
        }

        setVoteChoice(choice)
        setShowConfirmDialog(true)
    }

    const confirmVote = async () => {
        if (!account || !voteChoice) return

        setIsVoting(true)
        try {
            const votingPower = 100 // Mock voting power
            const voterAddress = account.address().to_string()

            // Cast vote (generates ZK proof in simulation)
            await castVote(proposal.id, voterAddress, voteChoice, votingPower)

            // Update proposal stats
            updateProposalVotes(proposal.id, voteChoice, votingPower)

            toast({
                title: "Vote Cast Successfully!",
                description: "Your vote has been recorded privately on-chain.",
            })

            setShowConfirmDialog(false)
            router.refresh()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to cast vote. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsVoting(false)
        }
    }

    const isVoteDisabled = !isConnected || userHasVoted || proposal.status !== 'active'

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto flex h-16 items-center px-4">
                    <Link href="/proposals" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Proposals
                    </Link>
                </div>
            </header>

            <div className="container mx-auto max-w-4xl px-4 py-8">
                {/* Proposal Info */}
                <div className="mb-8">
                    <p className="text-sm text-muted-foreground mb-2">{dao.name}</p>
                    <h1 className="text-3xl font-bold mb-4">{proposal.title}</h1>
                    <p className="text-muted-foreground">{proposal.description}</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Voting Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Current Results */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Results</CardTitle>
                                <CardDescription>
                                    Live voting results (your vote will remain private)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-green-500" />
                                            <span className="font-medium">Yes: {yesPercentage}%</span>
                                            <span className="text-muted-foreground">({proposal.forVotes.toLocaleString()} votes)</span>
                                        </div>
                                    </div>

                                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="absolute left-0 h-full bg-green-500 transition-all"
                                            style={{ width: `${yesPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-red-500" />
                                            <span className="font-medium">No: {noPercentage}%</span>
                                            <span className="text-muted-foreground">({proposal.againstVotes.toLocaleString()} votes)</span>
                                        </div>
                                    </div>

                                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="absolute left-0 h-full bg-red-500 transition-all"
                                            style={{ width: `${noPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-gray-500" />
                                            <span className="font-medium">Abstain: {abstainPercentage}%</span>
                                            <span className="text-muted-foreground">({proposal.abstainVotes.toLocaleString()} votes)</span>
                                        </div>
                                    </div>

                                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="absolute left-0 h-full bg-gray-500 transition-all"
                                            style={{ width: `${abstainPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 text-sm text-muted-foreground">
                                    Total: {totalVotes.toLocaleString()} votes cast
                                </div>
                            </CardContent>
                        </Card>

                        {/* Vote Actions */}
                        {proposal.status === 'active' && !userHasVoted ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Cast Your Vote</CardTitle>
                                    <CardDescription>
                                        Your choice will be private and cannot be revealed
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 sm:grid-cols-3">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-auto flex-col gap-3 py-8 border-green-500/20 hover:border-green-500 hover:bg-green-500/5"
                                        onClick={() => handleVote('for')}
                                        disabled={isVoteDisabled}
                                    >
                                        <ThumbsUp className="h-8 w-8 text-green-500" />
                                        <div className="text-center">
                                            <div className="font-semibold text-lg">Vote Yes</div>
                                            <div className="text-xs text-muted-foreground">Support</div>
                                        </div>
                                    </Button>

                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-auto flex-col gap-3 py-8 border-red-500/20 hover:border-red-500 hover:bg-red-500/5"
                                        onClick={() => handleVote('against')}
                                        disabled={isVoteDisabled}
                                    >
                                        <ThumbsDown className="h-8 w-8 text-red-500" />
                                        <div className="text-center">
                                            <div className="font-semibold text-lg">Vote No</div>
                                            <div className="text-xs text-muted-foreground">Reject</div>
                                        </div>
                                    </Button>

                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-auto flex-col gap-3 py-8 border-gray-500/20 hover:border-gray-500 hover:bg-gray-500/5"
                                        onClick={() => handleVote('abstain')}
                                        disabled={isVoteDisabled}
                                    >
                                        <Minus className="h-8 w-8 text-gray-500" />
                                        <div className="text-center">
                                            <div className="font-semibold text-lg">Abstain</div>
                                            <div className="text-xs text-muted-foreground">Neutral</div>
                                        </div>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : userHasVoted ? (
                            <Card className="border-green-500/20 bg-green-500/5">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-6 w-6 text-green-500" />
                                        <CardTitle>Vote Confirmed</CardTitle>
                                    </div>
                                    <CardDescription>
                                        You have successfully cast a private vote on this proposal.
                                        Only you know what you voted for.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ) : null}
                    </div>

                    {/* Privacy Info Sidebar */}
                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-base">Private Voting</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium">Your vote is private</p>
                                        <p className="text-muted-foreground text-xs">No one can see how you voted</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium">ZK-proof verified</p>
                                        <p className="text-muted-foreground text-xs">Vote validity proven cryptographically</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium">Cannot be changed</p>
                                        <p className="text-muted-foreground text-xs">Vote is final once submitted</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Voting Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className="font-medium capitalize">{proposal.status}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Quorum:</span>
                                    <span className="font-medium">{dao.quorumPercentage}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Your Power:</span>
                                    <span className="font-medium">100</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Your Private Vote</DialogTitle>
                        <DialogDescription>
                            You are about to vote <strong>{voteChoice?.toUpperCase()}</strong> on this proposal.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-4">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                            <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-background border">
                                {isGeneratingProof || isVoting ? (
                                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                                ) : (
                                    <Lock className="h-5 w-5 text-primary" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-medium">Generating Zero-Knowledge Proof</h4>
                                <p className="text-sm text-muted-foreground">
                                    {isVoting ? "Encrypting vote & generating proof..." : "Your vote choice is encrypted locally."}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Your vote choice will never be revealed</li>
                                <li>• Only you will know how you voted</li>
                                <li>• Results are still publicly verifiable</li>
                            </ul>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isVoting}>
                            Cancel
                        </Button>
                        <Button onClick={confirmVote} disabled={isVoting}>
                            {isVoting ? 'Proving & Submitting...' : 'Confirm & Sign'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
