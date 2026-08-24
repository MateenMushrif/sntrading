import Link from "next/link";
import { MessageCircle, ArrowRight, Sparkles } from "lucide-react";

export default function WholesaleCtaBanner() {
    return (
        <section className="relative overflow-hidden rounded-2xl border-2 border-accent/30 bg-bg-main p-6 shadow-md sm:p-8">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                <div className="max-w-2xl space-y-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-subtle px-2.5 py-0.5 text-xs font-bold text-primary">
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                        <span>Contract Commercial Supply</span>
                    </div>

                    <h3 className="text-xl font-extrabold tracking-tight text-text-main sm:text-2xl">
                        Running a Commercial Bakery or Central Kitchen?
                    </h3>

                    <p className="text-xs text-text-muted sm:text-sm leading-relaxed">
                        Get direct factory volume pricing and customized delivery schedules on recurring orders of cocoa powders, chocolate slabs, fats, and premixes.
                    </p>
                </div>

                <div className="flex flex-col w-full sm:w-auto sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    <a
                        href="https://wa.me/919999999999?text=Hello%20SN%20Trading,%20I%20would%20like%20to%20inquire%20about%20commercial%20bulk%20orders."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-accent shadow-sm transition-all duration-150 active:scale-95 hover:bg-primary-hover hover:shadow-md"
                    >
                        <MessageCircle className="h-4 w-4" />
                        <span>WhatsApp Trade Desk</span>
                    </a>

                    <Link
                        href="/products"
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-border-subtle bg-bg-off px-5 py-3 text-xs font-bold text-text-main transition-all duration-150 active:scale-95 hover:border-accent hover:bg-bg-main hover:text-accent"
                    >
                        <span>Browse Ingredients</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}