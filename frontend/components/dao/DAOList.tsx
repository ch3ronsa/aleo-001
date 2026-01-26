'use client'

import { useDAOStore } from '@/lib/store/dao-store'
import { DAOCard } from './DAOCard'

export function DAOList() {
    const { daos } = useDAOStore()

    if (daos.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No DAOs created yet. Be the first to create one!</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {daos.map((dao) => (
                <DAOCard key={dao.id} dao={dao} />
            ))}
        </div>
    )
}
