// src/types/cart.ts

import { Product, ProductVariant } from "./product";

export interface CartItem {
    product: Product;
    variant?: ProductVariant; // Store the exact selected variant object
    quantity: number;
    selectedWeight?: string;  // Fallback string if variant is not selected
}

export interface CartContextType {
    cart: CartItem[];
    addToCart: (
        product: Product,
        quantity?: number,
        selectedWeight?: string,
        variant?: ProductVariant
    ) => void;
    // Track by productId AND optional variantId to handle multiple variants in cart
    removeFromCart: (productId: string, variantId?: string) => void;
    updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
    clearCart: () => void;
    totalItems: number;
}