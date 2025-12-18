"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Upload,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Timer,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Data dummy pengajuan yang sudah dibuat - dijadikan initial state
const initialSubmissions = [
  {
    id: 1,
    tanggalPengajuan: "2024-12-01",
    namaInstansi: "PT Bank Mandiri Tbk",
    jenisKerjasama: "Magang",
    ruangLingkup: "Nasional",
    status: "Approved",
    keterangan: "Disetujui untuk ditindaklanjuti",
    timeline: [
      { tahap: "Pengajuan", tanggal: "2024-12-01", duration: null },
      { tahap: "Review Wadek II", tanggal: "2024-12-02", duration: "1 hari" },
      { tahap: "Review Wadek I", tanggal: "2024-12-03", duration: "1 hari" },
      { tahap: "Review Kabag KST", tanggal: "2024-12-04", duration: "1 hari" },
      { tahap: "Approved Dekan", tanggal: "2024-12-05", duration: "1 hari" },
    ],
  },
  {
    id: 2,
    tanggalPengajuan: "2024-12-10",
    namaInstansi: "Gojek Indonesia",
    jenisKerjasama: "Penelitian",
    ruangLingkup: "Nasional",
    status: "Pending",
    keterangan: "Menunggu review dari dekan",
    timeline: [
      { tahap: "Pengajuan", tanggal: "2024-12-10", duration: null },
      { tahap: "Revisi Diminta", tanggal: "2024-12-11", duration: "1 hari" },
      { tahap: "Revisi Dikirim", tanggal: "2024-12-13", duration: "2 hari" },
      { tahap: "Review Dekan", tanggal: "2024-12-15", duration: "2 hari" },
    ],
  },
  {
    id: 3,
    tanggalPengajuan: "2024-11-25",
    namaInstansi: "PT Unilever Indonesia",
    jenisKerjasama: "Workshop",
    ruangLingkup: "Nasional",
    status: "Rejected",
    keterangan: "Tidak sesuai dengan fokus fakultas",
    timeline: [
      { tahap: "Pengajuan", tanggal: "2024-11-25", duration: null },
      { tahap: "Review Wadek II", tanggal: "2024-11-26", duration: "1 hari" },
      { tahap: "Rejected", tanggal: "2024-11-27", duration: "1 hari" },
    ],
  },
];

// Fungsi untuk menyimpan data ke localStorage (simulasi database)
const saveSubmissionToStorage = (submission) => {
  if (typeof window !== 'undefined') {
    const existingData = JSON.parse(localStorage.getItem('partnershipSubmissions') || '[]');
    existingData.push(submission);
    localStorage.setItem('partnershipSubmissions', JSON.stringify(existingData));
  }
};

// Fungsi untuk mendapatkan semua submission dari localStorage
const getSubmissionsFromStorage = () => {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('partnershipSubmissions') || '[]');
  }
  return [];
};

