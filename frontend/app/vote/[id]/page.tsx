'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Lock, Shield, ExternalLink, Info, User, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { calculatePercentage, formatDate, formatAddress } from '@/lib/utils'
import { useWallet } from '@/lib/aleo/wallet'
import { useProposalStore } from '@/lib/store/proposal-store'
import { useVoteStore, VoteChoice } from '@/lib/store/vote-store'
import { useDAOStore } from '@/lib/store/dao-store'
import { PROGRAMS } from '@/lib/aleo/config'
import { buildCastVoteTx } from '@/lib/aleo/transaction-builder'
import { cn } from '@/lib/utils'

// GitHub Icon Component
const GitHubIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
)

import { Header } from '@/components/layout/Header'

export default function VotePage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const { isConnected, account, requestTransaction, requestRecords } = useWallet()
    const { getProposal, updateProposalVotes } = useProposalStore()
    const { getDAO } = useDAOStore()
    const { castVote, hasVoted } = useVoteStore()

    const [selectedOption, setSelectedOption] = useState<VoteChoice | null>(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [isVoting, setIsVoting] = useState(false)

    // Load data
    const proposalId = params.id as string
    const proposal = getProposal(proposalId)
    const dao = proposal ? getDAO(proposal.daoId) : undefined

    // Check if user has already voted - get address as string
    const walletAddress = account?.address ? String(account.address) : ''
    const userHasVoted = isConnected && walletAddress ? hasVoted(proposalId, walletAddress) : false

    if (!proposal || !dao) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#000000] text-white">
                <div className="text-center">
                    <h2 className="text-lg font-semibold">Proposal Not Found</h2>
                    <Button variant="link" onClick={() => router.push('/proposals')} className="text-[#3b82f6]">
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    const totalVotes = proposal.forVotes + proposal.againstVotes
    const yesPercentage = calculatePercentage(proposal.forVotes, totalVotes)
    const noPercentage = calculatePercentage(proposal.againstVotes, totalVotes)

    const handleVoteSubmit = () => {
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

        if (!selectedOption) {
            toast({
                title: "Select an option",
                description: "Please select a voting option to proceed.",
            })
            return
        }

        setShowConfirmDialog(true)
    }

    const confirmVote = async () => {
        if (!account || !selectedOption) return

        setIsVoting(true)
        try {
            const voterAddress = String(account.address)
            const voteChoice = selectedOption === 'for' // true = yes, false = no
            let txId: string | undefined

            // Try real wallet transaction
            if (requestTransaction && requestRecords) {
                try {
                    // Get Member records from wallet
                    const records = await requestRecords(PROGRAMS.DAO_REGISTRY)
                    const memberRecord = records?.find((r: any) =>
                        r.data?.dao_id || r.plaintext?.includes('dao_id')
                    )

                    if (memberRecord) {
                        const recordPlaintext = typeof memberRecord === 'string'
                            ? memberRecord
                            : memberRecord.plaintext || JSON.stringify(memberRecord)

                        const transaction = buildCastVoteTx(
                            recordPlaintext,
                            proposal.id,
                            voteChoice
                        )
                        const result = await requestTransaction(transaction)
                        txId = typeof result === 'string' ? result : result?.transactionId
                    }
                } catch (txError) {
                    console.warn("Wallet transaction failed:", txError)
                }
            }

            // Update local state
            const votingPower = 1
            await castVote(proposal.id, voterAddress, selectedOption, votingPower, txId)
            updateProposalVotes(proposal.id, selectedOption, votingPower)

            toast({
                title: txId ? "Vote Submitted On-Chain" : "Vote Recorded",
                description: txId
                    ? "Your private vote has been submitted with ZK-proof verification."
                    : "Your vote has been recorded locally. Connect wallet for on-chain submission.",
            })

            setShowConfirmDialog(false)
            router.refresh()
        } catch (error) {
            console.error("Vote failed:", error)
            toast({
                title: "Error",
                description: "Failed to submit vote. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsVoting(false)
        }
    }

    const isActive = proposal.status === 'active'
    const statusLabel = proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)

    // Status color mapping matching Aleo style
    const statusColors: Record<string, string> = {
        active: 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20',
        passed: 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20',
        rejected: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
        pending: 'bg-zinc-800 text-zinc-400 border-zinc-700',
        executed: 'bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/20',
    }

    return (
        <div className="min-h-screen bg-[#000000] text-[#e5e5e5] font-sans selection:bg-[#3b82f6]/30">
            <Header />

            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-[1012px]">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-8">
                    <Link href="/proposals" className="hover:text-zinc-300 transition-colors">Governance</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-zinc-300">Proposal</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8">
                    {/* Left Column: Proposal Details */}
                    <div className="space-y-8">
                        <div>
                            <div className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px] font-bold border mb-4 capitalize",
                                statusColors[proposal.status] || statusColors.pending
                            )}>
                                <div className={cn("h-1.5 w-1.5 rounded-full", proposal.status === 'active' ? 'bg-[#22c55e]' : 'bg-current')} />
                                {statusLabel}
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                                {proposal.title}
                            </h1>
                            <div className="flex items-center gap-3 text-sm mb-8">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center border border-zinc-800">
                                    <User className="h-4 w-4 text-zinc-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-mono text-zinc-300">{formatAddress(proposal.proposer)}</span>
                                    <span className="text-zinc-500 text-xs">Proposed on {formatDate(proposal.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="bg-[#111111] border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-300 gap-2 h-11 w-full sm:w-auto"
                        >
                            <GitHubIcon className="h-4 w-4" />
                            View on GitHub
                            <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                        </Button>

                        <div className="prose prose-invert max-w-none border-t border-zinc-900 pt-8 mt-4">
                            <h3 className="text-xl font-bold text-white mb-4">Description</h3>
                            <p className="text-lg text-zinc-400 leading-relaxed whitespace-pre-wrap mb-8">
                                {proposal.description}
                            </p>

                            <div className="mt-8 space-y-4 p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Info className="h-5 w-5 text-[#3b82f6]" />
                                    Proposal Objective
                                </h3>
                                <p className="text-zinc-400">
                                    This proposal focuses on the long-term sustainability of the Aleo ecosystem.
                                    By formalizing the governance structure, we ensure that every community
                                    member has a private, verifiable way to influence key protocol decisions.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Voting & Info */}
                    <div className="space-y-6">
                        {/* Cast Vote Card */}
                        <div className="bg-[#111111] border border-zinc-900 rounded-xl overflow-hidden">
                            <div className="p-5 border-b border-zinc-900">
                                <h3 className="font-bold text-white">Cast your vote</h3>
                            </div>
                            <div className="p-5 space-y-3">
                                <button
                                    onClick={() => setSelectedOption('for')}
                                    disabled={!isActive || userHasVoted}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all",
                                        selectedOption === 'for'
                                            ? "border-[#3b82f6] bg-[#3b82f6]/10 text-white"
                                            : "border-zinc-800 hover:border-zinc-700 text-zinc-400"
                                    )}
                                >
                                    <span className="font-medium">Approve</span>
                                    {selectedOption === 'for' && <Check className="h-4 w-4" />}
                                </button>
                                <button
                                    onClick={() => setSelectedOption('against')}
                                    disabled={!isActive || userHasVoted}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all",
                                        selectedOption === 'against'
                                            ? "border-[#3b82f6] bg-[#3b82f6]/10 text-white"
                                            : "border-zinc-800 hover:border-zinc-700 text-zinc-400"
                                    )}
                                >
                                    <span className="font-medium">Reject</span>
                                    {selectedOption === 'against' && <Check className="h-4 w-4" />}
                                </button>
                                {userHasVoted ? (
                                    <div className="pt-2 flex items-center gap-2 text-[#22c55e] text-sm font-medium">
                                        <Shield className="h-4 w-4" />
                                        You have successfully voted
                                    </div>
                                ) : (
                                    <Button
                                        onClick={handleVoteSubmit}
                                        disabled={!isActive || !selectedOption || isVoting}
                                        className="w-full h-11 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold rounded-lg mt-2"
                                    >
                                        {isVoting ? "Proving..." : "Vote"}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Results Card - Privacy-Preserving */}
                        <div className="bg-[#111111] border border-zinc-900 rounded-xl overflow-hidden">
                            <div className="p-5 border-b border-zinc-900">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    {isActive ? (
                                        <>
                                            <Lock className="h-4 w-4 text-[#3b82f6]" />
                                            Voting Results
                                        </>
                                    ) : (
                                        "Final Results"
                                    )}
                                </h3>
                            </div>
                            <div className="p-5">
                                {isActive ? (
                                    // Privacy Mode: Hide results during active voting
                                    <div className="space-y-4">
                                        <div className="p-6 rounded-xl bg-gradient-to-br from-[#3b82f6]/10 to-[#3b82f6]/5 border border-[#3b82f6]/20">
                                            <div className="flex items-start gap-3 mb-3">
                                                <Shield className="h-5 w-5 text-[#3b82f6] mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-bold text-white text-sm mb-1">Privacy Protection Active</h4>
                                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                                        Results are hidden during voting to prevent bandwagon effects.
                                                        Your vote is encrypted with zero-knowledge proofs.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-zinc-500 font-medium">Total Participants</span>
                                                <span className="text-white font-bold">{totalVotes > 0 ? `${totalVotes} votes` : 'No votes yet'}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-zinc-500 font-medium">Results Available</span>
                                                <span className="text-[#3b82f6] font-bold">After {formatDate(proposal.endTime)}</span>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-zinc-800">
                                            <p className="text-[10px] text-zinc-600 leading-relaxed">
                                                <strong className="text-zinc-500">How it works:</strong> Your vote choice is encrypted locally.
                                                Only a ZK-proof of validity is submitted on-chain. Final tallies are revealed when voting ends.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    // Results revealed after voting ends
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm font-medium">
                                                <span className="text-zinc-300">Approve</span>
                                                <span className="text-white">{yesPercentage}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                                <div className="h-full bg-white transition-all duration-1000" style={{ width: `${yesPercentage}%` }} />
                                            </div>
                                            <div className="text-[11px] text-zinc-500 font-medium">
                                                {proposal.forVotes} ALEO
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm font-medium">
                                                <span className="text-zinc-300">Reject</span>
                                                <span className="text-white">{noPercentage}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                                <div className="h-full bg-white transition-all duration-1000" style={{ width: `${noPercentage}%` }} />
                                            </div>
                                            <div className="text-[11px] text-zinc-500 font-medium">
                                                {proposal.againstVotes} ALEO
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Information Card */}
                        <div className="bg-[#111111] border border-zinc-900 rounded-xl overflow-hidden">
                            <div className="p-5 border-b border-zinc-900">
                                <h3 className="font-bold text-white">Information</h3>
                            </div>
                            <div className="p-5 space-y-4 text-[13px]">
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-500 font-medium">Voting system</span>
                                    <span className="text-zinc-300">Single choice voting</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-500 font-medium">Start date</span>
                                    <span className="text-zinc-300">{formatDate(proposal.startTime)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-500 font-medium">End date</span>
                                    <span className="text-zinc-300">{formatDate(proposal.endTime)}</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
                                    <span className="text-zinc-500 font-medium">Snapshot</span>
                                    <div className="flex items-center gap-1.5 text-[#3b82f6]">
                                        <span className="font-mono">#3,452,901</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="bg-[#0a0a0a] border border-zinc-900 text-white max-w-sm rounded-[24px]">
                    <DialogHeader className="pt-2">
                        <DialogTitle className="text-center text-xl font-bold">Confirm your vote</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-6 px-2">
                        <p className="text-center text-zinc-400 text-sm leading-relaxed">
                            Are you sure you want to vote <strong className="text-white uppercase">{selectedOption}</strong>?
                            Your choice will be cryptographically hashed and remains private.
                        </p>

                        <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                            {isVoting ? (
                                <div className="animate-spin h-6 w-6 border-2 border-[#3b82f6] border-t-transparent rounded-full" />
                            ) : (
                                <Lock className="h-6 w-6 text-[#3b82f6]" />
                            )}
                            <span className="text-sm font-bold text-zinc-300">
                                {isVoting ? "Verifying ZK Proof..." : "Privacy Active"}
                            </span>
                        </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-col gap-2 pb-2">
                        <Button
                            onClick={confirmVote}
                            disabled={isVoting}
                            className="bg-white text-black hover:bg-zinc-200 font-bold h-12 w-full rounded-xl"
                        >
                            {isVoting ? 'Submitting...' : 'Confirm'}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setShowConfirmDialog(false)}
                            disabled={isVoting}
                            className="text-zinc-400 hover:text-white font-bold h-12 w-full"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
