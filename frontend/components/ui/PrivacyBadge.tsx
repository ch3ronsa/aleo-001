'use client'

import { Lock, Shield, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PrivacyBadgeProps {
    variant?: 'default' | 'large' | 'compact'
    className?: string
}

export function PrivacyBadge({ variant = 'default', className }: PrivacyBadgeProps) {
    if (variant === 'compact') {
        return (
            <div className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full",
                "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
                "text-xs font-medium",
                className
            )}>
                <Lock className="h-3 w-3" />
                Private
            </div>
        )
    }

    if (variant === 'large') {
        return (
            <div className={cn(
                "flex items-center gap-3 p-4 rounded-xl",
                "bg-emerald-500/5 border border-emerald-500/20",
                className
            )}>
                <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Shield className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="space-y-1">
                    <h4 className="font-semibold text-emerald-400 text-sm">🔒 Private Vote</h4>
                    <p className="text-xs text-zinc-400">
                        Your vote is encrypted with zero-knowledge proofs
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
            "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
            "text-xs font-semibold",
            className
        )}>
            <Lock className="h-3.5 w-3.5" />
            🔒 Private Vote
        </div>
    )
}

interface PrivacyInfoCardProps {
    className?: string
}

export function PrivacyInfoCard({ className }: PrivacyInfoCardProps) {
    const features = [
        {
            icon: EyeOff,
            title: 'Hidden Vote Choice',
            description: 'Your vote (For/Against/Abstain) is never revealed'
        },
        {
            icon: Lock,
            title: 'Token Balance Private',
            description: 'Voting power verified without exposing balance'
        },
        {
            icon: Shield,
            title: 'ZK-Proof Protection',
            description: 'Cryptographic guarantee of privacy'
        },
        {
            icon: CheckCircle,
            title: 'Verifiable Results',
            description: 'Final tally is publicly verifiable'
        }
    ]

    return (
        <div className={cn(
            "p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800",
            className
        )}>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                    <Shield className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Privacy Guarantees</h3>
                    <p className="text-xs text-zinc-500">Powered by Aleo Zero-Knowledge Proofs</p>
                </div>
            </div>

            <div className="grid gap-3">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50"
                    >
                        <feature.icon className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-medium text-zinc-200">{feature.title}</h4>
                            <p className="text-xs text-zinc-500">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

interface VoteReceiptProps {
    transactionId?: string
    choice?: string
    timestamp?: Date
    className?: string
}

export function VoteReceipt({ transactionId, choice, timestamp, className }: VoteReceiptProps) {
    return (
        <div className={cn(
            "p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20",
            className
        )}>
            <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span className="font-bold text-emerald-400">Vote Submitted Successfully</span>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-zinc-400">
                    <span>Status</span>
                    <span className="text-emerald-400 font-medium">Confirmed ✓</span>
                </div>
                {transactionId && (
                    <div className="flex justify-between text-zinc-400">
                        <span>Transaction</span>
                        <span className="font-mono text-xs text-zinc-300">
                            {transactionId.slice(0, 8)}...{transactionId.slice(-6)}
                        </span>
                    </div>
                )}
                <div className="flex justify-between text-zinc-400">
                    <span>Vote Choice</span>
                    <span className="text-zinc-300 flex items-center gap-1.5">
                        <Lock className="h-3 w-3 text-emerald-400" />
                        <span className="italic">Hidden (Private)</span>
                    </span>
                </div>
                {timestamp && (
                    <div className="flex justify-between text-zinc-400">
                        <span>Timestamp</span>
                        <span className="text-zinc-300">{timestamp.toLocaleString()}</span>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-500/10">
                <p className="text-xs text-zinc-500 text-center">
                    🔐 Your vote is recorded on-chain but your choice remains private
                </p>
            </div>
        </div>
    )
}
