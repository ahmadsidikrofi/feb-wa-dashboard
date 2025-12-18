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
import { Plus, Search, Download, Upload, Target, ArrowLeft } from "lucide-react";
import TableKriteriaData from "@/components/AkreditasiLamemba/table-kriteria-data";
import AddKriteriaDialog from "@/components/AkreditasiLamemba/add-kriteria-dialog";
import { toast } from "sonner";

export default function VisiMisiPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    toast.success("Data berhasil ditambahkan");
  };

  const kriteriaInfo = {
    title: "Visi, Misi, Tujuan dan Sasaran",
    description:
      "Database dokumen dan data terkait visi, misi, tujuan, dan sasaran program studi",
    icon: Target,
    columns: [
      { key: "dokumen", label: "Nama Dokumen", type: "text" },
      { key: "tahun", label: "Tahun", type: "number" },
      {
        key: "jenisDokumen",
        label: "Jenis Dokumen",
        type: "select",
        options: ["Visi", "Misi", "Tujuan", "Sasaran", "Dokumen Pendukung"],
      },
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
        dokumen: "Visi Program Studi Manajemen 2020-2025",
        tahun: 2020,
        jenisDokumen: "Visi",
        status: "Aktif",
        keterangan: "Visi yang sedang berjalan periode 2020-2025",
        tanggalUpload: "2020-01-15",
        uploadedBy: "Admin FEB",
      },
      {
        id: 2,
        dokumen: "Misi Program Studi Manajemen 2020-2025",
        tahun: 2020,
        jenisDokumen: "Misi",
        status: "Aktif",
        keterangan: "Misi yang sedang berjalan periode 2020-2025",
        tanggalUpload: "2020-01-15",
        uploadedBy: "Admin FEB",
      },
      {
        id: 3,
        dokumen: "Tujuan Strategis 2023",
        tahun: 2023,
        jenisDokumen: "Tujuan",
        status: "Aktif",
        keterangan: "Tujuan strategis jangka menengah",
        tanggalUpload: "2023-02-10",
        uploadedBy: "Ketua Prodi",
      },
      {
        id: 4,
        dokumen: "Sasaran Mutu Program Studi 2024",
        tahun: 2024,
        jenisDokumen: "Sasaran",
        status: "Aktif",
        keterangan: "Sasaran mutu tahunan program studi",
        tanggalUpload: "2024-01-05",
        uploadedBy: "Tim Penjamin Mutu",
      },
      {
        id: 5,
        dokumen: "Dokumen Renstra 2020-2025",
        tahun: 2020,
        jenisDokumen: "Dokumen Pendukung",
        status: "Aktif",
        keterangan: "Rencana strategis sebagai dokumen pendukung",
        tanggalUpload: "2020-03-01",
        uploadedBy: "Dekan FEB",
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
