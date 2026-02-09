'use client'

import { PROVABLE_API_URL, ALEO_NETWORK } from './config'

const API_BASE = PROVABLE_API_URL

/**
 * Fetch a mapping value from an on-chain program
 */
export async function getMappingValue(
    programId: string,
    mappingName: string,
    key: string
): Promise<string | null> {
    try {
        const url = `${API_BASE}/${ALEO_NETWORK}/program/${programId}/mapping/${mappingName}/${key}`
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) return null
        const text = await res.text()
        if (!text || text === 'null') return null
        return text
    } catch (error) {
        console.warn(`Failed to fetch mapping ${programId}/${mappingName}/${key}:`, error)
        return null
    }
}

/**
 * Get the latest block height
 */
export async function getBlockHeight(): Promise<number> {
    try {
        const url = `${API_BASE}/${ALEO_NETWORK}/block/height/latest`
        const res = await fetch(url, { cache: 'no-store' })
        return parseInt(await res.text())
    } catch {
        return 0
    }
}

/**
 * Get a transaction by ID
 */
export async function getTransaction(txId: string): Promise<any | null> {
    try {
        const url = `${API_BASE}/${ALEO_NETWORK}/transaction/${txId}`
        const res = await fetch(url)
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}

/**
 * Check if a program is deployed
 */
export async function isProgramDeployed(programId: string): Promise<boolean> {
    try {
        const url = `${API_BASE}/${ALEO_NETWORK}/program/${programId}`
        const res = await fetch(url)
        return res.ok
    } catch {
        return false
    }
}
