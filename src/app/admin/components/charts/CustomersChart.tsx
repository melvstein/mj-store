"use client"

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
import { useGetCustomersQuery } from "@/lib/redux/services/customersApi"
import { TProduct } from "@/types"
import { TCustomer } from "@/types/TCustomer"

export const description = "Customers chart showing active and inactive customers"

const CustomersChart = () => {
    const { data: response, error, isLoading } = useGetCustomersQuery();
    const [customers, setCustomers] = useState<TCustomer[]>([]);
    const [activeCount, setActiveCount] = useState(0);
    const [inactiveCount, setInactiveCount] = useState(0);

    useEffect(() => {
        if (response?.data?.content) {
            setCustomers(response.data.content);
            setActiveCount(customers.filter((customer: TCustomer) => customer.isActive).length);
            setInactiveCount(customers.filter((customer: TCustomer) => !customer.isActive).length);
        }
    }, [response, customers]);

    const chartData = [
        { browser: "active", customers: activeCount, fill: "hsl(var(--primary))" },
        { browser: "inactive", customers: inactiveCount, fill: "hsl(var(--secondary))" },
    ]

    const chartConfig = {
        customers: {
            label: "Customers",
        },
        chrome: {
            label: "active",
            color: "hsl(var(--primary))",
        },
        firefox: {
            label: "Inactive",
            color: "hsl(var(--secondary))",
        },
    } satisfies ChartConfig

    const totalCustomers = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.customers, 0)
    }, [activeCount, inactiveCount])

    return (
        <Card className="flex flex-col w-full">
        <CardHeader className="items-center pb-0">
            <CardTitle>Customers</CardTitle>
            <CardDescription>Total number of customers</CardDescription>
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
                dataKey="customers"
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
                            {totalCustomers.toLocaleString()}
                            </tspan>
                            <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                            >
                            Customers
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
            Active and Inactive
            </div>
        </CardFooter>
        </Card>
    );
};

export default CustomersChart;