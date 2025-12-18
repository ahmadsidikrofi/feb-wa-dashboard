"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

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

export const description = "A bar chart with a label"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#60a5fa",
  },
}

export function GrowthTrendByYearChart() {
  // Data dummy untuk pertumbuhan kerjasama per tahun
  const dummyData = [
    { tahun: "2020", jumlah: 45 },
    { tahun: "2021", jumlah: 58 },
    { tahun: "2022", jumlah: 72 },
    { tahun: "2023", jumlah: 89 },
    { tahun: "2024", jumlah: 105 },
    { tahun: "2025", jumlah: 128 },
  ]

  const [chartData, setChartData] = useState(dummyData)
  const [growthPercentage, setGrowthPercentage] = useState(0)

  useEffect(() => {
    // Hitung growth percentage
    if (chartData.length >= 2) {
      const last = chartData[chartData.length - 1].jumlah;
      const prev = chartData[chartData.length - 2].jumlah;
    
      if (prev > 0) {
        const growth = ((last - prev) / prev) * 100;
        setGrowthPercentage(growth);
      } else {
        setGrowthPercentage(0);
      }
    } else {
      setGrowthPercentage(0);
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tren Pertumbuhan Kerjasama per Tahun</CardTitle>
        <CardDescription>
          Visualisasi pertumbuhan jumlah dokumen kerjasama yang telah diajukan dan disetujui pada setiap tahun. Data yang ditampilkan adalah tren perubahan yang terjadi selama periode beberapa tahun terakhir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 && <p className="text-muted-foreground">Data tidak tersedia</p>}
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: -20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="tahun"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="jumlah" fill="var(--color-desktop)" radius={8}>
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
        <div className="flex gap-2 leading-none font-medium">
          Trending up by {growthPercentage.toFixed(1)}% this year <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last {chartData.length} years
        </div>
      </CardFooter>
    </Card>
  )
}
