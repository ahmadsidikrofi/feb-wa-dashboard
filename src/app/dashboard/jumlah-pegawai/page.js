"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, Briefcase, ArrowRight, TrendingUp, Loader2 } from "lucide-react";
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
import api from "@/lib/axios"

export default function DataPegawaiPage() {
  const router = useRouter();
  const [lecturers, setLecturers] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const lecturersRes = await api.get(`/api/lecturers`)
        const staffsRes = await api.get(`/api/staffs`)

        if (lecturersRes.data?.success) {
          setLecturers(lecturersRes.data.data || [])
        }

        if (staffsRes.data?.success) {
          setStaffs(staffsRes.data.data || [])
        }
      } catch (error) {
        console.error("Gagal fetch data pegawai:", error)
      } finally {
        setIsLoading(false)
      }
    };

    fetchData()
  }, [])

  // Calculate stats from API data
  const stats = {
    totalDosen: lecturers.length,
    totalTPA: staffs.length,
    totalPegawai: lecturers.length + staffs.length,
  }

  // Calculate dosen by pendidikan
  const dosenByPendidikanData = lecturers.reduce((acc, dosen) => {
    const pendidikan = dosen.education || "Lainnya";
    const existing = acc.find((item) => item.name === pendidikan);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: pendidikan, value: 1, percentage: 0 });
    }
    return acc;
  }, []);

  const dosenByPendidikan = dosenByPendidikanData.map((item) => ({
    ...item,
    percentage: stats.totalDosen > 0 ? ((item.value / stats.totalDosen) * 100).toFixed(1) : 0,
  }));

  // Calculate dosen by prodi
  const dosenByProdiData = lecturers.reduce((acc, dosen) => {
    const prodi = dosen.prodi || "Lainnya";
    const existing = acc.find((item) => item.prodi === prodi);
    if (existing) {
      existing.total += 1;
    } else {
      acc.push({ prodi, total: 1 });
    }
    return acc;
  }, []);

  const dosenByProdi = dosenByProdiData.sort((a, b) => b.total - a.total);

  // Calculate TPA by status
  const tpaByStatusData = staffs.reduce((acc, staff) => {
    let statusName = "Lainnya";
    if (staff.employmentStatus?.includes("Pegawai Tetap")) {
      statusName = "Pegawai Tetap";
    } else if (staff.employmentStatus?.includes("Profesional")) {
      statusName = "Profesional";
    } else if (staff.employmentStatus === "TLH") {
      statusName = "TLH";
    } else if (staff.employmentStatus?.includes("TLH Borongan")) {
      statusName = "TLH Borongan";
    }

    const existing = acc.find((item) => item.name === statusName);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: statusName, value: 1, percentage: 0 });
    }
    return acc;
  }, []);

  const tpaByStatus = tpaByStatusData.map((item) => ({
    ...item,
    percentage: stats.totalTPA > 0 ? ((item.value / stats.totalTPA) * 100).toFixed(1) : 0,
  }));

  // Calculate TPA by work unit
  const tpaByLokasiData = staffs.reduce((acc, staff) => {
    const lokasi = staff.workUnit || "Lainnya";
    const existing = acc.find((item) => item.lokasi === lokasi);
    if (existing) {
      existing.total += 1;
    } else {
      acc.push({ lokasi, total: 1 });
    }
    return acc;
  }, []);

  const tpaByLokasi = tpaByLokasiData.sort((a, b) => b.total - a.total);

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
      path: "/dashboard/jumlah-pegawai/dosen",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950",
      stats: [
        { label: "S3", value: String(lecturers.filter((d) => d.education === "S3").length) },
        { label: "S2", value: String(lecturers.filter((d) => d.education === "S2").length) },
      ],
    },
    {
      id: 2,
      title: "Data TPA",
      description: "Data Tenaga Pendukung Akademik FEB",
      icon: Briefcase,
      total: stats.totalTPA,
      path: "/dashboard/jumlah-pegawai/tpa",
      color: "bg-green-50 text-green-600 dark:bg-green-950",
      stats: [
        { label: "Pegawai Tetap", value: String(staffs.filter((s) => s.employmentStatus?.includes("Pegawai Tetap")).length) },
        { label: "Profesional", value: String(staffs.filter((s) => s.employmentStatus?.includes("Profesional")).length) },
        { label: "TLH", value: String(staffs.filter((s) => s.employmentStatus === "TLH").length) },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
