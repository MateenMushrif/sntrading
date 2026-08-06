import { Loader2 } from "lucide-react";

interface LoadingProps {
    message?: string;
}

export default function Loading({ message = "Loading products..." }: LoadingProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[250px] py-12">
            <Loader2 className="w-8 h-8 text-accent animate-spin mb-3" />
            <p className="text-2xs font-semibold text-text-muted animate-pulse">{message}</p>
        </div>
    );
}