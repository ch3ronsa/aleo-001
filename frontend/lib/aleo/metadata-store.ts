'use client'

/**
 * Off-chain metadata store for human-readable DAO and Proposal data.
 *
 * Aleo stores only hashes on-chain (title_hash, description_hash).
 * This module persists the hash→text mappings in localStorage.
 * In production, this should be replaced with IPFS or a backend service.
 */

const METADATA_KEY = 'aleodao-metadata'

export interface DAOMetadata {
    daoId: string
    name: string
    description: string
    nameHash: string
    createdAt: number
}

export interface ProposalMetadata {
    proposalId: string
    daoId: string
    title: string
    description: string
    imageUrl?: string
    titleHash: string
    descriptionHash: string
    createdAt: number
}

interface MetadataDB {
    daos: Record<string, DAOMetadata>
    proposals: Record<string, ProposalMetadata>
    knownDAOIds: string[]
    knownProposalIds: Record<string, string[]> // daoId → proposalId[]
}

function getDB(): MetadataDB {
    if (typeof window === 'undefined') return { daos: {}, proposals: {}, knownDAOIds: [], knownProposalIds: {} }
    const raw = localStorage.getItem(METADATA_KEY)
    return raw ? JSON.parse(raw) : { daos: {}, proposals: {}, knownDAOIds: [], knownProposalIds: {} }
}

function saveDB(db: MetadataDB) {
    if (typeof window === 'undefined') return
    localStorage.setItem(METADATA_KEY, JSON.stringify(db))
}

// DAO Metadata
export function storeDAOMetadata(meta: DAOMetadata) {
    const db = getDB()
    db.daos[meta.daoId] = meta
    if (!db.knownDAOIds.includes(meta.daoId)) {
        db.knownDAOIds.push(meta.daoId)
    }
    saveDB(db)
}

export function getDAOMetadata(daoId: string): DAOMetadata | null {
    return getDB().daos[daoId] || null
}

export function getAllDAOMetadata(): DAOMetadata[] {
    return Object.values(getDB().daos)
}

export function getKnownDAOIds(): string[] {
    return getDB().knownDAOIds
}

// Proposal Metadata
export function storeProposalMetadata(meta: ProposalMetadata) {
    const db = getDB()
    db.proposals[meta.proposalId] = meta
    if (!db.knownProposalIds[meta.daoId]) {
        db.knownProposalIds[meta.daoId] = []
    }
    if (!db.knownProposalIds[meta.daoId].includes(meta.proposalId)) {
        db.knownProposalIds[meta.daoId].push(meta.proposalId)
    }
    saveDB(db)
}

export function getProposalMetadata(proposalId: string): ProposalMetadata | null {
    return getDB().proposals[proposalId] || null
}

export function getDAOProposalIds(daoId: string): string[] {
    return getDB().knownProposalIds[daoId] || []
}

export function getAllProposalMetadata(): ProposalMetadata[] {
    return Object.values(getDB().proposals)
}

// Register a DAO ID that was discovered (e.g., via URL)
export function registerKnownDAOId(daoId: string) {
    const db = getDB()
    if (!db.knownDAOIds.includes(daoId)) {
        db.knownDAOIds.push(daoId)
        saveDB(db)
    }
}
