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
import { Plus, Search, Download, Upload, FileText } from "lucide-react";
import TableAkreditasiLamemba from "@/components/AkreditasiLamemba/table-akreditasi";
import AddAkreditasiDialog from "@/components/AkreditasiLamemba/add-akreditasi";
import { toast } from "sonner";

export default function AkreditasiLamembaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    toast.success("Data akreditasi berhasil ditambahkan");
  };

  const handleExport = () => {
    toast.info("Fitur export sedang dalam pengembangan");
  };

  const handleImport = () => {
    toast.info("Fitur import sedang dalam pengembangan");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Akreditasi LAMEMBA
          </h1>
          <p className="text-muted-foreground">
            Database akreditasi program studi LAMEMBA di universitas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
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
          <CardTitle>Database Akreditasi Program Studi</CardTitle>
          <CardDescription>
            Kelola dan pantau data akreditasi program studi untuk keperluan
            LAMEMBA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari program studi, fakultas, atau nomor SK..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TableAkreditasiLamemba
            searchQuery={searchQuery}
            refreshTrigger={refreshTrigger}
            onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
          />
        </CardContent>
      </Card>

      <AddAkreditasiDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informasi Akreditasi LAMEMBA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <p className="font-semibold mb-2">Tentang LAMEMBA:</p>
            <p className="text-muted-foreground leading-relaxed">
              Lembaga Akreditasi Mandiri Ekonomi, Manajemen, Bisnis, dan
              Akuntansi (LAMEMBA) adalah lembaga akreditasi yang menilai dan
              memberikan status akreditasi kepada program studi di bidang
              ekonomi, manajemen, bisnis, dan akuntansi di Indonesia.
            </p>
          </div>
          <div className="text-sm">
            <p className="font-semibold mb-2">Kriteria Penilaian:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Visi, Misi, Tujuan dan Sasaran</li>
              <li>
                Tata Pamong, Kepemimpinan, Sistem Pengelolaan, dan Penjaminan
                Mutu
              </li>
              <li>Mahasiswa dan Lulusan</li>
              <li>Sumber Daya Manusia</li>
              <li>Kurikulum, Pembelajaran, dan Suasana Akademik</li>
              <li>Pembiayaan, Sarana dan Prasarana, serta Sistem Informasi</li>
              <li>
                Penelitian, Pelayanan/Pengabdian kepada Masyarakat, dan
                Kerjasama
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
