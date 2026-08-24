import Link from "next/link";
import { MessageCircle, ArrowUpRight } from "lucide-react";

export default function WholesaleCtaBanner() {
    return (
        <section className="relative overflow-hidden bg-slate-950 border border-amber-500/20 rounded-2xl p-6 sm:p-8 text-white shadow-md">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30 text-xs font-extrabold uppercase tracking-widest">
                        Commercial Bakery Contract Supply
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                        Running a Commercial Bakery or Central Kitchen?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Get bespoke volume quotations on recurring supply contracts for cocoa powders, chocolate compounds, margarine fats, and premixes.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    <a
                        href="https://wa.me/919999999999?text=Hello%20SN%20Trading,%20I%20would%20like%20to%20inquire%20about%20commercial%20bulk%20orders."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp Trade Desk</span>
                    </a>

                    <Link
                        href="/products"
                        className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all active:scale-95"
                    >
                        <span>Explore All Materials</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}