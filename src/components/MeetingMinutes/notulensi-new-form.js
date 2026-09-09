"use client";

import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Plus, Save, Trash2, ClipboardList,
    Loader2, Users, MessageSquareText,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import ButtonWithIcon from "@/components/shadcn-space/radix/button/button-08";
import ButtonRipleSpotlight from "@/components/shadcn-space/radix/button/button-16";
import ButtonBlobFill from "@/components/shadcn-space/radix/button/button-17";
import ExportNotulensiExcelButton from "@/components/shared/ExportNotulensiExcelButton";

const ROOM_MAPPING = {
    "Ruang Rapat Manterawu lt. 2": "RuangRapatManterawuLt2",
    "Ruang Rapat Miossu lt. 1": "RuangRapatMiossuLt1",
    "Ruang Rapat Miossu lt. 2": "RuangRapatMiossuLt2",
    "Ruang Rapat Maratua lt. 1": "RuangRapatMaratuaLt1",
    "Aula FEB": "AulaFEB",
    "Aula Manterawu": "AulaManterawu",
    "Lainnya": "Lainnya",
};

const rooms = Object.keys(ROOM_MAPPING);

const defaultAgendaItem = () => ({
    id: undefined,
    agenda: "",
    pembahasan: "",
    keputusan: "",
    actionItems: [],
});

const defaultActionItem = () => ({
    id: undefined,
    tugas: "",
    penanggungJawab: "",
    deadline: "",
    status: "Open",
    notes: "",
});

