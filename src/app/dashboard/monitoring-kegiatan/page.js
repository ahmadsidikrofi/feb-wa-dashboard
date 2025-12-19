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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Filter,
  Plus,
  Search,
  Building2,
  UserCheck,
  Download,
  CalendarPlus,
  LayoutGrid,
  CalendarDays,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

// Data dummy untuk unit dan prodi
const units = [
  "Dekan",
  "Wakil Dekan I",
  "Wakil Dekan II",
  "Urusan Sekretariat Dekan",
  "Urusan Layanan Akademik",
  "Urusan Laboratorium",
  "Urusan SDM Keuangan",
  "Urusan Kemahasiswaan",
  "Prodi S1 Manajemen",
  "Prodi S1 Administrasi Bisnis",
  "Prodi S1 Akuntansi",
  "Prodi S1 Leisure Management",
  "Prodi S1 Bisnis Digital",
  "Prodi S2 Manajemen",
  "Prodi S2 Manajemen PJJ",
  "Prodi S2 Administrasi Bisnis",
  "Prodi S2 Akuntansi",
  "Prodi S3 Manajemen",
];

const prodiList = [
  "S1 Manajemen",
  "S1 Administrasi Bisnis",
  "S1 Akuntansi",
  "S1 Leisure Management",
  "S1 Bisnis Digital",
  "S2 Manajemen",
  "S2 Manajemen PJJ",
  "S2 Administrasi Bisnis",
  "S2 Akuntansi",
  "S3 Manajemen",
];

const rooms = [
  "Ruang Rapat Manterawu lt. 2",
  "Ruang Rapat Miossu lt. 1",
  "Ruang Rapat Miossu lt. 2",
  "Ruang Rapat Maratua lt. 1",
  "Aula FEB",
  "Aula Manterawu",
  "Lainnya",
];

const officials = [
  "Rektor",
  "Wakil Rektor 1",
  "Wakil Rektor 2",
  "Wakil Rektor 3",
  "Wakil Rektor 4",
  "Dekan",
  "Wakil Dekan I",
  "Wakil Dekan II",
  "Kaur Sekretariat Dekan",
  "Kaur Akademik",
  "Kaur Laboratorium",
  "Kaur SDM Keuangan",
  "Kaur Kemahasiswaan",
  "Kaprodi S1 Manajemen",
  "Kaprodi S1 Administrasi Bisnis",
  "Kaprodi S1 Akuntansi",
  "Kaprodi S1 Leisure Management",
  "Kaprodi S1 Bisnis Digital",
  "Kaprodi S2 Manajemen",
  "Kaprodi S2 Manajemen PJJ",
  "Kaprodi S2 Administrasi Bisnis",
  "Kaprodi S2 Akuntansi",
  "Kaprodi S3 Manajemen",
];

