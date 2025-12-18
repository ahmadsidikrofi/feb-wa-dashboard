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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  FileText,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Eye,
  Download,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Dummy data for meetings
const dummyMeetings = [
  {
    id: 1,
    judulRapat: "Rapat Koordinasi Kurikulum Semester Genap",
    tanggal: "2025-01-10",
    waktu: "09:00 - 11:00",
    tempat: "Ruang Sidang Dekan",
    pemimpin: "Wakil Dekan I",
    peserta: 15,
    status: "Selesai",
    notulen: "Dr. Ahmad Susanto",
    hasNotulensi: true,
  },
  {
    id: 2,
    judulRapat: "Evaluasi Kinerja Triwulan IV",
    tanggal: "2025-01-12",
    waktu: "13:00 - 15:30",
    tempat: "Ruang Rapat Dekan",
    pemimpin: "Dekan",
    peserta: 25,
    status: "Selesai",
    notulen: "Siti Nurhaliza, M.M.",
    hasNotulensi: true,
  },
  {
    id: 3,
    judulRapat: "Rapat Persiapan Akreditasi AACSB",
    tanggal: "2025-01-15",
    waktu: "08:00 - 12:00",
    tempat: "Aula Fakultas",
    pemimpin: "Dekan",
    peserta: 40,
    status: "Selesai",
    notulen: "Prof. Budiman",
    hasNotulensi: true,
  },
  {
    id: 4,
    judulRapat: "Rapat Koordinasi Program Studi S1",
    tanggal: "2025-01-17",
    waktu: "10:00 - 12:00",
    tempat: "Ruang Seminar A",
    pemimpin: "Wakil Dekan I",
    peserta: 20,
    status: "Selesai",
    notulen: "Dr. Rina Kusuma",
    hasNotulensi: false,
  },
  {
    id: 5,
    judulRapat: "Rapat Evaluasi Penelitian dan Pengabdian",
    tanggal: "2025-01-18",
    waktu: "14:00 - 16:00",
    tempat: "Ruang Sidang Dekan",
    pemimpin: "Wakil Dekan II",
    peserta: 18,
    status: "Berlangsung",
    notulen: "Dr. Hendra Wijaya",
    hasNotulensi: false,
  },
  {
    id: 6,
    judulRapat: "Rapat Perencanaan Kegiatan Kemahasiswaan",
    tanggal: "2025-01-20",
    waktu: "09:00 - 11:00",
    tempat: "Ruang Rapat Kemahasiswaan",
    pemimpin: 'Kaur Kemahasiswaan',
    peserta: 12,
    status: "Terjadwal",
    notulen: "Ani Setiani, S.E.",
    hasNotulensi: false,
  },
  {
    id: 7,
    judulRapat: 'Rapat Evaluasi Laboratorium',
    tanggal: '2025-01-22',
    waktu: '13:00 - 15:00',
    tempat: 'Lab Komputer 1',
    pemimpin: 'Kaur Laboratorium',
    peserta: 10,
    status: "Terjadwal",
    notulen: "Budi Santoso, M.T.",
    hasNotulensi: false,
  },
  {
    id: 8,
    judulRapat: "Rapat Koordinasi SDM dan Keuangan",
    tanggal: "2025-01-25",
    waktu: "10:00 - 12:00",
    tempat: "Ruang Rapat Dekan",
    pemimpin: 'Kaur SDM Keuangan',
    peserta: 8,
    status: "Terjadwal",
    notulen: "Lina Marlina, S.E., M.M.",
    hasNotulensi: false,
  },
];

