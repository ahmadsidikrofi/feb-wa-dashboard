"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Target,
  CheckCircle2,
  Download,
  BarChart3,
} from "lucide-react";
import TableContractManagement from "@/components/ContractManagement/TableContractManagement";

// Data dummy untuk statistik kinerja
const statsData = [
  {
    title: "Total Responsibility",
    value: "156",
    change: "+8 items",
    trend: "up",
    icon: FileText,
    description: "dari triwulan lalu",
  },
  {
    title: "Rata-rata Pencapaian",
    value: "87.5%",
    change: "+5.2%",
    trend: "up",
    icon: Target,
    description: "dari target",
  },
  {
    title: "Target Tercapai",
    value: "142",
    change: "+12",
    trend: "up",
    icon: CheckCircle2,
    description: "responsibility",
  },
  {
    title: "Total Nilai",
    value: "4,285",
    change: "+3.8%",
    trend: "up",
    icon: BarChart3,
    description: "nilai kinerja",
  },
];

// Data dummy kinerja per unit - 18 Units
const unitPerformance = [
  {
    unit: "Dekan",
    totalResponsibility: 42,
    avgPencapaian: 92.5,
    totalNilai: 1245,
    status: "Excellent",
  },
  {
    unit: "Wakil Dekan I",
    totalResponsibility: 38,
    avgPencapaian: 88.3,
    totalNilai: 1098,
    status: "Good",
  },
  {
    unit: "Wakil Dekan II",
    totalResponsibility: 35,
    avgPencapaian: 85.7,
    totalNilai: 987,
    status: "Good",
  },
  {
    unit: "Urusan Sekretariat Dekan",
    totalResponsibility: 28,
    avgPencapaian: 86.4,
    totalNilai: 875,
    status: "Good",
  },
  {
    unit: "Urusan Layanan Akademik",
    totalResponsibility: 32,
    avgPencapaian: 84.7,
    totalNilai: 921,
    status: "Good",
  },
  {
    unit: "Urusan Laboratorium",
    totalResponsibility: 26,
    avgPencapaian: 83.2,
    totalNilai: 798,
    status: "Satisfactory",
  },
  {
    unit: "Urusan SDM Keuangan",
    totalResponsibility: 41,
    avgPencapaian: 84.2,
    totalNilai: 955,
    status: "Satisfactory",
  },
  {
    unit: "Urusan Kemahasiswaan",
    totalResponsibility: 30,
    avgPencapaian: 87.1,
    totalNilai: 932,
    status: "Good",
  },
  {
    unit: "Prodi S1 Manajemen",
    totalResponsibility: 36,
    avgPencapaian: 89.1,
    totalNilai: 1020,
    status: "Good",
  },
  {
    unit: "Prodi S1 Administrasi Bisnis",
    totalResponsibility: 31,
    avgPencapaian: 86.5,
    totalNilai: 945,
    status: "Good",
  },
  {
    unit: "Prodi S1 Akuntansi",
    totalResponsibility: 34,
    avgPencapaian: 87.8,
    totalNilai: 968,
    status: "Good",
  },
  {
    unit: "Prodi S1 Leisure Management",
    totalResponsibility: 24,
    avgPencapaian: 82.3,
    totalNilai: 765,
    status: "Satisfactory",
  },
  {
    unit: "Prodi S1 Bisnis Digital",
    totalResponsibility: 27,
    avgPencapaian: 85.9,
    totalNilai: 854,
    status: "Good",
  },
  {
    unit: "Prodi S2 Manajemen",
    totalResponsibility: 29,
    avgPencapaian: 88.7,
    totalNilai: 978,
    status: "Good",
  },
  {
    unit: "Prodi S2 Manajemen PJJ",
    totalResponsibility: 22,
    avgPencapaian: 81.4,
    totalNilai: 712,
    status: "Satisfactory",
  },
  {
    unit: "Prodi S2 Administrasi Bisnis",
    totalResponsibility: 25,
    avgPencapaian: 84.6,
    totalNilai: 823,
    status: "Satisfactory",
  },
  {
    unit: "Prodi S2 Akuntansi",
    totalResponsibility: 26,
    avgPencapaian: 86.2,
    totalNilai: 867,
    status: "Good",
  },
  {
    unit: "Prodi S3 Manajemen",
    totalResponsibility: 20,
    avgPencapaian: 90.3,
    totalNilai: 798,
    status: "Excellent",
  },
];

export default function KontrakManagementPage() {
  const getStatusBadge = (status) => {
    const config = {
      Excellent: {
        variant: "default",
        className: "bg-green-600 hover:bg-green-700",
      },
      Good: { variant: "default", className: "bg-blue-600 hover:bg-blue-700" },
      Satisfactory: { variant: "secondary", className: "" },
      "Needs Improvement": { variant: "destructive", className: "" },
    };
    const { variant, className } = config[status] || config["Satisfactory"];

    return (
      <Badge variant={variant} className={className}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#e31e25]">
            Kontrak Management
          </h1>
          <p className="text-muted-foreground">
            Dashboard kinerja kontrak kerja yang ditugaskan kepada fakultas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Laporan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span>{stat.description}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance by Unit */}
      <Card>
        <CardHeader>
          <CardTitle>Kinerja Per Unit</CardTitle>
          <CardDescription>
            Ringkasan kinerja kontrak kerja berdasarkan unit kerja
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {unitPerformance.map((unit, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{unit.unit}</h4>
                    {getStatusBadge(unit.status)}
                  </div>
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {unit.totalResponsibility} Responsibility
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {unit.avgPencapaian}% Pencapaian
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      {unit.totalNilai} Nilai
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Detail
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Kontrak Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Kontrak Kerja</CardTitle>
          <CardDescription>
            Daftar responsibility dan monitoring kinerja kontrak kerja fakultas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableContractManagement />
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bobot Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Distribusi bobot seluruh responsibility
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rata-rata Realisasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">91.2%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dari total target yang ditetapkan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Data sudah dimonitor dan diinput
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
