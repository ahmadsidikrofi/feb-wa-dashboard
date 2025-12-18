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
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  FileText,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function BuatNotulensiPage() {
  const router = useRouter();

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

  const handleAddPeserta = () => {
    setPesertaList([...pesertaList, ""]);
  };

  const handleRemovePeserta = (index) => {
    setPesertaList(pesertaList.filter((_, i) => i !== index));
  };

  const handlePesertaChange = (index, value) => {
    const newList = [...pesertaList];
    newList[index] = value;
    setPesertaList(newList);
  };

  const handleAddAgenda = () => {
    setAgendaList([...agendaList, ""]);
  };

  const handleRemoveAgenda = (index) => {
    setAgendaList(agendaList.filter((_, i) => i !== index));
  };

  const handleAgendaChange = (index, value) => {
    const newList = [...agendaList];
    newList[index] = value;
    setAgendaList(newList);
  };

  const handleAddPembahasan = () => {
    setPembahasanList([
      ...pembahasanList,
      { agenda: "", pembahasan: "", keputusan: "" },
    ]);
  };

  const handleRemovePembahasan = (index) => {
    setPembahasanList(pembahasanList.filter((_, i) => i !== index));
  };

  const handlePembahasanChange = (index, field, value) => {
    const newList = [...pembahasanList];
    newList[index][field] = value;
    setPembahasanList(newList);
  };

  const handleAddTindakLanjut = () => {
    setTindakLanjutList([
      ...tindakLanjutList,
      { tugas: "", penanggungJawab: "", deadline: "" },
    ]);
  };

  const handleRemoveTindakLanjut = (index) => {
    setTindakLanjutList(tindakLanjutList.filter((_, i) => i !== index));
  };

  const handleTindakLanjutChange = (index, field, value) => {
    const newList = [...tindakLanjutList];
    newList[index][field] = value;
    setTindakLanjutList(newList);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.judulRapat || !formData.tanggal || !formData.pemimpin) {
      toast.error("Mohon lengkapi data rapat");
      return;
    }

    const notulensiData = {
      ...formData,
      peserta: pesertaList.filter((p) => p.trim() !== ""),
      agenda: agendaList.filter((a) => a.trim() !== ""),
      pembahasan: pembahasanList.filter((p) => p.agenda.trim() !== ""),
      tindakLanjut: tindakLanjutList.filter((t) => t.tugas.trim() !== ""),
      penutup,
    };

    console.log("Notulensi Data:", notulensiData);
    toast.success("Notulensi berhasil disimpan");

    // Redirect back to list
    setTimeout(() => {
      router.push("/dashboard/notulensi-rapat");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
            Buat Notulensi Rapat
          </h1>
          <p className="text-muted-foreground">
            Dokumentasikan hasil rapat dengan lengkap
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
                  placeholder="Contoh: Rapat Koordinasi Kurikulum Semester Genap"
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
                    placeholder="Contoh: Ruang Sidang Dekan"
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
                    placeholder="Contoh: Wakil Dekan I"
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
                  placeholder="Nama petugas notulen"
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
                <CardDescription>
                  Daftar agenda yang akan dibahas
                </CardDescription>
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
            onClick={() => router.push("/dashboard/notulensi-rapat")}
          >
            Batal
          </Button>
          <Button type="submit" className="bg-[#e31e25] hover:bg-[#c41a20]">
            <Save className="h-4 w-4 mr-2" />
            Simpan Notulensi
          </Button>
        </div>
      </form>
    </div>
  );
}
