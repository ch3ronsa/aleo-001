'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    label?: string
}

export function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-10 w-10 border-3'
    }

    return (
        <div className={cn("flex flex-col items-center gap-3", className)}>
            <div
                className={cn(
                    "animate-spin rounded-full border-zinc-700 border-t-blue-500",
                    sizeClasses[size]
                )}
            />
            {label && (
                <span className="text-sm text-zinc-400 animate-pulse">{label}</span>
            )}
        </div>
    )
}

interface TransactionLoadingProps {
    step?: 'signing' | 'proving' | 'submitting' | 'confirming'
    className?: string
}

export function TransactionLoading({ step = 'proving', className }: TransactionLoadingProps) {
    const steps = [
        { id: 'signing', label: 'Signing Transaction' },
        { id: 'proving', label: 'Generating ZK Proof' },
        { id: 'submitting', label: 'Submitting to Network' },
        { id: 'confirming', label: 'Waiting for Confirmation' }
    ]

    const currentIndex = steps.findIndex(s => s.id === step)

    return (
        <div className={cn("p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800", className)}>
            <div className="flex justify-center mb-6">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-zinc-800 border-t-blue-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl">🔐</span>
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-bold text-white text-center mb-2">
                {steps[currentIndex]?.label || 'Processing'}
            </h3>
            <p className="text-sm text-zinc-500 text-center mb-6">
                Please wait while we process your transaction
            </p>

            <div className="space-y-2">
                {steps.map((s, index) => (
                    <div
                        key={s.id}
                        className={cn(
                            "flex items-center gap-3 p-2 rounded-lg transition-all",
                            index < currentIndex && "text-emerald-400",
                            index === currentIndex && "text-blue-400 bg-blue-500/10",
                            index > currentIndex && "text-zinc-600"
                        )}
                    >
                        <div className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold",
                            index < currentIndex && "bg-emerald-500/20",
                            index === currentIndex && "bg-blue-500/20 animate-pulse",
                            index > currentIndex && "bg-zinc-800"
                        )}>
                            {index < currentIndex ? '✓' : index + 1}
                        </div>
                        <span className="text-sm font-medium">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

interface SkeletonProps {
    className?: string
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div className={cn(
            "animate-pulse bg-zinc-800 rounded-lg",
            className
        )} />
    )
}

export function CardSkeleton() {
    return (
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </div>
        </div>
    )
}

export function DAOListSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
                <CardSkeleton key={i} />
            ))}
        </div>
    )
}

export function ProposalListSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex items-start justify-between mb-3">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-2 flex-1 rounded-full" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                </div>
            ))}
        </div>
    )
}
