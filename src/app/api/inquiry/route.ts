import { NextRequest, NextResponse } from "next/server";

interface CartItem {
    product: {
        name: string;
    };
    variant: {
        name?: string;
        weightOrSize?: string;
    };
    quantity: number;
}

// PUBLIC: Customer Inquiry Submission & WhatsApp Link Generation
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { buyerName, businessName, phone, email, notes, items } = body;

        // Basic payload validation
        if (!buyerName || typeof buyerName !== "string" || buyerName.trim() === "") {
            return NextResponse.json(
                { error: "Missing required field: buyerName" },
                { status: 400 }
            );
        }

        if (!phone || typeof phone !== "string" || phone.trim() === "") {
            return NextResponse.json(
                { error: "Missing required field: phone" },
                { status: 400 }
            );
        }

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Inquiry must contain at least one item" },
                { status: 400 }
            );
        }

        // Formatted WhatsApp payload build
        let message = `*NEW B2B WHOLESALE INQUIRY - SN TRADING*\n`;
        message += `------------------------------------\n`;
        message += `*Buyer:* ${buyerName.trim()}\n`;
        if (businessName) message += `*Business:* ${businessName.trim()}\n`;
        message += `*Phone:* ${phone.trim()}\n`;
        if (email) message += `*Email:* ${email.trim()}\n\n`;
        message += `*REQUESTED ITEMS:*\n`;

        items.forEach((item: CartItem, index: number) => {
            const productName = item.product?.name || "Product";
            const packInfo = item.variant?.weightOrSize || item.variant?.name || "Standard Pack";
            const qty = item.quantity || 1;

            message += `${index + 1}. *${productName}*\n`;
            message += `   - Pack: ${packInfo}\n`;
            message += `   - Quantity: ${qty}\n`;
        });

        if (notes && typeof notes === "string" && notes.trim() !== "") {
            message += `\n*Notes/Remarks:* ${notes.trim()}\n`;
        }

        const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        return NextResponse.json({
            success: true,
            whatsappUrl,
            message: "Inquiry processed successfully",
        });
    } catch (error) {
        console.error("Inquiry API error:", error);
        return NextResponse.json(
            { error: "Failed to process inquiry" },
            { status: 500 }
        );
    }
}