export default function AjukanKerjasamaPage() {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [formData, setFormData] = useState({
    namaInstansi: "",
    jenisKerjasama: "",
    ruangLingkup: "",
    deskripsi: "",
    tujuan: "",
    manfaat: "",
    durasi: "",
    kontak: "",
    email: "",
    telepon: "",
  });

  const [file, setFile] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5000000) {
        // 5MB
        toast.error("Ukuran file maksimal 5MB");
        return;
      }
      setFile(selectedFile);
      toast.success("File berhasil dipilih");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi
    if (
      !formData.namaInstansi ||
      !formData.jenisKerjasama ||
      !formData.ruangLingkup
    ) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    // Buat data pengajuan baru
    const today = new Date().toISOString().split('T')[0];
    const newSubmission = {
      id: submissions.length + 1,
      tanggalPengajuan: today,
      namaInstansi: formData.namaInstansi,
      jenisKerjasama: formData.jenisKerjasama,
      ruangLingkup: formData.ruangLingkup,
      deskripsi: formData.deskripsi,
      tujuan: formData.tujuan,
      manfaat: formData.manfaat,
      durasi: formData.durasi,
      kontak: formData.kontak,
      email: formData.email,
      telepon: formData.telepon,
      status: "Pending",
      keterangan: "Menunggu review dari Wadek II",
      timeline: [
        { tahap: "Pengajuan", tanggal: today, duration: null },
      ],
    };

    // Tambahkan ke riwayat pengajuan
    setSubmissions([newSubmission, ...submissions]);

    // Simpan ke localStorage untuk bisa diakses di menu pengajuan
    saveSubmissionToStorage(newSubmission);

    toast.success("Pengajuan kerjasama berhasil dikirim!");

    // Reset form
    setFormData({
      namaInstansi: "",
      jenisKerjasama: "",
      ruangLingkup: "",
      deskripsi: "",
      tujuan: "",
      manfaat: "",
      durasi: "",
      kontak: "",
      email: "",
      telepon: "",
    });
    setFile(null);
  };

  const getStatusBadge = (status) => {
    const config = {
      Approved: {
        variant: "default",
        icon: CheckCircle,
        className: "bg-green-600",
      },
      Pending: {
        variant: "secondary",
        icon: Clock,
        className: "bg-yellow-600",
      },
      Rejected: { variant: "destructive", icon: XCircle, className: "" },
    };
    const {
      variant,
      icon: Icon,
      className,
    } = config[status] || config["Pending"];

    return (
      <Badge
        variant={variant}
        className={`flex items-center gap-1 w-fit ${className}`}
      >
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const calculateTotalDuration = (timeline) => {
    if (!timeline || timeline.length === 0) return "-";

    const firstDate = new Date(timeline[0].tanggal);
    const lastDate = new Date(timeline[timeline.length - 1].tanggal);
    const diffTime = Math.abs(lastDate - firstDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "1 hari";
    return `${diffDays} hari`;
  };

  const TimelineDialog = ({ submission }) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="h-3 w-3 mr-1" />
            Timeline
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Timeline Proses - {submission.namaInstansi}
            </DialogTitle>
            <DialogDescription>
              Riwayat perjalanan dokumen dari pengajuan hingga status saat ini
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Summary */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="mt-1">
                      {getStatusBadge(submission.status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Durasi
                    </p>
                    <p className="font-semibold mt-1">
                      {calculateTotalDuration(submission.timeline)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tahapan</p>
                    <p className="font-semibold mt-1">
                      {submission.timeline?.length || 0} Tahap
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Riwayat Tahapan</h4>
              <div className="relative pl-8 space-y-4">
                {/* Vertical line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />

                {submission.timeline?.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Dot */}
                    <div
                      className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full border-2 ${
                        index === submission.timeline.length - 1
                          ? "bg-primary border-primary"
                          : "bg-background border-muted-foreground"
                      }`}
                    />

                    {/* Content */}
                    <div className="bg-card border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {item.tahap}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(item.tanggal).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                            {item.duration && (
                              <Badge variant="secondary" className="text-xs">
                                <Timer className="h-3 w-3 mr-1" />
                                {item.duration}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ajukan Kerjasama
          </h1>
          <p className="text-muted-foreground">
            Form pengajuan dokumen kerjasama baru dengan mitra eksternal
          </p>
        </div>
      </div>

      {/* Form Pengajuan */}
      <Card>
        <CardHeader>
          <CardTitle>Form Pengajuan Kerjasama</CardTitle>
          <CardDescription>
            Lengkapi formulir di bawah ini untuk mengajukan kerjasama baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informasi Mitra */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informasi Mitra</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="namaInstansi">
                    Nama Instansi/Perusahaan *
                  </Label>
                  <Input
                    id="namaInstansi"
                    placeholder="Contoh: PT Bank Mandiri Tbk"
                    value={formData.namaInstansi}
                    onChange={(e) =>
                      handleInputChange("namaInstansi", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jenisKerjasama">Jenis Kerjasama *</Label>
                  <Select
                    value={formData.jenisKerjasama}
                    onValueChange={(value) =>
                      handleInputChange("jenisKerjasama", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kerjasama" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Magang">Magang</SelectItem>
                      <SelectItem value="Penelitian">Penelitian</SelectItem>
                      <SelectItem value="Pengabdian Masyarakat">
                        Pengabdian Masyarakat
                      </SelectItem>
                      <SelectItem value="Workshop">Workshop/Seminar</SelectItem>
                      <SelectItem value="Guest Lecture">
                        Guest Lecture
                      </SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ruangLingkup">Ruang Lingkup *</Label>
                  <Select
                    value={formData.ruangLingkup}
                    onValueChange={(value) =>
                      handleInputChange("ruangLingkup", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih ruang lingkup" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lokal">Lokal</SelectItem>
                      <SelectItem value="Nasional">Nasional</SelectItem>
                      <SelectItem value="Regional">Regional</SelectItem>
                      <SelectItem value="Internasional">
                        Internasional
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="durasi">Durasi Kerjasama</Label>
                  <Input
                    id="durasi"
                    placeholder="Contoh: 1 tahun"
                    value={formData.durasi}
                    onChange={(e) =>
                      handleInputChange("durasi", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Detail Kerjasama */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detail Kerjasama</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deskripsi">Deskripsi Kerjasama</Label>
                  <Textarea
                    id="deskripsi"
                    placeholder="Jelaskan secara singkat tentang kerjasama yang akan dilakukan"
                    rows={3}
                    value={formData.deskripsi}
                    onChange={(e) =>
                      handleInputChange("deskripsi", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tujuan">Tujuan Kerjasama</Label>
                  <Textarea
                    id="tujuan"
                    placeholder="Apa tujuan dari kerjasama ini?"
                    rows={3}
                    value={formData.tujuan}
                    onChange={(e) =>
                      handleInputChange("tujuan", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manfaat">Manfaat untuk Fakultas</Label>
                  <Textarea
                    id="manfaat"
                    placeholder="Jelaskan manfaat yang akan diperoleh fakultas"
                    rows={3}
                    value={formData.manfaat}
                    onChange={(e) =>
                      handleInputChange("manfaat", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Kontak Person */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Kontak Person Mitra</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="kontak">Nama Kontak</Label>
                  <Input
                    id="kontak"
                    placeholder="Nama kontak person"
                    value={formData.kontak}
                    onChange={(e) =>
                      handleInputChange("kontak", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@contoh.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telepon">Telepon</Label>
                  <Input
                    id="telepon"
                    placeholder="08xx-xxxx-xxxx"
                    value={formData.telepon}
                    onChange={(e) =>
                      handleInputChange("telepon", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Upload Dokumen */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dokumen Pendukung</h3>
              <div className="space-y-2">
                <Label htmlFor="file">Upload Dokumen (PDF/DOC, Max 5MB)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {file && (
                    <Badge variant="secondary" className="shrink-0">
                      <FileText className="h-3 w-3 mr-1" />
                      {file.name}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload proposal atau dokumen pendukung lainnya (opsional)
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setFormData({
                    namaInstansi: "",
                    jenisKerjasama: "",
                    ruangLingkup: "",
                    deskripsi: "",
                    tujuan: "",
                    manfaat: "",
                    durasi: "",
                    kontak: "",
                    email: "",
                    telepon: "",
                  });
                  setFile(null);
                }}
              >
                Reset
              </Button>
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Kirim Pengajuan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Riwayat Pengajuan */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pengajuan Saya</CardTitle>
          <CardDescription>
            Daftar pengajuan kerjasama yang telah Anda buat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nama Instansi</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Ruang Lingkup</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {new Date(item.tanggalPengajuan).toLocaleDateString(
                        "id-ID"
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.namaInstansi}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.jenisKerjasama}</Badge>
                    </TableCell>
                    <TableCell>{item.ruangLingkup}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Timer className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">
                          {calculateTotalDuration(item.timeline)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.keterangan}
                    </TableCell>
                    <TableCell className="text-center">
                      <TimelineDialog submission={item} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
