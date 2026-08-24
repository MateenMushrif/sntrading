import { ShieldCheck, Truck, Package, MessageSquare } from "lucide-react";

export default function TrustValueStrip() {
    const values = [
        {
            icon: <Package className="w-5 h-5 text-amber-500" />,
            title: "Bulk Commercial Packs",
            desc: "5kg, 15kg and 25kg standard factory packaging",
        },
        {
            icon: <ShieldCheck className="w-5 h-5 text-amber-500" />,
            title: "Direct Factory Supply",
            desc: "Authentic cocoa, compounds and baking fats",
        },
        {
            icon: <Truck className="w-5 h-5 text-amber-500" />,
            title: "Scheduled Dispatch",
            desc: "Prompt supply across regional bakery networks",
        },
        {
            icon: <MessageSquare className="w-5 h-5 text-amber-500" />,
            title: "Instant Wholesale Quotes",
            desc: "Direct trade desk support and quotation desk",
        },
    ];

    return (
        <section className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {values.map((v, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 shrink-0 mt-0.5">
                            {v.icon}
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                                {v.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                                {v.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}