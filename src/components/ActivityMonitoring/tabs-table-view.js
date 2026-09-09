import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import DeleteActivity from "./delete-activity";
import { CalendarPlus, Clock, Building2, MapPin, UserCheck, Users, Pencil, Loader2, AlertTriangle, CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCamelCaseLabel } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useRef } from "react";

const formatRangeInfo = (pagination, currentPage, filteredCount) => {
    const total = pagination?.totalItems ?? 0
    const pageSize = pagination?.pageSize ?? 0

    if (total === 0 || pageSize === 0) {
        return "0–0 dari 0"
    }

    if (pageSize >= 3000) {
        return `Menampilkan ${filteredCount} data`
    }

    const safePage = Math.max(currentPage || 1, 1)
    const start = (safePage - 1) * pageSize + 1
    const end = Math.min(safePage * pageSize, total)

    return `${start} – ${end} dari ${total} data`
}


const MONTHS_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const shiftMonth = (month, year, delta) => {
    let m = parseInt(month)
    let y = parseInt(year)
    if (isNaN(m) || m < 1 || m > 12) { m = new Date().getMonth() + 1 }
    if (isNaN(y)) { y = new Date().getFullYear() }
    m += delta
    if (m > 12) { m = 1; y++ }
    if (m < 1) { m = 12; y-- }
    return { month: String(m), year: String(y) }
}