export default function NotulensiNewForm({ meeting, onBack, meetingId }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ── Basic info ──────────────────────────────────────────────────
    const [formData, setFormData] = useState({
        judulRapat: meeting?.title || "",
        tanggal: meeting?.date ? new Date(meeting.date).toISOString().split("T")[0] : "",
        waktuMulai: (() => {
            if (!meeting?.startTime) return "";
            const d = new Date(meeting.startTime);
            return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        })(),
        waktuSelesai: (() => {
            if (!meeting?.endTime) return "";
            const d = new Date(meeting.endTime);
            return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        })(),
        ruangan: Object.keys(ROOM_MAPPING).find(k => ROOM_MAPPING[k] === meeting?.room) || meeting?.room || "",
        locationDetail: meeting?.locationDetail || "",
        pemimpin: meeting?.leader || "",
        notulen: meeting?.notetaker || "",
    });

    // ── Peserta ─────────────────────────────────────────────────────
    const [pesertaList, setPesertaList] = useState(
        meeting?.participants?.length > 0 ? meeting.participants : [""]
    );

    // ── Agenda/Pembahasan (rows) ─────────────────────────────────────
    const [pembahasanList, setPembahasanList] = useState(() => {
        if (meeting?.agendas?.length > 0) {
            return meeting.agendas.map(ag => ({
                id: ag.id,
                agenda: ag.title || "",
                pembahasan: ag.discussion || "",
                keputusan: ag.decision || "",
                actionItems: ag.actionItems?.length > 0
                    ? ag.actionItems.map(ai => ({
                        id: ai.id,
                        tugas: ai.task || "",
                        penanggungJawab: ai.pic || "",
                        deadline: ai.deadline ? new Date(ai.deadline).toISOString().split("T")[0] : "",
                        status: ai.status || "Open",
                        notes: ai.notes || "",
                    }))
                    : [],
            }));
        }
        return [defaultAgendaItem(), defaultAgendaItem(), defaultAgendaItem()];
    });

    // ── Signature ───────────────────────────────────────────────────
    const [notulen, setNotulen] = useState({ nama: meeting?.preparedByName || "", jabatan: meeting?.preparedByPosition || "" });
    const [pejabat, setPejabat] = useState({ nama: meeting?.reviewedByName || "", jabatan: meeting?.reviewedByPosition || "" });
    const [pimpinan, setPimpinan] = useState({ nama: meeting?.approvedByName || "", jabatan: meeting?.approvedByPosition || "" });

    // ── Handlers ───────────────────────────────────────────────────
    const addPembahasanRow = () => setPembahasanList(p => [...p, defaultAgendaItem()]);
    const removePembahasanRow = (i) => setPembahasanList(p => p.filter((_, idx) => idx !== i));
    const handlePembahasanChange = (i, field, val) => {
        setPembahasanList(p => { const n = [...p]; n[i] = { ...n[i], [field]: val }; return n; });
    };

    const addActionItem = (agendaIdx) => {
        setPembahasanList(p => {
            const n = [...p];
            n[agendaIdx] = { ...n[agendaIdx], actionItems: [...(n[agendaIdx].actionItems || []), defaultActionItem()] };
            return n;
        });
    };
    const removeActionItem = (agendaIdx, actionIdx) => {
        setPembahasanList(p => {
            const n = [...p];
            n[agendaIdx] = { ...n[agendaIdx], actionItems: n[agendaIdx].actionItems.filter((_, i) => i !== actionIdx) };
            return n;
        });
    };
    const handleActionItemChange = (agendaIdx, actionIdx, field, val) => {
        setPembahasanList(p => {
            const n = [...p];
            const items = [...n[agendaIdx].actionItems];
            items[actionIdx] = { ...items[actionIdx], [field]: val };
            n[agendaIdx] = { ...n[agendaIdx], actionItems: items };
            return n;
        });
    };

    const addPeserta = () => setPesertaList(p => [...p, ""]);
    const removePeserta = (i) => setPesertaList(p => p.filter((_, idx) => idx !== i));
    const handlePesertaChange = (i, val) => setPesertaList(p => { const n = [...p]; n[i] = val; return n; });

    // ── Save ────────────────────────────────────────────────────────
    const actualMeetingId = meetingId || meeting?.id;

    const handleSave = async () => {
        if (!formData.judulRapat || !formData.tanggal || !formData.waktuMulai || !formData.waktuSelesai || !formData.pemimpin) {
            toast.error("Waduh... Harap lengkapi Judul, Tanggal, Waktu, dan Pemimpin Rapat (*)", {
                position: "bottom-center",
                style: { background: "#fee2e2", color: "#991b1b" },
                className: "border border-red-500",
            });
            return;
        }

        if (!formData.ruangan) {
            toast.error("Ruangan belum dipilih. Silakan pilih ruangan terlebih dahulu.", {
                position: "bottom-center",
                style: { background: "#fee2e2", color: "#991b1b" },
                className: "border border-red-500",
            });
            return;
        }

        if (formData.ruangan === "Lainnya" && (!formData.locationDetail || formData.locationDetail.trim() === "")) {
            toast.error("Jika memilih 'Lainnya', isi detail lokasi kegiatan.", {
                position: "bottom-center",
                style: { background: "#fee2e2", color: "#991b1b" },
                className: "border border-red-500",
            });
            return;
        }

        try {
            setIsSubmitting(true);

            let agendasPayload = pembahasanList
                .filter(p => p.agenda.trim() !== "")
                .map(item => ({
                    id: item.id,
                    title: item.agenda,
                    discussion: item.pembahasan?.trim() || null,
                    decision: item.keputusan?.trim() || null,
                    actionItems: (item.actionItems || [])
                        .filter(ai => ai.tugas.trim() !== "")
                        .map(ai => ({
                            id: ai.id,
                            task: ai.tugas,
                            pic: ai.penanggungJawab?.trim() || "-",
                            deadline: ai.deadline ? `${ai.deadline}T00:00:00` : new Date().toISOString(),
                            status: ai.status || "Open",
                            notes: ai.notes || "",
                        })),
                }));

            if (agendasPayload.length === 0) {
                agendasPayload = [
                    {
                        title: formData.judulRapat || "Pembahasan Utama",
                        discussion: null,
                        decision: null,
                        actionItems: [],
                    },
                ];
            }

            const payload = {
                title: formData.judulRapat,
                date: formData.tanggal,
                startTime: new Date(`${formData.tanggal}T${formData.waktuMulai}:00`).toISOString(),
                endTime: new Date(`${formData.tanggal}T${formData.waktuSelesai}:00`).toISOString(),
                room: ROOM_MAPPING[formData.ruangan] || formData.ruangan || "RuangRapatManterawuLt2",
                locationDetail: formData.locationDetail || "",
                leader: formData.pemimpin,
                notetaker: formData.notulen,
                participants: pesertaList.filter(p => p.trim() !== ""),
                agendas: agendasPayload,
                preparedByName: notulen.nama,
                preparedByPosition: notulen.jabatan,
                reviewedByName: pejabat.nama,
                reviewedByPosition: pejabat.jabatan,
                approvedByName: pimpinan.nama,
                approvedByPosition: pimpinan.jabatan,
            };

            if (actualMeetingId) {
                await api.put(`/api/meetings/${actualMeetingId}`, payload);
            } else {
                await api.post("/api/meetings", payload);
            }

            toast.success(`Mantap... Kegiatan rapat berhasil ${actualMeetingId ? "diperbarui" : "disimpan"}`, {
                position: "bottom-center",
                style: { background: "#059669", color: "#d1fae5" },
                className: "border border-emerald-500",
            });
            onBack();
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            toast.error(error.response?.data?.message || `Yahh... Gagal ${actualMeetingId ? "memperbarui" : "menyimpan"} notulensi rapat`, {
                position: "bottom-center",
                style: { background: "#fee2e2", color: "#991b1b" },
                className: "border border-red-500",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="border-none shadow-sm bg-base-100">
            <CardContent className="">
                <Button variant="ghost" onClick={onBack} className="mb-6 gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                </Button>

                {/* ── Section 1: Input Kegiatan Rapat ── */}
                <div className="mb-10 pb-10 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                            <ClipboardList className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Input Kegiatan Rapat</h2>
                            <p className="text-sm text-muted-foreground mt-0.5">Informasi dasar dan detail rapat</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Grid 2 column */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* SOTK */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">SOTK</label>
                                <div className="mt-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 px-4 py-2.5 rounded-xl text-sm font-medium">
                                    Fakultas Ekonomi dan Bisnis
                                </div>
                            </div>

                            {/* Pemimpin Rapat */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pemimpin Rapat</label>
                                <Input
                                    placeholder="Nama pemimpin rapat"
                                    value={formData.pemimpin}
                                    onChange={e => setFormData({ ...formData, pemimpin: e.target.value })}
                                    className="mt-2 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary shadow-sm h-11"
                                />
                            </div>

                            {/* Tanggal */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tanggal Rapat</label>
                                <Input
                                    type="date"
                                    value={formData.tanggal}
                                    onChange={e => setFormData({ ...formData, tanggal: e.target.value })}
                                    className="mt-2 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary shadow-sm h-11"
                                />
                            </div>

                            {/* Notulen */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notulen</label>
                                <Input
                                    placeholder="Nama notulen"
                                    value={formData.notulen}
                                    onChange={e => setFormData({ ...formData, notulen: e.target.value })}
                                    className="mt-2 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary shadow-sm h-11"
                                />
                            </div>

                            {/* Waktu Mulai */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Waktu Mulai</label>
                                <Input
                                    type="time"
                                    value={formData.waktuMulai}
                                    onChange={e => setFormData({ ...formData, waktuMulai: e.target.value })}
                                    className="mt-2 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary shadow-sm h-11"
                                />
                            </div>

                            {/* Waktu Selesai */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Waktu Selesai</label>
                                <Input
                                    type="time"
                                    value={formData.waktuSelesai}
                                    onChange={e => setFormData({ ...formData, waktuSelesai: e.target.value })}
                                    className="mt-2 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary shadow-sm h-11"
                                />
                            </div>

                            {/* Ruangan */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ruangan</label>
                                <Select value={formData.ruangan} onValueChange={val => setFormData({ ...formData, ruangan: val })}>
                                    <SelectTrigger className="mt-2 rounded-xl border-gray-200 dark:border-gray-700 h-11 shadow-sm">
                                        <SelectValue placeholder="Pilih ruangan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rooms.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Location detail */}
                            {formData.ruangan === "Lainnya" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Detail Lokasi</label>
                                    <Input
                                        placeholder="Contoh: Hotel Papandayan"
                                        value={formData.locationDetail}
                                        onChange={e => setFormData({ ...formData, locationDetail: e.target.value })}
                                        className="mt-2 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary shadow-sm h-11"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Judul Rapat */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Judul Rapat</label>
                            <Textarea
                                placeholder="Contoh: Rapat Koordinasi Kurikulum Semester Ganjil 2025"
                                value={formData.judulRapat}
                                onChange={e => setFormData({ ...formData, judulRapat: e.target.value })}
                                className="mt-2 min-h-[80px] rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary shadow-sm resize-y"
                            />
                        </div>

                        {/* Peserta */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Peserta Rapat</label>
                                    <p className="text-xs text-muted-foreground mt-0.5">Tambahkan satu per satu peserta yang hadir.</p>
                                </div>
                                <ButtonRipleSpotlight
                                    icon={<Plus className="h-4 w-4" />}
                                    text="Tambah Peserta"
                                    variant="outline"
                                    onClick={addPeserta}
                                    className="gap-2 border-dashed rounded-lg text-muted-foreground hover:text-foreground shadow-sm text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                {pesertaList.map((p, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                                            {i + 1}
                                        </div>
                                        <Input
                                            value={p}
                                            onChange={e => handlePesertaChange(i, e.target.value)}
                                            placeholder={`Nama peserta ${i + 1}`}
                                            className="rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary shadow-sm h-10"
                                        />
                                        {pesertaList.length > 1 && (
                                            <ButtonWithIcon
                                                icon={<Trash2 className="h-4 w-4" />}
                                                onClick={() => removePeserta(i)}
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8 p-0 shrink-0"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Section 2: Dokumen Notulensi (Kop Surat style) ── */}
                <div className="p-6 mb-8 relative overflow-hidden">
                    {/* Kop Surat */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-2 border-border mb-8 rounded-xl overflow-hidden">
                        <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-border p-4 flex items-center justify-center bg-muted/20">
                            <Image
                                src="/logo-telyu.webp"
                                width={700}
                                height={700}
                                alt="Telkom University"
                                className="h-20 object-contain"
                                onError={e => e.target.style.display = "none"}
                            />
                        </div>
                        <div className="md:col-span-7 border-b md:border-b-0 md:border-r border-border p-6 flex flex-col items-center justify-center text-center">
                            <h2 className="font-bold text-xl tracking-tight text-primary">TELKOM UNIVERSITY</h2>
                            <p className="text-sm font-medium text-muted-foreground mt-1">Jl. Telekomunikasi No. 1 Ters. Buah Batu Bandung 40257</p>
                            <h3 className="font-bold text-lg mt-3 uppercase tracking-wider">Notulensi Rapat</h3>
                        </div>
                        <div className="md:col-span-3 bg-muted/10">
                            {[
                                ["No. Formulir", "FEB-NOT-001"],
                                ["Revisi", "0"],
                                ["Berlaku Efektif", "2024"],
                                ["Hal.", "1 dari 1"],
                            ].map(([label, val], i, arr) => (
                                <div key={label} className={`grid grid-cols-2 ${i < arr.length - 1 ? "border-b" : ""} border-border`}>
                                    <div className="p-2.5 text-[11px] font-bold border-r border-border text-muted-foreground uppercase tracking-wider">{label}</div>
                                    <div className="p-2.5 text-xs font-semibold">{val}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Rapat inline (mirip RTM) */}
                    <div className="space-y-4 mb-8 w-full max-w-3xl">
                        {[
                            { label: "Tanggal", type: "date", key: "tanggal" },
                            { label: "Tempat", type: "text", key: "ruangan" },
                        ].map(({ label, type, key }) => (
                            <div key={key} className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                                <div className="sm:col-span-3 text-sm font-bold text-muted-foreground uppercase tracking-wider">{label}</div>
                                <div className="sm:col-span-9">
                                    <Input
                                        type={type}
                                        value={formData[key]}
                                        onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                                        className="bg-transparent border-t-0 border-x-0 border-b-2 border-border rounded-none shadow-none focus-visible:ring-0 focus-visible:border-primary px-0 font-medium"
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="grid grid-cols-1 sm:grid-cols-12 items-start gap-2 sm:gap-4">
                            <div className="sm:col-span-3 text-sm font-bold text-muted-foreground uppercase tracking-wider pt-2">Judul Rapat</div>
                            <div className="sm:col-span-9">
                                <Textarea
                                    value={formData.judulRapat}
                                    onChange={e => setFormData({ ...formData, judulRapat: e.target.value })}
                                    className="min-h-[60px] bg-transparent border-2 border-border rounded-xl shadow-none focus-visible:ring-1 focus-visible:ring-primary font-medium resize-y"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Tabel Pembahasan/Agenda ── */}
                    <div className="border-2 border-border rounded-xl shadow-sm overflow-x-auto mb-6 bg-card">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="border-b-2 border-border hover:bg-transparent">
                                    <TableHead className="w-12 text-center font-bold text-foreground border-r border-border">NO</TableHead>
                                    <TableHead className="font-bold text-foreground min-w-[180px] border-r border-border">Agenda / Topik</TableHead>
                                    <TableHead className="font-bold text-foreground min-w-[220px] border-r border-border">Pembahasan</TableHead>
                                    <TableHead className="font-bold text-foreground min-w-[200px] border-r border-border">Keputusan</TableHead>
                                    <TableHead className="font-bold text-foreground min-w-[280px] border-r border-border">Tindak Lanjut</TableHead>
                                    <TableHead className="w-16 text-center font-bold text-foreground">Act</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pembahasanList.map((item, index) => (
                                    <TableRow key={index} className="border-b border-border last:border-0 hover:bg-muted/20 align-top">
                                        <TableCell className="text-center font-medium border-r border-border pt-4">{index + 1}</TableCell>
                                        <TableCell className="p-2.5 border-r border-border align-top">
                                            <Textarea
                                                value={item.agenda}
                                                onChange={e => handlePembahasanChange(index, "agenda", e.target.value)}
                                                placeholder="Topik agenda..."
                                                className="min-h-[80px] bg-transparent border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-primary p-2 resize-none shadow-none"
                                            />
                                        </TableCell>
                                        <TableCell className="p-2.5 border-r border-border align-top">
                                            <Textarea
                                                value={item.pembahasan}
                                                onChange={e => handlePembahasanChange(index, "pembahasan", e.target.value)}
                                                placeholder="Detail pembahasan..."
                                                className="min-h-[80px] bg-transparent border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-primary p-2 resize-none shadow-none"
                                            />
                                        </TableCell>
                                        <TableCell className="p-2.5 border-r border-border align-top">
                                            <Textarea
                                                value={item.keputusan}
                                                onChange={e => handlePembahasanChange(index, "keputusan", e.target.value)}
                                                placeholder="Keputusan yang diambil..."
                                                className="min-h-[80px] bg-transparent border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-primary p-2 resize-none shadow-none"
                                            />
                                        </TableCell>
                                        {/* Nested Action Items */}
                                        <TableCell className="p-2.5 border-r border-border align-top">
                                            <div className="space-y-2">
                                                {(item.actionItems || []).map((ai, aiIdx) => (
                                                    <div key={aiIdx} className="bg-muted/40 rounded-lg p-2 space-y-1.5 relative">
                                                        <Input
                                                            value={ai.tugas}
                                                            onChange={e => handleActionItemChange(index, aiIdx, "tugas", e.target.value)}
                                                            placeholder="Tugas..."
                                                            className="h-7 text-xs bg-transparent border-0 shadow-none focus-visible:ring-1 focus-visible:ring-primary"
                                                        />
                                                        <div className="grid grid-cols-2 gap-1">
                                                            <Input
                                                                value={ai.penanggungJawab}
                                                                onChange={e => handleActionItemChange(index, aiIdx, "penanggungJawab", e.target.value)}
                                                                placeholder="PIC"
                                                                className="h-7 text-xs bg-transparent border-0 shadow-none focus-visible:ring-1 focus-visible:ring-primary"
                                                            />
                                                            <Input
                                                                type="date"
                                                                value={ai.deadline}
                                                                onChange={e => handleActionItemChange(index, aiIdx, "deadline", e.target.value)}
                                                                className="h-7 text-xs bg-transparent border-0 shadow-none focus-visible:ring-1 focus-visible:ring-primary"
                                                            />
                                                        </div>
                                                        {/* Status toggle */}
                                                        <div className="flex items-center gap-1 flex-wrap">
                                                            {["Open", "Closed"].map(s => (
                                                                <button
                                                                    key={s}
                                                                    type="button"
                                                                    onClick={() => handleActionItemChange(index, aiIdx, "status", s)}
                                                                    className={`text-[10px] px-2 py-0.5 rounded-full border font-medium transition-colors ${ai.status === s
                                                                        ? s === "Open"
                                                                            ? "bg-red-100 text-red-700 border-red-300"
                                                                            : "bg-green-100 text-green-700 border-green-300"
                                                                        : "bg-transparent text-muted-foreground border-border hover:bg-muted"
                                                                        }`}
                                                                >
                                                                    {s}
                                                                </button>
                                                            ))}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeActionItem(index, aiIdx)}
                                                                className="ml-auto text-red-500 hover:text-red-700 text-[10px] px-2 py-0.5 rounded hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => addActionItem(index)}
                                                    className="w-full text-[11px] text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg py-1.5 flex items-center justify-center gap-1 hover:bg-muted/40 transition-colors"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                    Tambah Tindak Lanjut
                                                </button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-2.5 text-center align-middle">
                                            <div className="flex justify-center">
                                                <ButtonWithIcon
                                                    icon={<Trash2 className="h-4 w-4" />}
                                                    onClick={() => removePembahasanRow(index)}
                                                    variant="ghost"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8 p-0"
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-start mb-14">
                        <ButtonRipleSpotlight
                            icon={<Plus className="h-4 w-4" />}
                            text="Tambah baris"
                            variant="outline"
                            onClick={addPembahasanRow}
                            className="gap-2 border-dashed rounded-lg text-muted-foreground hover:text-foreground shadow-sm"
                        />
                    </div>

                    {/* ── Signatures ── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 text-center text-sm mb-4">
                        {[
                            { label: "Dibuat oleh,", state: notulen, setState: setNotulen },
                            { label: "Diperiksa oleh,", state: pejabat, setState: setPejabat },
                            { label: "Disetujui oleh,", state: pimpinan, setState: setPimpinan },
                        ].map(({ label, state, setState }) => (
                            <div key={label} className="flex flex-col justify-end min-h-[140px]">
                                {label === "Diperiksa oleh," && (
                                    <p className="mb-2 font-medium text-muted-foreground">
                                        Bandung, {formData.tanggal || "(tanggal)"}
                                    </p>
                                )}
                                <p className="mb-14 font-medium">{label}</p>
                                <div className="flex flex-col items-center">
                                    <Input
                                        placeholder="(nama)"
                                        value={state.nama}
                                        onChange={e => setState({ ...state, nama: e.target.value })}
                                        className="h-8 bg-transparent border-x-0 border-t-0 border-b-2 border-border rounded-none shadow-none text-center focus-visible:ring-0 focus-visible:border-primary max-w-[220px]"
                                    />
                                    <Input
                                        placeholder="(jabatan)"
                                        value={state.jabatan}
                                        onChange={e => setState({ ...state, jabatan: e.target.value })}
                                        className="h-8 bg-transparent border-x-0 border-t-0 border-b-0 rounded-none shadow-none text-center font-bold focus-visible:ring-0 max-w-[220px] text-muted-foreground mt-1"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Footer Buttons ── */}
                <div className="flex justify-end gap-4 border-t pt-6">
                    <ButtonRipleSpotlight
                        onClick={onBack}
                        text="Batal"
                        className="gap-2 border-dashed rounded-lg shadow-sm"
                    />
                    {actualMeetingId && (
                        <ExportNotulensiExcelButton meetingId={actualMeetingId} />
                    )}
                    <ButtonBlobFill
                        icon={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        text={isSubmitting ? "Menyimpan..." : "Simpan Notulensi"}
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className={`gap-2 rounded-lg shadow-sm ${isSubmitting ? "opacity-70 pointer-events-none" : "border-dashed"}`}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
