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
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
}

export function ProportionPartnershipCategory() {
  const [growthPercentage, setGrowthPercentage] = useState(0)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Proporsi Kategori Kerjasama</CardTitle>
        <CardDescription>
          Proporsi dokumen kerjasama menurut kategori dalam periode tertentu.
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
