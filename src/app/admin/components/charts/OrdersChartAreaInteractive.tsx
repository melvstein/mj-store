"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetOrdersQuery } from "@/lib/redux/services/ordersApi"
import Loading from "@/components/Loading/Loading"
import { useEffect, useState, useMemo } from "react"
import { OrderStatusCode } from "@/enums/OrderStatus"

export const description = "An interactive area chart"

// Default fake data from November 1 to 11, 2025
const defaultChartData = [
  { date: "2025-11-01", pending: 8, processing: 15, shipped: 12, delivered: 25, cancelled: 3 },
  { date: "2025-11-02", pending: 12, processing: 18, shipped: 14, delivered: 32, cancelled: 2 },
  { date: "2025-11-03", pending: 6, processing: 22, shipped: 18, delivered: 28, cancelled: 4 },
  { date: "2025-11-04", pending: 15, processing: 25, shipped: 20, delivered: 35, cancelled: 5 },
  { date: "2025-11-05", pending: 10, processing: 20, shipped: 16, delivered: 30, cancelled: 3 },
  { date: "2025-11-06", pending: 14, processing: 28, shipped: 22, delivered: 40, cancelled: 6 },
  { date: "2025-11-07", pending: 9, processing: 16, shipped: 13, delivered: 22, cancelled: 2 },
  { date: "2025-11-08", pending: 18, processing: 32, shipped: 26, delivered: 45, cancelled: 7 },
  { date: "2025-11-09", pending: 7, processing: 14, shipped: 11, delivered: 20, cancelled: 3 },
  { date: "2025-11-10", pending: 13, processing: 24, shipped: 19, delivered: 38, cancelled: 4 },
  { date: "2025-11-11", pending: 11, processing: 19, shipped: 15, delivered: 28, cancelled: 5 },
]

const chartConfig = {
  orders: {
    label: "Orders",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-1)",
  },
  processing: {
    label: "Processing",
    color: "var(--chart-2)",
  },
  shipped: {
    label: "Shipped",
    color: "var(--chart-3)",
  },
  delivered: {
    label: "Delivered",
    color: "var(--chart-4)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

const OrdersChartAreaInteractive = () => {
    const {data: response, isLoading: ordersLoading} = useGetOrdersQuery({ status: null });
    const [isLoading, setIsLoading] = useState(false);
    const [timeRange, setTimeRange] = useState("90d")

    // Transform orders data into chart data
    const chartData = useMemo(() => {
        const orders = response?.data || [];
        
        // Start with default fake data as base
        const groupedData: Record<string, { 
            date: string, 
            pending: number, 
            processing: number, 
            shipped: number, 
            delivered: number, 
            cancelled: number 
        }> = {};

        // First, populate with default fake data
        defaultChartData.forEach(item => {
            groupedData[item.date] = { ...item };
        });

        // Then add real orders data on top of fake data
        orders.forEach(order => {
            const date = new Date(order.createdAt || Date.now()).toISOString().split('T')[0];
            
            if (!groupedData[date]) {
                groupedData[date] = {
                    date,
                    pending: 0,
                    processing: 0,
                    shipped: 0,
                    delivered: 0,
                    cancelled: 0
                };
            }

            // Add real order counts to existing data
            switch (order.status) {
                case OrderStatusCode.PENDING:
                    groupedData[date].pending++;
                    break;
                case OrderStatusCode.PROCESSING:
                    groupedData[date].processing++;
                    break;
                case OrderStatusCode.SHIPPED:
                    groupedData[date].shipped++;
                    break;
                case OrderStatusCode.DELIVERED:
                    groupedData[date].delivered++;
                    break;
                case OrderStatusCode.CANCELLED:
                    groupedData[date].cancelled++;
                    break;
            }
        });

        // Convert to array and sort by date
        return Object.values(groupedData).sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }, [response?.data]);

     useEffect(() => {
        if (ordersLoading) {
            setIsLoading(ordersLoading);
            return;
        }
    }, [ordersLoading]);
  
    if (isLoading) return <Loading duration={300} onComplete={ () => setIsLoading(false) } />

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date() // Use current date instead of hardcoded date
        let daysToSubtract = 90

        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })

    return (
        <Card className="bg-secondary pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1">
            <CardTitle>Orders</CardTitle>
            <CardDescription>
                Showing total orders for the {
                    timeRange === "90d" ? "last 3 months" :
                    timeRange === "30d" ? "last 30 days" : "last 7 days"
                }
            </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
                className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                aria-label="Select a value"
            >
                <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                    Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                    Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                    Last 7 days
                </SelectItem>
            </SelectContent>
            </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
            >
            <AreaChart data={filteredData}>
                <defs>
                <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                    <stop
                        offset="5%"
                        stopColor="var(--color-pending)"
                        stopOpacity={0.8}
                    />
                    <stop
                        offset="95%"
                        stopColor="var(--color-pending)"
                        stopOpacity={0.1}
                    />
                </linearGradient>
                <linearGradient id="fillProcessing" x1="0" y1="0" x2="0" y2="1">
                    <stop
                        offset="5%"
                        stopColor="var(--color-processing)"
                        stopOpacity={0.8}
                    />
                    <stop
                        offset="95%"
                        stopColor="var(--color-processing)"
                        stopOpacity={0.1}
                    />
                </linearGradient>
                <linearGradient id="fillShipped" x1="0" y1="0" x2="0" y2="1">
                    <stop
                        offset="5%"
                        stopColor="var(--color-shipped)"
                        stopOpacity={0.8}
                    />
                    <stop
                        offset="95%"
                        stopColor="var(--color-shipped)"
                        stopOpacity={0.1}
                    />
                </linearGradient>
                <linearGradient id="fillDelivered" x1="0" y1="0" x2="0" y2="1">
                    <stop
                        offset="5%"
                        stopColor="var(--color-delivered)"
                        stopOpacity={0.8}
                    />
                    <stop
                        offset="95%"
                        stopColor="var(--color-delivered)"
                        stopOpacity={0.1}
                    />
                </linearGradient>
                <linearGradient id="fillCancelled" x1="0" y1="0" x2="0" y2="1">
                    <stop
                        offset="5%"
                        stopColor="var(--color-cancelled)"
                        stopOpacity={0.8}
                    />
                    <stop
                        offset="95%"
                        stopColor="var(--color-cancelled)"
                        stopOpacity={0.1}
                    />
                </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        })
                    }}
                />
                <ChartTooltip
                cursor={false}
                content={
                    <ChartTooltipContent
                    labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        })
                    }}
                    indicator="dot"
                    />
                }
                />
                <Area
                    dataKey="cancelled"
                    type="natural"
                    fill="url(#fillCancelled)"
                    stroke="var(--color-cancelled)"
                    stackId="a"
                />
                <Area
                    dataKey="pending"
                    type="natural"
                    fill="url(#fillPending)"
                    stroke="var(--color-pending)"
                    stackId="a"
                />
                <Area
                    dataKey="processing"
                    type="natural"
                    fill="url(#fillProcessing)"
                    stroke="var(--color-processing)"
                    stackId="a"
                />
                <Area
                    dataKey="shipped"
                    type="natural"
                    fill="url(#fillShipped)"
                    stroke="var(--color-shipped)"
                    stackId="a"
                />
                <Area
                    dataKey="delivered"
                    type="natural"
                    fill="url(#fillDelivered)"
                    stroke="var(--color-delivered)"
                    stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
            </ChartContainer>
        </CardContent>
        </Card>
    )
}

export default OrdersChartAreaInteractive;