"use client"

import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useMemo, useState } from "react"
import { TProduct } from "@/types"
import { useGetProductsQuery } from "@/lib/redux/services/productsApi"

export const description = "Products chart showing enabled and disabled products"

const ProductsChart = () => {
    const { data: response, error, isLoading } = useGetProductsQuery();
    const [products, setProducts] = useState<TProduct[]>([]);
    const [enabledCount, setEnabledCount] = useState(0);
    const [disabledCount, setDisabledCount] = useState(0);

    useEffect(() => {
        if (response?.data?.content) {
            setProducts(response.data.content);
            setEnabledCount(products.filter((product: TProduct) => product.isActive).length);
            setDisabledCount(products.filter((product: TProduct) => !product.isActive).length);
        }
    }, [response, products]);

    const chartData = [
        { browser: "enabled", products: enabledCount, fill: "hsl(var(--primary))" },
        { browser: "disabled", products: disabledCount, fill: "hsl(var(--secondary))" },
    ]

    const chartConfig = {
        products: {
            label: "Products",
        },
        enabled: {
            label: "Enabled",
            color: "hsl(var(--primary))",
        },
        firefox: {
            label: "Disabled",
            color: "hsl(var(--secondary))",
        },
    } satisfies ChartConfig

    const totalProducts = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.products, 0)
    }, [enabledCount, disabledCount])

    return (
        <Card className="flex flex-col w-full">
        <CardHeader className="items-center pb-0">
            <CardTitle>Products</CardTitle>
            <CardDescription>Total number of products</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
            <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
            >
            <PieChart>
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                data={chartData}
                dataKey="products"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
                >
                <Label
                    content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                        <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                            >
                            {totalProducts.toLocaleString()}
                            </tspan>
                            <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                            >
                            Products
                            </tspan>
                        </text>
                        )
                    }
                    }}
                />
                </Pie>
            </PieChart>
            </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
            Status
            </div>
            <div className="text-muted-foreground leading-none">
            Enabled and Disabled
            </div>
        </CardFooter>
        </Card>
    );
};

export default ProductsChart;