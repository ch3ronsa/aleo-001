import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatAddress(address: string, chars = 4): string {
    if (!address) return ''
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function formatNumber(num: number | string): string {
    const n = typeof num === 'string' ? parseFloat(num) : num
    return new Intl.NumberFormat('en-US').format(n)
}

export function formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export function calculatePercentage(part: number, total: number): number {
    if (total === 0) return 0
    return Math.round((part / total) * 100)
}
