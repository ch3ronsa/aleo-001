'use client'

import { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import { EXPLORER_URL } from '@/lib/aleo/config'
import { getTransaction } from '@/lib/aleo/api'

type TxState = 'idle' | 'pending' | 'confirming' | 'confirmed' | 'failed'

interface TransactionStatusProps {
    txId: string | null
    onConfirmed?: () => void
}

export function TransactionStatus({ txId, onConfirmed }: TransactionStatusProps) {
    const [state, setState] = useState<TxState>('idle')

    useEffect(() => {
        if (!txId) {
            setState('idle')
            return
        }

        setState('confirming')

        const checkTx = async () => {
            let attempts = 0
            const maxAttempts = 30 // 30 * 2s = 60s timeout

            const interval = setInterval(async () => {
                attempts++
                const tx = await getTransaction(txId)

                if (tx) {
                    clearInterval(interval)
                    setState('confirmed')
                    onConfirmed?.()
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval)
                    setState('failed')
                }
            }, 2000)

            return () => clearInterval(interval)
        }

        checkTx()
    }, [txId, onConfirmed])

    if (state === 'idle') return null

    return (
        <div className="mt-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-3">
                {state === 'confirming' && (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                        <div>
                            <p className="text-sm font-medium text-blue-400">Processing on Aleo Network...</p>
                            <p className="text-xs text-zinc-500 mt-0.5">ZK-proof generation and verification in progress</p>
                        </div>
                    </>
                )}
                {state === 'confirmed' && (
                    <>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-500">Transaction Confirmed</p>
                            {txId && (
                                <a
                                    href={`${EXPLORER_URL}/transaction/${txId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-zinc-400 hover:text-blue-400 flex items-center gap-1 mt-0.5"
                                >
                                    View on Explorer <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </div>
                    </>
                )}
                {state === 'failed' && (
                    <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        <div>
                            <p className="text-sm font-medium text-red-500">Transaction Failed</p>
                            <p className="text-xs text-zinc-500 mt-0.5">Please try again or check your wallet</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
