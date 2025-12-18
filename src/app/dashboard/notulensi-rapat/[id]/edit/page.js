"use client";

import { use, useState, useEffect } from "react";
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
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Dummy notulensi data (same as detail page)
const notulensiData = {
  1: {
    id: 1,
    judulRapat: "Rapat Koordinasi Kurikulum Semester Genap",
    tanggal: "2025-01-10",
    waktuMulai: "09:00",
    waktuSelesai: "11:00",
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
    waktuMulai: "13:00",
    waktuSelesai: "15:30",
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

export default function EditNotulensiPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const existingData = notulensiData[id];

  const [formData, setFormData] = useState({
    judulRapat: "",
    tanggal: "",
    waktuMulai: "",
    waktuSelesai: "",
    tempat: "",
    pemimpin: "",
    notulen: "",
  });

  const [pesertaList, setPesertaList] = useState([""]);
  const [agendaList, setAgendaList] = useState([""]);
  const [pembahasanList, setPembahasanList] = useState([
    { agenda: "", pembahasan: "", keputusan: "" },
  ]);
  const [tindakLanjutList, setTindakLanjutList] = useState([
    { tugas: "", penanggungJawab: "", deadline: "" },
  ]);
  const [penutup, setPenutup] = useState("");

  // Load existing data on mount
  useEffect(() => {
    if (existingData) {
      setFormData({
        judulRapat: existingData.judulRapat,
        tanggal: existingData.tanggal,
        waktuMulai: existingData.waktuMulai,
        waktuSelesai: existingData.waktuSelesai,
        tempat: existingData.tempat,
        pemimpin: existingData.pemimpin,
        notulen: existingData.notulen,
      });
      setPesertaList(existingData.peserta || [""]);
      setAgendaList(existingData.agendaRapat || [""]);
      setPembahasanList(
        existingData.pembahasanKeputusan || [
          { agenda: "", pembahasan: "", keputusan: "" },
        ]
      );
      setTindakLanjutList(
        existingData.tindakLanjut || [
          { tugas: "", penanggungJawab: "", deadline: "" },
        ]
      );
      setPenutup(existingData.penutup || "");
    }
  }, [existingData]);

  if (!existingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Notulensi tidak ditemukan
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

  const handleAddPeserta = () => setPesertaList([...pesertaList, ""]);
  const handleRemovePeserta = (index) =>
    setPesertaList(pesertaList.filter((_, i) => i !== index));
  const handlePesertaChange = (index, value) => {
    const newList = [...pesertaList];
    newList[index] = value;
    setPesertaList(newList);
  };

  const handleAddAgenda = () => setAgendaList([...agendaList, ""]);
  const handleRemoveAgenda = (index) =>
    setAgendaList(agendaList.filter((_, i) => i !== index));
  const handleAgendaChange = (index, value) => {
    const newList = [...agendaList];
    newList[index] = value;
    setAgendaList(newList);
  };

  const handleAddPembahasan = () =>
    setPembahasanList([
      ...pembahasanList,
      { agenda: "", pembahasan: "", keputusan: "" },
    ]);
  const handleRemovePembahasan = (index) =>
    setPembahasanList(pembahasanList.filter((_, i) => i !== index));
  const handlePembahasanChange = (index, field, value) => {
    const newList = [...pembahasanList];
    newList[index][field] = value;
    setPembahasanList(newList);
  };

  const handleAddTindakLanjut = () =>
    setTindakLanjutList([
      ...tindakLanjutList,
      { tugas: "", penanggungJawab: "", deadline: "" },
    ]);
  const handleRemoveTindakLanjut = (index) =>
    setTindakLanjutList(tindakLanjutList.filter((_, i) => i !== index));
  const handleTindakLanjutChange = (index, field, value) => {
    const newList = [...tindakLanjutList];
    newList[index][field] = value;
    setTindakLanjutList(newList);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.judulRapat || !formData.tanggal || !formData.pemimpin) {
      toast.error("Mohon lengkapi data rapat");
      return;
    }

    const updatedData = {
      ...formData,
      peserta: pesertaList.filter((p) => p.trim() !== ""),
      agenda: agendaList.filter((a) => a.trim() !== ""),
      pembahasan: pembahasanList.filter((p) => p.agenda.trim() !== ""),
      tindakLanjut: tindakLanjutList.filter((t) => t.tugas.trim() !== ""),
      penutup,
    };

    console.log("Updated Notulensi:", updatedData);
    toast.success("Notulensi berhasil diperbarui");

    setTimeout(() => {
      router.push(`/dashboard/notulensi-rapat/${id}`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/dashboard/notulensi-rapat/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#e31e25]">
            Edit Notulensi Rapat
          </h1>
          <p className="text-muted-foreground">
            Perbarui dokumentasi hasil rapat
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informasi Rapat */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Rapat</CardTitle>
            <CardDescription>
              Data dasar rapat yang dilaksanakan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                      setFormData({ ...formData, waktuMulai: e.target.value })
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
                      setFormData({ ...formData, waktuSelesai: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tempat">Tempat *</Label>
                  <Input
                    id="tempat"
                    value={formData.tempat}
                    onChange={(e) =>
                      setFormData({ ...formData, tempat: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pemimpin">Pemimpin Rapat *</Label>
                  <Input
                    id="pemimpin"
                    value={formData.pemimpin}
                    onChange={(e) =>
                      setFormData({ ...formData, pemimpin: e.target.value })
                    }
                    required
                  />
                </div>
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
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peserta Rapat */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Peserta Rapat</CardTitle>
                <CardDescription>
                  Daftar peserta yang hadir dalam rapat
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPeserta}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Peserta
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pesertaList.map((peserta, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={peserta}
                    onChange={(e) => handlePesertaChange(index, e.target.value)}
                    placeholder={`Peserta ${index + 1}`}
                  />
                  {pesertaList.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemovePeserta(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agenda Rapat */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Agenda Rapat</CardTitle>
                <CardDescription>Daftar agenda yang dibahas</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAgenda}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Agenda
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agendaList.map((agenda, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="font-semibold text-[#e31e25] min-w-[30px]">
                    {index + 1}.
                  </span>
                  <Input
                    value={agenda}
                    onChange={(e) => handleAgendaChange(index, e.target.value)}
                    placeholder={`Agenda ${index + 1}`}
                  />
                  {agendaList.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveAgenda(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pembahasan dan Keputusan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pembahasan dan Keputusan</CardTitle>
                <CardDescription>
                  Detail pembahasan dan keputusan setiap agenda
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPembahasan}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pembahasan
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pembahasanList.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-[#e31e25] hover:bg-[#c41a20]">
                      Agenda {index + 1}
                    </Badge>
                    {pembahasanList.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemovePembahasan(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Judul Agenda</Label>
                      <Input
                        value={item.agenda}
                        onChange={(e) =>
                          handlePembahasanChange(
                            index,
                            "agenda",
                            e.target.value
                          )
                        }
                        placeholder="Judul agenda yang dibahas"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Pembahasan</Label>
                      <Textarea
                        value={item.pembahasan}
                        onChange={(e) =>
                          handlePembahasanChange(
                            index,
                            "pembahasan",
                            e.target.value
                          )
                        }
                        placeholder="Detail pembahasan agenda..."
                        rows={4}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Keputusan</Label>
                      <Textarea
                        value={item.keputusan}
                        onChange={(e) =>
                          handlePembahasanChange(
                            index,
                            "keputusan",
                            e.target.value
                          )
                        }
                        placeholder="Keputusan yang diambil..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tindak Lanjut */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tindak Lanjut</CardTitle>
                <CardDescription>
                  Tugas dan tanggung jawab hasil rapat
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTindakLanjut}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Tindak Lanjut
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tindakLanjutList.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Tugas {index + 1}</span>
                    {tindakLanjutList.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveTindakLanjut(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Tugas</Label>
                      <Input
                        value={item.tugas}
                        onChange={(e) =>
                          handleTindakLanjutChange(
                            index,
                            "tugas",
                            e.target.value
                          )
                        }
                        placeholder="Deskripsi tugas..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Penanggung Jawab</Label>
                        <Input
                          value={item.penanggungJawab}
                          onChange={(e) =>
                            handleTindakLanjutChange(
                              index,
                              "penanggungJawab",
                              e.target.value
                            )
                          }
                          placeholder="Nama/Unit penanggung jawab"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Deadline</Label>
                        <Input
                          type="date"
                          value={item.deadline}
                          onChange={(e) =>
                            handleTindakLanjutChange(
                              index,
                              "deadline",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
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
            <CardDescription>Kesimpulan dan penutup rapat</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={penutup}
              onChange={(e) => setPenutup(e.target.value)}
              placeholder="Tuliskan kesimpulan dan keterangan penutup rapat..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/notulensi-rapat/${id}`)}
          >
            Batal
          </Button>
          <Button type="submit" className="bg-[#e31e25] hover:bg-[#c41a20]">
            <Save className="h-4 w-4 mr-2" />
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
