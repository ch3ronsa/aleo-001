'use client'

import Link from 'next/link'
import { Clock, CheckCircle2, XCircle, Timer, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { calculatePercentage, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Proposal, ProposalStatus } from '@/lib/store/proposal-store'

interface ProposalWithDAO extends Proposal {
    daoName: string
}

interface ProposalCardProps {
    proposal: ProposalWithDAO
}

const statusConfig: Record<ProposalStatus, { label: string; icon: typeof Clock; className: string }> = {
    pending: {
        label: 'Pending',
        icon: Clock,
        className: 'text-muted-foreground bg-muted',
    },
    active: {
        label: 'Active',
        icon: Timer,
        className: 'text-primary bg-primary/10',
    },
    passed: {
        label: 'Passed',
        icon: CheckCircle2,
        className: 'text-green-500 bg-green-500/10',
    },
    rejected: {
        label: 'Rejected',
        icon: XCircle,
        className: 'text-red-500 bg-red-500/10',
    },
    executed: {
        label: 'Executed',
        icon: TrendingUp,
        className: 'text-blue-500 bg-blue-500/10',
    },
}

export function ProposalCard({ proposal }: ProposalCardProps) {
    const status = statusConfig[proposal.status]
    const StatusIcon = status.icon

    const totalVotePower = proposal.forVotes + proposal.againstVotes
    const forPercentage = totalVotePower > 0
        ? calculatePercentage(proposal.forVotes, totalVotePower)
        : 0
    const againstPercentage = totalVotePower > 0
        ? calculatePercentage(proposal.againstVotes, totalVotePower)
        : 0

    const isActive = proposal.status === 'active'
    const timeLeft = isActive ? Math.floor((proposal.endTime - Date.now()) / (86400 * 1000)) : 0

    return (
        <Card className="hover:border-[#3b82f6]/50 transition-colors bg-[#111111] border-zinc-900">
            <CardHeader className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{proposal.daoName}</span>
                            <span className="text-muted-foreground">•</span>
                            <div className={cn(
                                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                                status.className
                            )}>
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold">{proposal.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {proposal.description}
                        </p>
                    </div>
                </div>

                {/* Voting Progress */}
                {totalVotePower > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                                <span className="font-medium">For: {forPercentage}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Against: {againstPercentage}%</span>
                                <div className="h-3 w-3 rounded-full bg-red-500" />
                            </div>
                        </div>

                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="absolute left-0 h-full bg-green-500 transition-all"
                                style={{ width: `${forPercentage}%` }}
                            />
                            <div
                                className="absolute right-0 h-full bg-red-500 transition-all"
                                style={{ width: `${againstPercentage}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{proposal.totalVoters} voters</span>
                            {isActive && timeLeft > 0 && (
                                <span>{timeLeft} days left</span>
                            )}
                        </div>
                    </div>
                )}
            </CardHeader>

            <CardFooter className="flex items-center justify-between border-t bg-muted/50 py-3">
                <span className="text-xs text-muted-foreground">
                    Created {formatDate(proposal.createdAt)}
                </span>
                <Link href={`/vote/${proposal.id}`}>
                    <Button variant={isActive ? 'default' : 'outline'} size="sm">
                        {isActive ? 'Vote Now' : 'View Details'}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
