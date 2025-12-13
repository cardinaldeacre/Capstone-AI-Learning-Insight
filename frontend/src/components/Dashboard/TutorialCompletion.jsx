"use client"

import {Bar, BarChart, CartesianGrid, LabelList, XAxis} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export default function TutorialCompletion({completion, dateRange}) {
    const mostActive = completion.reduce((prev, current) => {
        return prev.count > current.count ? prev : current
    }, 0);

    const totalCompleted = completion.reduce((sum, entry) => sum + entry.count, 0);

    const config = {
        count: {
            label: "Completed",
            color: "currentColor",
        },
    }

    return (
        <Card className="break-inside-avoid">
            <CardHeader>
                <CardTitle>Tutorial Completion by Day</CardTitle>
                <CardDescription>{dateRange}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer className="text-teal-600" config={config}>
                    <BarChart
                        accessibilityLayer
                        data={completion}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            className="capitalize"
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel/>}
                        />
                        <Bar dataKey="count" fill="currentColor" radius={8}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-1 leading-none font-medium">
                    Your most active day is
                    <span className="capitalize">
                        {mostActive.day}
                    </span>
                </div>
                <div className="text-muted-foreground leading-none">
                    {totalCompleted} tutorials completed last week.
                </div>
            </CardFooter>
        </Card>
    )
}