export default function ProductGridSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <div className="h-7 w-48 bg-slate-200 rounded-lg" />
                <div className="h-4 w-80 bg-slate-200 rounded-md" />
            </div>

            {/* 8 Card Grid Skeleton (Matches ProductCard.tsx 1:1) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl border border-gray-200 shadow-xs flex flex-col h-full overflow-hidden"
                    >
                        {/* 16:9 Aspect Video Header Image Frame */}
                        <div className="relative w-full aspect-video bg-slate-200 border-b border-gray-100 shrink-0">
                            {/* Top Left Badge Placeholder */}
                            <div className="absolute top-2 left-2 h-4 w-20 bg-slate-300 rounded" />
                            {/* Bottom Right Floating Circular Button Placeholder */}
                            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-slate-300" />
                        </div>

                        {/* Card Body Matching ProductCard Padding */}
                        <div className="p-3 flex flex-col flex-grow justify-between w-full space-y-2">
                            <div>
                                {/* Category Tag Line */}
                                <div className="h-3 w-16 bg-slate-200 rounded mb-1.5" />
                                {/* Product Title Line */}
                                <div className="h-4 w-5/6 bg-slate-200 rounded mb-1.5" />
                                {/* Short Description Lines */}
                                <div className="space-y-1">
                                    <div className="h-3 w-full bg-slate-200 rounded" />
                                    <div className="h-3 w-2/3 bg-slate-200 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}