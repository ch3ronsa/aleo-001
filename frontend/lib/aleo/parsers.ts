'use client'

/**
 * Parse an Aleo struct string into a JS object
 * Example: "{ id: 123field, creator: aleo1abc...xyz, voting_period: 100800u32 }"
 */
export function parseAleoStruct(raw: string): Record<string, string> {
    const cleaned = raw.trim().replace(/^\{/, '').replace(/\}$/, '').trim()
    const pairs: Record<string, string> = {}
    const parts = cleaned.split(',')
    for (const part of parts) {
        const colonIdx = part.indexOf(':')
        if (colonIdx === -1) continue
        const key = part.slice(0, colonIdx).trim()
        const value = part.slice(colonIdx + 1).trim()
        if (key) pairs[key] = value
    }
    return pairs
}

/**
 * Extract numeric value from Aleo typed literal
 * "100800u32" → 100800, "5000u64" → 5000, "500field" → 500
 */
export function parseAleoNumber(value: string): number {
    return parseInt(value.replace(/[a-z]+$/i, ''), 10) || 0
}

/**
 * Extract field value string (remove "field" suffix)
 */
export function parseAleoField(value: string): string {
    return value.replace(/field$/, '').trim()
}

/**
 * Clean Aleo address
 */
export function parseAleoAddress(value: string): string {
    return value.trim()
}

/**
 * Parse Aleo boolean
 */
export function parseAleoBool(value: string): boolean {
    return value.trim() === 'true'
}
