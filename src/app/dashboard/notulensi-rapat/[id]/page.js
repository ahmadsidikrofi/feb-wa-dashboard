"use client";

import { use } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  FileText,
  Download,
  ArrowLeft,
  Edit,
  CheckCircle,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Dummy notulensi data
const notulensiData = {
  1: {
    id: 1,
    judulRapat: "Rapat Koordinasi Kurikulum Semester Genap",
    tanggal: "2025-01-10",
    waktu: "09:00 - 11:00",
    tempat: "Ruang Sidang Dekan",
    pemimpin: "Wakil Dekan I",
    notulen: "Dr. Ahmad Susanto",
    peserta: [
      "Dr. Siti Nurhaliza, M.M.",
      "Prof. Budiman",
      "Dr. Rina Kusuma",
      "Kaprodi S1 Manajemen",
      "Kaprodi S1 Akuntansi",
      "Kaprodi S1 Administrasi Bisnis",
      "Kaprodi S2 Manajemen",
      "Kaprodi S2 Akuntansi",
    ],
    agendaRapat: [
      "Pembukaan dan pembacaan agenda",
      "Evaluasi kurikulum semester ganjil 2024/2025",
      "Pembahasan kurikulum semester genap 2024/2025",
      "Rencana pengembangan kurikulum berbasis MBKM",
      "Lain-lain",
    ],
    pembahasanKeputusan: [
      {
        agenda: "Evaluasi kurikulum semester ganjil 2024/2025",
        pembahasan:
          "Tim kurikulum memaparkan hasil evaluasi kurikulum semester ganjil. Secara umum implementasi berjalan baik dengan tingkat kepuasan mahasiswa 85%. Beberapa mata kuliah perlu penyesuaian metode pembelajaran.",
        keputusan:
          "Menyetujui hasil evaluasi dan menugaskan masing-masing Kaprodi untuk melakukan perbaikan pada mata kuliah yang perlu ditingkatkan.",
      },
      {
        agenda: "Pembahasan kurikulum semester genap 2024/2025",
        pembahasan:
          "Dibahas jadwal perkuliahan semester genap, alokasi dosen pengampu, dan ketersediaan ruang kelas. Terdapat beberapa konflik jadwal yang perlu diselesaikan.",
        keputusan:
          "Menyetujui jadwal dengan penyesuaian untuk menghindari konflik. Koordinator jadwal akan melakukan finalisasi dalam 3 hari kerja.",
      },
      {
        agenda: "Rencana pengembangan kurikulum berbasis MBKM",
        pembahasan:
          "Wakil Dekan I memaparkan roadmap implementasi MBKM di fakultas. Target 80% program studi sudah menerapkan minimal 3 skema MBKM di tahun 2025.",
        keputusan:
          "Membentuk tim MBKM fakultas yang akan diketuai oleh Wakil Dekan I. Masing-masing prodi menunjuk 1 koordinator MBKM.",
      },
    ],
    tindakLanjut: [
      {
        tugas: "Perbaikan mata kuliah berdasarkan hasil evaluasi",
        penanggungJawab: "Masing-masing Kaprodi",
        deadline: "2025-01-31",
      },
      {
        tugas: "Finalisasi jadwal perkuliahan semester genap",
        penanggungJawab: "Koordinator Jadwal",
        deadline: "2025-01-15",
      },
      {
        tugas: "Pembentukan tim MBKM fakultas",
        penanggungJawab: "Wakil Dekan I",
        deadline: "2025-01-20",
      },
      {
        tugas: "Penunjukan koordinator MBKM prodi",
        penanggungJawab: "Masing-masing Kaprodi",
        deadline: "2025-01-25",
      },
    ],
    penutup:
      "Rapat ditutup pada pukul 11:00 WIB. Rapat berjalan dengan lancar dan produktif. Semua agenda terbahas dengan baik dan menghasilkan keputusan yang konstruktif.",
  },
  2: {
    id: 2,
    judulRapat: "Evaluasi Kinerja Triwulan IV",
    tanggal: "2025-01-12",
    waktu: "13:00 - 15:30",
    tempat: "Ruang Rapat Dekan",
    pemimpin: "Dekan",
    notulen: "Siti Nurhaliza, M.M.",
    peserta: [
      "Wakil Dekan I",
      "Wakil Dekan II",
      "Kaur Sekretariat Dekan",
      "Kaur SDM Keuangan",
      "Semua Kaprodi",
    ],
    agendaRapat: [
      "Pembukaan",
      "Presentasi capaian kinerja Triwulan IV",
      "Evaluasi target dan realisasi",
      "Pembahasan strategi peningkatan kinerja",
      "Penutup",
    ],
    pembahasanKeputusan: [
      {
        agenda: "Presentasi capaian kinerja Triwulan IV",
        pembahasan:
          "Kaur SDM Keuangan mempresentasikan capaian kinerja fakultas. Realisasi mencapai 87.5% dari target dengan 142 dari 156 indikator tercapai.",
        keputusan:
          "Menerima laporan capaian kinerja Triwulan IV dan mengapresiasi kerja keras seluruh unit.",
      },
      {
        agenda: "Evaluasi target dan realisasi",
        pembahasan:
          "Diidentifikasi 14 indikator yang belum tercapai, sebagian besar terkait publikasi internasional dan kerjasama industri.",
        keputusan:
          "Menugaskan Wakil Dekan II untuk menyusun action plan percepatan pencapaian indikator yang tertinggal.",
      },
    ],
    tindakLanjut: [
      {
        tugas: "Penyusunan action plan percepatan indikator",
        penanggungJawab: "Wakil Dekan II",
        deadline: "2025-01-20",
      },
      {
        tugas: "Sosialisasi strategi peningkatan publikasi",
        penanggungJawab: "Semua Kaprodi",
        deadline: "2025-02-01",
      },
    ],
    penutup:
      "Rapat ditutup pukul 15:30 WIB dengan komitmen bersama untuk meningkatkan kinerja di tahun 2025.",
  },
};

