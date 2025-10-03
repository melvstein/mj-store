"use client"

import { useEffect } from "react";
import ProductRating from "@/components/ProductRating";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/redux/store";
import { getProducts } from "@/lib/redux/slices/productSlice";
import ProductImageSlider from "@/components/ProductImageSlider";
import CartSummary from "@/components/CartSummary";
import Config from "@/utils/config";
import { TCurrencyCode } from "@/types";
import Loading from "@/components/Loading/Loading";
import Navbar from "@/components/Navbar";

const Cart: React.FC = () => {
    const currencyCode = process.env.NEXT_PUBLIC_CURRENCY_CODE as TCurrencyCode;

  return (
    <section className="w-full min-h-screen">
        <Navbar />
        <div className="pt-24 px-4">
            Cart {currencyCode}
        </div>
    </section>
  )
}

export default Cart;