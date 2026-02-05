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
import { Plus, Search, Download, Upload, UserCheck } from "lucide-react";
import TableKriteriaData from "@/components/AkreditasiLamemba/table-kriteria-data";
import AddKriteriaDialog from "@/components/AkreditasiLamemba/add-kriteria-dialog";
import { toast } from "sonner";

export default function SDMPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    toast.success("Data berhasil ditambahkan");
  };

  const kriteriaInfo = {
    title: "Sumber Daya Manusia",
    description:
      "Database data dosen, tenaga kependidikan, dan pengembangan SDM",
    icon: UserCheck,
    columns: [
      { key: "nama", label: "Nama", type: "text" },
      {
        key: "kategori",
        label: "Kategori",
        type: "select",
        options: [
          "Dosen Tetap",
          "Dosen Tidak Tetap",
          "Tenaga Kependidikan",
          "Pengembangan SDM",
        ],
      },
      { key: "jabatan", label: "Jabatan/Posisi", type: "text" },
      {
        key: "pendidikan",
        label: "Pendidikan",
        type: "select",
        options: ["S1", "S2", "S3", "Profesor"],
      },
      { key: "keterangan", label: "Keterangan", type: "textarea" },
    ],
    mockData: [
      {
        id: 1,
        nama: "Dr. Ahmad Santoso, M.M.",
        kategori: "Dosen Tetap",
        jabatan: "Ketua Program Studi",
        pendidikan: "S3",
        keterangan: "Bidang keahlian: Manajemen Strategis",
        tanggalUpload: "2024-01-10",
        uploadedBy: "Admin SDM",
      },
      {
        id: 2,
        nama: "Prof. Dr. Siti Rahayu, M.Sc.",
        kategori: "Dosen Tetap",
        jabatan: "Guru Besar",
        pendidikan: "Profesor",
        keterangan: "Bidang keahlian: Akuntansi Keuangan",
        tanggalUpload: "2024-01-10",
        uploadedBy: "Admin SDM",
      },
      {
        id: 3,
        nama: "Budi Hartono, S.Kom.",
        kategori: "Tenaga Kependidikan",
        jabatan: "Staf IT",
        pendidikan: "S1",
        keterangan: "Mengelola sistem informasi prodi",
        tanggalUpload: "2024-02-15",
        uploadedBy: "Admin SDM",
      },
      {
        id: 4,
        nama: "Dr. Rina Wati, M.M.",
        kategori: "Dosen Tidak Tetap",
        jabatan: "Dosen Luar Biasa",
        pendidikan: "S3",
        keterangan: "Praktisi dari industri perbankan",
        tanggalUpload: "2024-03-20",
        uploadedBy: "Koordinator Akademik",
      },
      {
        id: 5,
        nama: "Pelatihan Pedagogik 2024",
        kategori: "Pengembangan SDM",
        jabatan: "-",
        pendidikan: "-",
        keterangan: "Workshop metode pembelajaran inovatif",
        tanggalUpload: "2024-07-10",
        uploadedBy: "LPM",
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
          <CardTitle>Database SDM</CardTitle>
          <CardDescription>
            Kelola data dosen dan tenaga kependidikan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau kategori..."
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