const TabsTableView = ({
    isLoading,
    pagination,
    currentPage,
    onPageChange,
    filteredActivities,
    onEdit,
    onSuccess,
    exportToGoogleCalendar,
    getStatusBadge,
    // Month navigation props
    filterMonth,
    filterYear,
    setFilterMonth,
    setFilterYear,
}) => {
    const cardRef = useRef(null)
    const scrollCooldown = useRef(false)

    // Aktif hanya jika filterMonth bukan "all"
    const canScrollMonth = filterMonth !== 'all'

    useEffect(() => {
        const el = cardRef.current
        if (!el || !canScrollMonth) return

        const handleWheel = (e) => {
            e.preventDefault()
            if (scrollCooldown.current) return
            scrollCooldown.current = true
            setTimeout(() => { scrollCooldown.current = false }, 400)
            const { month, year } = shiftMonth(filterMonth, filterYear, e.deltaY > 0 ? 1 : -1)
            setFilterMonth(month)
            setFilterYear(year)
        }

        el.addEventListener('wheel', handleWheel, { passive: false })
        return () => el.removeEventListener('wheel', handleWheel)
    }, [canScrollMonth, filterMonth, filterYear, setFilterMonth, setFilterYear])

    const monthLabel = (() => {
        if (filterMonth === 'all') return 'Semua Bulan'
        const m = parseInt(filterMonth)
        const y = parseInt(filterYear)
        if (isNaN(m)) return 'Semua Bulan'
        return `${MONTHS_ID[m - 1]}${!isNaN(y) && filterYear !== 'all' ? ' ' + y : ''}`
    })()
    return (
        <Card ref={cardRef}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 flex-wrap gap-4">
                <div>
                    <CardTitle>Daftar Kegiatan</CardTitle>
                    <CardDescription>
                        Monitoring kegiatan unit dan program studi dengan deteksi konflik otomatis
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {/* Month navigator — hanya tampil jika filterMonth aktif */}
                    {canScrollMonth && (
                        <div className="flex items-center gap-1 border rounded-md px-1 py-0.5">
                            <button
                                onClick={() => {
                                    const { month, year } = shiftMonth(filterMonth, filterYear, -1)
                                    setFilterMonth(month)
                                    setFilterYear(year)
                                }}
                                className="p-1 rounded hover:bg-accent transition"
                                title="Bulan sebelumnya"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-xs font-medium px-1 min-w-[100px] text-center">{monthLabel}</span>
                            <button
                                onClick={() => {
                                    const { month, year } = shiftMonth(filterMonth, filterYear, 1)
                                    setFilterMonth(month)
                                    setFilterYear(year)
                                }}
                                className="p-1 rounded hover:bg-accent transition"
                                title="Bulan berikutnya"
                            >
                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}
                    <Button asChild size="sm" className="gap-2">
                        <Link href="/dashboard/manajemen-acara">
                            <CalendarCheck className="h-4 w-4" />
                            Manajemen Acara
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Waktu</TableHead>
                                <TableHead>Nama Kegiatan</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>Ruangan</TableHead>
                                <TableHead>Pejabat</TableHead>
                                <TableHead>Peserta</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={10}
                                        className="text-center py-8"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span className="text-muted-foreground">Memuat data...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredActivities.length === 0 ? (
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
                                        className={activity.hasConflict ? "bg-secondary/50 dark:bg-red-800" : ""}
                                    >
                                        <TableCell className="font-medium whitespace-nowrap">
                                            {activity.tanggal && !isNaN(new Date(activity.tanggal).getTime()) ? (
                                                <>
                                                    {new Date(activity.tanggal).toLocaleDateString("id-ID", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                    {activity.tanggalBerakhir && !isNaN(new Date(activity.tanggalBerakhir).getTime()) && (
                                                        <> - <br />{new Date(activity.tanggalBerakhir).toLocaleDateString("id-ID", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}</>
                                                    )}
                                                </>
                                            ) : "-"}
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
                                                    <div className="text-xs text-muted-foreground mt-1 truncate max-w-[260px]" title={activity.keterangan}>
                                                        {activity.keterangan}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Building2 className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-sm">
                                                    {activity.unit === "Lainnya" ? activity.otherUnit : formatCamelCaseLabel(activity.unit)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-sm">
                                                    {activity.ruangan === "Lainnya"
                                                        ? activity.locationDetail
                                                        : formatCamelCaseLabel(activity.ruangan)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                {activity.pejabat.map((p, idx) => {
                                                    const isConflicting = activity.conflictingOfficialsList?.includes(p);
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`flex items-center gap-1 ${isConflicting ? "text-red-600 font-medium" : ""}`}
                                                        >
                                                            {isConflicting ? (
                                                                <AlertTriangle className="h-3 w-3 text-red-600" />
                                                            ) : (
                                                                <UserCheck className="h-3 w-3 text-muted-foreground" />
                                                            )}
                                                            <span className="text-xs">{formatCamelCaseLabel(p)}</span>
                                                        </div>
                                                    )
                                                })}
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
                                        <TableCell>{getStatusBadge ? getStatusBadge(activity) : null}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <DeleteActivity
                                                    activityId={activity.id}
                                                    onSuccess={onSuccess}
                                                />

                                                {onEdit && (
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        onClick={() => onEdit(activity)}
                                                    >
                                                        <Pencil className="size-4" />
                                                        {/* Edit */}
                                                    </Button>
                                                )}
                                                {exportToGoogleCalendar && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => exportToGoogleCalendar(activity)}
                                                        className="gap-1"
                                                    >
                                                        <CalendarPlus className="h-3 w-3" />
                                                        Sync
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                {!isLoading && pagination.totalPages > 0 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            {formatRangeInfo(pagination, currentPage, filteredActivities.length)}
                        </div>
                        <div className="flex justify-start">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (currentPage > 1 && onPageChange) {
                                                    onPageChange(currentPage - 1)
                                                }
                                            }}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                                        if (
                                            page === 1 ||
                                            page === pagination.totalPages ||
                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                        ) {
                                            return (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={page === currentPage}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            if (onPageChange) {
                                                                onPageChange(page)
                                                            }
                                                        }}
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        } else if (
                                            page === currentPage - 2 ||
                                            page === currentPage + 2
                                        ) {
                                            return <PaginationItem key={page}><PaginationEllipsis /></PaginationItem>
                                        }
                                        return null
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                if (currentPage < pagination.totalPages && onPageChange) {
                                                    onPageChange(currentPage + 1)
                                                }
                                            }}
                                            className={currentPage >= pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default TabsTableView