// Data dummy kegiatan
const dummyActivities = [
  {
    id: 1,
    namaKegiatan: "Seminar Nasional Bisnis Digital",
    tanggal: "2025-01-15",
    waktuMulai: "08:00",
    waktuSelesai: "12:00",
    unit: "Dekan",
    prodi: "S1 Bisnis Digital",
    tempat: "Aula FEB",
    pejabat: ["Dekan", "Wakil Dekan I"],
    jumlahPeserta: 200,
    status: "Terjadwal",
    keterangan: "Tema: Transformasi Digital Indonesia",
    hasConflict: false,
  },
  {
    id: 2,
    namaKegiatan: "Workshop Akuntansi Forensik",
    tanggal: "2025-01-15",
    waktuMulai: "09:00",
    waktuSelesai: "11:00",
    unit: "Wakil Dekan I",
    prodi: "S1 Akuntansi",
    tempat: "Ruang Rapat Manterawu lt. 2",
    pejabat: ["Wakil Dekan I", "Kaprodi S1 Akuntansi"],
    jumlahPeserta: 50,
    status: "Terjadwal",
    keterangan: "Pembicara: Prof. Ahmad",
    hasConflict: true,
    conflictType: "pejabat",
  },
  {
    id: 3,
    namaKegiatan: "Rapat Koordinasi Kurikulum",
    tanggal: "2025-01-16",
    waktuMulai: "13:00",
    waktuSelesai: "15:00",
    unit: "Wakil Dekan I",
    prodi: "S1 Manajemen",
    tempat: "Ruang Rapat Miossu lt. 1",
    pejabat: ["Wakil Dekan I", "Kaprodi S1 Manajemen"],
    jumlahPeserta: 15,
    status: "Terjadwal",
    keterangan: "Review kurikulum semester genap",
    hasConflict: false,
  },
  {
    id: 4,
    namaKegiatan: "Pelatihan Penelitian",
    tanggal: "2025-01-17",
    waktuMulai: "08:00",
    waktuSelesai: "16:00",
    unit: "Prodi S2 Manajemen",
    prodi: "S2 Manajemen",
    tempat: "Ruang Rapat Miossu lt. 2",
    pejabat: ["Kaprodi S2 Manajemen"],
    jumlahPeserta: 30,
    status: "Terjadwal",
    keterangan: "Pelatihan SPSS dan Stata",
    hasConflict: false,
  },
  {
    id: 5,
    namaKegiatan: "Sidang Skripsi Gelombang 1",
    tanggal: "2025-01-17",
    waktuMulai: "08:00",
    waktuSelesai: "12:00",
    unit: "Urusan Layanan Akademik",
    prodi: "S1 Akuntansi",
    tempat: "Ruang Rapat Maratua lt. 1",
    pejabat: ["Kaprodi S1 Akuntansi"],
    jumlahPeserta: 10,
    status: "Terjadwal",
    keterangan: "10 mahasiswa",
    hasConflict: false,
  },
  {
    id: 6,
    namaKegiatan: "Yudisium Fakultas",
    tanggal: "2025-01-20",
    waktuMulai: "09:00",
    waktuSelesai: "12:00",
    unit: "Dekan",
    prodi: "-",
    tempat: "Aula Manterawu",
    pejabat: [
      "Dekan",
      "Wakil Dekan I",
      "Wakil Dekan II",
      "Kaur Sekretariat Dekan",
    ],
    jumlahPeserta: 150,
    status: "Terjadwal",
    keterangan: "Wisuda periode Januari 2025",
    hasConflict: false,
  },
  {
    id: 7,
    namaKegiatan: "Focus Group Discussion Tracer Study",
    tanggal: "2025-01-20",
    waktuMulai: "10:00",
    waktuSelesai: "12:00",
    unit: "Prodi S1 Administrasi Bisnis",
    prodi: "S1 Administrasi Bisnis",
    tempat: "Ruang Rapat Manterawu lt. 2",
    pejabat: ["Kaprodi S1 Administrasi Bisnis"],
    jumlahPeserta: 25,
    status: "Terjadwal",
    keterangan: "FGD Tracer Study",
    hasConflict: true,
    conflictType: "waktu",
  },
  {
    id: 8,
    namaKegiatan: "Sosialisasi Beasiswa",
    tanggal: "2025-01-22",
    waktuMulai: "13:00",
    waktuSelesai: "15:00",
    unit: "Urusan Kemahasiswaan",
    prodi: "-",
    tempat: "Aula FEB",
    pejabat: ["Kaur Kemahasiswaan"],
    jumlahPeserta: 100,
    status: "Terjadwal",
    keterangan: "Beasiswa tahun 2025",
    hasConflict: false,
  },
  {
    id: 9,
    namaKegiatan: "Workshop Leisure Management Industry",
    tanggal: "2025-01-23",
    waktuMulai: "09:00",
    waktuSelesai: "15:00",
    unit: "Prodi S1 Leisure Management",
    prodi: "S1 Leisure Management",
    tempat: "Ruang Rapat Miossu lt. 1",
    pejabat: ["Kaprodi S1 Leisure Management"],
    jumlahPeserta: 45,
    status: "Terjadwal",
    keterangan: "Kolaborasi dengan industri pariwisata",
    hasConflict: false,
  },
  {
    id: 10,
    namaKegiatan: "Rapat Evaluasi Lab",
    tanggal: "2025-01-24",
    waktuMulai: "10:00",
    waktuSelesai: "12:00",
    unit: "Urusan Laboratorium",
    prodi: "-",
    tempat: "Ruang Rapat Miossu lt. 2",
    pejabat: ["Kaur Laboratorium"],
    jumlahPeserta: 8,
    status: "Terjadwal",
    keterangan: "Evaluasi fasilitas dan peralatan",
    hasConflict: false,
  },
];

