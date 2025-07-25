"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import Image from "next/image";
import { useEffect, useState } from "react"

type ProductImageCarouselProps = {
  images: string[];
};

const ProductImagesCarousel = ({ images }: ProductImageCarouselProps) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) {
        return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    return (
        <div className="mx-auto max-w-xs">
        <Carousel setApi={setApi} className="w-full border rounded-lg">
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem 
                        key={`${image}-${index}`}
                        className="flex items-center justify-center aspect-square"
                    >
                        {
                            <Image
                                src={image} 
                                alt={`Product Image ${index + 1}`} 
                                width={300} 
                                height={300} 
                                className="object-cover w-full h-full rounded-lg"
                            />
                        }
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
        <div className="text-muted-foreground py-2 text-center text-sm">
            Slide {current} of {count}
        </div>
        </div>
    )
}

export default ProductImagesCarousel;