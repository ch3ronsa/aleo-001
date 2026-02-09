'use client'

import Link from 'next/link'
import { Users, FileText, Calendar, ArrowRight, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatNumber, formatDate } from '@/lib/utils'
import { DAO } from '@/lib/store/dao-store'

interface DAOCardProps {
    dao: DAO
}

export function DAOCard({ dao }: DAOCardProps) {
    return (
        <Card className="flex flex-col hover:border-[#3b82f6]/50 transition-colors bg-[#111111] border-zinc-900">
            <CardHeader>
                <CardTitle className="line-clamp-1">{dao.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                    {dao.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Members:</span>
                        <span className="font-medium">{formatNumber(dao.memberCount)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Proposals:</span>
                        <span className="font-medium">{dao.proposalCount}</span>
                    </div>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Quorum:</span>
                        <span className="font-medium">{dao.quorumPercentage}%</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Privacy:</span>
                        <span className="font-medium flex items-center gap-1 text-[#3b82f6]">
                            <Shield className="h-3 w-3" />
                            ZK-Verified
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Created {formatDate(dao.createdAt)}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                <Link href={`/dao/${dao.id}`} className="w-full">
                    <Button className="w-full gap-2">
                        View DAO
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
