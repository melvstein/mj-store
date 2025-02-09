import Image from "next/image";
import type { TProduct } from "@/types";

const Products: React.FC = () => {
    const Products: TProduct[] = [
        {
            id: 1,
            tags: ["fruits"],
            name: "Apple",
            description: "A fresh and juicy red apple.",
            price: 30,
            images: [
                "/images/products/fruits/apple.png",
            ]
        },
        {
            id: 2,
            tags: ["fruits"],
            name: "Banana",
            description: "A ripe and sweet yellow banana.",
            price: 10,
            images: [
                "/images/products/fruits/banana.png",
            ]
        },
        {
            id: 3,
            tags: ["fruits"],
            name: "Orange",
            description: "A tangy and vitamin-rich orange.",
            price: 25,
            images: [
                "/images/products/fruits/orange.png"
            ],
        },
        {
            id: 4,
            tags: ["fruits"],
            name: "Mango",
            description: "A tropical mango with a rich, sweet flavor.",
            price: 50,
            images: [
                "/images/products/fruits/mango.png",
            ]
        },
        {
            id: 5,
            tags: ["fruits"],
            name: "Grapes",
            description: "A bunch of juicy and seedless grapes.",
            price: 40,
            images: [
                "/images/products/fruits/grapes.png"
            ],
        },
        {
            id: 6,
            tags: ["fruits"],
            name: "Pineapple",
            description: "A tropical pineapple with a tangy-sweet taste.",
            price: 60,
            images: [
                "/images/products/fruits/pineapple.png",
            ]
        },
        {
            id: 7,
            tags: ["fruits"],
            name: "Strawberry",
            description: "Fresh and sweet red strawberries.",
            price: 35,
            images: [
                "/images/products/fruits/strawberry.png",
            ]
        },
    ];

    return (
        <section>
            <div className="grid grid-cols-5 gap-4">
            {
                Products.map((product) => {
                    return (
                        <div key={product.id}>
                            <div>
                                {
                                    product.images.map((images) => (
                                        <Image src={images} width={500} height={500} key={product.id} alt={product.name} />
                                    ))
                                }
                            </div>
                        </div>
                    );
                })
            }
            </div>
        </section>
    );
}

export default Products;