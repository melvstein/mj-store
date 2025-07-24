"use client";

import Image from "next/image";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/bundle";
import { FcPrevious, FcNext } from "react-icons/fc";
import { useRef, useEffect } from "react";
import { NavigationOptions } from "swiper/types";

type ProductImageCarouselProps = {
  images: string[];
};

const ProductImageSlider: React.FC<ProductImageCarouselProps> = ({ images }) => {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const swiperRef = useRef<SwiperRef>(null);

    if (!images || images.length === 0) {
        images = [
            '/images/products/default.jpg',
        ];
    }

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper && prevRef.current && nextRef.current) {
            const swiper = swiperRef.current.swiper;
            const navigation = swiper.params.navigation as NavigationOptions; // ✅ Type assertion

      if (navigation) {
        navigation.prevEl = prevRef.current;
        navigation.nextEl = nextRef.current;
        swiper.navigation.init();
        swiper.navigation.update();
      }
        }
    }, []);

    return (
        <div className="relative w-full mx-auto">
        <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination]}
            pagination={{ clickable: true }}
            className="w-full select-none"
        >
            {images.map((image, index) => (
                <SwiperSlide key={index} className="flex items-center justify-center p-4">
                    <Image
                        src={image}
                        width={500}
                        height={500}
                        alt={`Product image ${index + 1}`}
                        className="z-0"
                        priority
                    />
                </SwiperSlide>
            ))}
        </Swiper>

        {/* Navigation buttons (placed outside the Swiper component) */}
        <button ref={prevRef} className="absolute top-1/2 left-2 -translate-y-1/2 z-10">
            <FcPrevious size={25} />
        </button>
        <button ref={nextRef} className="absolute top-1/2 right-2 -translate-y-1/2 z-10">
            <FcNext size={25} />
        </button>
        </div>
    );
};

export default ProductImageSlider;
