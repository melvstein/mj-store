import { TCurrencyCode, TProduct } from '@/types'
import Config from '@/utils/config';
import React from 'react'

const CartSummary = ({ product }: {product: TProduct}) => {
    const currencyCode: TCurrencyCode = process.env.NEXT_PUBLIC_CURRENCY_CODE as TCurrencyCode;
    const productName: string = product.name ?? "N/A";
    const price: number = product.price ?? 0;
    const stock: number = product.stock ?? 0;
    const quantity: number = product.stock ?? 0;

    return (
        <section className="border rounded w-full">
            <div className="flex items-center justify-between p-4">
                <div>
                    <p>{ productName }</p>
                    <p className="text-sm">Stock: { stock }</p>
                </div>
                <div className="flex items-center justify-center flex-col">
                    <p>{ quantity } x { price }</p>
                    <p className="text-sm">Total: {Config.getCurrencySymbol(currencyCode)} { quantity * price }</p>
                </div>
            </div>
        </section>
    )
}

export default CartSummary