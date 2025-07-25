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
import { useGetUsersQuery } from "@/lib/redux/services/usersApi"
import { useEffect, useMemo, useState } from "react"
import { TUser } from "@/types"

export const description = "Users chart showing admin and staff users"

const UsersChart = () => {
    const { data: response, error, isLoading } = useGetUsersQuery();
    const [users, setUsers] = useState<TUser[]>([]);
    const [adminCount, setAdminCount] = useState(0);
    const [staffCount, setStaffCount] = useState(0);

    useEffect(() => {
        if (response?.data.content) {
            setUsers(response.data.content);
            setAdminCount(users.filter((user: TUser) => user.role === 'admin').length);
            setStaffCount(users.filter((user: TUser) => user.role === 'staff').length);
        }
    }, [response, users]);

    const chartData = [
        { browser: "admin", users: adminCount, fill: "hsl(var(--primary))" },
        { browser: "staff", users: staffCount, fill: "hsl(var(--secondary))" },
    ];

    const chartConfig = {
        users: {
            label: "Users",
        },
        admin: {
            label: "Admin",
            color: "hsl(var(--primary))",
        },
        staff: {
            label: "Staff",
            color: "hsl(var(--secondary))",
        },
    } satisfies ChartConfig

    const totalUsers = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.users, 0)
    }, [adminCount, staffCount])

    return (
        <Card className="flex flex-col w-full">
        <CardHeader className="items-center pb-0">
            <CardTitle>Backend Users</CardTitle>
            <CardDescription>Total users by role</CardDescription>
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
                dataKey="users"
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
                            {totalUsers.toLocaleString()}
                            </tspan>
                            <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                            >
                            Users
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
            Roles
            </div>
            <div className="text-muted-foreground leading-none">
            Admin and Staff
            </div>
        </CardFooter>
        </Card>
    );
};

export default UsersChart;