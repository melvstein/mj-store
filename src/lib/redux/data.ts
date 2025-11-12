/* import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/redux/store";
import { getProducts } from "@/lib/redux/slices/productSlice";

export const useProducts = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    const { items, loading, error } = useSelector((state: RootState) => state.products);

    return { items, loading, error };
};
 */