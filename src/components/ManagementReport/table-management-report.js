'use client'

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
} from "@/components/ui/table";

import { Checkbox } from "../ui/checkbox";
import { Edit3, ExternalLink, PlusCircleIcon, Search, SearchX, PackageOpenIcon, Loader2, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from "@/hooks/use-debounce";
import React, { useEffect, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import api from "@/lib/axios";
import ExportExcelButton from "../shared/ExportExcelButton";

const formatRangeInfo = (pagination, currentPage) => {
    const total = pagination?.totalItems ?? 0
    const pageSize = pagination?.pageSize ?? 0

    if (total === 0 || pageSize === 0) {
        return "0–0 dari 0"
    }

    const safePage = Math.max(currentPage || 1, 1)
    const start = (safePage - 1) * pageSize + 1
    const end = Math.min(safePage * pageSize, total)

    return `${start} – ${end} dari ${total} data`
}

const TableManagementReport = ({
    onEditIndicator,
    onStatusUpdate,
    onStatsUpdate,
    onAddReport,
    refreshKey,
    isLoading,
    setIsLoading
}) => {
    const [indicators, setIndicators] = useState([])
    const [toggleLoading, setToggleLoading] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPage: 0,
        currentPage: 1,
        pageSize: 10,
        currentYear: new Date().getFullYear()
    })

    const [searchTerm, setSearchTerm] = useState('')
    const [rowFilter, setRowFilter] = useState(10)
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear())
    const debounceSearch = useDebounce(searchTerm, 500)

    // Generate year options (current year and 5 years back)
    const currentYear = new Date().getFullYear()
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)

    const getManagementReportData = React.useCallback(async (page = 1) => {
        try {
            setIsLoading(true)

            const params = {
                page,
                limit: rowFilter,
                search: debounceSearch || "",
                year: yearFilter || undefined
            }

            const res = await api.get(`/api/management-reports`, {
                params: params,
            })

            if (res.data && res.data.success) {
                const { data = [], pagination: resPagination } = res.data
                setIndicators(Array.isArray(data) ? data : [])

                if (resPagination) {
                    setPagination(resPagination);
                    setCurrentPage(resPagination.currentPage);
                } else {
                    setPagination({
                        totalItems: 0,
                        totalPage: 0,
                        currentPage: page,
                        pageSize: rowFilter,
                        currentYear: yearFilter
                    });
                    setCurrentPage(page);
                }

                if (onStatsUpdate) {
                    const currentPageData = res.data.data || []
                    onStatsUpdate({
                        total: resPagination?.totalItems || 0,
                        completedTW1: currentPageData.filter((i) => i.tw1).length,
                        completedTW2: currentPageData.filter((i) => i.tw2).length,
                        completedTW3: currentPageData.filter((i) => i.tw3).length,
                        completedTW4: currentPageData.filter((i) => i.tw4).length,
                    })
                }
            }

        } catch (err) {
            console.error("Gagal fetch data:", err)
            setIndicators([])
        } finally {
            setIsLoading(false)
        }
    }, [rowFilter, debounceSearch, yearFilter, onStatsUpdate]);

    useEffect(() => {
        getManagementReportData(1)
    }, [rowFilter, debounceSearch, yearFilter, refreshKey])

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPage) {
            getManagementReportData(newPage)
        }
    }

    const handleClearSearch = () => {
        setSearchTerm('')
    }

    const handleToggle = async (indicatorId, quarter, currentStatus) => {
        const key = `${indicatorId}-${quarter}`

        // Optimistic update
        setIndicators((prev) =>
            prev.map((ind) =>
                ind.id === indicatorId ? { ...ind, [quarter]: !currentStatus } : ind
            )
        )

        // Set loading state for this specific cell
        setToggleLoading((prev) => ({ ...prev, [key]: true }))

        try {
            await api.patch(
                `/api/management-reports/${indicatorId}/toggle`,
                {
                    quarter,
                    value: !currentStatus,
                }
            )

            if (onStatusUpdate) {
                onStatusUpdate(indicatorId, quarter, !currentStatus)
            }
        } catch (error) {
            console.error("Gagal toggle status indikator:", error)

            // Revert perubahan optimistik jika gagal
            setIndicators((prev) =>
                prev.map((ind) =>
                    ind.id === indicatorId ? { ...ind, [quarter]: currentStatus } : ind
                )
            )
        } finally {
            setToggleLoading((prev) => {
                const { [key]: _, ...rest } = prev
                return rest
            })
        }
    }

    const handleEditIndicator = (indicator) => {
        if (onEditIndicator) {
            onEditIndicator(indicator)
        }
    }

    const managementReportColumns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Indikator', key: 'indicator', width: 40 },
        { header: 'Link bukti', key: 'evidenceLink', width: 40, style: { alignment: { wrapText: true } } },
        { header: 'Tahun', key: 'year', width: 8 },
        { header: 'Triwulan 1', key: 'tw1', width: 15 },
        { header: 'Triwulan 2', key: 'tw2', width: 15 },
        { header: 'Triwulan 3', key: 'tw3', width: 15 },
        { header: 'Triwulan 4', key: 'tw4', width: 15 },
    ]

    const handleMapData = (item) => {
        return {
            indicator: item.indicator,
            evidenceLink: item.evidenceLink,
            year: item.year,
            tw1: item.tw1,
            tw2: item.tw2,
            tw3: item.tw3,
            tw4: item.tw4,
        }
    }

    return (
        <>
            {/* Search and Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari indikator atau link evidence..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-10"
                            />
                            {searchTerm && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <div className="hidden xl:block max-sm:block">
                            <ExportExcelButton
                                apiEndpoint="/api/management-reports"
                                fileName="Rekap_Lapman"
                                sheetName="Laporan Manajemen"
                                columns={managementReportColumns}
                                mapData={handleMapData}
                            />
                        </div>
                        <div className="hidden xl:block max-sm:block">
                            <Select
                                className="hidden lg:block max-sm:block"
                                value={String(yearFilter)}
                                onValueChange={(value) => setYearFilter(parseInt(value))}
                            >
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearOptions.map((year) => (
                                        <SelectItem key={year} value={String(year)}>
                                            Tahun {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Select
                                value={String(rowFilter)}
                                onValueChange={(value) => setRowFilter(parseInt(value))}
                            >
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">Menampilkan 10 data</SelectItem>
                                    <SelectItem value="25">Menampilkan 25 data</SelectItem>
                                    <SelectItem value="50">Menampilkan 50 data</SelectItem>
                                    <SelectItem value="100">Menampilkan 100 data</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Button onClick={onAddReport}>
                                <PlusCircleIcon className="h-4 w-4 mr-2" />
                                Buat Pelaporan
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isLoading && (
                <div className="flex items-center justify-center py-4 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Mencari data...
                </div>
            )}

            {!isLoading && indicators.length === 0 && debounceSearch && (
                <div className="text-center py-8 text-gray-500">
                    <SearchX className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Tidak ada hasil untuk {debounceSearch}</p>
                    <button
                        onClick={handleClearSearch}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                        Hapus pencarian
                    </button>
                </div>
            )}

            {!isLoading && indicators.length === 0 && !debounceSearch && (
                <div className="text-center py-8 text-gray-500">
                    <PackageOpenIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Tidak ada data indikator</p>
                </div>
            )}

            {/* Indicators Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Indikator LAPMAN Fakultas</CardTitle>
                    <CardDescription>
                        Daftar indikator laporan manajemen dengan status per triwulan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[400px]">
                                        Indikator Lapman Fakultas
                                    </TableHead>
                                    <TableHead className="min-w-[200px]">Link Evidence</TableHead>
                                    <TableHead className="text-center">Status TW 1</TableHead>
                                    <TableHead className="text-center">Status TW 2</TableHead>
                                    <TableHead className="text-center">Status TW 3</TableHead>
                                    <TableHead className="text-center">Status TW 4</TableHead>
                                    <TableHead className="text-center">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!isLoading && indicators.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center text-muted-foreground py-8"
                                        >
                                            Tidak ada indikator ditemukan
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    indicators.map((indicator) => (
                                        <TableRow key={indicator.id}>
                                            <TableCell className="font-medium">
                                                {indicator.indicator}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {indicator.evidenceLink ? (
                                                        indicator.evidenceLink.split("\n").map(
                                                            (link, idx) =>
                                                                link.trim() && (
                                                                    <a
                                                                        key={idx}
                                                                        href={link.trim()}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                                                                    >
                                                                        {link.trim()}
                                                                        <ExternalLink className="h-3 w-3" />
                                                                    </a>
                                                                )
                                                        )
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">-</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Checkbox
                                                    checked={indicator.tw1 || false}
                                                    onCheckedChange={() =>
                                                        handleToggle(
                                                            indicator.id,
                                                            "tw1",
                                                            indicator.tw1 || false
                                                        )
                                                    }
                                                    className="mx-auto"
                                                    disabled={
                                                        !!toggleLoading[`${indicator.id}-tw1`] || isLoading
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Checkbox
                                                    checked={indicator.tw2 || false}
                                                    onCheckedChange={() =>
                                                        handleToggle(
                                                            indicator.id,
                                                            "tw2",
                                                            indicator.tw2 || false
                                                        )
                                                    }
                                                    className="mx-auto"
                                                    disabled={
                                                        !!toggleLoading[`${indicator.id}-tw2`] || isLoading
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Checkbox
                                                    checked={indicator.tw3 || false}
                                                    onCheckedChange={() =>
                                                        handleToggle(
                                                            indicator.id,
                                                            "tw3",
                                                            indicator.tw3 || false
                                                        )
                                                    }
                                                    className="mx-auto"
                                                    disabled={
                                                        !!toggleLoading[`${indicator.id}-tw3`] || isLoading
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Checkbox
                                                    checked={indicator.tw4 || false}
                                                    onCheckedChange={() =>
                                                        handleToggle(
                                                            indicator.id,
                                                            "tw4",
                                                            indicator.tw4 || false
                                                        )
                                                    }
                                                    className="mx-auto"
                                                    disabled={
                                                        !!toggleLoading[`${indicator.id}-tw4`] || isLoading
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditIndicator(indicator)}
                                                >
                                                    <Edit3 className="h-3 w-3" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {!isLoading && indicators.length > 0 && (
                <>
                    <div className="text-sm text-gray-600 mt-2">{formatRangeInfo(pagination, currentPage)}</div>

                    <div className="flex justify-start">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handlePageChange(currentPage - 1)
                                        }}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>

                                {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map((page) => {
                                    // Tampilkan halaman 1, halaman terakhir, dan halaman di sekitar current page
                                    if (
                                        page === 1 ||
                                        page === pagination.totalPage ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
                                        return (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={page === currentPage}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePageChange(page);
                                                    }}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    } else if (
                                        page === currentPage - 2 ||
                                        page === currentPage + 2
                                    ) {
                                        // Tampilkan Ellipsis jika ada gap
                                        return <PaginationItem key={page}><PaginationEllipsis /></PaginationItem>
                                    }
                                    return null;
                                })}

                                <PaginationItem>
                                    <PaginationNext href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handlePageChange(currentPage + 1)
                                        }}
                                        className={currentPage === pagination.totalPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </>
            )}
        </>
    )
}

export default TableManagementReport