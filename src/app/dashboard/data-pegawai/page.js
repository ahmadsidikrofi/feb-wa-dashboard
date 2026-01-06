"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, Briefcase, ArrowRight, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DataPegawaiPage() {
  const router = useRouter();

  // Stats dari data CSV
  const stats = {
    totalDosen: 205,
    totalTPA: 40,
    totalPegawai: 245,
  };

  // Data Dosen berdasarkan Pendidikan
  const dosenByPendidikan = [
    { name: "S3", value: 156, percentage: 76.1 },
    { name: "S2", value: 49, percentage: 23.9 },
  ];

  // Data Dosen berdasarkan Prodi
  const dosenByProdi = [
    { prodi: "S1 MAN", total: 52 },
    { prodi: "S1 ADBIS", total: 46 },
    { prodi: "S1 AKUN", total: 38 },
    { prodi: "S2 MAN", total: 19 },
    { prodi: "S2 MAN PJJ", total: 17 },
    { prodi: "S2 ADBIS", total: 10 },
    { prodi: "S2 AKUN", total: 8 },
    { prodi: "S1 LM", total: 6 },
    { prodi: "S3 MAN", total: 1 },
    { prodi: "Lainnya", total: 8 },
  ];

  // Data TPA berdasarkan Status
  const tpaByStatus = [
    { name: "Pegawai Tetap", value: 16, percentage: 40 },
    { name: "Profesional", value: 11, percentage: 27.5 },
    { name: "TLH", value: 10, percentage: 25 },
    { name: "TLH Borongan", value: 3, percentage: 7.5 },
  ];

  // Data TPA berdasarkan Lokasi Kerja
  const tpaByLokasi = [
    { lokasi: "Urusan Akademik", total: 5 },
    { lokasi: "Kepala Urusan", total: 5 },
    { lokasi: "Urusan SDM & Keuangan", total: 4 },
    { lokasi: "Urusan Kemahasiswaan", total: 4 },
    { lokasi: "Urusan Sekretariat", total: 3 },
    { lokasi: "S2 Manajemen", total: 3 },
    { lokasi: "S2 MAN PJJ", total: 3 },
    { lokasi: "Urusan Lab/Studio", total: 3 },
    { lokasi: "S1 Manajemen", total: 2 },
    { lokasi: "S1 Akuntansi", total: 2 },
    { lokasi: "S1 Bisnis Digital", total: 2 },
    { lokasi: "S1 Adbis", total: 1 },
    { lokasi: "S1 LM", total: 1 },
    { lokasi: "S2 Adbis", total: 1 },
    { lokasi: "S2 Akuntansi", total: 1 },
  ];

  const COLORS = {
    brickRed: "#b91c1c",
    lightGray: "#d1d5db",
    darkGray: "#4b5563",
    pink: "#ec4899",
    darkBlue: "#1e3a8a",
    lightBlue: "#60a5fa",
  };

  const PIE_COLORS = [COLORS.brickRed, COLORS.lightGray, COLORS.darkGray, COLORS.pink, COLORS.darkBlue, COLORS.lightBlue];

  const categories = [
    {
      id: 1,
      title: "Data Dosen",
      description: "Data lengkap dosen dan pengajar FEB",
      icon: GraduationCap,
      total: stats.totalDosen,
      path: "/dashboard/data-pegawai/dosen",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950",
      stats: [
        { label: "S3", value: "156" },
        { label: "S2", value: "50" },
      ],
    },
    {
      id: 2,
      title: "Data TPA",
      description: "Data Tenaga Pendukung Akademik FEB",
      icon: Briefcase,
      total: stats.totalTPA,
      path: "/dashboard/data-pegawai/tpa",
      color: "bg-green-50 text-green-600 dark:bg-green-950",
      stats: [
        { label: "Pegawai Tetap", value: "16" },
        { label: "Profesional", value: "23" },
        { label: "TLH", value: "3" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Jumlah Pegawai</h1>
        <p className="text-muted-foreground mt-2">
          Rekapitulasi data pegawai Fakultas Ekonomi dan Bisnis
        </p>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Total Pegawai FEB</CardTitle>
              <CardDescription>Dosen dan Tenaga Pendukung Akademik</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">{stats.totalPegawai}</span>
            <span className="text-muted-foreground">pegawai</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-background border">
              <p className="text-sm text-muted-foreground">Dosen</p>
              <p className="text-2xl font-bold">{stats.totalDosen}</p>
            </div>
            <div className="p-4 rounded-lg bg-background border">
              <p className="text-sm text-muted-foreground">TPA</p>
              <p className="text-2xl font-bold">{stats.totalTPA}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Kategori Data Pegawai</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${category.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-3">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{category.total}</span>
                      <span className="text-muted-foreground">orang</span>
                    </div>
                    <div className="flex gap-3">
                      {category.stats.map((stat, idx) => (
                        <div key={idx} className="flex-1 p-3 rounded-lg bg-muted">
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                          <p className="text-lg font-semibold">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full mt-4"
                      onClick={() => router.push(category.path)}
                    >
                      Data Detail
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Rekapitulasi Dosen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Rekapitulasi Data Dosen
          </CardTitle>
          <CardDescription>
            Distribusi dosen berdasarkan pendidikan dan program studi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dosen by Pendidikan - Pie Chart */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Berdasarkan Pendidikan</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dosenByPendidikan}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dosenByPendidikan.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {dosenByPendidikan.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[idx] }}
                      />
                      <p className="text-xs font-medium">{item.name}</p>
                    </div>
                    <p className="text-xl font-bold">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dosen by Prodi - Bar Chart */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Berdasarkan Program Studi</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dosenByProdi}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="prodi" angle={-45} textAnchor="end" height={80} fontSize={11} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill={COLORS.darkBlue} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {dosenByProdi.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted text-xs">
                    <span className="font-medium">{item.prodi}</span>
                    <Badge variant="secondary">{item.total}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rekapitulasi TPA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Rekapitulasi Data TPA
          </CardTitle>
          <CardDescription>
            Distribusi TPA berdasarkan status kepegawaian dan lokasi kerja
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TPA by Status - Pie Chart */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Berdasarkan Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={tpaByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tpaByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {tpaByStatus.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[idx] }}
                      />
                      <p className="text-xs font-medium">{item.name}</p>
                    </div>
                    <p className="text-xl font-bold">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* TPA by Lokasi - Bar Chart */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Berdasarkan Lokasi Kerja</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tpaByLokasi}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="lokasi" angle={-45} textAnchor="end" height={100} fontSize={11} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill={COLORS.brickRed} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {tpaByLokasi.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted text-xs">
                    <span className="font-medium">{item.lokasi}</span>
                    <Badge variant="secondary">{item.total}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tentang Data Pegawai</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sistem data pegawai FEB menyediakan informasi lengkap mengenai dosen
              dan tenaga pendukung akademik. Data mencakup informasi personal,
              riwayat pendidikan, jabatan, dan status kepegawaian.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sumber Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                <span className="text-muted-foreground">Data Dosen</span>
                <span className="font-medium">Data FEB.csv</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                <span className="text-muted-foreground">Data TPA</span>
                <span className="font-medium">Data TPA FEB.csv</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
