"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"

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

export const description = "A mixed bar chart"

const chartConfig = {
  international: {
    label: "International",
    color: "var(--chart-3)",
  },
  national: {
    label: "National",
    color: "var(--chart-4)",
  },
  value: {
    label: "Total",
  },
}

export function ScopeChart() {
  const [chartData, setChartData] = useState([])
  const [growthPercentage, setGrowthPercentage] = useState(0)

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partnership/chart`, {
        headers: {
          "ngrok-skip-browser-warning": true,
        },
      })

      // Perhatikan response datanya, gunakan 'documentByScope'
      const rawData = res?.data?.data?.documentByScope || []

      // Gunakan key yang sesuai untuk dipakai di chart
      const mapp = rawData.map((data) => ({
        name: data.name,
        value: data.value,
      }))

      setChartData(mapp)

      if (mapp.length >= 2) {
        const last = mapp[mapp.length - 1].value;
        const prev = mapp[mapp.length - 2].value;

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
      console.error("Gagal memuat data:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jangkauan Mitra: International vs National</CardTitle>
        <CardDescription>
          Visualisasi ini menunjukkan perbandingan jumlah mitra kerjasama pada jenjang internasional dan nasional. Anda dapat melihat sebaran jangkauan mitra untuk mengetahui proporsi kerjasama lintas wilayah.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 && <p className="text-muted-foreground">Data tidak tersedia</p>}
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
            <Bar dataKey="value" radius={5}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartConfig[entry.name]?.color}
                />
              ))}
            </Bar>

          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by {growthPercentage.toFixed(1)}% this month <TrendingUp className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total value for the last {chartData.length} years
        </div>
      </CardFooter>
    </Card>
  )
}
