"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { productService, GetProductsParams } from "@/services/product.service";
import { Product } from "@/types/product";

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export function useProducts(initialParams: GetProductsParams = {}) {
    const [params, setParams] = useState<GetProductsParams>(initialParams);
    const [data, setData] = useState<Product[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Track request sequence to prevent out-of-order race conditions
    const requestCountRef = useRef(0);

    // Sync state during render when initialParams change from URL searchParams
    const serializedInitial = JSON.stringify(initialParams);
    const [prevInitial, setPrevInitial] = useState(serializedInitial);

    if (serializedInitial !== prevInitial) {
        setPrevInitial(serializedInitial);
        setParams(initialParams);
        setLoading(true); // ✅ Set loading synchronously during render pass when params change
    }

    // Track previous params to trigger loading state synchronously on setParams calls
    const serializedParams = JSON.stringify(params);
    const [prevParams, setPrevParams] = useState(serializedParams);

    if (serializedParams !== prevParams) {
        setPrevParams(serializedParams);
        setLoading(true); // ✅ Set loading synchronously during render pass when params change
    }

    // Manual refetch function for UI actions (e.g. pull-to-refresh or retry buttons)
    const loadProducts = useCallback(async () => {
        const currentRequest = ++requestCountRef.current;
        setLoading(true);
        setError(null);

        try {
            const res = await productService.getProducts(params);
            if (currentRequest === requestCountRef.current) {
                setData(res.data || []);
                setPagination(res.pagination || null);
            }
        } catch (err: unknown) {
            if (currentRequest === requestCountRef.current) {
                const message = err instanceof Error ? err.message : "Failed to load products";
                setError(message);
            }
        } finally {
            if (currentRequest === requestCountRef.current) {
                setLoading(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serializedParams]);

    useEffect(() => {
        let isSubscribed = true;
        const currentRequest = ++requestCountRef.current;

        productService
            .getProducts(JSON.parse(serializedParams))
            .then((res) => {
                if (isSubscribed && currentRequest === requestCountRef.current) {
                    setData(res.data || []);
                    setPagination(res.pagination || null);
                    setError(null);
                }
            })
            .catch((err: unknown) => {
                if (isSubscribed && currentRequest === requestCountRef.current) {
                    const message = err instanceof Error ? err.message : "Failed to load products";
                    setError(message);
                }
            })
            .finally(() => {
                if (isSubscribed && currentRequest === requestCountRef.current) {
                    setLoading(false);
                }
            });

        return () => {
            isSubscribed = false;
        };
    }, [serializedParams]);

    return {
        products: data,
        pagination,
        loading,
        error,
        params,
        setParams,
        refetch: loadProducts,
    };
}