import Loading from "@/components/Loading/Loading";
import ProductImagesCarousel from "@/components/ProductImagesCarousel";
import ProductRating from "@/components/ProductRating";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetProductBySkuQuery } from "@/lib/redux/services/productsApi";
import { TCurrencyCode, TProduct } from "@/types";
import { TCartItem } from "@/types/TCart";
import Config from "@/utils/config";
import clsx from "clsx";
import { useEffect, useState } from "react";

const currencyCode = process.env.NEXT_PUBLIC_CURRENCY_CODE as TCurrencyCode;
const currencySymbol = Config.getCurrencySymbol(currencyCode);

const OrderItemCard = ({ item } : { item: TCartItem }) => {
    const { data: productData, isLoading: productLoading } = useGetProductBySkuQuery(item.sku, { skip: !item.sku });
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState<TProduct>({} as TProduct);

    useEffect(() => {
        if (productLoading) {
            setIsLoading(true);
            return;
        }

        if (productData && productData.data) {
            setProduct(productData.data);
        }
    }, [productLoading, productData]);

    if (isLoading) {
        return <Loading onComplete={ () => setIsLoading(false) } />;
    }

    return (
        <Card className={clsx("flex flex-col justify-between")}>
            <CardHeader>
                <div className="flex items-center justify-center px-8 w-full">
                    <ProductImagesCarousel key={String(product.id)} images={product.images} />
                </div>
            </CardHeader>
            <div>
                <CardContent>
                    <div className="flex items-center justify-center flex-col gap-4">
                        <div className="flex items-center justify-center space-x-2 text-yellow-500">
                            <ProductRating rating={3.5}/>
                        </div>
                        <div className="flex flex-col items-start justify-center w-full">
                            <div className="flex items-center justify-between w-full font-bold">
                                <p className="first-letter:uppercase">{ product.name }</p>
                                <p>{ currencySymbol } { product.price }</p>
                            </div>
                            <p className="text-sm">{ product.description }</p>
                        </div>
                        <div className="flex flex-col items-start justify-center w-full">
                            <p className="text-sm">Quantity:<span className="font-bold">{ item.quantity }</span></p>
                            <p className="text-sm">Total Amount:<span className="font-bold">{ ` ${currencySymbol} ${product.price * item.quantity}` }</span></p>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}

export default OrderItemCard;