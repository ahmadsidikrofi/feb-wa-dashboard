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
import axios from "axios"

export const description = "A bar chart with a label"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
}

export function GrowthTrendByYearChart() {
  const [chartData, setChartData] = useState([])
  const [growthPercentage, setGrowthPercentage] = useState(0)

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partnership/chart`)
      const rawData = res.data.data.documentsByYear || []
      
      const mapp = rawData.map((data) => ({
        tahun: data.name,
        jumlah: data.value,
      }))

      setChartData(mapp)

      if (mapp.length >= 2) {
        const last = mapp[mapp.length - 1].jumlah;
        const prev = mapp[mapp.length - 2].jumlah;
      
        if (prev > 0) {
          const growth = ((last - prev) / prev) * 100;
          setGrowthPercentage(growth);
        } else {
          setGrowthPercentage(0);
        }
      } else {
        setGrowthPercentage(0);
      }
    } catch (error) {
      console.error("Gagal memuat data kategori tiket:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tren Pertumbuhan Kerjasama per Tahun</CardTitle>
        <CardDescription>
          Visualisasi pertumbuhan jumlah dokumen kerjasama yang telah diajukan dan disetujui pada setiap tahun.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
