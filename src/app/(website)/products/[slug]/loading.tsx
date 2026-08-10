export default function LoadingProductDetail() {
    return (
        <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 animate-pulse space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-7 w-2/3 bg-slate-200 rounded" />
                <div className="h-3 w-1/2 bg-slate-200 rounded" />
            </div>

            {/* Main Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Aspect Square Image Frame */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="w-full aspect-square max-w-md bg-slate-200 rounded-2xl mx-auto" />
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-14 h-14 bg-slate-200 rounded-lg shrink-0" />
                        ))}
                    </div>
                </div>

                {/* Right Details Column */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-2">
                        <div className="h-4 w-40 bg-slate-200 rounded" />
                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="h-12 bg-slate-200 rounded-xl" />
                            <div className="h-12 bg-slate-200 rounded-xl" />
                        </div>
                    </div>

                    <div className="h-32 bg-slate-200 rounded-xl" />

                    <div className="flex gap-3">
                        <div className="w-24 h-10 bg-slate-200 rounded-xl" />
                        <div className="flex-1 h-10 bg-slate-200 rounded-xl" />
                    </div>
                </div>
            </div>
        </main>
    );
}