'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { ConnectWallet } from '@/components/wallet/ConnectWallet'

const NAV_LINKS = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/proposals', label: 'Proposals' },
    { href: '/polls', label: 'Polls' },
    { href: '/how-it-works', label: 'How It Works' },
]

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="border-b border-zinc-900 sticky top-0 z-50 bg-[#000000]/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold aleo-text-gradient">
                        AleoDAO
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        {NAV_LINKS.map(link => (
                            <Link key={link.href} href={link.href} className="text-zinc-400 hover:text-white transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <ConnectWallet />
                    <button
                        className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <nav className="md:hidden border-t border-zinc-900 bg-[#000000]/95 backdrop-blur-md">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
                        {NAV_LINKS.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-3 py-3 text-zinc-400 hover:text-white hover:bg-zinc-900/50 rounded-lg transition-colors text-sm font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </nav>
            )}
        </header>
    )
}
