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
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Upload, Users } from "lucide-react";
import TableKriteriaData from "@/components/AkreditasiLamemba/table-kriteria-data";
import AddKriteriaDialog from "@/components/AkreditasiLamemba/add-kriteria-dialog";
import { toast } from "sonner";

export default function MahasiswaLulusanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    toast.success("Data berhasil ditambahkan");
  };

  const kriteriaInfo = {
    title: "Mahasiswa dan Lulusan",
    description: "Database data mahasiswa, lulusan, dan tracer study",
    icon: Users,
    columns: [
      { key: "dokumen", label: "Nama Dokumen", type: "text" },
      { key: "tahunAkademik", label: "Tahun Akademik", type: "text" },
      {
        key: "kategori",
        label: "Kategori",
        type: "select",
        options: [
          "Data Mahasiswa",
          "Data Lulusan",
          "Tracer Study",
          "Prestasi",
          "Beasiswa",
        ],
      },
      { key: "jumlah", label: "Jumlah", type: "number" },
      { key: "keterangan", label: "Keterangan", type: "textarea" },
    ],
    mockData: [
      {
        id: 1,
        dokumen: "Data Mahasiswa Aktif 2024/2025",
        tahunAkademik: "2024/2025",
        kategori: "Data Mahasiswa",
        jumlah: 450,
        keterangan: "Data mahasiswa aktif semester ganjil",
        tanggalUpload: "2024-09-01",
        uploadedBy: "Admin Akademik",
      },
      {
        id: 2,
        dokumen: "Data Lulusan 2023",
        tahunAkademik: "2023",
        kategori: "Data Lulusan",
        jumlah: 125,
        keterangan: "Wisudawan angkatan 2019",
        tanggalUpload: "2023-12-15",
        uploadedBy: "Koordinator Akademik",
      },
      {
        id: 3,
        dokumen: "Laporan Tracer Study 2024",
        tahunAkademik: "2024",
        kategori: "Tracer Study",
        jumlah: 98,
        keterangan: "Responden dari lulusan 2022",
        tanggalUpload: "2024-06-20",
        uploadedBy: "Tim Career Center",
      },
      {
        id: 4,
        dokumen: "Rekapitulasi Prestasi Mahasiswa 2024",
        tahunAkademik: "2024",
        kategori: "Prestasi",
        jumlah: 35,
        keterangan: "Prestasi tingkat nasional dan internasional",
        tanggalUpload: "2024-11-10",
        uploadedBy: "Kemahasiswaan",
      },
      {
        id: 5,
        dokumen: "Penerima Beasiswa 2024/2025",
        tahunAkademik: "2024/2025",
        kategori: "Beasiswa",
        jumlah: 75,
        keterangan: "Beasiswa dari berbagai sumber",
        tanggalUpload: "2024-10-05",
        uploadedBy: "Bagian Kemahasiswaan",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <kriteriaInfo.icon className="h-8 w-8" />
            {kriteriaInfo.title}
          </h1>
          <p className="text-muted-foreground">{kriteriaInfo.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Data
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Dokumen</CardTitle>
          <CardDescription>
            Kelola dokumen dan data terkait kriteria ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari dokumen..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TableKriteriaData
            data={kriteriaInfo.mockData}
            columns={kriteriaInfo.columns}
            searchQuery={searchQuery}
            refreshTrigger={refreshTrigger}
            onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
          />
        </CardContent>
      </Card>

      <AddKriteriaDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
        columns={kriteriaInfo.columns}
        title={kriteriaInfo.title}
      />
    </div>
  );
}
