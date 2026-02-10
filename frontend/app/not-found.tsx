import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                    <FileQuestion className="h-8 w-8 text-[#3b82f6]" />
                </div>
                <h1 className="text-6xl font-bold text-white mb-2">404</h1>
                <h2 className="text-xl font-semibold text-zinc-300 mb-3">Page Not Found</h2>
                <p className="text-zinc-500 mb-6">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white" asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        </div>
    )
}
