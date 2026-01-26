import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { WalletProvider } from '@/components/wallet/WalletProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'AleoDAO - Private DAO Governance',
    description: 'Privacy-preserving DAO governance platform built on Aleo',
    keywords: ['Aleo', 'DAO', 'Governance', 'Privacy', 'Zero-Knowledge'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <WalletProvider>
                    {children}
                    <Toaster />
                </WalletProvider>
            </body>
        </html>
    )
}
