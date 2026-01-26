'use client'

import Link from 'next/link'
import { Clock, CheckCircle2, XCircle, Timer, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { calculatePercentage, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Proposal {
    id: string
    daoId: string
    daoName: string
    title: string
    description: string
    status: 'pending' | 'active' | 'succeeded' | 'failed' | 'executed'
    votingStart: number
    votingEnd: number
    yesVotes: number
    noVotes: number
    totalVotes: number
    quorum: number
    createdAt: number
}

interface ProposalCardProps {
    proposal: Proposal
}

const statusConfig = {
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
    succeeded: {
        label: 'Succeeded',
        icon: CheckCircle2,
        className: 'text-green-500 bg-green-500/10',
    },
    failed: {
        label: 'Failed',
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

    const yesPercentage = proposal.totalVotes > 0
        ? calculatePercentage(proposal.yesVotes, proposal.totalVotes)
        : 0
    const noPercentage = proposal.totalVotes > 0
        ? calculatePercentage(proposal.noVotes, proposal.totalVotes)
        : 0

    const isActive = proposal.status === 'active'
    const timeLeft = isActive ? Math.floor((proposal.votingEnd - Date.now() / 1000) / 86400) : 0

    return (
        <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="space-y-4">
                <div className="flex items-start justify-between gap-4">
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
                {proposal.totalVotes > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                                <span className="font-medium">Yes: {yesPercentage}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">No: {noPercentage}%</span>
                                <div className="h-3 w-3 rounded-full bg-red-500" />
                            </div>
                        </div>

                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="absolute left-0 h-full bg-green-500 transition-all"
                                style={{ width: `${yesPercentage}%` }}
                            />
                            <div
                                className="absolute right-0 h-full bg-red-500 transition-all"
                                style={{ width: `${noPercentage}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{proposal.totalVotes.toLocaleString()} votes cast</span>
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
                <Link href={`/proposals/${proposal.id}`}>
                    <Button variant={isActive ? 'default' : 'outline'} size="sm">
                        {isActive ? 'Vote Now' : 'View Details'}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
