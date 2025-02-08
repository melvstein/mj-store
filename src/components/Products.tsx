import Image from "next/image";
import type { Product } from "./Types";

const Products: React.FC = () => {
    const Products: Product[] = [
        {
            id: 1,
            name: "Apple",
            description: "A fresh and juicy red apple.",
            price: 30,
            images: [
                "/images/products/fruits/apple.jpg",
            ]
        },
        {
            id: 2,
            name: "Banana",
            description: "A ripe and sweet yellow banana.",
            price: 10,
            images: [
                "/images/products/fruits/banana.jpg",
            ]
        },
        {
            id: 3,
            name: "Orange",
            description: "A tangy and vitamin-rich orange.",
            price: 25,
            images: [
                "/images/products/fruits/orange.jpg"
            ],
        },
        {
            id: 4,
            name: "Mango",
            description: "A tropical mango with a rich, sweet flavor.",
            price: 50,
            images: [
                "/images/products/fruits/mango.jpg",
            ]
        },
        {
            id: 5,
            name: "Grapes",
            description: "A bunch of juicy and seedless grapes.",
            price: 40,
            images: [
                "/images/products/fruits/grapes.jpg"
            ],
        },
        {
            id: 6,
            name: "Pineapple",
            description: "A tropical pineapple with a tangy-sweet taste.",
            price: 60,
            images: [
                "/images/products/fruits/pineapple.jpg",
            ]
        },
        {
            id: 7,
            name: "Strawberry",
            description: "Fresh and sweet red strawberries.",
            price: 35,
            images: [
                "/images/products/fruits/strawberry.jpg",
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