export default function NotulensiDetailPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const notulensi = notulensiData[id];

  if (!notulensi) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Notulensi Tidak Ditemukan
            </h3>
            <p className="text-muted-foreground mb-4">
              Notulensi rapat belum dibuat atau tidak tersedia
            </p>
            <Button onClick={() => router.push("/dashboard/notulensi-rapat")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/notulensi-rapat")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#e31e25]">
              Notulensi Rapat
            </h1>
            <p className="text-muted-foreground">
              Dokumentasi lengkap hasil rapat
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/notulensi-rapat/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Meeting Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{notulensi.judulRapat}</CardTitle>
          <CardDescription>Informasi Rapat</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e31e25]/10">
                <Calendar className="h-5 w-5 text-[#e31e25]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal</p>
                <p className="font-medium">
                  {new Date(notulensi.tanggal).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e31e25]/10">
                <Clock className="h-5 w-5 text-[#e31e25]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Waktu</p>
                <p className="font-medium">{notulensi.waktu} WIB</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e31e25]/10">
                <MapPin className="h-5 w-5 text-[#e31e25]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tempat</p>
                <p className="font-medium">{notulensi.tempat}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e31e25]/10">
                <User className="h-5 w-5 text-[#e31e25]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pemimpin Rapat</p>
                <p className="font-medium">{notulensi.pemimpin}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-[#e31e25]" />
              <h3 className="font-semibold">
                Peserta Rapat ({notulensi.peserta.length})
              </h3>
            </div>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {notulensi.peserta.map((peserta, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {peserta}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#e31e25]" />
            <span className="text-sm text-muted-foreground">Notulen:</span>
            <span className="font-medium">{notulensi.notulen}</span>
          </div>
        </CardContent>
      </Card>

      {/* Agenda Rapat */}
      <Card>
        <CardHeader>
          <CardTitle>Agenda Rapat</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {notulensi.agendaRapat.map((agenda, index) => (
              <li key={index} className="flex gap-3">
                <span className="font-semibold text-[#e31e25]">
                  {index + 1}.
                </span>
                <span>{agenda}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Pembahasan dan Keputusan */}
      <Card>
        <CardHeader>
          <CardTitle>Pembahasan dan Keputusan</CardTitle>
          <CardDescription>
            Detail pembahasan setiap agenda dan keputusan yang diambil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notulensi.pembahasanKeputusan.map((item, index) => (
            <div key={index}>
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-3">
                  <Badge className="bg-[#e31e25] hover:bg-[#c41a20]">
                    Agenda {index + 1}
                  </Badge>
                  <h3 className="font-semibold text-lg">{item.agenda}</h3>
                </div>

                <div className="space-y-4 pl-6">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      Pembahasan:
                    </h4>
                    <p className="text-sm leading-relaxed">{item.pembahasan}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      Keputusan:
                    </h4>
                    <div className="flex gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed font-medium">
                        {item.keputusan}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {index < notulensi.pembahasanKeputusan.length - 1 && (
                <Separator />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tindak Lanjut */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Tindak Lanjut
          </CardTitle>
          <CardDescription>
            Tugas dan tanggung jawab hasil rapat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notulensi.tindakLanjut.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.tugas}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{item.penanggungJawab}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          Deadline:{" "}
                          {new Date(item.deadline).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {new Date(item.deadline) > new Date()
                      ? "Aktif"
                      : "Terlambat"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Penutup */}
      <Card>
        <CardHeader>
          <CardTitle>Penutup</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{notulensi.penutup}</p>
        </CardContent>
      </Card>
    </div>
  );
}
