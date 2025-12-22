"use client";

import { useState } from "react";
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
import { ArrowLeft, Search, Download, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data from CSV - first 50 entries as sample
const dosenData = [
  { no: 1, nip: "23660002", nama: "A. Mukti Soma", gelarDepan: "Dr. Ir.", gelarBelakang: "M.M.", prodi: "S2 MAN", kodeDosen: "DUL", pendidikan: "S3" },
  { no: 2, nip: "02760025", nama: "Abdullah", gelarDepan: "", gelarBelakang: "S.Pd., M.M.", prodi: "S1 MAN", kodeDosen: "DLL", pendidikan: "" },
  { no: 3, nip: "23890007", nama: "Abdurrahman Faris Indriya Himawan", gelarDepan: "", gelarBelakang: "S.E., M.SM., Ph.D.", prodi: "S1 MAN", kodeDosen: "MWN", pendidikan: "S3" },
  { no: 4, nip: "91660037", nama: "Ade Irma Susanty", gelarDepan: "", gelarBelakang: "M.M., Ph.D.", prodi: "S1 ADBIS", kodeDosen: "NTY", pendidikan: "S3" },
  { no: 5, nip: "10730006", nama: "Adhi Prasetio", gelarDepan: "Dr.", gelarBelakang: "S.T., M.M.", prodi: "S1 MAN", kodeDosen: "AHP", pendidikan: "S3" },
  { no: 6, nip: "24880006", nama: "Adi Santoso", gelarDepan: "Dr.", gelarBelakang: "SE., MM., CMA.", prodi: "S1 MAN", kodeDosen: "DST", pendidikan: "S3" },
  { no: 7, nip: "14720030", nama: "Aditya Wardhana", gelarDepan: "", gelarBelakang: "S.E.,M.Si.,M.M", prodi: "S1 ADBIS", kodeDosen: "ADT", pendidikan: "" },
  { no: 8, nip: "14680034", nama: "Agus Maolana Hidayat", gelarDepan: "Dr.", gelarBelakang: "S.E.,M.Si", prodi: "S1 ADBIS", kodeDosen: "AUM", pendidikan: "S3" },
  { no: 9, nip: "23940016", nama: "Ajeng Luthfiyatul Farida", gelarDepan: "", gelarBelakang: "S.E., M.Akun", prodi: "S1 AKUN", kodeDosen: "AJF", pendidikan: "" },
  { no: 10, nip: "22670001", nama: "Akhmad Yunani", gelarDepan: "Dr.", gelarBelakang: "S.E., M.T", prodi: "S1 ADBIS", kodeDosen: "AKU", pendidikan: "S3" },
  { no: 11, nip: "23740003", nama: "Aldi Akbar", gelarDepan: "", gelarBelakang: "A.T.,M.M", prodi: "S1 ADBIS", kodeDosen: "LDI", pendidikan: "S3" },
  { no: 12, nip: "14870046", nama: "Aldilla Iradianty", gelarDepan: "", gelarBelakang: "S.E., M.M.", prodi: "S1 MAN", kodeDosen: "LDL", pendidikan: "" },
  { no: 13, nip: "92700026", nama: "Alex Winarno", gelarDepan: "Dr", gelarBelakang: "S.T., M.M", prodi: "S1 ADBIS", kodeDosen: "WNO", pendidikan: "S3" },
  { no: 14, nip: "21880008", nama: "Ali Riza Fahlevi", gelarDepan: "", gelarBelakang: "S.E., Ak., M.Acc., CA.", prodi: "S1 AKUN", kodeDosen: "AFV", pendidikan: "" },
  { no: 15, nip: "08860064", nama: "Andrieta Shintia Dewi", gelarDepan: "", gelarBelakang: "S.Pd., M.M.", prodi: "S1 MAN", kodeDosen: "TSD", pendidikan: "S3" },
  { no: 16, nip: "13710043", nama: "Andry Alamsyah", gelarDepan: "Dr.", gelarBelakang: "S.Si., M.Sc.", prodi: "S1 MAN", kodeDosen: "YAL", pendidikan: "S3" },
  { no: 17, nip: "14870053", nama: "Anisah Firli", gelarDepan: "Dr.", gelarBelakang: "S.M.B., M.M.", prodi: "S2 MAN PJJ", kodeDosen: "NFY", pendidikan: "S3" },
  { no: 18, nip: "12770068", nama: "Anita Silvianita", gelarDepan: "", gelarBelakang: "S.E., M.S.M., Ph.D", prodi: "S2 ADBIS", kodeDosen: "AVA", pendidikan: "S3" },
  { no: 19, nip: "15890059", nama: "Annisa Nurbaiti", gelarDepan: "", gelarBelakang: "S.E., M.Si.", prodi: "S1 AKUN", kodeDosen: "NBT", pendidikan: "" },
  { no: 20, nip: "23730002", nama: "Anton Mulyono Azis", gelarDepan: "Dr.", gelarBelakang: "S.E., M.T.", prodi: "S2 MAN PJJ", kodeDosen: "AYZ", pendidikan: "S3" },
];

export default function DataDosenPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProdi, setFilterProdi] = useState("all");
  const [filterPendidikan, setFilterPendidikan] = useState("all");

  // Get unique prodi and pendidikan values
  const prodiList = [...new Set(dosenData.map((d) => d.prodi))].filter(Boolean);
  const pendidikanList = [...new Set(dosenData.map((d) => d.pendidikan))].filter(Boolean);

  // Calculate stats
  const totalDosen = dosenData.length;
  const dosenS3 = dosenData.filter((d) => d.pendidikan === "S3").length;
  const dosenS2 = dosenData.filter((d) => d.pendidikan !== "S3" && d.pendidikan).length;
  const dosenDr = dosenData.filter((d) => d.gelarDepan && d.gelarDepan.includes("Dr")).length;

  // Filter data
  const filteredData = dosenData.filter((dosen) => {
    const matchSearch =
      dosen.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dosen.nip.includes(searchQuery) ||
      dosen.kodeDosen.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProdi = filterProdi === "all" || dosen.prodi === filterProdi;
    const matchPendidikan = filterPendidikan === "all" || dosen.pendidikan === filterPendidikan;

    return matchSearch && matchProdi && matchPendidikan;
  });

  const handleExport = () => {
    // Logic to export data
    alert("Export data dosen ke CSV");
  };

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
                  filteredData.map((dosen) => (
                    <TableRow key={dosen.no}>
                      <TableCell>{dosen.no}</TableCell>
                      <TableCell className="font-mono text-sm">{dosen.nip}</TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {dosen.gelarDepan && <span>{dosen.gelarDepan} </span>}
                          {dosen.nama}
                          {dosen.gelarBelakang && <span>, {dosen.gelarBelakang}</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{dosen.prodi}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{dosen.kodeDosen}</Badge>
                      </TableCell>
                      <TableCell>
                        {dosen.pendidikan ? (
                          <Badge
                            variant={dosen.pendidikan === "S3" ? "default" : "secondary"}
                          >
                            {dosen.pendidikan}
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
