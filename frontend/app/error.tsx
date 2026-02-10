'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Application error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
                <p className="text-zinc-400 mb-6">
                    An unexpected error occurred. Please try again or return to the homepage.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button onClick={reset} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                        Try Again
                    </Button>
                    <Button variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900" asChild>
                        <a href="/">Go Home</a>
                    </Button>
                </div>
            </div>
        </div>
    )
}
