"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

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
import { useEffect, useState } from "react"
import axios from "axios"

const chartConfig = {
  count: {
    label: "Tickets",
    color: "hsl(var(--chart-1))",
  },
}

export function DailyTrenChart() {
  const [chartData, setChartData] = useState([])
  const [trendStatus, setTrendStatus] = useState("stable")
  const [percentageChange, setPercentageChange] = useState(0)
  const maxCount = Math.max(...chartData.map(d => d.count || 0))

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('http://localhost:3001/api/dashboard/stats/ticket-trends')
      const data = res.data
      setChartData(data)

      if (data.length >= 2) {
        const last = data[data.length - 1].count
        const prev = data[data.length - 2].count
        const change = prev === 0 ? (last > 0 ? 100 : 0) : ((last - prev) / prev) * 100
        setPercentageChange(change)

        if (last > prev) setTrendStatus("up")
        else if (last < prev) setTrendStatus("down")
        else setTrendStatus("stable")
      }
    }
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tren tiket (Dalam 7 hari terakhir)</CardTitle>
        <CardDescription>Visualizing volume tiket seiring berjalannya waktu</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 30, left: 12, right: 12 }}
          >
            <defs>
              <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(5)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="count"
              type="monotone"
              stroke="url(#colorTickets)"
              strokeWidth={2.5}
              dot={{ fill: "#3b82f6" }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                dataKey="count"
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>

      {/* ✅ CardFooter */}
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {trendStatus === "up" && (
          <div className="flex gap-2 leading-none font-medium text-green-600">
            Trending up by {percentageChange.toFixed(1)}% today
            <TrendingUp className="h-4 w-4" />
          </div>
        )}
        {trendStatus === "down" && (
          <div className="flex gap-2 leading-none font-medium text-red-600">
            Trending down by {Math.abs(percentageChange).toFixed(1)}% today
            <TrendingDown className="h-4 w-4" />
          </div>
        )}
        {trendStatus === "stable" && (
          <div className="flex gap-2 leading-none font-medium text-gray-500">
            No change from previous day
          </div>
        )}

        <div className="text-muted-foreground leading-none">
          Showing ticket trend for the last 7 days
        </div>
      </CardFooter>
    </Card>
  )
}