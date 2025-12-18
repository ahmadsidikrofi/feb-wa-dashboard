"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Upload, Banknote, ArrowLeft } from "lucide-react";
import TableKriteriaData from "@/components/AkreditasiLamemba/table-kriteria-data";
import AddKriteriaDialog from "@/components/AkreditasiLamemba/add-kriteria-dialog";
import { toast } from "sonner";

export default function PembiayaanPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    toast.success("Data berhasil ditambahkan");
  };

  const kriteriaInfo = {
    title: "Pembiayaan, Sarana dan Prasarana, serta Sistem Informasi",
    description: "Database anggaran, fasilitas, dan sistem informasi prodi",
    icon: Banknote,
    columns: [
      { key: "item", label: "Item", type: "text" },
      {
        key: "kategori",
        label: "Kategori",
        type: "select",
        options: [
          "Pembiayaan",
          "Sarana",
          "Prasarana",
          "Sistem Informasi",
          "Laboratorium",
        ],
      },
      { key: "tahunAnggaran", label: "Tahun Anggaran", type: "number" },
      { key: "nilai", label: "Nilai (Rp)", type: "number" },
      { key: "keterangan", label: "Keterangan", type: "textarea" },
    ],
    mockData: [
      {
        id: 1,
        item: "Anggaran Operasional Program Studi 2024",
        kategori: "Pembiayaan",
        tahunAnggaran: 2024,
        nilai: 500000000,
        keterangan: "Anggaran untuk kegiatan operasional tahunan",
        tanggalUpload: "2024-01-10",
        uploadedBy: "Bendahara Prodi",
      },
      {
        id: 2,
        item: "Laboratorium Komputer",
        kategori: "Laboratorium",
        tahunAnggaran: 2023,
        nilai: 300000000,
        keterangan: "40 unit komputer dengan spesifikasi terbaru",
        tanggalUpload: "2023-08-15",
        uploadedBy: "Kepala Lab",
      },
      {
        id: 3,
        item: "Sistem Informasi Akademik (SIAKAD)",
        kategori: "Sistem Informasi",
        tahunAnggaran: 2024,
        nilai: 150000000,
        keterangan: "Maintenance dan upgrade sistem",
        tanggalUpload: "2024-02-20",
        uploadedBy: "Admin IT",
      },
      {
        id: 4,
        item: "Ruang Kelas Multimedia",
        kategori: "Prasarana",
        tahunAnggaran: 2023,
        nilai: 200000000,
        keterangan: "5 ruang kelas dengan fasilitas multimedia",
        tanggalUpload: "2023-07-10",
        uploadedBy: "Dekan FEB",
      },
      {
        id: 5,
        item: "Perpustakaan Digital",
        kategori: "Sarana",
        tahunAnggaran: 2024,
        nilai: 100000000,
        keterangan: "Langganan e-journal dan e-book",
        tanggalUpload: "2024-03-05",
        uploadedBy: "Kepala Perpustakaan",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/dashboard/akreditasi-lamemba")}
        className="mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Akreditasi LAMEMBA
      </Button>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <kriteriaInfo.icon className="h-8 w-8" />
            Pembiayaan & Sarana Prasarana
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
          <CardTitle>Database Pembiayaan & Fasilitas</CardTitle>
          <CardDescription>
            Kelola data anggaran dan fasilitas prodi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari item atau kategori..."
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
