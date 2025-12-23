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
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import axios from "axios";

const AddActivity = ({
    isDialogOpen,
    setIsDialogOpen,
    editingId,
    // handleSubmit,
    formData,
    setFormData,
    units,
    prodiList,
    rooms,
    officials,
    onSuccess
}) => {
    const createActivity = async (payload) => {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/activity-monitoring`,
            payload,
            {
                headers: { "ngrok-skip-browser-warning": true },
            }
        );
        return res.data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const payload = {
                title: formData.namaKegiatan,
                date: formData.tanggal,
                startTime: `${formData.tanggal}T${formData.waktuMulai}:00`,
                endTime: `${formData.tanggal}T${formData.waktuSelesai}:00`,
                participants: Number(formData.jumlahPeserta) || 0,
                description: formData.keterangan,
                unit: formData.unit,
                room: formData.ruangan,
                prodi: formData.prodi || null,
                officials: formData.pejabat,
            };

            await createActivity(payload);

            toast.success("Kegiatan berhasil ditambahkan")
            setIsDialogOpen(false);

            setFormData({
                namaKegiatan: "",
                tanggal: "",
                waktuMulai: "",
                waktuSelesai: "",
                unit: "",
                prodi: "",
                ruangan: "",
                pejabat: [],
                jumlahPeserta: "",
                keterangan: "",
            });

            onSuccess()
        } catch (err) {
            console.error(err);
            toast.error("Gagal menyimpan kegiatan");
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#e31e25] hover:bg-[#c41a20]">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Kegiatan
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editingId ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingId
                            ? "Edit informasi kegiatan di bawah. Sistem akan mendeteksi konflik otomatis."
                            : "Isi form di bawah untuk menambahkan kegiatan. Sistem akan mendeteksi konflik otomatis."}
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
                                <Label htmlFor="prodi">Program Studi</Label>
                                <Select
                                    value={formData.prodi}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, prodi: value })
                                    }
                                >
                                    <SelectTrigger id="prodi">
                                        <SelectValue placeholder="Pilih prodi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="-">Tidak ada</SelectItem>
                                        {prodiList.map((prodi) => (
                                            <SelectItem key={prodi} value={prodi}>
                                                {prodi}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="ruangan">Ruangan *</Label>
                            <Select
                                value={formData.ruangan}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, ruangan: value })
                                }
                                required
                            >
                                <SelectTrigger id="ruangan">
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
                            onClick={() => {
                                setIsDialogOpen(false);
                                setEditingId(null);
                                setFormData({
                                    namaKegiatan: "",
                                    tanggal: "",
                                    waktuMulai: "",
                                    waktuSelesai: "",
                                    unit: "",
                                    prodi: "",
                                    ruangan: "",
                                    pejabat: [],
                                    jumlahPeserta: "",
                                    keterangan: "",
                                });
                            }}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#e31e25] hover:bg-[#c41a20]"
                        >
                            {editingId ? "Update Kegiatan" : "Simpan Kegiatan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddActivity