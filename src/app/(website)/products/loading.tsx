export default function ProductsLoading() {
    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 space-y-6 animate-pulse">
            {/* Page Title & Subtitle Skeleton */}
            <div className="space-y-2">
                <div className="h-7 w-48 bg-slate-200 rounded-lg" />
                <div className="h-4 w-80 bg-slate-200 rounded-md" />
            </div>

            {/* Search & Filter Toolbar Skeleton */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 justify-between items-center shadow-xs">
                <div className="h-10 w-full md:w-80 bg-slate-200 rounded-xl" />
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="h-10 w-36 bg-slate-200 rounded-xl" />
                    <div className="h-10 w-36 bg-slate-200 rounded-xl" />
                </div>
            </div>

            {/* Grid Skeleton (Matches 1:1 Aspect Ratio Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3.5 shadow-2xs flex flex-col justify-between"
                    >
                        {/* Square Image Box */}
                        <div className="w-full aspect-square bg-slate-200 rounded-xl" />

                        {/* Content Lines */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center gap-2">
                                <div className="h-4 w-2/3 bg-slate-200 rounded-md" />
                                <div className="h-4 w-12 bg-slate-200 rounded-md" />
                            </div>
                            <div className="h-3 w-1/2 bg-slate-200 rounded-md" />
                            <div className="h-3 w-3/4 bg-slate-200 rounded-md" />
                        </div>

                        {/* Packaging / Button Footer */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div className="h-6 w-20 bg-slate-200 rounded-md" />
                            <div className="h-8 w-24 bg-slate-200 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}