export default function MonitoringKegiatanPage() {
  const [activities, setActivities] = useState(dummyActivities);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUnit, setFilterUnit] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");

  // Form state
  const [formData, setFormData] = useState({
    namaKegiatan: "",
    tanggal: "",
    waktuMulai: "",
    waktuSelesai: "",
    unit: "",
    prodi: "",
    tempat: "",
    tempatLainnya: "",
    pejabat: [],
    jumlahPeserta: "",
    keterangan: "",
  });

  // Stats calculation
  const totalActivities = activities.length;
  const upcomingActivities = activities.filter(
    (a) => new Date(a.tanggal) >= new Date()
  ).length;
  const conflictActivities = activities.filter((a) => a.hasConflict).length;
  const todayActivities = activities.filter((a) => {
    const today = new Date().toISOString().split("T")[0];
    return a.tanggal === today;
  }).length;

  // Filter activities
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.namaKegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.prodi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit = filterUnit === "all" || activity.unit === filterUnit;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "conflict" && activity.hasConflict) ||
      (filterStatus === "normal" && !activity.hasConflict);

    return matchesSearch && matchesUnit && matchesStatus;
  });

  const getStatusBadge = (activity) => {
    if (activity.hasConflict) {
      // Deteksi konflik tempat dan pejabat
      const roomConflict = activities.find(
        (a) =>
          a.id !== activity.id &&
          a.tanggal === activity.tanggal &&
          a.tempat === activity.tempat &&
          ((a.waktuMulai >= activity.waktuMulai &&
            a.waktuMulai < activity.waktuSelesai) ||
            (a.waktuSelesai > activity.waktuMulai &&
              a.waktuSelesai <= activity.waktuSelesai) ||
            (a.waktuMulai <= activity.waktuMulai &&
              a.waktuSelesai >= activity.waktuSelesai))
      );

      const officialConflict = activities.find(
        (a) =>
          a.id !== activity.id &&
          a.tanggal === activity.tanggal &&
          a.pejabat.some((p) => activity.pejabat.includes(p)) &&
          ((a.waktuMulai >= activity.waktuMulai &&
            a.waktuMulai < activity.waktuSelesai) ||
            (a.waktuSelesai > activity.waktuMulai &&
              a.waktuSelesai <= activity.waktuSelesai) ||
            (a.waktuMulai <= activity.waktuMulai &&
              a.waktuSelesai >= activity.waktuSelesai))
      );

      const conflicts = [];
      if (roomConflict) conflicts.push("Tempat");
      if (officialConflict) conflicts.push("Pejabat");

      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Konflik {conflicts.join(" & ")}
        </Badge>
      );
    }
    return (
      <Badge
        variant="default"
        className="bg-green-600 hover:bg-green-700 gap-1"
      >
        <CheckCircle2 className="h-3 w-3" />
        Normal
      </Badge>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for conflicts
    const conflicts = detectConflicts(formData);

    const newActivity = {
      id: activities.length + 1,
      namaKegiatan: formData.namaKegiatan,
      tanggal: formData.tanggal,
      waktuMulai: formData.waktuMulai,
      waktuSelesai: formData.waktuSelesai,
      unit: formData.unit,
      prodi: formData.prodi || "-",
      tempat: formData.tempat === "Lainnya" ? formData.tempatLainnya : formData.tempat,
      pejabat: formData.pejabat,
      jumlahPeserta: formData.jumlahPeserta,
      keterangan: formData.keterangan,
      status: "Terjadwal",
      hasConflict: conflicts.hasConflict,
      conflictType: conflicts.type,
    };

    setActivities([newActivity, ...activities]);
    setIsDialogOpen(false);

    if (conflicts.hasConflict) {
      toast.warning("Kegiatan ditambahkan dengan konflik", {
        description: conflicts.message,
      });
    } else {
      toast.success("Kegiatan berhasil ditambahkan");
    }

    // Reset form
    setFormData({
      namaKegiatan: "",
      tanggal: "",
      waktuMulai: "",
      waktuSelesai: "",
      unit: "",
      prodi: "",
      tempat: "",
      tempatLainnya: "",
      pejabat: [],
      jumlahPeserta: "",
      keterangan: "",
    });
  };

  // Function to export to Google Calendar
  const exportToGoogleCalendar = (activity) => {
    const startDateTime = `${activity.tanggal}T${activity.waktuMulai}:00`;
    const endDateTime = `${activity.tanggal}T${activity.waktuSelesai}:00`;

    const details = `
Unit: ${activity.unit}
Prodi: ${activity.prodi}
Tempat: ${activity.tempat}
Pejabat: ${activity.pejabat.join(", ")}
Jumlah Peserta: ${activity.jumlahPeserta}

${activity.keterangan}`;

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      activity.namaKegiatan
    )}&dates=${startDateTime.replace(/[-:]/g, "")}/${endDateTime.replace(
      /[-:]/g,
      ""
    )}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
      activity.tempat
    )}`;

    window.open(googleCalendarUrl, "_blank");
    toast.success("Membuka Google Calendar");
  };

  const exportAllToGoogleCalendar = () => {
    const upcomingActivities = activities.filter(
      (a) => new Date(a.tanggal) >= new Date()
    );

    if (upcomingActivities.length === 0) {
      toast.error("Tidak ada kegiatan mendatang untuk di-export");
      return;
    }

    toast.success(
      `Membuka ${upcomingActivities.length} kegiatan di Google Calendar`,
      {
        description: "Window akan terbuka untuk setiap kegiatan",
      }
    );

    upcomingActivities.forEach((activity, index) => {
      setTimeout(() => {
        exportToGoogleCalendar(activity);
      }, index * 500); // Delay to avoid popup blocker
    });
  };

  const detectConflicts = (newActivity) => {
    // Check for room conflicts
    const roomConflict = activities.find(
      (a) =>
        a.tanggal === newActivity.tanggal &&
        a.tempat === newActivity.tempat &&
        ((newActivity.waktuMulai >= a.waktuMulai &&
          newActivity.waktuMulai < a.waktuSelesai) ||
          (newActivity.waktuSelesai > a.waktuMulai &&
            newActivity.waktuSelesai <= a.waktuSelesai))
    );

    if (roomConflict) {
      return {
        hasConflict: true,
        type: "tempat",
        message: `Tempat ${newActivity.tempat} sudah digunakan untuk "${roomConflict.namaKegiatan}"`,
      };
    }

    // Check for official conflicts
    const officialConflict = activities.find((a) => {
      if (a.tanggal !== newActivity.tanggal) return false;

      const timeOverlap =
        (newActivity.waktuMulai >= a.waktuMulai &&
          newActivity.waktuMulai < a.waktuSelesai) ||
        (newActivity.waktuSelesai > a.waktuMulai &&
          newActivity.waktuSelesai <= a.waktuSelesai);

      if (!timeOverlap) return false;

      return newActivity.pejabat.some((p) => a.pejabat.includes(p));
    });

    if (officialConflict) {
      const conflictingOfficials = newActivity.pejabat.filter((p) =>
        officialConflict.pejabat.includes(p)
      );
      return {
        hasConflict: true,
        type: "pejabat",
        message: `${conflictingOfficials.join(", ")} sudah terjadwal di "${
          officialConflict.namaKegiatan
        }"`,
      };
    }

    return { hasConflict: false };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#e31e25]">
            Daftar Kegiatan
          </h1>
          <p className="text-muted-foreground">
            Pantau dan kelola agenda kegiatan unit dan program studi untuk
            menghindari konflik jadwal
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportAllToGoogleCalendar}
            className="gap-2"
          >
            <CalendarPlus className="h-4 w-4" />
            Export ke Google Calendar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#e31e25] hover:bg-[#c41a20]">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kegiatan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah Kegiatan Baru</DialogTitle>
                <DialogDescription>
                  Isi form di bawah untuk menambahkan kegiatan. Sistem akan
                  mendeteksi konflik otomatis.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="namaKegiatan">Nama Kegiatan *</Label>
                    <Input
                      id="namaKegiatan"
                      value={formData.namaKegiatan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          namaKegiatan: e.target.value,
                        })
                      }
                      required
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="unit">Unit Penyelenggara *</Label>
                      <Select
                        value={formData.unit}
                        onValueChange={(value) =>
                          setFormData({ ...formData, unit: value })
                        }
                        required
                      >
                        <SelectTrigger id="unit">
                          <SelectValue placeholder="Pilih unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="tempat">Tempat *</Label>
                    <Select
                      value={formData.tempat}
                      onValueChange={(value) =>
                        setFormData({ ...formData, tempat: value, tempatLainnya: "" })
                      }
                      required
                    >
                      <SelectTrigger id="tempat">
                        <SelectValue placeholder="Pilih tempat" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map((room) => (
                          <SelectItem key={room} value={room}>
                            {room}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.tempat === "Lainnya" && (
                      <Input
                        id="tempatLainnya"
                        value={formData.tempatLainnya}
                        onChange={(e) =>
                          setFormData({ ...formData, tempatLainnya: e.target.value })
                        }
                        required
                        placeholder="Masukkan nama tempat"
                        className="mt-2"
                      />
                    )}
                  </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Pejabat yang Hadir *</Label>
                    <div className="grid grid-cols-2 gap-2 p-3 border rounded-md max-h-40 overflow-y-auto">
                      {officials.map((official) => (
                        <label
                          key={official}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.pejabat.includes(official)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  pejabat: [...formData.pejabat, official],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  pejabat: formData.pejabat.filter(
                                    (p) => p !== official
                                  ),
                                });
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{official}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="jumlahPeserta">Jumlah Peserta</Label>
                    <Input
                      id="jumlahPeserta"
                      type="number"
                      value={formData.jumlahPeserta}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jumlahPeserta: e.target.value,
                        })
                      }
                      placeholder="Estimasi jumlah peserta"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="keterangan">Keterangan</Label>
                    <Textarea
                      id="keterangan"
                      value={formData.keterangan}
                      onChange={(e) =>
                        setFormData({ ...formData, keterangan: e.target.value })
                      }
                      placeholder="Informasi tambahan tentang kegiatan"
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
                    Simpan Kegiatan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Kegiatan
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivities}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Terjadwal dan aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayActivities}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Kegiatan berlangsung
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mendatang</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingActivities}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Kegiatan terjadwal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Konflik Terdeteksi
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {conflictActivities}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Perlu perhatian
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle and Filters */}
      <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Filter & Tampilan</CardTitle>
              <TabsList>
                <TabsTrigger value="table" className="gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Table
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Board
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari kegiatan, unit, atau prodi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterUnit} onValueChange={setFilterUnit}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Semua Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Unit</SelectItem>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="conflict">Ada Konflik</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table View */}
        <TabsContent value="table" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Kegiatan</CardTitle>
              <CardDescription>
                Monitoring kegiatan unit dan program studi dengan deteksi
                konflik otomatis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Nama Kegiatan</TableHead>
                      <TableHead>Unit / Prodi</TableHead>
                      {/* <TableHead>Prodi</TableHead> */}
                      <TableHead>Tempat</TableHead>
                      <TableHead>Pejabat</TableHead>
                      <TableHead>Peserta</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="text-center text-muted-foreground py-8"
                        >
                          Tidak ada kegiatan ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredActivities.map((activity) => (
                        <TableRow
                          key={activity.id}
                          className={activity.hasConflict ? "bg-red-50" : ""}
                        >
                          <TableCell className="font-medium">
                            {new Date(activity.tanggal).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              {activity.waktuMulai} - {activity.waktuSelesai}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {activity.namaKegiatan}
                              </div>
                              {activity.keterangan && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {activity.keterangan}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{activity.unit}</span>
                            </div>
                          </TableCell>
                          {/* <TableCell>
                            <Badge variant="outline">{activity.prodi}</Badge>
                          </TableCell> */}
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {activity.tempat}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {activity.pejabat.map((p, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-1"
                                >
                                  <UserCheck className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs">{p}</span>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {activity.jumlahPeserta}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(activity)}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // Set form data untuk edit
                                  setFormData({
                                    namaKegiatan: activity.namaKegiatan,
                                    tanggal: activity.tanggal,
                                    waktuMulai: activity.waktuMulai,
                                    waktuSelesai: activity.waktuSelesai,
                                    unit: activity.unit,
                                    prodi: activity.prodi,
                                    tempat: activity.tempat === "Lainnya" ? "Lainnya" : activity.tempat,
                                    tempatLainnya: activity.tempat === "Lainnya" ? "" : "",
                                    pejabat: activity.pejabat,
                                    jumlahPeserta: activity.jumlahPeserta,
                                    keterangan: activity.keterangan,
                                  });
                                  setIsDialogOpen(true);
                                  toast.info("Mode edit kegiatan");
                                }}
                                className="gap-1"
                              >
                                <Pencil className="h-3 w-3" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => exportToGoogleCalendar(activity)}
                                className="gap-1"
                              >
                                <CalendarPlus className="h-3 w-3" />
                                Sync
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Kalender Kegiatan</CardTitle>
              <CardDescription>
                Tampilan kalender agenda kegiatan fakultas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Group activities by date */}
                {Object.entries(
                  filteredActivities.reduce((acc, activity) => {
                    const date = new Date(activity.tanggal).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    );
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(activity);
                    return acc;
                  }, {})
                )
                  .sort(([dateA], [dateB]) => {
                    const a = filteredActivities.find(
                      (act) =>
                        new Date(act.tanggal).toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }) === dateA
                    );
                    const b = filteredActivities.find(
                      (act) =>
                        new Date(act.tanggal).toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }) === dateB
                    );
                    return new Date(a.tanggal) - new Date(b.tanggal);
                  })
                  .map(([date, dayActivities]) => (
                    <div key={date} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#e31e25] text-white px-3 py-1 rounded-md">
                          <CalendarDays className="h-4 w-4" />
                        </div>
                        <h3 className="font-semibold text-lg">{date}</h3>
                        <Badge variant="secondary">
                          {dayActivities.length} kegiatan
                        </Badge>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {dayActivities.map((activity) => (
                          <Card
                            key={activity.id}
                            className={
                              activity.hasConflict ? "border-red-500" : ""
                            }
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-base">
                                    {activity.namaKegiatan}
                                  </CardTitle>
                                  <div className="flex items-center gap-2 mt-2">
                                    {getStatusBadge(activity)}
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {activity.waktuMulai} -{" "}
                                  {activity.waktuSelesai}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{activity.tempat}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span>{activity.unit}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{activity.jumlahPeserta} peserta</span>
                              </div>
                              {activity.pejabat.length > 0 && (
                                <div className="pt-2 border-t">
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Pejabat:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {activity.pejabat.map((p, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {p}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="pt-2 flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    exportToGoogleCalendar(activity)
                                  }
                                  className="flex-1 gap-1"
                                >
                                  <CalendarPlus className="h-3 w-3" />
                                  Sync
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                {filteredActivities.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Tidak ada kegiatan ditemukan</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats by Resource */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Penggunaan Tempat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Aula Utama", "Ruang Seminar A", "Lab Komputer 1"].map(
                (room, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{room}</span>
                    <Badge variant="secondary">
                      {Math.floor(Math.random() * 10) + 5} kegiatan
                    </Badge>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Unit Paling Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Dekan", "Wakil Dekan I", "Prodi S1 Manajemen"].map(
                (unit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{unit}</span>
                    <Badge variant="secondary">
                      {Math.floor(Math.random() * 15) + 8} kegiatan
                    </Badge>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Kegiatan Pejabat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Dekan", "Wakil Dekan I", "Wakil Dekan II"].map(
                (official, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{official}</span>
                    <Badge variant="secondary">
                      {Math.floor(Math.random() * 12) + 6} kegiatan
                    </Badge>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
