import { ShieldCheck, Truck, Package, MessageSquare } from "lucide-react";

export default function TrustValueStrip() {
    const values = [
        {
            icon: <Package className="h-6 w-6 text-accent" />,
            title: "Bulk Commercial Packs",
            desc: "5kg, 15kg and 25kg standard factory packaging direct to units.",
        },
        {
            icon: <ShieldCheck className="h-6 w-6 text-accent" />,
            title: "Direct Factory Supply",
            desc: "100% authentic cocoa, premium compounds, and certified fats.",
        },
        {
            icon: <Truck className="h-6 w-6 text-accent" />,
            title: "Scheduled Dispatch",
            desc: "Reliable commercial distribution across regional bakeries.",
        },
        {
            icon: <MessageSquare className="h-6 w-6 text-accent" />,
            title: "Instant Wholesale Quotes",
            desc: "Direct WhatsApp support and customized contract rates.",
        },
    ];

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-badge-amber">
                        Commercial Wholesale Advantage
                    </span>
                    <h2 className="text-base font-bold text-text-main sm:text-xl">
                        Why Regional Bakeries Partner With SN Trading
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {values.map((v, i) => (
                    <div
                        key={i}
                        className="group flex flex-col justify-between rounded-2xl border border-border-subtle bg-bg-main p-5 shadow-xs transition-all duration-200 hover:border-accent hover:shadow-md"
                    >
                        <div className="space-y-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/20 bg-accent-subtle/40 transition-transform duration-200 group-hover:scale-105">
                                {v.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-text-main group-hover:text-accent transition-colors">
                                    {v.title}
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-text-muted">
                                    {v.desc}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}