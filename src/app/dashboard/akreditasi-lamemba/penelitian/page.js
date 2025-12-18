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
import { Plus, Search, Download, Upload, Microscope } from "lucide-react";
import TableKriteriaData from "@/components/AkreditasiLamemba/table-kriteria-data";
import AddKriteriaDialog from "@/components/AkreditasiLamemba/add-kriteria-dialog";
import { toast } from "sonner";

export default function PenelitianPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    toast.success("Data berhasil ditambahkan");
  };

  const kriteriaInfo = {
    title: "Penelitian, Pelayanan/Pengabdian kepada Masyarakat, dan Kerjasama",
    description:
      "Database penelitian, pengabdian masyarakat, dan kerjasama institusi",
    icon: Microscope,
    columns: [
      { key: "judul", label: "Judul/Nama Kegiatan", type: "text" },
      {
        key: "kategori",
        label: "Kategori",
        type: "select",
        options: [
          "Penelitian",
          "Pengabdian Masyarakat",
          "Kerjasama",
          "Publikasi",
          "HKI",
        ],
      },
      { key: "tahun", label: "Tahun", type: "number" },
      { key: "ketua", label: "Ketua/PIC", type: "text" },
      { key: "keterangan", label: "Keterangan", type: "textarea" },
    ],
    mockData: [
      {
        id: 1,
        judul: "Analisis Dampak Digital Marketing terhadap UMKM",
        kategori: "Penelitian",
        tahun: 2024,
        ketua: "Dr. Ahmad Santoso, M.M.",
        keterangan: "Hibah penelitian internal, publikasi Sinta 2",
        tanggalUpload: "2024-02-15",
        uploadedBy: "LPPM",
      },
      {
        id: 2,
        judul: "Pelatihan Manajemen Keuangan UMKM Desa Sukamaju",
        kategori: "Pengabdian Masyarakat",
        tahun: 2024,
        ketua: "Dr. Rina Wati, M.M.",
        keterangan: "Program PKM dengan mitra desa",
        tanggalUpload: "2024-05-10",
        uploadedBy: "LPPM",
      },
      {
        id: 3,
        judul: "MoU dengan PT Bank Mandiri",
        kategori: "Kerjasama",
        tahun: 2024,
        ketua: "Ketua Program Studi",
        keterangan: "Kerjasama magang dan praktik kerja",
        tanggalUpload: "2024-03-20",
        uploadedBy: "Ketua Prodi",
      },
      {
        id: 4,
        judul: "The Impact of Financial Literacy on Business Performance",
        kategori: "Publikasi",
        tahun: 2024,
        ketua: "Prof. Dr. Siti Rahayu, M.Sc.",
        keterangan: "Publikasi Scopus Q2",
        tanggalUpload: "2024-06-15",
        uploadedBy: "LPPM",
      },
      {
        id: 5,
        judul: "Aplikasi Mobile Manajemen Keuangan Pribadi",
        kategori: "HKI",
        tahun: 2024,
        ketua: "Dr. Budi Hartono, M.Kom.",
        keterangan: "Hak Cipta terdaftar di DJKI",
        tanggalUpload: "2024-08-25",
        uploadedBy: "LPPM",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <kriteriaInfo.icon className="h-8 w-8" />
            Penelitian & Pengabdian
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
          <CardTitle>Database Penelitian & Pengabdian</CardTitle>
          <CardDescription>
            Kelola data penelitian, pengabdian, dan kerjasama
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari judul atau kategori..."
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
