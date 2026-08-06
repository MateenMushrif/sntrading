"use client";

import { useState, useEffect, useCallback } from "react";
import { productService, GetProductsParams } from "@/services/product.service";

export function useProducts(initialParams: GetProductsParams = {}) {
    const [params, setParams] = useState<GetProductsParams>(initialParams);
    const [data, setData] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await productService.getProducts(params);
            setData(res.data);
            setPagination(res.pagination);
        } catch (err: any) {
            setError(err.message || "Failed to load products");
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

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