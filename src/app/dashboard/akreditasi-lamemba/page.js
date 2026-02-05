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
import { Plus, Search, Download, Upload, FileText, Target, Shield, Users, GraduationCap, BookOpen, Wallet, FlaskConical, ArrowRight } from "lucide-react";
import TableAkreditasiLamemba from "@/components/AkreditasiLamemba/table-akreditasi";
import AddAkreditasiDialog from "@/components/AkreditasiLamemba/add-akreditasi";
import { toast } from "sonner";

export default function AkreditasiLamembaPage() {
  const router = useRouter();
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

  const kriteriaPenilaian = [
    {
      id: 1,
      title: "Visi, Misi, Tujuan dan Sasaran",
      description: "Dokumentasi visi, misi, tujuan, dan sasaran program studi",
      icon: Target,
      path: "/dashboard/akreditasi-lamemba/visi-misi",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950",
    },
    {
      id: 2,
      title: "Tata Pamong & Kepemimpinan",
      description: "Sistem tata pamong, kepemimpinan, dan penjaminan mutu",
      icon: Shield,
      path: "/dashboard/akreditasi-lamemba/tata-pamong",
      color: "bg-green-50 text-green-600 dark:bg-green-950",
    },
    {
      id: 3,
      title: "Mahasiswa dan Lulusan",
      description: "Data mahasiswa, lulusan, dan tracer study",
      icon: Users,
      path: "/dashboard/akreditasi-lamemba/mahasiswa-lulusan",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950",
    },
    {
      id: 4,
      title: "Sumber Daya Manusia",
      description: "Data dosen dan tenaga kependidikan",
      icon: GraduationCap,
      path: "/dashboard/akreditasi-lamemba/sdm",
      color: "bg-orange-50 text-orange-600 dark:bg-orange-950",
    },
    {
      id: 5,
      title: "Kurikulum & Pembelajaran",
      description: "Kurikulum, pembelajaran, dan suasana akademik",
      icon: BookOpen,
      path: "/dashboard/akreditasi-lamemba/kurikulum",
      color: "bg-pink-50 text-pink-600 dark:bg-pink-950",
    },
    {
      id: 6,
      title: "Pembiayaan & Sarana Prasarana",
      description: "Data pembiayaan, sarana prasarana, dan sistem informasi",
      icon: Wallet,
      path: "/dashboard/akreditasi-lamemba/pembiayaan",
      color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-950",
    },
    {
      id: 7,
      title: "Penelitian & Pengabdian Masyarakat",
      description: "Data penelitian, pengabdian, dan kerjasama",
      icon: FlaskConical,
      path: "/dashboard/akreditasi-lamemba/penelitian",
      color: "bg-teal-50 text-teal-600 dark:bg-teal-950",
    },
  ];

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

      {/* Database Akreditasi Program Studi */}
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

      {/* Informasi LAMEMBA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informasi Akreditasi LAMEMBA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <p className="font-semibold mb-2">7 Kriteria Penilaian Akreditasi:</p>
            <div className="grid gap-2 mt-3">
              {kriteriaPenilaian.map((kriteria, index) => (
                <div
                  key={kriteria.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => router.push(kriteria.path)}
                >
                  <div className={`p-2 rounded ${kriteria.color}`}>
                    <kriteria.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      Kriteria {index + 1}: {kriteria.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {kriteria.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
