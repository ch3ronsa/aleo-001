'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, BarChart3, Lock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/Header'
import { usePollStore } from '@/lib/store/poll-store'
import { useDAOStore } from '@/lib/store/dao-store'
import { formatDate, calculatePercentage } from '@/lib/utils'

export default function PollsPage() {
    const { polls, getActivePolls } = usePollStore()
    const { getDAO } = useDAOStore()
    const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('active')

    const filteredPolls = polls.filter(poll => {
        if (filter === 'active') return poll.isActive && poll.deadline > Date.now()
        if (filter === 'ended') return !poll.isActive || poll.deadline < Date.now()
        return true
    })

    return (
        <div className="min-h-screen bg-[#000000] text-white">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white mb-4 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Private Polls & Surveys</h1>
                            <p className="text-zinc-400 text-lg">
                                Multi-choice polls with ZK-proof privacy. Your vote is encrypted and anonymous.
                            </p>
                        </div>

                        <Link href="/polls/create">
                            <Button className="bg-[#a855f7] hover:bg-[#9333ea]">
                                Create Poll
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 border-b border-zinc-800">
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 font-semibold transition-colors border-b-2 ${filter === 'active'
                                ? 'border-[#a855f7] text-white'
                                : 'border-transparent text-zinc-500 hover:text-white'
                            }`}
                    >
                        Active ({polls.filter(p => p.isActive && p.deadline > Date.now()).length})
                    </button>
                    <button
                        onClick={() => setFilter('ended')}
                        className={`px-4 py-2 font-semibold transition-colors border-b-2 ${filter === 'ended'
                                ? 'border-[#a855f7] text-white'
                                : 'border-transparent text-zinc-500 hover:text-white'
                            }`}
                    >
                        Ended ({polls.filter(p => !p.isActive || p.deadline < Date.now()).length})
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 font-semibold transition-colors border-b-2 ${filter === 'all'
                                ? 'border-[#a855f7] text-white'
                                : 'border-transparent text-zinc-500 hover:text-white'
                            }`}
                    >
                        All ({polls.length})
                    </button>
                </div>

                {/* Polls Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {filteredPolls.map(poll => {
                        const dao = getDAO(poll.daoId)
                        const isActive = poll.isActive && poll.deadline > Date.now()
                        const timeLeft = poll.deadline - Date.now()
                        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
                        const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

                        return (
                            <Link key={poll.id} href={`/polls/${poll.id}`}>
                                <Card className="bg-zinc-900/50 border-zinc-800 hover:border-[#a855f7]/50 transition-all cursor-pointer h-full">
                                    <CardHeader>
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {poll.isPrivate && (
                                                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#a855f7]/10 border border-[#a855f7]/20">
                                                        <Lock className="h-3 w-3 text-[#a855f7]" />
                                                        <span className="text-xs text-[#a855f7] font-semibold">Private</span>
                                                    </div>
                                                )}
                                                {isActive ? (
                                                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20">
                                                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                                        <span className="text-xs text-green-500 font-semibold">Active</span>
                                                    </div>
                                                ) : (
                                                    <div className="px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700">
                                                        <span className="text-xs text-zinc-400 font-semibold">Ended</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <CardTitle className="text-xl">{poll.title}</CardTitle>
                                        <CardDescription className="text-zinc-400 line-clamp-2">
                                            {poll.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-3">
                                            {/* Poll Stats */}
                                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    <span>{poll.totalVotes} votes</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <BarChart3 className="h-4 w-4" />
                                                    <span>{poll.options.length} options</span>
                                                </div>
                                            </div>

                                            {/* Time Remaining */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-zinc-500" />
                                                {isActive ? (
                                                    <span className="text-zinc-400">
                                                        {daysLeft > 0 ? `${daysLeft}d ${hoursLeft}h left` : `${hoursLeft}h left`}
                                                    </span>
                                                ) : (
                                                    <span className="text-zinc-500">Ended {formatDate(poll.deadline)}</span>
                                                )}
                                            </div>

                                            {/* DAO Badge */}
                                            {dao && (
                                                <div className="pt-2 border-t border-zinc-800">
                                                    <span className="text-xs text-zinc-500">
                                                        {dao.name}
                                                    </span>
                                                </div>
                                            )}

                                            {/* View Button */}
                                            <div className="flex items-center justify-between pt-2">
                                                <span className="text-sm text-[#a855f7] font-semibold inline-flex items-center">
                                                    {isActive ? 'Vote Now' : 'View Results'}
                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>

                {/* Empty State */}
                {filteredPolls.length === 0 && (
                    <div className="text-center py-16">
                        <BarChart3 className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No polls found</h3>
                        <p className="text-zinc-500 mb-6">
                            {filter === 'active' && 'There are no active polls at the moment.'}
                            {filter === 'ended' && 'No polls have ended yet.'}
                            {filter === 'all' && 'No polls have been created yet.'}
                        </p>
                        <Link href="/polls/create">
                            <Button className="bg-[#a855f7] hover:bg-[#9333ea]">
                                Create First Poll
                            </Button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    )
}
