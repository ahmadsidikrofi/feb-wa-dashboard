"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Search, Download, Briefcase, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function DataTPAPage() {
  const router = useRouter();
  const [tpaData, setTpaData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLokasi, setFilterLokasi] = useState("all");

  useEffect(() => {
    const fetchTPA = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/api/staffs`)

        if (res.data?.success) {
          setTpaData(res.data.data || [])
        }
      } catch (error) {
        console.error("Gagal fetch data TPA:", error)
        setTpaData([])
      } finally {
        setIsLoading(false)
      }
    };

    fetchTPA()
  }, [])

  // Get unique values
  const statusList = [...new Set(tpaData.map((d) => d.employmentStatus))].filter(Boolean);
  const lokasiList = [...new Set(tpaData.map((d) => d.workUnit))].filter(Boolean);

  // Calculate stats
  const totalTPA = tpaData.length;
  const pegawaiTetap = tpaData.filter((d) => d.employmentStatus?.includes("Pegawai Tetap")).length;
  const profesional = tpaData.filter((d) => d.employmentStatus?.includes("Profesional")).length;
  const tlh = tpaData.filter((d) => d.employmentStatus === "TLH").length;

  // Filter data
  const filteredData = tpaData.filter((tpa) => {
    const matchSearch =
      tpa.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpa.nip?.includes(searchQuery) ||
      tpa.workUnit?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || tpa.employmentStatus === filterStatus;
    const matchLokasi = filterLokasi === "all" || tpa.workUnit === filterLokasi;

    return matchSearch && matchStatus && matchLokasi;
  });

  const handleExport = () => {
    // Logic to export data
    alert("Export data TPA ke CSV");
  };

  const getStatusBadge = (status) => {
    if (status?.includes("Pegawai Tetap")) {
      return <Badge variant="default">Pegawai Tetap</Badge>;
    } else if (status?.includes("Profesional")) {
      return <Badge variant="secondary">Profesional</Badge>;
    } else if (status === "TLH") {
      return <Badge variant="outline">TLH</Badge>;
    } else {
      return <Badge variant="outline">{status || "-"}</Badge>;
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/data-pegawai")}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold">Data TPA</h1>
          <p className="text-muted-foreground mt-2">
            Data Tenaga Pendukung Akademik Fakultas Ekonomi dan Bisnis
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total TPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{totalTPA}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pegawai Tetap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pegawaiTetap}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((pegawaiTetap / totalTPA) * 100).toFixed(1)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Profesional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profesional}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((profesional / totalTPA) * 100).toFixed(1)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              TLH
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tlh}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((tlh / totalTPA) * 100).toFixed(1)}% dari total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar TPA</CardTitle>
          <CardDescription>
            Menampilkan {filteredData.length} dari {totalTPA} TPA
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nama, NIP, atau lokasi kerja..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {statusList.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterLokasi} onValueChange={setFilterLokasi}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Semua Lokasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Lokasi</SelectItem>
                {lokasiList.map((lokasi) => (
                  <SelectItem key={lokasi} value={lokasi}>
                    {lokasi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Lokasi Kerja</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Tidak ada data TPA ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((tpa, index) => (
                    <TableRow key={tpa.id || index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-mono text-sm">{tpa.nip || "-"}</TableCell>
                      <TableCell>
                        <div className="font-medium">{tpa.name || "-"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{tpa.workUnit || "-"}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(tpa.employmentStatus)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
