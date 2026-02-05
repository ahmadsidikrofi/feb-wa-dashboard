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
import { Plus, Search, Download, Upload, BookOpen } from "lucide-react";
import TableKriteriaData from "@/components/AkreditasiLamemba/table-kriteria-data";
import AddKriteriaDialog from "@/components/AkreditasiLamemba/add-kriteria-dialog";
import { toast } from "sonner";

export default function KurikulumPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    toast.success("Data berhasil ditambahkan");
  };

  const kriteriaInfo = {
    title: "Kurikulum, Pembelajaran, dan Suasana Akademik",
    description: "Database dokumen kurikulum, RPS, dan metode pembelajaran",
    icon: BookOpen,
    columns: [
      { key: "dokumen", label: "Nama Dokumen", type: "text" },
      {
        key: "kategori",
        label: "Kategori",
        type: "select",
        options: [
          "Kurikulum",
          "RPS",
          "Silabus",
          "Metode Pembelajaran",
          "Evaluasi",
        ],
      },
      { key: "kode", label: "Kode Mata Kuliah", type: "text" },
      { key: "sks", label: "SKS", type: "number" },
      { key: "keterangan", label: "Keterangan", type: "textarea" },
    ],
    mockData: [
      {
        id: 1,
        dokumen: "Kurikulum 2024 Program Studi Manajemen",
        kategori: "Kurikulum",
        kode: "-",
        sks: 144,
        keterangan: "Kurikulum berbasis KKNI dan MBKM",
        tanggalUpload: "2024-01-05",
        uploadedBy: "Ketua Prodi",
      },
      {
        id: 2,
        dokumen: "RPS Manajemen Strategis",
        kategori: "RPS",
        kode: "MNJ301",
        sks: 3,
        keterangan: "Semester 5, wajib prodi",
        tanggalUpload: "2024-08-15",
        uploadedBy: "Dr. Ahmad Santoso",
      },
      {
        id: 3,
        dokumen: "RPS Akuntansi Keuangan Lanjutan",
        kategori: "RPS",
        kode: "AKT401",
        sks: 3,
        keterangan: "Semester 7, wajib prodi",
        tanggalUpload: "2024-08-16",
        uploadedBy: "Prof. Dr. Siti Rahayu",
      },
      {
        id: 4,
        dokumen: "Panduan Pembelajaran Berbasis Proyek",
        kategori: "Metode Pembelajaran",
        kode: "-",
        sks: 0,
        keterangan: "Panduan project-based learning",
        tanggalUpload: "2024-03-10",
        uploadedBy: "Tim Kurikulum",
      },
      {
        id: 5,
        dokumen: "Evaluasi Pembelajaran Semester Genap 2023/2024",
        kategori: "Evaluasi",
        kode: "-",
        sks: 0,
        keterangan: "Hasil evaluasi dari mahasiswa dan peer review",
        tanggalUpload: "2024-07-20",
        uploadedBy: "Tim Penjamin Mutu",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <kriteriaInfo.icon className="h-8 w-8" />
            Kurikulum & Pembelajaran
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
            Kelola dokumen kurikulum dan pembelajaran
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari dokumen atau mata kuliah..."
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
