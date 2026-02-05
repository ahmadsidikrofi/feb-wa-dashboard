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
import { Plus, Search, Download, Upload, Lightbulb } from "lucide-react";
import TableKriteriaData from "@/components/AkreditasiLamemba/table-kriteria-data";
import AddKriteriaDialog from "@/components/AkreditasiLamemba/add-kriteria-dialog";
import { toast } from "sonner";

export default function StrategicManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    toast.success("Data berhasil ditambahkan");
  };

  const kriteriaInfo = {
    title: "Strategic Management & Innovation",
    description:
      "Database dokumen strategi, inovasi, dan perencanaan program studi",
    icon: Lightbulb,
    columns: [
      { key: "dokumen", label: "Nama Dokumen", type: "text" },
      { key: "tahun", label: "Tahun", type: "number" },
      {
        key: "kategori",
        label: "Kategori",
        type: "select",
        options: [
          "Strategic Plan",
          "Innovation Initiative",
          "Impact Assessment",
          "Mission Statement",
          "Action Plan",
        ],
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Completed", "In Progress", "Planned"],
      },
      { key: "keterangan", label: "Keterangan", type: "textarea" },
    ],
    mockData: [
      {
        id: 1,
        dokumen: "Strategic Plan 2024-2029",
        tahun: 2024,
        kategori: "Strategic Plan",
        status: "In Progress",
        keterangan: "Rencana strategis 5 tahun untuk akreditasi AACSB",
        tanggalUpload: "2024-01-15",
        uploadedBy: "Strategic Planning Team",
      },
      {
        id: 2,
        dokumen: "Innovation in Digital Learning",
        tahun: 2024,
        kategori: "Innovation Initiative",
        status: "In Progress",
        keterangan: "Implementasi pembelajaran digital inovatif",
        tanggalUpload: "2024-03-20",
        uploadedBy: "Academic Innovation Team",
      },
      {
        id: 3,
        dokumen: "Mission Statement Revision",
        tahun: 2023,
        kategori: "Mission Statement",
        status: "Completed",
        keterangan: "Revisi misi untuk alignment dengan AACSB standards",
        tanggalUpload: "2023-11-10",
        uploadedBy: "Dean Office",
      },
      {
        id: 4,
        dokumen: "Impact Assessment Report 2023",
        tahun: 2023,
        kategori: "Impact Assessment",
        status: "Completed",
        keterangan: "Penilaian dampak program terhadap stakeholders",
        tanggalUpload: "2023-12-15",
        uploadedBy: "Quality Assurance Team",
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
            Kelola dokumen strategi dan inovasi untuk AACSB
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
