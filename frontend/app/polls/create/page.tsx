'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, X, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/Header'
import { useToast } from '@/components/ui/use-toast'
import { usePollStore } from '@/lib/store/poll-store'
import { useDAOStore } from '@/lib/store/dao-store'
import { useWallet } from '@/lib/aleo/wallet'

export default function CreatePollPage() {
    const router = useRouter()
    const { toast } = useToast()
    const { isConnected, account } = useWallet()
    const { createPoll } = usePollStore()
    const { daos } = useDAOStore()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [selectedDAO, setSelectedDAO] = useState(daos[0]?.id || '')
    const [options, setOptions] = useState(['', ''])
    const [daysUntilDeadline, setDaysUntilDeadline] = useState(7)
    const [isPrivate, setIsPrivate] = useState(true)
    const [isCreating, setIsCreating] = useState(false)

    const addOption = () => {
        if (options.length < 10) {
            setOptions([...options, ''])
        }
    }

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index))
        }
    }

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isConnected || !account) {
            toast({
                title: 'Connect Wallet',
                description: 'Please connect your wallet to create a poll.',
                variant: 'destructive',
            })
            return
        }

        if (!title || !description || !selectedDAO) {
            toast({
                title: 'Missing Information',
                description: 'Please fill in all required fields.',
                variant: 'destructive',
            })
            return
        }

        const validOptions = options.filter(opt => opt.trim() !== '')
        if (validOptions.length < 2) {
            toast({
                title: 'Invalid Options',
                description: 'Please provide at least 2 poll options.',
                variant: 'destructive',
            })
            return
        }

        setIsCreating(true)

        try {
            const deadline = Date.now() + (daysUntilDeadline * 24 * 60 * 60 * 1000)

            const poll = createPoll({
                daoId: selectedDAO,
                title,
                description,
                options: validOptions.map((text, i) => ({
                    id: `opt_${Date.now()}_${i}`,
                    text,
                    votes: 0,
                })),
                creator: account.address().to_string(),
                deadline,
                isActive: true,
                isPrivate,
            })

            toast({
                title: 'Poll Created!',
                description: 'Your private poll has been created successfully.',
            })

            router.push(`/polls/${poll.id}`)
        } catch (error) {
            console.error('Failed to create poll:', error)
            toast({
                title: 'Error',
                description: 'Failed to create poll. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#000000] text-white">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <Link href="/polls" className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Polls
                </Link>

                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-2xl">Create Private Poll</CardTitle>
                        <CardDescription>
                            Create a multi-choice poll with ZK-proof privacy. Votes are encrypted and anonymous.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* DAO Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="dao">DAO</Label>
                                <select
                                    id="dao"
                                    value={selectedDAO}
                                    onChange={(e) => setSelectedDAO(e.target.value)}
                                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-[#a855f7]"
                                    required
                                >
                                    {daos.map(dao => (
                                        <option key={dao.id} value={dao.id}>{dao.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Poll Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="What should we prioritize next?"
                                    className="bg-zinc-800 border-zinc-700"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Provide context for your poll..."
                                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-[#a855f7] min-h-[100px]"
                                    required
                                />
                            </div>

                            {/* Options */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Poll Options</Label>
                                    <Button
                                        type="button"
                                        onClick={addOption}
                                        disabled={options.length >= 10}
                                        variant="outline"
                                        size="sm"
                                        className="border-zinc-700"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Option
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    {options.map((option, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={option}
                                                onChange={(e) => updateOption(index, e.target.value)}
                                                placeholder={`Option ${index + 1}`}
                                                className="bg-zinc-800 border-zinc-700"
                                                required
                                            />
                                            {options.length > 2 && (
                                                <Button
                                                    type="button"
                                                    onClick={() => removeOption(index)}
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-zinc-500 hover:text-red-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-zinc-500">
                                    Minimum 2 options, maximum 10 options
                                </p>
                            </div>

                            {/* Deadline */}
                            <div className="space-y-2">
                                <Label htmlFor="deadline">Voting Duration (days)</Label>
                                <Input
                                    id="deadline"
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={daysUntilDeadline}
                                    onChange={(e) => setDaysUntilDeadline(parseInt(e.target.value))}
                                    className="bg-zinc-800 border-zinc-700"
                                    required
                                />
                            </div>

                            {/* Privacy Toggle */}
                            <div className="flex items-center justify-between p-4 bg-[#a855f7]/10 border border-[#a855f7]/20 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-[#a855f7]" />
                                    <div>
                                        <p className="font-semibold">Private Poll</p>
                                        <p className="text-sm text-zinc-400">Votes are encrypted with ZK-proofs</p>
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                    className="h-5 w-5"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="flex-1 border-zinc-700"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-1 bg-[#a855f7] hover:bg-[#9333ea]"
                                >
                                    {isCreating ? 'Creating...' : 'Create Poll'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
