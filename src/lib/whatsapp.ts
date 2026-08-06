import { CartItem } from "@/types/cart";

const WHATSAPP_PHONE_NUMBER = "919000000000"; // Replace with SN Trading's business number

export function generateWhatsAppLink(cart: CartItem[], notes?: string): string {
    let message = `*Hello SN Trading,*\n\nI would like to inquire about bulk wholesale pricing for the following items:\n\n`;

    cart.forEach((item, index) => {
        const weightInfo = item.selectedWeight ? ` (${item.selectedWeight})` : "";
        message += `${index + 1}. *${item.product.name}* ${weightInfo}\n   - Quantity: ${item.quantity}\n   - Brand: ${item.product.brand}\n\n`;
    });

    if (notes) {
        message += `*Additional Notes:* ${notes}\n\n`;
    }

    message += `Please provide quotation and delivery availability. Thank you!`;

    return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}