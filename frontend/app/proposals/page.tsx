'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProposalList } from '@/components/proposals/ProposalList'

import { Header } from '@/components/layout/Header'

export default function ProposalsPage() {
    return (
        <div className="min-h-screen bg-[#000000] text-zinc-100 font-sans">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Governance Proposals</h1>
                            <p className="text-muted-foreground">
                                View and cast private votes on active proposals
                            </p>
                        </div>
                        {/* 
                           Note: Proposal creation is typically done from within a specific DAO page.
                           We hide the global create button to simplify the flow and direct users to specific DAOs.
                         */}
                    </div>
                </div>

                {/* Proposal List */}
                <ProposalList />
            </div>
        </div>
    )
}
