import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Badge } from "../ui/badge";
import { useState } from "react";
import { CheckCircle, Clock, Eye, Timer, XCircle } from "lucide-react";
import { Button } from "../ui/button";

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
]

const SubmissionHistory = () => {
    const [submissions, setSubmissions] = useState(initialSubmissions);

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
                                            className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full border-2 ${index === submission.timeline.length - 1
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
    }

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

    return (
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
    )
}

export default SubmissionHistory