"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

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

export const description = "A mixed bar chart"

const chartData = [
  { name: "international", value: 187, fill: "var(--color-international)" },
  { name: "national", value: 173, fill: "var(--color-national)" },
]

const chartConfig = {
  value: {
    label: "Value",
  },
  international: {
    label: "International",
    color: "var(--chart-3)",
  },
  national: {
    label: "National",
    color: "var(--chart-4)",
  },
}

export function ScopeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jangkauan Mitra: International vs National</CardTitle>
        <CardDescription>
          Visualisasi ini menunjukkan perbandingan jumlah mitra kerjasama pada jenjang internasional dan nasional. Anda dapat melihat sebaran jangkauan mitra untuk mengetahui proporsi kerjasama lintas wilayah.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 40,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value]?.label
              }
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total value for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
