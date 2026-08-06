"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductVariant } from "@/types/product";

export interface CartItem {
    product: Product;
    variant: ProductVariant;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
    removeFromCart: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("sn_cart");
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error("Failed to parse cart", e);
                }
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem("sn_cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product, variant?: ProductVariant, quantity = 1) => {
        const activeVariant: ProductVariant =
            variant ||
            product.variants?.[0] || {
                id: `default-${product.id}`,
                name: "Standard Package",
                weightOrSize: "Standard",
                productId: product.id,
            };

        const targetKey = activeVariant.id;

        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex(
                (item) => item.variant.id === targetKey
            );

            if (existingIndex > -1) {
                const newCart = [...prevCart];
                // Immutable update: Copy the item object before modifying quantity
                newCart[existingIndex] = {
                    ...newCart[existingIndex],
                    quantity: newCart[existingIndex].quantity + quantity,
                };
                return newCart;
            }

            return [...prevCart, { product, variant: activeVariant, quantity }];
        });
    };

    const removeFromCart = (variantId: string) => {
        setCart((prevCart) =>
            prevCart.filter((item) => item.variant.id !== variantId)
        );
    };

    const updateQuantity = (variantId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(variantId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.variant.id === variantId) {
                    return { ...item, quantity };
                }
                return item;
            })
        );
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}