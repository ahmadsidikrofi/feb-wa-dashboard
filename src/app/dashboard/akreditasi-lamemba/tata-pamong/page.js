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
import { Plus, Search, Download, Upload, Shield } from "lucide-react";
import TableKriteriaData from "@/components/AkreditasiLamemba/table-kriteria-data";
import AddKriteriaDialog from "@/components/AkreditasiLamemba/add-kriteria-dialog";
import { toast } from "sonner";

export default function TataPamongPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    toast.success("Data berhasil ditambahkan");
  };

  const kriteriaInfo = {
    title: "Tata Pamong, Kepemimpinan, Sistem Pengelolaan, dan Penjaminan Mutu",
    description:
      "Database dokumen tata pamong, kepemimpinan, dan sistem penjaminan mutu",
    icon: Shield,
    columns: [
      { key: "dokumen", label: "Nama Dokumen", type: "text" },
      {
        key: "kategori",
        label: "Kategori",
        type: "select",
        options: [
          "Tata Pamong",
          "Kepemimpinan",
          "Sistem Pengelolaan",
          "Penjaminan Mutu",
          "SOP",
        ],
      },
      { key: "nomorDokumen", label: "Nomor Dokumen", type: "text" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Aktif", "Revisi", "Arsip"],
      },
      { key: "keterangan", label: "Keterangan", type: "textarea" },
    ],
    mockData: [
      {
        id: 1,
        dokumen: "Struktur Organisasi Program Studi",
        kategori: "Tata Pamong",
        nomorDokumen: "ORG/PS/2024/001",
        status: "Aktif",
        keterangan: "Struktur organisasi periode 2024",
        tanggalUpload: "2024-01-10",
        uploadedBy: "Ketua Prodi",
      },
      {
        id: 2,
        dokumen: "SK Pengangkatan Ketua Program Studi",
        kategori: "Kepemimpinan",
        nomorDokumen: "SK/FEB/2024/025",
        status: "Aktif",
        keterangan: "SK periode 2024-2028",
        tanggalUpload: "2024-02-01",
        uploadedBy: "Dekan FEB",
      },
      {
        id: 3,
        dokumen: "Manual Mutu Program Studi",
        kategori: "Penjaminan Mutu",
        nomorDokumen: "MM/PS/2023/001",
        status: "Aktif",
        keterangan: "Manual mutu versi 3.0",
        tanggalUpload: "2023-06-15",
        uploadedBy: "Tim Penjamin Mutu",
      },
      {
        id: 4,
        dokumen: "SOP Pembelajaran Daring",
        kategori: "SOP",
        nomorDokumen: "SOP/PS/2023/008",
        status: "Aktif",
        keterangan: "SOP pembelajaran online dan hybrid",
        tanggalUpload: "2023-08-20",
        uploadedBy: "Koordinator Akademik",
      },
      {
        id: 5,
        dokumen: "Sistem Pengelolaan Database Akademik",
        kategori: "Sistem Pengelolaan",
        nomorDokumen: "SIS/PS/2024/003",
        status: "Aktif",
        keterangan: "Panduan pengelolaan SIAKAD",
        tanggalUpload: "2024-03-10",
        uploadedBy: "Admin Prodi",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <kriteriaInfo.icon className="h-8 w-8" />
            Tata Pamong & Penjaminan Mutu
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
