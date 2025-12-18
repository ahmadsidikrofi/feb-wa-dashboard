"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"

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
    total: {
        label: "Total Tiket",
        color: "var(--chart-2)",
    },
    label: {
        color: "var(--background)",
    },
}

const getBarColor = (category) => {
    switch (category) {
        case "Dekan":
            return "#b91c1c" // Brick Red
        case "Wakil Dekan I":
        case "Wadek1":
            return "#d1d5db" // Light Gray
        case "Wakil Dekan II":
        case "Wadek2":
            return "#4b5563" // Dark Gray
        case "Urusan Sekretariat Dekan":
        case "Sekretariat":
            return "#ec4899" // Pink
        case "Urusan Layanan Akademik":
            return "#1e3a8a" // Dark Blue
        case "Urusan Laboratorium":
            return "#60a5fa" // Light Blue
        case "Urusan SDM Keuangan":
        case "Keuangan":
            return "#b91c1c" // Brick Red
        case "Urusan Kemahasiswaan":
            return "#d1d5db" // Light Gray
        case "Prodi S1 Manajemen":
        case "Prodi1":
            return "#4b5563" // Dark Gray
        case "Prodi S1 Administrasi Bisnis":
            return "#ec4899" // Pink
        case "Prodi S1 Akuntansi":
            return "#1e3a8a" // Dark Blue
        case "Prodi S1 Leisure Management":
            return "#60a5fa" // Light Blue
        case "Prodi S1 Bisnis Digital":
            return "#b91c1c" // Brick Red
        case "Prodi S2 Manajemen":
            return "#d1d5db" // Light Gray
        case "Prodi S2 Manajemen PJJ":
            return "#4b5563" // Dark Gray
        case "Prodi S2 Administrasi Bisnis":
        case "Prodi2":
            return "#ec4899" // Pink
        case "Prodi S2 Akuntansi":
            return "#1e3a8a" // Dark Blue
        case "Prodi S3 Manajemen":
            return "#60a5fa" // Light Blue
        case "Sidang":
            return "#b91c1c" // Brick Red
        case "Wisuda":
            return "#4b5563" // Dark Gray
        default:
            return "#1e293b" // Slate Darker
    }
}

export function TicketPerCategoryChart() {
    const [chartData, setChartData] = useState([])
    const [topCategory, setTopCategory] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/stats/ticket-categories`, {
                    headers: {
                        "ngrok-skip-browser-warning": true,
                      },
                })
                const data = res.data
                console.log("Response data:", data);
                setChartData(data)

                if (Array.isArray(data)) {
                    setChartData(data);

                    if (data.length > 0) {
                        const maxCategory = data.reduce((prev, curr) =>
                            curr.total > prev.total ? curr : prev
                        );
                        setTopCategory(maxCategory.name)
                    }
                } else {
                    console.warn("Data bukan array:", data)
                    setChartData([])
                }
            } catch (error) {
                console.error("Gagal memuat data kategori tiket:", error)
            }
        }
        fetchData()
    }, [])
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tiket Berdasarkan Kategori</CardTitle>
                <CardDescription>Distribusi jumlah tiket per kategori</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{ right: 16 }}
                        barSize={80}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                        />
                        <XAxis dataKey="total" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="total"
                            layout="vertical"
                            fill="var(--color-desktop)"
                            radius={4}
                        >
                            <LabelList
                                dataKey="name"
                                position="insideLeft"
                                offset={8}
                                className="fill-(--color-label)"
                                fontSize={12}
                            />
                            <LabelList
                                dataKey="total"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} className="rounded-b-4xl" />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Kategori terbanyak: <span className="text-blue-600">{topCategory} </span> <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Data diperbarui secara real-time dari sistem tiket
                </div>
            </CardFooter>
        </Card>
    )
}
