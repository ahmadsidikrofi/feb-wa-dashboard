"use client"

import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Sector } from "recharts"
// import { PieSectorDataItem } from "recharts/types/polar/Pie"

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

export const description = "A donut chart with an active sector"

const chartData = [
  { browser: "akademik", visitors: 275, fill: "var(--color-akademik)" },
  { browser: "penelitian", visitors: 200, fill: "var(--color-penelitian)" },
  { browser: "abdimas", visitors: 187, fill: "var(--color-abdimas)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  akademik: {
    label: "Akademik",
    color: "var(--chart-1)",
  },
  penelitian: {
    label: "Penelitian",
    color: "var(--chart-2)",
  },
  abdimas: {
    label: "Abdimas",
    color: "var(--chart-3)",
  },
  // edge: {
  //   label: "Edge",
  //   color: "var(--chart-4)",
  // },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
}

export function ProportionPartnershipCategory() {
  const [chartData, setChartData] = useState([])
  const [growthPercentage, setGrowthPercentage] = useState(0)

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partnership/chart`, {
        headers: {
          "ngrok-skip-browser-warning": true,
        },
      })
      const rawData = res?.data?.data?.documentByCategory || []
      const mapp = rawData.map((data) => ({
        name: data.name,
        value: data.value,
      }))
      // console.log(res.data.data);

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
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Proporsi Kategori Kerjasama</CardTitle>
        <CardDescription>
          Visualisasi ini menunjukkan proporsi dokumen kerjasama berdasarkan kategori yang diajukan dan disetujui dalam periode tertentu, sehingga Anda dapat melihat penyebaran jenis kategori kerjasama yang paling banyak diimplementasikan.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length === 0 && <p className="text-muted-foreground">Data tidak tersedia</p>}
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
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by {growthPercentage.toFixed(1)}% this month <TrendingUp className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last {chartData.length} months
        </div>
      </CardFooter>
    </Card>
  )
}
