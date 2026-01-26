'use client'

import Link from 'next/link'
import { ConnectWallet } from '@/components/wallet/ConnectWallet'

export function Header() {
    return (
        <header className="border-b sticky top-0 z-50 bg-[#000000]/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold aleo-text-gradient">
                        AleoDAO
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <Link href="/proposals" className="text-zinc-400 hover:text-white transition-colors">
                            Proposals
                        </Link>
                        <Link href="/how-it-works" className="text-zinc-400 hover:text-white transition-colors">
                            How It Works
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center">
                    <ConnectWallet />
                </div>
            </div>
        </header>
    )
}
