"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  CheckCircle2,
  Download,
  ExternalLink,
  Calendar,
  TrendingUp,
  Edit,
  Search,
} from "lucide-react";
import { toast } from "sonner";

// Data dummy untuk indikator laporan fakultas
const indicatorsData = [
  {
    id: 1,
    indikator: "Kepuasan Pengguna Lulusan Program Studi",
    linkEvidence: "kepuasan pengguna lulusan",
    tw1: true,
    tw2: false,
    tw3: false,
    tw4: false,
  },
  {
    id: 2,
    indikator: "Persen Mata kuliah dengan Sertifikasi",
    linkEvidence: "mk sertifikasi dt_feb\ndt mk proses feb",
    tw1: true,
    tw2: false,
    tw3: false,
    tw4: false,
  },
  {
    id: 3,
    indikator: "Persentase Riset 2023 yang upload ke Dataverse",
    linkEvidence: "dataverse\nLaporan",
    tw1: true,
    tw2: false,
    tw3: false,
    tw4: false,
  },
  {
    id: 4,
    indikator: "Jumlah kegiatan pembinaan karakter",
    linkEvidence: "Laporan\npembinaan karakter",
    tw1: true,
    tw2: true,
    tw3: true,
    tw4: false,
  },
  {
    id: 5,
    indikator: "Jumlah Academic Peer Internasional per Dosen",
    linkEvidence: "Academicpeer.xlt",
    tw1: true,
    tw2: false,
    tw3: false,
    tw4: false,
  },
  {
    id: 6,
    indikator: "Perkutaan Dosen DTPS Sesuai Standar Akreditasi Jumlah dan JFA",
    linkEvidence: "Dosen DTPS",
    tw1: true,
    tw2: false,
    tw3: true,
    tw4: false,
  },
  {
    id: 7,
    indikator:
      "Rata-rata Aktivitas LMS pada tiap mata kuliah (untuk TW 2 & TW 4)",
    linkEvidence: "cctve",
    tw1: false,
    tw2: true,
    tw3: false,
    tw4: false,
  },
  {
    id: 8,
    indikator:
      "Persen individu dari Industri yang Hadir berkegiatan di Universitas dibanding jumlah dosen",
    linkEvidence: "individu industri",
    tw1: true,
    tw2: false,
    tw3: true,
    tw4: false,
  },
  {
    id: 9,
    indikator: "Pembentukan Prodi Baru",
    linkEvidence: "prodi baru",
    tw1: true,
    tw2: false,
    tw3: true,
    tw4: false,
  },
  {
    id: 10,
    indikator: "Prodi naik akreditasi",
    linkEvidence: "prodi naik akre",
    tw1: false,
    tw2: false,
    tw3: true,
    tw4: false,
  },
  {
    id: 11,
    indikator: "Pelaksanaan Rencana Kerja Manajerial",
    linkEvidence: "RKM",
    tw1: true,
    tw2: false,
    tw3: true,
    tw4: false,
  },
  {
    id: 12,
    indikator: "Jumlah P1PP Berstatus Open",
    linkEvidence: "P3 & P1PP",
    tw1: true,
    tw2: true,
    tw3: true,
    tw4: false,
  },
  {
    id: 13,
    indikator:
      "Persentase Minimum Responden Tracer Study untuk setiap prodi (Control) (CAE) ka -> fakultas",
    linkEvidence: "Tracer Study",
    tw1: true,
    tw2: false,
    tw3: true,
    tw4: false,
  },
  {
    id: 14,
    indikator:
      "Jumlah Mahasiswa yang ambbound Research based (SPJO) -> fakultas",
    linkEvidence: "mhs asing inbound",
    tw1: true,
    tw2: false,
    tw3: true,
    tw4: false,
  },
  {
    id: 15,
    indikator: "IKU 6: Program Studi Bekerjasama dengan Mitra Kelas Dunia",
    linkEvidence: "IKU 6",
    tw1: true,
    tw2: false,
    tw3: true,
    tw4: false,
  },
  {
    id: 16,
    indikator: "IKU 3: Dosen berkegiatan di luar kampus",
    linkEvidence: "",
    tw1: false,
    tw2: false,
    tw3: true,
    tw4: false,
  },
  {
    id: 17,
    indikator: "IKU 4: Praktek mengajar di dalam kampus",
    linkEvidence: "",
    tw1: false,
    tw2: false,
    tw3: false,
    tw4: false,
  },
];

