import {CloudMoon, CloudSun, Moon, Sun} from "lucide-react"
import {Bar, BarChart, LabelList, XAxis, YAxis} from "recharts"

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

export default function LearningPattern({pattern, dateRange}) {
    const mostActive = pattern.reduce((prev, current) => {
        return prev.count > current.count ? prev : current
    }, 0);

    let icon;
    if (mostActive.session === 'morning') {
        icon = <CloudSun className="h-4 w-4"/>;
    } else if (mostActive.session === 'afternoon') {
        icon = <Sun className="h-4 w-4"/>;
    } else if (mostActive.session === 'evening') {
        icon = <CloudMoon className="h-4 w-4"/>;
    } else {
        icon = <Moon className="h-4 w-4"/>;;
    }

    const config = {
        count: {
            label: "Completed",
            color: "currentColor",
        },
    };

    return (
        <Card className="break-inside-avoid">
            <CardHeader>
                <CardTitle>Learning Pattern by Time of Day</CardTitle>
                <CardDescription>{dateRange}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer className="text-teal-600" config={config}>
                    <BarChart
                        accessibilityLayer
                        data={pattern}
                        layout="vertical"
                        margin={{
                            right: 16,
                        }}
                    >
                        <YAxis
                            dataKey="session"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                        />
                        <XAxis dataKey="count" type="number" hide/>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line"/>}
                        />
                        <Bar
                            dataKey="count"
                            layout="vertical"
                            fill="currentColor"
                            radius={4}
                            className="text-teal-600"
                        >
                            <LabelList
                                dataKey="session"
                                position="insideLeft"
                                offset={8}
                                className="fill-background capitalize"
                                fontSize={14}
                            />
                            <LabelList
                                dataKey="count"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={14}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-1 leading-none font-medium">
                    You're
                    <span>{['a', 'e'].includes(mostActive?.session?.charAt(0)) ? 'an' : 'a'}</span>
                    <span>{mostActive?.session}</span>
                    learner
                    {icon}
                </div>
                <div className="text-muted-foreground leading-none">
                    You're most active during the {mostActive?.session} with {mostActive.count} completed
                    tutorials.
                </div>
            </CardFooter>
        </Card>
    )
}
