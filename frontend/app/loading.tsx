export default function Loading() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-500 text-sm font-medium">Loading...</p>
            </div>
        </div>
    )
}