export default function LaporanManagementPage() {
  const [indicators, setIndicators] = useState(indicatorsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter indicators based on search
  const filteredIndicators = indicators.filter(
    (indicator) =>
      indicator.indikator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      indicator.linkEvidence.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalIndicators = indicators.length;
  const completedTW1 = indicators.filter((i) => i.tw1).length;
  const completedTW2 = indicators.filter((i) => i.tw2).length;
  const completedTW3 = indicators.filter((i) => i.tw3).length;
  const completedTW4 = indicators.filter((i) => i.tw4).length;

  const handleStatusUpdate = (indicatorId, quarter, value) => {
    setIndicators(
      indicators.map((ind) =>
        ind.id === indicatorId ? { ...ind, [quarter]: value } : ind
      )
    );
    toast.success("Status berhasil diperbarui");
  };

  const handleEditIndicator = (indicator) => {
    setSelectedIndicator({ ...indicator });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setIndicators(
      indicators.map((ind) =>
        ind.id === selectedIndicator.id ? selectedIndicator : ind
      )
    );
    setIsEditDialogOpen(false);
    toast.success("Indikator berhasil diperbarui");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#e31e25]">
            Laporan Management
          </h1>
          <p className="text-muted-foreground">
            Monitoring indikator laporan manajemen fakultas per triwulan
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Indikator
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIndicators}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Indikator LAPMAN
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TW 1</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTW1}</div>
            <p className="text-xs text-muted-foreground mt-1">
              dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TW 2</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTW2}</div>
            <p className="text-xs text-muted-foreground mt-1">
              dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TW 3</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTW3}</div>
            <p className="text-xs text-muted-foreground mt-1">
              dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TW 4</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTW4}</div>
            <p className="text-xs text-muted-foreground mt-1">
              dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari indikator atau link evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Indicators Table */}
      <Card>
        <CardHeader>
          <CardTitle>Indikator LAPMAN Fakultas</CardTitle>
          <CardDescription>
            Daftar indikator laporan manajemen dengan status per triwulan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[400px]">
                    Indikator Lapman Fakultas
                  </TableHead>
                  <TableHead className="min-w-[200px]">Link Evidence</TableHead>
                  <TableHead className="text-center">Status TW 1</TableHead>
                  <TableHead className="text-center">Status TW 2</TableHead>
                  <TableHead className="text-center">Status TW 3</TableHead>
                  <TableHead className="text-center">Status TW 4</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIndicators.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-8"
                    >
                      Tidak ada indikator ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIndicators.map((indicator) => (
                    <TableRow key={indicator.id}>
                      <TableCell className="font-medium">
                        {indicator.indikator}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {indicator.linkEvidence.split("\n").map(
                            (link, idx) =>
                              link.trim() && (
                                <a
                                  key={idx}
                                  href="#"
                                  className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                                >
                                  {link.trim()}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={indicator.tw1}
                          onCheckedChange={(checked) =>
                            handleStatusUpdate(indicator.id, "tw1", checked)
                          }
                          className="mx-auto"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={indicator.tw2}
                          onCheckedChange={(checked) =>
                            handleStatusUpdate(indicator.id, "tw2", checked)
                          }
                          className="mx-auto"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={indicator.tw3}
                          onCheckedChange={(checked) =>
                            handleStatusUpdate(indicator.id, "tw3", checked)
                          }
                          className="mx-auto"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={indicator.tw4}
                          onCheckedChange={(checked) =>
                            handleStatusUpdate(indicator.id, "tw4", checked)
                          }
                          className="mx-auto"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditIndicator(indicator)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress TW 1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((completedTW1 / totalIndicators) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTW1} dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress TW 2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((completedTW2 / totalIndicators) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTW2} dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress TW 3
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((completedTW3 / totalIndicators) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTW3} dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress TW 4
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((completedTW4 / totalIndicators) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTW4} dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Indikator</DialogTitle>
            <DialogDescription>
              Perbarui informasi indikator dan link evidence
            </DialogDescription>
          </DialogHeader>
          {selectedIndicator && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Indikator</label>
                <Input
                  value={selectedIndicator.indikator}
                  onChange={(e) =>
                    setSelectedIndicator({
                      ...selectedIndicator,
                      indikator: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Link Evidence</label>
                <Input
                  value={selectedIndicator.linkEvidence}
                  onChange={(e) =>
                    setSelectedIndicator({
                      ...selectedIndicator,
                      linkEvidence: e.target.value,
                    })
                  }
                  placeholder="Pisahkan multiple link dengan enter"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tw1"
                    checked={selectedIndicator.tw1}
                    onCheckedChange={(checked) =>
                      setSelectedIndicator({
                        ...selectedIndicator,
                        tw1: checked,
                      })
                    }
                  />
                  <label htmlFor="tw1" className="text-sm font-medium">
                    TW 1
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tw2"
                    checked={selectedIndicator.tw2}
                    onCheckedChange={(checked) =>
                      setSelectedIndicator({
                        ...selectedIndicator,
                        tw2: checked,
                      })
                    }
                  />
                  <label htmlFor="tw2" className="text-sm font-medium">
                    TW 2
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tw3"
                    checked={selectedIndicator.tw3}
                    onCheckedChange={(checked) =>
                      setSelectedIndicator({
                        ...selectedIndicator,
                        tw3: checked,
                      })
                    }
                  />
                  <label htmlFor="tw3" className="text-sm font-medium">
                    TW 3
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tw4"
                    checked={selectedIndicator.tw4}
                    onCheckedChange={(checked) =>
                      setSelectedIndicator({
                        ...selectedIndicator,
                        tw4: checked,
                      })
                    }
                  />
                  <label htmlFor="tw4" className="text-sm font-medium">
                    TW 4
                  </label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-[#e31e25] hover:bg-[#c41a20]"
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
