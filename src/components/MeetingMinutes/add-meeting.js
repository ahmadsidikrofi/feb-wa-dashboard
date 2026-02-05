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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const AddMeeting = ({ isDialogOpen, setIsDialogOpen, isLoading, setIsLoading, formData, setFormData, onSuccess, rooms }) => {

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (!formData.ruangan) {
            toast.error("Ruangan belum dipilih. Silakan pilih ruangan terlebih dahulu.", {
                style: { background: "#b91c1c", color: "#fef2f2" },
                iconTheme: { primary: "#b91c1c", secondary: "#fff" },
            });
            return
        }

        if (
            formData.ruangan === "Lainnya" &&
            (!formData.locationDetail || formData.locationDetail.trim() === "")
        ) {
            toast.error("Jika memilih 'Lainnya', isi detail lokasi kegiatan.");
            return
        }

        if (!rooms.includes(formData.ruangan)) {
            toast.error(
                "Data ruangan tidak valid. Silakan pilih ulang ruangan.",
                {
                    style: { background: "#b91c1c", color: "#fef2f2" },
                    iconTheme: { primary: "#b91c1c", secondary: "#fff" },
                }
            );
            return
        }

        try {
            const payload = {
                title: formData.judulRapat,
                date: formData.tanggal,
                startTime: `${formData.tanggal}T${formData.waktuMulai}:00`,
                endTime: `${formData.tanggal}T${formData.waktuSelesai}:00`,
                room: formData.ruangan,
                locationDetail: formData.locationDetail,
                leader: formData.pemimpin,
                notetaker: formData.notulen,

                participants: [],
                actionItems: [],
                agendas: [
                    {
                        title: "Pembahasan Utama",
                        discussion: null,
                        decision: null
                    }
                ]
            }

            await api.post(`/api/meetings`, payload)

            setIsDialogOpen(false)
            toast.success("Rapat berhasil ditambahkan")
            // Reset form
            setFormData({
                judulRapat: "",
                tanggal: "",
                waktuMulai: "",
                waktuSelesai: "",
                ruangan: "",
                pemimpin: "",
                notulen: "",
                keterangan: "",
            })
        } catch (error) {
            console.error("Gagal menambahkan rapat:", error)
            toast.error("Gagal menambahkan rapat. Silakan coba lagi.")
        } finally {
            onSuccess()
            setIsLoading(false)
        }
    }

    return (
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

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="ruangan">Ruangan *</Label>
                            <Select
                                value={formData.ruangan}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, ruangan: value })
                                }
                                required
                            >
                                <SelectTrigger id="ruangan" className="w-full">
                                    <SelectValue placeholder="Pilih ruangan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {rooms.map((room) => (
                                        <SelectItem key={room} value={room}>
                                            {room}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className={`grid gap-2 ${formData.ruangan === "Lainnya" ? `` : `hidden`}`}>
                            <Label htmlFor="locationDetail" className="text-red-500">Detail Lokasi *</Label>
                            <Input
                                id="locationDetail"
                                value={formData.locationDetail}
                                onChange={(e) =>
                                    setFormData({ ...formData, locationDetail: e.target.value })
                                }
                                required
                                placeholder="Contoh: Hotel Papandayan"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                            <div className="grid gap-2">
                                <Label htmlFor="agenda">Agenda Rapat *</Label>
                                <Input
                                    id="agenda"
                                    value={formData.agenda || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, agenda: e.target.value })
                                    }
                                    required
                                    placeholder="Tuliskan topik atau agenda rapat"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#e31e25] hover:bg-[#c41a20]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <span>Simpan Rapat</span>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddMeeting