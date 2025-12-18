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
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Dummy notulensi data
const notulensiData = {
  1: {
    id: 1,
    judulRapat: "Rapat Koordinasi Kurikulum Semester Genap",
    tanggal: "2025-01-10",
    waktu: "09:00 - 11:00",
    tempat: "Ruang Rapat Manterawu lt. 2",
    pemimpin: "Wakil Dekan I",
    notulen: "Dr. Ahmad Susanto",
    peserta: [
      "Dekan",
      "Wakil Dekan I",
      "Wakil Dekan II",
      "Kaprodi S1 Manajemen",
      "Kaprodi S1 Akuntansi",
      "Kaprodi S1 Administrasi Bisnis",
      "Kaprodi S1 Leisure Management",
      "Kaprodi S1 Bisnis Digital",
      "Kaprodi S2 Manajemen",
      "Kaprodi S2 Manajemen PJJ",
      "Kaprodi S2 Administrasi Bisnis",
      "Kaprodi S2 Akuntansi",
      "Kaprodi S3 Manajemen",
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
        tindakLanjut: {
          tugas: "Perbaikan mata kuliah berdasarkan hasil evaluasi",
          penanggungJawab: "Masing-masing Kaprodi",
          deadline: "2025-01-31",
        },
      },
      {
        agenda: "Pembahasan kurikulum semester genap 2024/2025",
        pembahasan:
          "Dibahas jadwal perkuliahan semester genap, alokasi dosen pengampu, dan ketersediaan ruang kelas. Terdapat beberapa konflik jadwal yang perlu diselesaikan.",
        keputusan:
          "Menyetujui jadwal dengan penyesuaian untuk menghindari konflik. Koordinator jadwal akan melakukan finalisasi dalam 3 hari kerja.",
        tindakLanjut: {
          tugas: "Finalisasi jadwal perkuliahan semester genap",
          penanggungJawab: "Koordinator Jadwal",
          deadline: "2025-01-15",
        },
      },
      {
        agenda: "Rencana pengembangan kurikulum berbasis MBKM",
        pembahasan:
          "Wakil Dekan I memaparkan roadmap implementasi MBKM di fakultas. Target 80% program studi sudah menerapkan minimal 3 skema MBKM di tahun 2025.",
        keputusan:
          "Membentuk tim MBKM fakultas yang akan diketuai oleh Wakil Dekan I. Masing-masing prodi menunjuk 1 koordinator MBKM.",
        tindakLanjut: {
          tugas: "Pembentukan tim MBKM fakultas dan penunjukan koordinator MBKM prodi",
          penanggungJawab: "Wakil Dekan I dan Masing-masing Kaprodi",
          deadline: "2025-01-25",
        },
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
    tempat: "Ruang Rapat Miossu lt. 1",
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
        tindakLanjut: {
          tugas: "Dokumentasi dan publikasi capaian kinerja",
          penanggungJawab: "Kaur Sekretariat Dekan",
          deadline: "2025-01-25",
        },
      },
      {
        agenda: "Evaluasi target dan realisasi",
        pembahasan:
          "Diidentifikasi 14 indikator yang belum tercapai, sebagian besar terkait publikasi internasional dan kerjasama industri.",
        keputusan:
          "Menugaskan Wakil Dekan II untuk menyusun action plan percepatan pencapaian indikator yang tertinggal.",
        tindakLanjut: {
          tugas: "Penyusunan action plan percepatan indikator dan sosialisasi strategi peningkatan publikasi",
          penanggungJawab: "Wakil Dekan II dan Semua Kaprodi",
          deadline: "2025-02-01",
        },
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

  const exportToPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    
    // Header dengan border
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, 30);
    
    // Logo dan Judul (simulasi)
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TELKOM UNIVERSITY', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Jl. Telekomunikasi No. 1 Ters. BuahBatu Bandung 40257', pageWidth / 2, 26, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Risalah Rapat Tinjauan Manajemen Pimpinan', pageWidth / 2, 34, { align: 'center' });
    
    // No. Form Info (kanan atas)
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('No. Form: ITT-IT-REK-BPM-FM-017/006', pageWidth - 15, 15, { align: 'right' });
    doc.text('Revisi: 01', pageWidth - 15, 19, { align: 'right' });
    doc.text(`Berlaku: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth - 15, 23, { align: 'right' });
    doc.text('Hal.: 1', pageWidth - 15, 27, { align: 'right' });
    
    // Informasi Rapat
    let yPos = 50;
    autoTable(doc, {
      startY: yPos,
      head: [],
      body: [
        ['Hari/Tanggal/Waktu', `: ${new Date(notulensi.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} / ${notulensi.waktu} WIB`],
        ['Tempat', `: ${notulensi.tempat}`],
        ['Pemimpin Rapat', `: ${notulensi.pemimpin}`],
        ['Notulen', `: ${notulensi.notulen}`],
      ],
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: pageWidth - 70 }
      },
      margin: { left: margin, right: margin }
    });
    
    yPos = doc.lastAutoTable.finalY + 5;
    
    // Agenda
    autoTable(doc, {
      startY: yPos,
      head: [],
      body: [
        ['Agenda', `: ${notulensi.agendaRapat.map((a, i) => `${i + 1}. ${a}`).join('\n   ')}`],
      ],
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold', valign: 'top' },
        1: { cellWidth: pageWidth - 70 }
      },
      margin: { left: margin, right: margin }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
    
    // Tabel Pembahasan dengan Tindak Lanjut
    const tableData = [];
    notulensi.pembahasanKeputusan.forEach((item, index) => {
      const tindakLanjut = item.tindakLanjut || {};
      tableData.push([
        (index + 1).toString(),
        item.agenda,
        item.pembahasan,
        item.keputusan,
        tindakLanjut.penanggungJawab || '-',
        tindakLanjut.deadline ? new Date(tindakLanjut.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-',
        tindakLanjut.deadline && new Date(tindakLanjut.deadline) > new Date() ? 'Open' : 'Closed'
      ]);
    });
    
    autoTable(doc, {
      startY: yPos,
      head: [['No.', 'Topik', 'Pembahasan/Permasalahan', 'RencanaTindakan/Perbaikan', 'PIC', 'Target', 'Status']],
      body: tableData,
      theme: 'grid',
      styles: { 
        fontSize: 8, 
        cellPadding: 2,
        valign: 'top',
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      headStyles: { 
        fillColor: [220, 220, 220],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 35 },
        2: { cellWidth: 45 },
        3: { cellWidth: 45 },
        4: { cellWidth: 25 },
        5: { cellWidth: 15, halign: 'center' },
        6: { cellWidth: 15, halign: 'center' }
      },
      margin: { left: margin, right: margin }
    });
    
    // Simpan PDF
    const fileName = `Risalah_Rapat_${notulensi.judulRapat.replace(/\s+/g, '_')}_${notulensi.tanggal}.pdf`;
    doc.save(fileName);
  };

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
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportToPDF}
            className="bg-[#e31e25] hover:bg-[#c41a20] text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export to PDF
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

      {/* Pembahasan, Keputusan, dan Tindak Lanjut */}
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

                  {item.tindakLanjut && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Tindak Lanjut:
                      </h4>
                      <div className="border rounded-lg p-3 bg-muted/50">
                        <p className="text-sm font-medium mb-2">{item.tindakLanjut.tugas}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{item.tindakLanjut.penanggungJawab}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              Deadline:{" "}
                              {new Date(item.tindakLanjut.deadline).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <Badge variant="secondary" className="ml-auto">
                            {new Date(item.tindakLanjut.deadline) > new Date()
                              ? "Open"
                              : "Terlambat"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {index < notulensi.pembahasanKeputusan.length - 1 && (
                <Separator />
              )}
            </div>
          ))}
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
