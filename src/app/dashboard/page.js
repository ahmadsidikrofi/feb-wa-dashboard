'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  TicketXIcon,
  List,
  AlarmClock,
  Inbox,
  ParkingMeter,
  Newspaper,
  GraduationCap,
  Award,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const menuItems = [
  {
    name: "Ticket Management",
    description: "Kelola tiket bantuan dan layanan WhatsApp",
    href: "/dashboard/ticket-management",
    icon: TicketXIcon,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    name: "Daftar Kegiatan",
    description: "Pantau dan kelola agenda kegiatan unit dan program studi untuk menghindari konflik jadwal",
    href: "/dashboard/monitoring-kegiatan",
    icon: List,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    name: "Reminder",
    description: "Atur pengingat dan jadwal notifikasi",
    href: "/dashboard/reminder",
    icon: AlarmClock,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    name: "Notulensi Rapat",
    description: "Arsip dan pembuatan notulensi rapat",
    href: "/dashboard/notulensi-rapat",
    icon: Inbox,
    color: "bg-green-500/10 text-green-500",
  },
  {
    name: "Monitoring Kerjasama",
    description: "Pantau kerjasama dengan mitra luar",
    href: "/dashboard/partnership-monitoring",
    icon: ParkingMeter,
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    name: "Kontrak Manajemen",
    description: "Kelola dokumen kontrak manajemen",
    href: "/dashboard/kontrak-manajemen",
    icon: Newspaper,
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    name: "Laporan Manajemen",
    description: "Akses berbagai laporan manajemen FEB",
    href: "/dashboard/laporan-manajemen",
    icon: Newspaper,
    color: "bg-cyan-500/10 text-cyan-500",
  },
  {
    name: "Akreditasi LAMEMBA",
    description: "Dokumentasi akreditasi LAMEMBA",
    href: "/dashboard/akreditasi-lamemba",
    icon: GraduationCap,
    color: "bg-red-500/10 text-red-500",
  },
  {
    name: "Akreditasi AACSB",
    description: "Dokumentasi akreditasi internasional AACSB",
    href: "/dashboard/akreditasi-aacsb",
    icon: Award,
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    name: "Jumlah Pegawai",
    description: "Rekapitulasi data pegawai FEB",
    href: "/dashboard/data-pegawai",
    icon: Users,
    color: "bg-slate-500/10 text-slate-500",
  },
]

export default function DashboardHome() {
  const router = useRouter()

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Selamat Datang di Media Informasi dan Relasi Anda (MIRA) - Fakultas Ekonomi dan Bisnis - Telkom University</h1>
        <p className="text-muted-foreground mt-1">
          Pilih modul yang ingin Anda akses di bawah ini.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <Card
            key={item.name}
            className="group hover:border-primary transition-all cursor-pointer hover:shadow-md border-muted-foreground/10"
            onClick={() => router.push(item.href)}
          >
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <div className={`p-2 rounded-lg ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                {item.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}