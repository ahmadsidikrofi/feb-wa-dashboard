'use client'

import { CheckCircle, Clock, FileSignature, FileText, Globe2, Handshake, ScrollText, SquareDashedBottomCodeIcon, Ticket, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GrowthTrendByYearChart } from "@/components/PartnershipMonitoring/growth-trend-by-year-chart"
import { ProportionPartnershipCategory } from "@/components/PartnershipMonitoring/proportion-partnership-cateogory-chart"
import { ScopeChart } from "@/components/PartnershipMonitoring/scope-chart"
import TableSubmission from "@/components/PartnershipMonitoring/table-submission"

const Pengajuan = () => {
    const [statusData, setStatusData] = useState({
        totalMoA: 0,
        totalMoU: 0,
        totalIA: 0,
        totalPengajuan: 0,
        activePartnerGroup: 0
    })

    const fetchDashboardData = async () => {
        // Ambil data pengajuan dari localStorage
        let submissions = [];
        if (typeof window !== 'undefined') {
            submissions = JSON.parse(localStorage.getItem('partnershipSubmissions') || '[]');
        }

        // Hitung jumlah pengajuan
        const totalPengajuan = submissions.length;

        // Update status data dengan data dari localStorage
        setStatusData({
            totalMoA: 0,
            totalMoU: 0,
            totalIA: 0,
            totalPengajuan: totalPengajuan,
            activePartnerGroup: 0
        })
    }

    useEffect(() => {
        fetchDashboardData()
        
        // Refresh data setiap kali halaman menjadi visible
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchDashboardData();
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start mt-1 gap-3">
                    <div className="bg-[#e31e25] rounded-full w-14 h-14 flex justify-center items-center">
                        <FileText className="size-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#e31e25]">Dokumen Pengajuan Kerjasama</h1>
                        <p className="text-muted-foreground">
                            Pantau status dokumen kerjasama MoU maupun MoA yang sedang diajukan bersama mitra.
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-sm:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pengajuan</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusData.totalPengajuan}</div>
                        <p className="text-xs text-muted-foreground">
                            Dokumen yang diajukan
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jumlah MoA</CardTitle>
                        <FileSignature className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusData.totalMoA}</div>
                        <p className="text-xs text-muted-foreground">
                            Memorandum of Agreement
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jumlah MoU</CardTitle>
                        <Handshake className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusData.totalMoU}</div>
                        <p className="text-xs text-muted-foreground">
                            Memorandum of Understanding
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jumlah IA</CardTitle>
                        <ScrollText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statusData.totalIA}</div>
                        <p className="text-xs text-muted-foreground">
                            Surat Keputusan Kerjasama
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <div className='grid xl:grid-cols-3 sm:grid-cols-2 gap-4'>
                <GrowthTrendByYearChart />
                <ProportionPartnershipCategory />
                <ScopeChart />
            </div>

            <TableSubmission />
        </div>
    )
}

export default Pengajuan