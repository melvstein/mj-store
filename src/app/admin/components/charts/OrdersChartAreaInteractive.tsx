"use client"

import * as React from "react"
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

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", pending: 22, processing: 45, shipped: 32, delivered: 85, cancelled: 8 },
  { date: "2024-04-02", pending: 15, processing: 38, shipped: 28, delivered: 92, cancelled: 5 },
  { date: "2024-04-03", pending: 18, processing: 42, shipped: 35, delivered: 78, cancelled: 12 },
  { date: "2024-04-04", pending: 28, processing: 55, shipped: 48, delivered: 105, cancelled: 7 },
  { date: "2024-04-05", pending: 35, processing: 62, shipped: 55, delivered: 125, cancelled: 15 },
  { date: "2024-04-06", pending: 32, processing: 48, shipped: 42, delivered: 118, cancelled: 9 },
  { date: "2024-04-07", pending: 24, processing: 35, shipped: 38, delivered: 95, cancelled: 6 },
  { date: "2024-04-08", pending: 42, processing: 68, shipped: 58, delivered: 145, cancelled: 18 },
  { date: "2024-04-09", pending: 8, processing: 22, shipped: 18, delivered: 45, cancelled: 4 },
  { date: "2024-04-10", pending: 26, processing: 45, shipped: 38, delivered: 88, cancelled: 11 },
  { date: "2024-04-11", pending: 35, processing: 58, shipped: 52, delivered: 125, cancelled: 14 },
  { date: "2024-04-12", pending: 28, processing: 48, shipped: 42, delivered: 98, cancelled: 9 },
  { date: "2024-04-13", pending: 38, processing: 62, shipped: 55, delivered: 132, cancelled: 16 },
  { date: "2024-04-14", pending: 15, processing: 32, shipped: 28, delivered: 75, cancelled: 7 },
  { date: "2024-04-15", pending: 12, processing: 28, shipped: 25, delivered: 68, cancelled: 5 },
  { date: "2024-04-16", pending: 14, processing: 32, shipped: 28, delivered: 72, cancelled: 6 },
  { date: "2024-04-17", pending: 48, processing: 78, shipped: 68, delivered: 162, cancelled: 22 },
  { date: "2024-04-18", pending: 38, processing: 65, shipped: 58, delivered: 148, cancelled: 18 },
  { date: "2024-04-19", pending: 25, processing: 42, shipped: 36, delivered: 95, cancelled: 8 },
  { date: "2024-04-20", pending: 9, processing: 22, shipped: 18, delivered: 48, cancelled: 4 },
  { date: "2024-04-21", pending: 14, processing: 32, shipped: 28, delivered: 72, cancelled: 6 },
  { date: "2024-04-22", pending: 22, processing: 38, shipped: 32, delivered: 85, cancelled: 8 },
  { date: "2024-04-23", pending: 16, processing: 35, shipped: 28, delivered: 78, cancelled: 7 },
  { date: "2024-04-24", pending: 42, processing: 68, shipped: 58, delivered: 148, cancelled: 19 },
  { date: "2024-04-25", pending: 24, processing: 45, shipped: 38, delivered: 98, cancelled: 10 },
  { date: "2024-04-26", pending: 8, processing: 18, shipped: 15, delivered: 42, cancelled: 3 },
  { date: "2024-04-27", pending: 45, processing: 72, shipped: 62, delivered: 155, cancelled: 21 },
  { date: "2024-04-28", pending: 12, processing: 28, shipped: 22, delivered: 65, cancelled: 5 },
  { date: "2024-04-29", pending: 32, processing: 55, shipped: 45, delivered: 118, cancelled: 13 },
  { date: "2024-04-30", pending: 48, processing: 78, shipped: 68, delivered: 165, cancelled: 22 },
  { date: "2024-05-01", pending: 18, processing: 38, shipped: 32, delivered: 88, cancelled: 9 },
  { date: "2024-05-02", pending: 32, processing: 55, shipped: 45, delivered: 118, cancelled: 13 },
  { date: "2024-05-03", pending: 26, processing: 45, shipped: 38, delivered: 95, cancelled: 11 },
  { date: "2024-05-04", pending: 42, processing: 68, shipped: 58, delivered: 148, cancelled: 19 },
  { date: "2024-05-05", pending: 52, processing: 82, shipped: 72, delivered: 185, cancelled: 24 },
  { date: "2024-05-06", pending: 55, processing: 88, shipped: 78, delivered: 198, cancelled: 26 },
  { date: "2024-05-07", pending: 42, processing: 65, shipped: 58, delivered: 148, cancelled: 18 },
  { date: "2024-05-08", pending: 16, processing: 32, shipped: 28, delivered: 72, cancelled: 6 },
  { date: "2024-05-09", pending: 24, processing: 42, shipped: 36, delivered: 88, cancelled: 9 },
  { date: "2024-05-10", pending: 32, processing: 58, shipped: 48, delivered: 118, cancelled: 14 },
  { date: "2024-05-11", pending: 36, processing: 62, shipped: 52, delivered: 128, cancelled: 15 },
  { date: "2024-05-12", pending: 22, processing: 42, shipped: 36, delivered: 88, cancelled: 9 },
  { date: "2024-05-13", pending: 21, processing: 38, shipped: 32, delivered: 82, cancelled: 8 },
  { date: "2024-05-14", pending: 48, processing: 78, shipped: 68, delivered: 168, cancelled: 22 },
  { date: "2024-05-15", pending: 51, processing: 82, shipped: 68, delivered: 175, cancelled: 23 },
  { date: "2024-05-16", pending: 36, processing: 65, shipped: 55, delivered: 138, cancelled: 16 },
  { date: "2024-05-17", pending: 54, processing: 85, shipped: 72, delivered: 188, cancelled: 25 },
  { date: "2024-05-18", pending: 34, processing: 58, shipped: 48, delivered: 125, cancelled: 13 },
  { date: "2024-05-19", pending: 25, processing: 42, shipped: 35, delivered: 88, cancelled: 10 },
  { date: "2024-05-20", pending: 19, processing: 38, shipped: 32, delivered: 78, cancelled: 7 },
  { date: "2024-05-21", pending: 9, processing: 18, shipped: 15, delivered: 38, cancelled: 3 },
  { date: "2024-05-22", pending: 8, processing: 16, shipped: 14, delivered: 35, cancelled: 3 },
  { date: "2024-05-23", pending: 27, processing: 48, shipped: 42, delivered: 102, cancelled: 11 },
  { date: "2024-05-24", pending: 32, processing: 52, shipped: 45, delivered: 112, cancelled: 12 },
  { date: "2024-05-25", pending: 22, processing: 42, shipped: 38, delivered: 88, cancelled: 9 },
  { date: "2024-05-26", pending: 23, processing: 38, shipped: 32, delivered: 85, cancelled: 8 },
  { date: "2024-05-27", pending: 45, processing: 75, shipped: 65, delivered: 162, cancelled: 21 },
  { date: "2024-05-28", pending: 25, processing: 42, shipped: 36, delivered: 88, cancelled: 9 },
  { date: "2024-05-29", pending: 8, processing: 16, shipped: 14, delivered: 35, cancelled: 3 },
  { date: "2024-05-30", pending: 36, processing: 58, shipped: 48, delivered: 132, cancelled: 14 },
  { date: "2024-05-31", pending: 19, processing: 38, shipped: 32, delivered: 78, cancelled: 7 },
  { date: "2024-06-01", pending: 19, processing: 38, shipped: 32, delivered: 78, cancelled: 7 },
  { date: "2024-06-02", pending: 51, processing: 82, shipped: 68, delivered: 175, cancelled: 23 },
  { date: "2024-06-03", pending: 11, processing: 22, shipped: 18, delivered: 48, cancelled: 4 },
  { date: "2024-06-04", pending: 47, processing: 75, shipped: 62, delivered: 162, cancelled: 21 },
  { date: "2024-06-05", pending: 9, processing: 18, shipped: 15, delivered: 38, cancelled: 3 },
  { date: "2024-06-06", pending: 32, processing: 52, shipped: 42, delivered: 112, cancelled: 12 },
  { date: "2024-06-07", pending: 35, processing: 58, shipped: 52, delivered: 128, cancelled: 15 },
  { date: "2024-06-08", pending: 42, processing: 65, shipped: 55, delivered: 145, cancelled: 18 },
  { date: "2024-06-09", pending: 47, processing: 78, shipped: 68, delivered: 168, cancelled: 22 },
  { date: "2024-06-10", pending: 17, processing: 32, shipped: 28, delivered: 72, cancelled: 6 },
  { date: "2024-06-11", pending: 10, processing: 22, shipped: 18, delivered: 48, cancelled: 4 },
  { date: "2024-06-12", pending: 53, processing: 85, shipped: 72, delivered: 185, cancelled: 24 },
  { date: "2024-06-13", pending: 9, processing: 16, shipped: 14, delivered: 35, cancelled: 3 },
  { date: "2024-06-14", pending: 46, processing: 72, shipped: 62, delivered: 158, cancelled: 20 },
  { date: "2024-06-15", pending: 33, processing: 58, shipped: 48, delivered: 125, cancelled: 14 },
  { date: "2024-06-16", pending: 40, processing: 62, shipped: 52, delivered: 142, cancelled: 16 },
  { date: "2024-06-17", pending: 51, processing: 85, shipped: 72, delivered: 188, cancelled: 25 },
  { date: "2024-06-18", pending: 12, processing: 22, shipped: 18, delivered: 52, cancelled: 4 },
  { date: "2024-06-19", pending: 37, processing: 58, shipped: 48, delivered: 132, cancelled: 14 },
  { date: "2024-06-20", pending: 44, processing: 72, shipped: 62, delivered: 155, cancelled: 21 },
  { date: "2024-06-21", pending: 18, processing: 35, shipped: 28, delivered: 78, cancelled: 7 },
  { date: "2024-06-22", pending: 34, processing: 55, shipped: 45, delivered: 122, cancelled: 13 },
  { date: "2024-06-23", pending: 52, processing: 85, shipped: 72, delivered: 188, cancelled: 25 },
  { date: "2024-06-24", pending: 14, processing: 28, shipped: 22, delivered: 62, cancelled: 5 },
  { date: "2024-06-25", pending: 15, processing: 32, shipped: 28, delivered: 72, cancelled: 6 },
  { date: "2024-06-26", pending: 47, processing: 72, shipped: 62, delivered: 162, cancelled: 20 },
  { date: "2024-06-27", pending: 48, processing: 78, shipped: 68, delivered: 172, cancelled: 22 },
  { date: "2024-06-28", pending: 16, processing: 32, shipped: 28, delivered: 72, cancelled: 6 },
  { date: "2024-06-29", pending: 11, processing: 22, shipped: 18, delivered: 48, cancelled: 4 },
  { date: "2024-06-30", pending: 48, processing: 75, shipped: 65, delivered: 165, cancelled: 21 },
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
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
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
            Showing total orders for the last 3 months
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