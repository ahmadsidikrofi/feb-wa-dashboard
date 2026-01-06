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
import { ArrowLeft, Search, Download, GraduationCap, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DataDosenPage() {
  const router = useRouter();
  const [dosenData, setDosenData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProdi, setFilterProdi] = useState("all");
  const [filterPendidikan, setFilterPendidikan] = useState("all");

  // Fetch data from API
  useEffect(() => {
    const fetchDosen = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lecturers`, {
          headers: {
            "ngrok-skip-browser-warning": true,
          },
        });

        if (res.data?.success) {
          setDosenData(res.data.data || []);
        }
      } catch (error) {
        console.error("Gagal fetch data dosen:", error);
        setDosenData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDosen();
  }, []);

  // Get unique prodi and pendidikan values
  const prodiList = [...new Set(dosenData.map((d) => d.prodi))].filter(Boolean);
  const pendidikanList = [...new Set(dosenData.map((d) => d.education))].filter(Boolean);

  // Calculate stats
  const totalDosen = dosenData.length;
  const dosenS3 = dosenData.filter((d) => d.education === "S3").length;
  const dosenS2 = dosenData.filter((d) => d.education === "S2").length;
  const dosenDr = dosenData.filter((d) => d.frontTitle && d.frontTitle.includes("Dr")).length;

  // Filter data
  const filteredData = dosenData.filter((dosen) => {
    const fullName = `${dosen.frontTitle || ""} ${dosen.name || ""} ${dosen.backTitle || ""}`.trim();
    const matchSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dosen.nip?.includes(searchQuery) ||
      dosen.lecturerCode?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProdi = filterProdi === "all" || dosen.prodi === filterProdi;
    const matchPendidikan = filterPendidikan === "all" || dosen.education === filterPendidikan;

    return matchSearch && matchProdi && matchPendidikan;
  });

  const handleExport = () => {
    // Logic to export data
    alert("Export data dosen ke CSV");
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
          <h1 className="text-3xl font-bold">Data Dosen</h1>
          <p className="text-muted-foreground mt-2">
            Data lengkap dosen dan pengajar Fakultas Ekonomi dan Bisnis
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
              Total Dosen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{totalDosen}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendidikan S3
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dosenS3}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((dosenS3 / totalDosen) * 100).toFixed(1)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendidikan S2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dosenS2}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((dosenS2 / totalDosen) * 100).toFixed(1)}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gelar Doktor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dosenDr}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((dosenDr / totalDosen) * 100).toFixed(1)}% dari total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Dosen</CardTitle>
          <CardDescription>
            Menampilkan {filteredData.length} dari {totalDosen} dosen
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari nama, NIP, atau kode dosen..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterProdi} onValueChange={setFilterProdi}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Semua Prodi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prodi</SelectItem>
                {prodiList.map((prodi) => (
                  <SelectItem key={prodi} value={prodi}>
                    {prodi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPendidikan} onValueChange={setFilterPendidikan}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Semua Pendidikan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pendidikan</SelectItem>
                {pendidikanList.map((pend) => (
                  <SelectItem key={pend} value={pend}>
                    {pend}
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
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Prodi</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Pendidikan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Tidak ada data dosen ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((dosen, index) => (
                    <TableRow key={dosen.id || index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-mono text-sm">{dosen.nip || "-"}</TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {dosen.frontTitle && <span>{dosen.frontTitle} </span>}
                          {dosen.name || "-"}
                          {dosen.backTitle && <span>, {dosen.backTitle}</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{dosen.prodi || "-"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{dosen.lecturerCode || "-"}</Badge>
                      </TableCell>
                      <TableCell>
                        {dosen.education ? (
                          <Badge
                            variant={dosen.education === "S3" ? "default" : "secondary"}
                          >
                            {dosen.education}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
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
