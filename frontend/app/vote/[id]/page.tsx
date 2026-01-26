'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ThumbsUp, ThumbsDown, Lock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { calculatePercentage } from '@/lib/utils'

export default function VotePage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const [voteChoice, setVoteChoice] = useState<boolean | null>(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [isVoting, setIsVoting] = useState(false)

    // Mock proposal data
    const proposal = {
        id: params.id,
        title: 'Fund zkML Research Initiative',
        description: 'Allocate 50,000 tokens to research zero-knowledge machine learning applications. This initiative aims to explore the intersection of ML and ZK proofs, potentially unlocking new use cases for privacy-preserving AI.',
        daoName: 'Aleo Builders DAO',
        votingEnd: Date.now() / 1000 + 86400 * 6,
        yesVotes: 12500,
        noVotes: 3200,
        totalVotes: 15700,
    }

    const yesPercentage = calculatePercentage(proposal.yesVotes, proposal.totalVotes)
    const noPercentage = calculatePercentage(proposal.noVotes, proposal.totalVotes)

    const handleVote = (choice: boolean) => {
        setVoteChoice(choice)
        setShowConfirmDialog(true)
    }

    const confirmVote = async () => {
        setIsVoting(true)
        try {
            // TODO: Call private_vote.aleo cast_vote transition
            await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate transaction

            toast({
                title: "Vote Cast Successfully!",
                description: "Your vote has been recorded privately on-chain.",
            })

            setShowConfirmDialog(false)
            router.push('/proposals')
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
                    <p className="text-sm text-muted-foreground mb-2">{proposal.daoName}</p>
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
                                            <span className="text-muted-foreground">({proposal.yesVotes.toLocaleString()} votes)</span>
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
                                            <span className="text-muted-foreground">({proposal.noVotes.toLocaleString()} votes)</span>
                                        </div>
                                    </div>

                                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="absolute left-0 h-full bg-red-500 transition-all"
                                            style={{ width: `${noPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 text-sm text-muted-foreground">
                                    Total: {proposal.totalVotes.toLocaleString()} votes cast
                                </div>
                            </CardContent>
                        </Card>

                        {/* Vote Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Cast Your Vote</CardTitle>
                                <CardDescription>
                                    Your choice will be private and cannot be revealed
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-auto flex-col gap-3 py-8 border-green-500/20 hover:border-green-500 hover:bg-green-500/5"
                                    onClick={() => handleVote(true)}
                                >
                                    <ThumbsUp className="h-8 w-8 text-green-500" />
                                    <div className="text-center">
                                        <div className="font-semibold text-lg">Vote Yes</div>
                                        <div className="text-xs text-muted-foreground">Support this proposal</div>
                                    </div>
                                </Button>

                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-auto flex-col gap-3 py-8 border-red-500/20 hover:border-red-500 hover:bg-red-500/5"
                                    onClick={() => handleVote(false)}
                                >
                                    <ThumbsDown className="h-8 w-8 text-red-500" />
                                    <div className="text-center">
                                        <div className="font-semibold text-lg">Vote No</div>
                                        <div className="text-xs text-muted-foreground">Reject this proposal</div>
                                    </div>
                                </Button>
                            </CardContent>
                        </Card>
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
                                    <span className="text-muted-foreground">Time Left:</span>
                                    <span className="font-medium">6 days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Quorum:</span>
                                    <span className="font-medium">50%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Your Power:</span>
                                    <span className="font-medium">5,000</span>
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
                        <DialogTitle>Confirm Your Vote</DialogTitle>
                        <DialogDescription>
                            You are about to vote <strong>{voteChoice ? 'YES' : 'NO'}</strong> on this proposal.
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-4">
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Privacy Guaranteed
                            </h4>
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
                            {isVoting ? 'Submitting...' : 'Confirm Vote'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
