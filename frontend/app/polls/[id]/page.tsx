'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lock, Users, Clock, BarChart3, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Header } from '@/components/layout/Header'
import { useToast } from '@/components/ui/use-toast'
import { usePollStore } from '@/lib/store/poll-store'
import { useDAOStore } from '@/lib/store/dao-store'
import { useWallet } from '@/lib/aleo/wallet'
import { formatDate, calculatePercentage } from '@/lib/utils'

export default function PollVotePage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const { isConnected, account } = useWallet()
    const { getPoll, hasVoted, castVote, getUserVote } = usePollStore()
    const { getDAO } = useDAOStore()

    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [isVoting, setIsVoting] = useState(false)

    const pollId = params.id as string
    const poll = getPoll(pollId)
    const dao = poll ? getDAO(poll.daoId) : undefined
    const walletAddress = account?.address ? String(account.address) : ''
    const userHasVoted = isConnected && walletAddress ? hasVoted(pollId, walletAddress) : false
    const userVote = isConnected && walletAddress ? getUserVote(pollId, walletAddress) : undefined

    if (!poll || !dao) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#000000] text-white">
                <div className="text-center">
                    <h2 className="text-lg font-semibold">Poll Not Found</h2>
                    <Button variant="link" onClick={() => router.push('/polls')} className="text-[#a855f7]">
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    const isActive = poll.isActive && poll.deadline > Date.now()
    const timeLeft = poll.deadline - Date.now()
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    const handleVoteSubmit = () => {
        if (!isConnected) {
            toast({
                title: 'Connect Wallet',
                description: 'Please connect your wallet to vote.',
                variant: 'destructive',
            })
            return
        }

        if (userHasVoted) {
            toast({
                title: 'Already Voted',
                description: 'You have already cast your vote on this poll.',
                variant: 'destructive',
            })
            return
        }

        if (!selectedOption) {
            toast({
                title: 'Select an option',
                description: 'Please select a voting option to proceed.',
            })
            return
        }

        setShowConfirmDialog(true)
    }

    const confirmVote = async () => {
        if (!account || !selectedOption) return

        setIsVoting(true)
        try {
            const votingPower = 100 // Mock voting power
            const voterAddress = String(account.address)

            await castVote(pollId, voterAddress, selectedOption, votingPower)

            toast({
                title: 'Success',
                description: 'Your private vote has been submitted.',
            })

            setShowConfirmDialog(false)
            router.refresh()
        } catch (error) {
            console.error('Vote failed:', error)
            toast({
                title: 'Error',
                description: 'Failed to submit vote. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsVoting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#000000] text-white">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <Link href="/polls" className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Polls
                </Link>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Poll Header */}
                        <Card className="bg-zinc-900/50 border-zinc-800">
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-4">
                                    {poll.isPrivate && (
                                        <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-[#a855f7]/10 border border-[#a855f7]/20">
                                            <Lock className="h-4 w-4 text-[#a855f7]" />
                                            <span className="text-sm text-[#a855f7] font-semibold">Private Poll</span>
                                        </div>
                                    )}
                                    {isActive ? (
                                        <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-500/10 border border-green-500/20">
                                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-sm text-green-500 font-semibold">Active</span>
                                        </div>
                                    ) : (
                                        <div className="px-3 py-1 rounded-md bg-zinc-800 border border-zinc-700">
                                            <span className="text-sm text-zinc-400 font-semibold">Ended</span>
                                        </div>
                                    )}
                                </div>

                                <CardTitle className="text-3xl">{poll.title}</CardTitle>
                                <CardDescription className="text-zinc-400 text-base">
                                    {poll.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        {/* Voting Options */}
                        <Card className="bg-zinc-900/50 border-zinc-800">
                            <CardHeader>
                                <CardTitle>
                                    {userHasVoted ? 'Your Vote' : isActive ? 'Cast Your Vote' : 'Results'}
                                </CardTitle>
                                {poll.isPrivate && !userHasVoted && isActive && (
                                    <CardDescription className="flex items-center gap-2 text-[#a855f7]">
                                        <Lock className="h-4 w-4" />
                                        Your vote choice will be encrypted with ZK-proofs
                                    </CardDescription>
                                )}
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {poll.options.map(option => {
                                    const percentage = calculatePercentage(option.votes, poll.totalVotes)
                                    const isSelected = selectedOption === option.id
                                    const isUserVote = userVote?.optionId === option.id

                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => !userHasVoted && isActive && setSelectedOption(option.id)}
                                            disabled={userHasVoted || !isActive}
                                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${isUserVote
                                                    ? 'border-[#a855f7] bg-[#a855f7]/10'
                                                    : isSelected
                                                        ? 'border-[#a855f7] bg-[#a855f7]/5'
                                                        : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                                                } ${userHasVoted || !isActive ? 'cursor-default' : 'cursor-pointer'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{option.text}</span>
                                                    {isUserVote && (
                                                        <Check className="h-4 w-4 text-[#a855f7]" />
                                                    )}
                                                </div>
                                                <span className="text-sm text-zinc-400">{percentage}%</span>
                                            </div>

                                            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-[#a855f7] transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>

                                            <div className="mt-2 text-sm text-zinc-500">
                                                {option.votes} votes
                                            </div>
                                        </button>
                                    )
                                })}

                                {!userHasVoted && isActive && (
                                    <Button
                                        onClick={handleVoteSubmit}
                                        disabled={!selectedOption}
                                        className="w-full bg-[#a855f7] hover:bg-[#9333ea] mt-4"
                                    >
                                        Submit Vote
                                    </Button>
                                )}

                                {userHasVoted && (
                                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                        <p className="text-sm text-green-500 font-semibold">
                                            ✓ You have voted on this poll
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Poll Stats */}
                        <Card className="bg-zinc-900/50 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-lg">Poll Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-zinc-500" />
                                    <div>
                                        <p className="text-sm text-zinc-500">Total Votes</p>
                                        <p className="font-semibold">{poll.totalVotes}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <BarChart3 className="h-5 w-5 text-zinc-500" />
                                    <div>
                                        <p className="text-sm text-zinc-500">Options</p>
                                        <p className="font-semibold">{poll.options.length}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-zinc-500" />
                                    <div>
                                        <p className="text-sm text-zinc-500">
                                            {isActive ? 'Time Remaining' : 'Ended'}
                                        </p>
                                        <p className="font-semibold">
                                            {isActive
                                                ? `${daysLeft}d ${hoursLeft}h`
                                                : formatDate(poll.deadline)}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-zinc-800">
                                    <p className="text-sm text-zinc-500 mb-1">DAO</p>
                                    <Link href={`/dashboard`} className="font-semibold text-[#a855f7] hover:text-[#9333ea]">
                                        {dao.name}
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Privacy Info */}
                        {poll.isPrivate && (
                            <Card className="bg-[#a855f7]/5 border-[#a855f7]/20">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Lock className="h-5 w-5 text-[#a855f7]" />
                                        <CardTitle className="text-lg">Privacy Protected</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-zinc-400">
                                        <li>✓ Vote choice encrypted</li>
                                        <li>✓ Voting power hidden</li>
                                        <li>✓ ZK-proof verification</li>
                                        <li>✓ Results publicly verifiable</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Confirmation Dialog */}
                <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <DialogContent className="bg-zinc-900 border-zinc-800">
                        <DialogHeader>
                            <DialogTitle>Confirm Your Vote</DialogTitle>
                            <DialogDescription>
                                Your vote will be encrypted and submitted anonymously. This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <div className="p-4 bg-[#a855f7]/10 border border-[#a855f7]/20 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lock className="h-4 w-4 text-[#a855f7]" />
                                    <span className="text-sm font-semibold text-[#a855f7]">
                                        {isVoting ? 'Generating ZK Proof...' : 'Privacy Active'}
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-400">
                                    Your vote choice and voting power will be encrypted using zero-knowledge proofs.
                                </p>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowConfirmDialog(false)}
                                disabled={isVoting}
                                className="border-zinc-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmVote}
                                disabled={isVoting}
                                className="bg-[#a855f7] hover:bg-[#9333ea]"
                            >
                                {isVoting ? 'Submitting...' : 'Confirm Vote'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    )
}
