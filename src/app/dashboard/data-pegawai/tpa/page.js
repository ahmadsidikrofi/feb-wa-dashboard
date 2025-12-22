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
import { ArrowLeft, Search, Download, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data from CSV - all entries
const tpaData = [
  { no: 1, nama: "Alfi Inayati S.Pd", nip: "22970021", lokasiKerja: "Urusan Sekretariat", status: "TPA Profesional Full Time" },
  { no: 2, nama: "Asep Sudrajat S.Kom.", nip: "15840035", lokasiKerja: "Kepala Urusan Laboratorium/Bengkel/Studio", status: "TPA Pegawai Tetap" },
  { no: 3, nama: "Astri Anggelia S.E.", nip: "21840003", lokasiKerja: "Prodi S3 Manajemen", status: "TPA Pegawai Tetap" },
  { no: 4, nama: "Aulia Ferina Sendhitasari S.Kom", nip: "23990038", lokasiKerja: "Prodi S1 Bisnis Digital", status: "TPA Profesional Full Time" },
  { no: 5, nama: "Azam Fhadillah Mulki S. T", nip: "62400039", lokasiKerja: "Prodi S2 Akuntansi", status: "TPA Profesional Full Time" },
  { no: 6, nama: "Desma Luluk Arianti S.Pi.", nip: "62498040", lokasiKerja: "Urusan Akademik", status: "TPA Profesional Full Time" },
  { no: 7, nama: "Enung Muhaemi", nip: "1710044", lokasiKerja: "Prodi S1 Akuntansi", status: "TPA Pegawai Tetap" },
  { no: 8, nama: "Hani Widianingrum S.Ak.", nip: "23000039", lokasiKerja: "Urusan Akademik", status: "TPA Profesional Full Time" },
  { no: 9, nama: "Harrys Sudarmadji S.M.B.", nip: "19900033", lokasiKerja: "Prodi S1 Manajemen", status: "TPA Pegawai Tetap" },
  { no: 10, nama: "Imas Maesyaroh A.Md.", nip: "19800005", lokasiKerja: "Urusan Akademik", status: "TPA Pegawai Tetap" },
  { no: 11, nama: "Indra Gunawan S.Kom.", nip: "12830015", lokasiKerja: "Kepala Urusan Kemahasiswaan", status: "TPA Pegawai Tetap" },
  { no: 12, nama: "Irwan Mulyawan S.Pd.", nip: "15820076", lokasiKerja: "Urusan Kemahasiswaan", status: "TPA Pegawai Tetap" },
  { no: 13, nama: "Ismaya Indrayanti S. A. B", nip: "22970019", lokasiKerja: "Prodi S1 Administrasi Bisnis", status: "TPA Profesional Full Time" },
  { no: 14, nama: "Kharisma Ellyana S.M.B.", nip: "15850073", lokasiKerja: "Urusan Kemahasiswaan", status: "TPA Pegawai Tetap" },
  { no: 15, nama: "Khoerunisa Mubarrokah Kusumawardhani S.Pd", nip: "62498041", lokasiKerja: "Prodi S2 Manajemen", status: "TPA Profesional Full Time" },
  { no: 16, nama: "Mesayu Ana Hanifah Yahsallah S.H.", nip: "23940021", lokasiKerja: "Urusan Sumber Daya Manusia dan Keuangan", status: "TPA Pegawai Tetap" },
  { no: 17, nama: "Mohammad Tyas Pawitra S.M.B.", nip: "15870055", lokasiKerja: "Kepala Urusan Sekretariat", status: "TPA Pegawai Tetap" },
  { no: 18, nama: "Muhamad Ramadhan S. E", nip: "23910010", lokasiKerja: "Urusan Akademik", status: "TPA Profesional Full Time" },
  { no: 19, nama: "Muhammad Farhan Ramadhan S.Pd", nip: "23990037", lokasiKerja: "Prodi S2 Manajemen", status: "TPA Profesional Full Time" },
  { no: 20, nama: "Nathaleo Michel Apon S.T.", nip: "12830063", lokasiKerja: "Kepala Urusan Sumber Daya Manusia dan Keuangan", status: "TPA Pegawai Tetap" },
  { no: 21, nama: "Nensi Damayanti S.S.", nip: "15860094", lokasiKerja: "Urusan Laboratorium/Bengkel/Studio", status: "TPA Pegawai Tetap" },
  { no: 22, nama: "Puji Adhiayati S.KM", nip: "62497042", lokasiKerja: "Prodi S2 Administrasi Bisnis", status: "TPA Profesional Full Time" },
  { no: 23, nama: "Ratih Raihun Raihanun S.T., M.T.", nip: "22000009", lokasiKerja: "Urusan Sumber Daya Manusia dan Keuangan", status: "TPA Profesional Full Time" },
  { no: 24, nama: "Sela Garnita S.M.", nip: "22950037", lokasiKerja: "Prodi S2 Manajemen PJJ", status: "TPA Profesional Full Time" },
  { no: 25, nama: "Setiadi S.Kom.", nip: "15860072", lokasiKerja: "Kepala Urusan Akademik", status: "TPA Pegawai Tetap" },
  { no: 26, nama: "Shinta Sekaring Wijiutami S.M.", nip: "23950041", lokasiKerja: "Prodi S1 Manajemen Bisnis Rekreasi", status: "TPA Pegawai Tetap" },
  { no: 27, nama: "Ahmad Sidik Rofiudin S.Kom", nip: "82501081", lokasiKerja: "Urusan Sekretariat", status: "TLH" },
  { no: 28, nama: "Ansari Siddieqi Yustia S.Kom.", nip: "82497100", lokasiKerja: "Urusan Kemahasiswaan", status: "TLH" },
  { no: 29, nama: "Dara Dhenissa Herman S.Sos.", nip: "82502079", lokasiKerja: "Prodi S1 Manajemen (Inter)", status: "TLH" },
];

export default function DataTPAPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLokasi, setFilterLokasi] = useState("all");

  // Get unique values
  const statusList = [...new Set(tpaData.map((d) => d.status))];
  const lokasiList = [...new Set(tpaData.map((d) => d.lokasiKerja))];

  // Calculate stats
  const totalTPA = tpaData.length;
  const pegawaiTetap = tpaData.filter((d) => d.status === "TPA Pegawai Tetap").length;
  const profesional = tpaData.filter((d) => d.status === "TPA Profesional Full Time").length;
  const tlh = tpaData.filter((d) => d.status === "TLH").length;

  // Filter data
  const filteredData = tpaData.filter((tpa) => {
    const matchSearch =
      tpa.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpa.nip.includes(searchQuery) ||
      tpa.lokasiKerja.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || tpa.status === filterStatus;
    const matchLokasi = filterLokasi === "all" || tpa.lokasiKerja === filterLokasi;

    return matchSearch && matchStatus && matchLokasi;
  });

  const handleExport = () => {
    // Logic to export data
    alert("Export data TPA ke CSV");
  };

  const getStatusBadge = (status) => {
    if (status === "TPA Pegawai Tetap") {
      return <Badge variant="default">Pegawai Tetap</Badge>;
    } else if (status === "TPA Profesional Full Time") {
      return <Badge variant="secondary">Profesional</Badge>;
    } else {
      return <Badge variant="outline">TLH</Badge>;
    }
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
                  filteredData.map((tpa) => (
                    <TableRow key={tpa.no}>
                      <TableCell>{tpa.no}</TableCell>
                      <TableCell className="font-mono text-sm">{tpa.nip}</TableCell>
                      <TableCell>
                        <div className="font-medium">{tpa.nama}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{tpa.lokasiKerja}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(tpa.status)}</TableCell>
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