export default function NotulensiRapatPage() {
  const router = useRouter();
  const [meetings, setMeetings] = useState(dummyMeetings);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    judulRapat: "",
    tanggal: "",
    waktuMulai: "",
    waktuSelesai: "",
    tempat: "",
    pemimpin: "",
    notulen: "",
    keterangan: "",
  });

  // Calculate stats
  const totalMeetings = meetings.length;
  const completedMeetings = meetings.filter(
    (m) => m.status === "Selesai"
  ).length;
  const scheduledMeetings = meetings.filter(
    (m) => m.status === "Terjadwal"
  ).length;
  const withNotulensi = meetings.filter((m) => m.hasNotulensi).length;
  const pendingNotulensi = completedMeetings - withNotulensi;

  // Filter meetings
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.judulRapat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.pemimpin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.tempat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || meeting.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = {
      Selesai: {
        variant: "default",
        className: "bg-green-600 hover:bg-green-700",
      },
      Berlangsung: {
        variant: "default",
        className: "bg-blue-600 hover:bg-blue-700",
      },
      Terjadwal: { variant: "secondary", className: "" },
    };
    const { variant, className } = config[status] || config["Terjadwal"];

    return (
      <Badge variant={variant} className={className}>
        {status}
      </Badge>
    );
  };

  const handleViewNotulensi = (meetingId) => {
    router.push(`/dashboard/notulensi-rapat/${meetingId}`);
  };

  const handleCreateNotulensi = () => {
    router.push("/dashboard/notulensi-rapat/buat");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMeeting = {
      id: meetings.length + 1,
      judulRapat: formData.judulRapat,
      tanggal: formData.tanggal,
      waktu: `${formData.waktuMulai} - ${formData.waktuSelesai}`,
      tempat: formData.tempat,
      pemimpin: formData.pemimpin,
      peserta: 0,
      status: "Terjadwal",
      notulen: formData.notulen,
      hasNotulensi: false,
    };

    setMeetings([newMeeting, ...meetings]);
    setIsDialogOpen(false);
    toast.success("Rapat berhasil ditambahkan");

    // Reset form
    setFormData({
      judulRapat: "",
      tanggal: "",
      waktuMulai: "",
      waktuSelesai: "",
      tempat: "",
      pemimpin: "",
      notulen: "",
      keterangan: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#e31e25]">
            Notulensi Rapat
          </h1>
          <p className="text-muted-foreground">
            Kelola dan dokumentasi notulensi rapat fakultas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Laporan
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#e31e25] hover:bg-[#c41a20]" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Rapat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah Rapat Baru</DialogTitle>
                <DialogDescription>
                  Isi formulir untuk menambahkan jadwal rapat baru
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="judulRapat">Judul Rapat *</Label>
                    <Input
                      id="judulRapat"
                      value={formData.judulRapat}
                      onChange={(e) =>
                        setFormData({ ...formData, judulRapat: e.target.value })
                      }
                      required
                      placeholder="Contoh: Rapat Koordinasi Kurikulum"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="tanggal">Tanggal *</Label>
                      <Input
                        id="tanggal"
                        type="date"
                        value={formData.tanggal}
                        onChange={(e) =>
                          setFormData({ ...formData, tanggal: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="waktuMulai">Waktu Mulai *</Label>
                      <Input
                        id="waktuMulai"
                        type="time"
                        value={formData.waktuMulai}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            waktuMulai: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="waktuSelesai">Waktu Selesai *</Label>
                      <Input
                        id="waktuSelesai"
                        type="time"
                        value={formData.waktuSelesai}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            waktuSelesai: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="tempat">Tempat *</Label>
                    <Input
                      id="tempat"
                      value={formData.tempat}
                      onChange={(e) =>
                        setFormData({ ...formData, tempat: e.target.value })
                      }
                      required
                      placeholder="Contoh: Ruang Sidang Dekan"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="pemimpin">Pemimpin Rapat *</Label>
                      <Select
                        value={formData.pemimpin}
                        onValueChange={(value) =>
                          setFormData({ ...formData, pemimpin: value })
                        }
                        required
                      >
                        <SelectTrigger id="pemimpin">
                          <SelectValue placeholder="Pilih pemimpin rapat" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dekan">Dekan</SelectItem>
                          <SelectItem value="Wakil Dekan I">
                            Wakil Dekan I
                          </SelectItem>
                          <SelectItem value="Wakil Dekan II">
                            Wakil Dekan II
                          </SelectItem>
                          <SelectItem value="Kaur Sekretariat Dekan">
                            Kaur Sekretariat Dekan
                          </SelectItem>
                          <SelectItem value="Kaur Akademik">
                            Kaur Akademik
                          </SelectItem>
                          <SelectItem value="Kaur Laboratorium">
                            Kaur Laboratorium
                          </SelectItem>
                          <SelectItem value="Kaur SDM Keuangan">
                            Kaur SDM Keuangan
                          </SelectItem>
                          <SelectItem value="Kaur Kemahasiswaan">
                            Kaur Kemahasiswaan
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="notulen">Notulen *</Label>
                      <Input
                        id="notulen"
                        value={formData.notulen}
                        onChange={(e) =>
                          setFormData({ ...formData, notulen: e.target.value })
                        }
                        required
                        placeholder="Nama petugas notulen"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="keterangan">Keterangan</Label>
                    <Textarea
                      id="keterangan"
                      value={formData.keterangan}
                      onChange={(e) =>
                        setFormData({ ...formData, keterangan: e.target.value })
                      }
                      placeholder="Catatan atau agenda singkat rapat"
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#e31e25] hover:bg-[#c41a20]"
                  >
                    Simpan Rapat
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards - Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rapat</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Semua rapat tercatat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapat Selesai</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Rapat terlaksana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terjadwal</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Rapat akan datang
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Notulensi Tersedia
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{withNotulensi}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dokumen lengkap
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Notulensi
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingNotulensi}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Menunggu dokumentasi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari rapat berdasarkan judul, pemimpin, atau tempat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                  <SelectItem value="Berlangsung">Berlangsung</SelectItem>
                  <SelectItem value="Terjadwal">Terjadwal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meetings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Rapat</CardTitle>
          <CardDescription>
            Daftar lengkap rapat fakultas dan status notulensi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Judul Rapat</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Tempat</TableHead>
                  <TableHead>Pemimpin Rapat</TableHead>
                  <TableHead className="text-center">Peserta</TableHead>
                  <TableHead>Notulen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeetings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground py-8"
                    >
                      Tidak ada rapat ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMeetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">
                        {new Date(meeting.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{meeting.judulRapat}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {meeting.waktu}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {meeting.tempat}
                      </TableCell>
                      <TableCell className="text-sm">
                        {meeting.pemimpin}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{meeting.peserta}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {meeting.notulen}
                      </TableCell>
                      <TableCell>{getStatusBadge(meeting.status)}</TableCell>
                      <TableCell className="text-center">
                        {meeting.hasNotulensi ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewNotulensi(meeting.id)}
                            className="gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            Lihat
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCreateNotulensi}
                            className="gap-1"
                            disabled={meeting.status === "Terjadwal"}
                          >
                            <FileText className="h-3 w-3" />
                            Buat
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tingkat Dokumentasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {completedMeetings > 0
                ? Math.round((withNotulensi / completedMeetings) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Rapat selesai dengan notulensi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rata-rata Peserta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(
                meetings.reduce((sum, m) => sum + m.peserta, 0) /
                  meetings.length
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per rapat yang dilaksanakan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rapat Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">Januari 2025</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
