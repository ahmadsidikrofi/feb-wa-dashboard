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
  Users,
  Crosshair
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

const ROLES = {
  ADMIN: "admin",
  DEKANAT: "dekanat",
  KAUR: "kaur",
  KAPRODI: "kaprodi",
  SEKPRODI: "sekprodi",
  DOSEN: "dosen",
  MAHASISWA: "mahasiswa"
}

const menuItems = [
  {
    name: "Ticket Management",
    description: "Kelola tiket bantuan dan layanan WhatsApp",
    href: "/dashboard/ticket-management",
    icon: TicketXIcon,
    color: "bg-blue-500/10 text-blue-500",
    allowedRoles: [ROLES.ADMIN],
  },
  {
    name: "Daftar Agenda",
    description: "Pantau dan kelola agenda kegiatan unit dan program studi untuk menghindari konflik jadwal",
    href: "/dashboard/monitoring-kegiatan",
    icon: List,
    color: "bg-purple-500/10 text-purple-500",
    allowedRoles: [ROLES.ADMIN, ROLES.DEKANAT, ROLES.KAUR, ROLES.KAPRODI, ROLES.SEKPRODI],
  },
  {
    name: "Reminder",
    description: "Atur pengingat dan jadwal notifikasi",
    href: "/dashboard/reminder",
    icon: AlarmClock,
    color: "bg-orange-500/10 text-orange-500",
    allowedRoles: [ROLES.ADMIN, ROLES.DEKANAT, ROLES.KAUR],
  },
  {
    name: "Notulensi Rapat",
    description: "Arsip dan pembuatan notulensi rapat",
    href: "/dashboard/notulensi-rapat",
    icon: Inbox,
    color: "bg-green-500/10 text-green-500",
    allowedRoles: [ROLES.ADMIN, ROLES.DEKANAT, ROLES.KAUR],
  },
  {
    name: "Partnership Monitoring",
    description: "Pantau kerjasama dengan mitra luar",
    href: "/dashboard/partnership-monitoring",
    icon: ParkingMeter,
    color: "bg-pink-500/10 text-pink-500",
    allowedRoles: [ROLES.ADMIN, ROLES.DEKANAT, ROLES.KAUR],
  },
  {
    name: "Kontrak Manajemen",
    description: "Kelola dokumen kontrak manajemen",
    href: "/dashboard/kontrak-management",
    icon: Newspaper,
    color: "bg-yellow-500/10 text-yellow-500",
    allowedRoles: [ROLES.ADMIN, ROLES.DEKANAT, ROLES.KAUR],
  },
  {
    name: "Sasaran Mutu",
    description: "Kelola dan pantau sasaran mutu unit",
    href: "/dashboard/sasaran-mutu",
    icon: Crosshair,
    color: "bg-emerald-500/10 text-emerald-500",
    allowedRoles: [ROLES.ADMIN, ROLES.DEKANAT, ROLES.KAUR],
  },
  {
    name: "Laporan Manajemen",
    description: "Akses berbagai laporan manajemen FEB",
    href: "/dashboard/laporan-management",
    icon: Newspaper,
    color: "bg-cyan-500/10 text-cyan-500",
    allowedRoles: [ROLES.ADMIN, ROLES.DEKANAT, ROLES.KAUR],
  },
  {
    name: "Akreditasi LAMEMBA",
    description: "Dokumentasi akreditasi LAMEMBA",
    href: "/dashboard/akreditasi-lamemba",
    icon: GraduationCap,
    color: "bg-red-500/10 text-red-500",
    allowedRoles: [ROLES.ADMIN, ROLES.DEKANAT, ROLES.KAUR, ROLES.KAPRODI, ROLES.SEKPRODI],
  },
  {
    name: "Akreditasi AACSB",
    description: "Dokumentasi akreditasi internasional AACSB",
    href: "/dashboard/akreditasi-aacsb",
    icon: Award,
    color: "bg-indigo-500/10 text-indigo-500",
    allowedRoles: [ROLES.ADMIN, ROLES.DEKANAT, ROLES.KAUR, ROLES.KAPRODI, ROLES.SEKPRODI],
  },
  {
    name: "Data Pegawai",
    description: "Rekapitulasi data pegawai FEB",
    href: "/dashboard/jumlah-pegawai",
    icon: Users,
    color: "bg-slate-500/10 text-slate-500",
    allowedRoles: [ROLES.ADMIN, ROLES.DEKANAT, ROLES.KAUR, ROLES.KAPRODI, ROLES.SEKPRODI, ROLES.DOSEN],
  },
]

export default function DashboardHome() {
  const router = useRouter()
  const { user } = useAuth()
  const userRole = user?.role

  const filteredNavigation = menuItems.filter((item) => {
    // A. Jika tidak ada batasan role, tampilkan (return true)
    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true
    }

    // B. Jika ada batasan, cek apakah role user ada di daftar allowedRoles
    return item.allowedRoles.includes(userRole)
  })

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Selamat Datang di MIRA - Fakultas Ekonomi dan Bisnis - Telkom University</h1>
        <p className="text-muted-foreground mt-1">
          Pilih modul yang ingin Anda akses di bawah ini.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNavigation.map((item) => (
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
