import React from "react";
import { ShieldCheck, Truck, Package, MessageSquare } from "lucide-react";

export default function TrustValueStrip() {
    const values = [
        {
            icon: Package,
            title: "Bulk Commercial Packs",
            desc: "5kg, 15kg & 25kg standard factory packaging direct to units.",
        },
        {
            icon: ShieldCheck,
            title: "Direct Factory Supply",
            desc: "100% authentic cocoa, premium compounds, and certified fats.",
        },
        {
            icon: Truck,
            title: "Scheduled Dispatch",
            desc: "Reliable commercial distribution across regional bakeries.",
        },
        {
            icon: MessageSquare,
            title: "Instant Wholesale Quotes",
            desc: "Direct WhatsApp support and customized contract rates.",
        },
    ];

    return (
        <section className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2.5 sm:pb-3">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-badge-amber">
                        Commercial Wholesale Advantage
                    </span>
                    <h2 className="text-sm sm:text-base md:text-lg font-bold text-text-main">
                        Why Regional Bakeries Partner With SN Trading
                    </h2>
                </div>
            </div>

            {/* 2x2 Grid on Mobile/Tablet, 4-column horizontal cards on Desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
                {values.map((v, i) => {
                    const Icon = v.icon;
                    return (
                        <div
                            key={i}
                            className="group flex flex-col lg:flex-row items-start gap-2.5 sm:gap-3.5 rounded-xl sm:rounded-2xl border border-border-subtle bg-bg-main p-3 sm:p-4 lg:p-5 shadow-xs transition-all duration-200 hover:border-accent hover:shadow-md"
                        >
                            <div className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent-subtle/40 text-accent transition-transform duration-200 group-hover:scale-105">
                                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div className="space-y-1 min-w-0 flex-1">
                                <h3 className="text-xs sm:text-sm font-bold text-text-main group-hover:text-accent transition-colors leading-snug">
                                    {v.title}
                                </h3>
                                <p className="text-xs leading-relaxed text-text-muted">
                                    {v.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}