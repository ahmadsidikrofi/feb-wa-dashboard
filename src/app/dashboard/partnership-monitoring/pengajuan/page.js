'use client'

import { CheckCircle, Clock, FileSignature, FileText, Globe2, Handshake, ScrollText, SquareDashedBottomCodeIcon, Ticket, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TicketPerCategoryChart } from "@/components/ticket-per-category-chart"
import { DailyTrenChart } from "@/components/daily-tren-chart"

const Pengajuan = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start mt-1 gap-3">
                    <div className="bg-emerald-500 rounded-full w-14 h-14 flex justify-center items-center">
                        <FileText className="size-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-emerald-600">Dokumen Pengajuan Kerjasama</h1>
                        <p className="text-muted-foreground">
                            Pantau status dokumen kerjasama MoU maupun MoA yang sedang diajukan bersama mitra.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pengajuan