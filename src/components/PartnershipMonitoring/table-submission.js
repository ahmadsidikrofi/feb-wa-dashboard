'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Ellipsis, FileEditIcon, Loader2, PackageOpenIcon, PlusCircle, Search, SearchX, Trash2, X } from "lucide-react"
import React, { useEffect, useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDebounce } from "@/hooks/use-debounce"
import SubmissionDetailDrawer from "./submission-detail-drawer"
import { Button } from "../ui/button"
import FilterTablePartnership from "./filter-table"
import AddPartnership from "./addPartnership"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import EditSubmission from "./edit-submission"
import EditApproval from "./edit-approval"
import DeletePartnership from "./delete-partnership"
import api from "@/lib/axios"
import ExportExcelButton from "../shared/ExportExcelButton"

const formatDate = (value) => {
  if (!value) return "-"
  const date = new Date(value)
  if (isNaN(date)) return "-"
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  return formatter.format(date)
}

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

const TableSubmission = () => {
  const [partnershipData, setPartnershipData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    totalItem: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 15
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [rowFilter, setRowFilter] = useState(15)
  const debounceSearch = useDebounce(searchTerm, 500)
  const [filters, setFilters] = useState({
    scope: null,
    docType: null,
    status: null,
    archive: null,
  })

  const [activityType, setActivityType] = useState([])

  const getPartnershipData = React.useCallback(async (page = 1) => {
    try {
      setIsLoading(true)
      const params = {
        page,
        limit: rowFilter,
        search: debounceSearch || "",
        scope: filters.scope,
        docType: filters.docType,
        status: filters.status,
        archive: filters.archive
      }

      const res = await api.get(`/api/partnership`, {
        params: params,
      })

      if (res.data) {
        const { data = [], pagination: resPagination } = res.data
        setPartnershipData(Array.isArray(data) ? data : [])

        if (resPagination) {
          setPagination(resPagination);
          setCurrentPage(resPagination.currentPage);
        } else {
          setPagination({
            totalItem: 0,
            totalPages: 0,
            currentPage: page,
            pageSize: rowFilter,
          });
          setCurrentPage(page);
        }
      }

    } catch (err) {
      console.error("Gagal fetch data:", err)
      setPartnershipData([])
    } finally {
      setIsLoading(false)
    }
  }, [rowFilter, debounceSearch, filters]);

  useEffect(() => {
    console.log('🔄 useEffect triggered - debounceSearch:', debounceSearch)
    getPartnershipData(1)
  }, [rowFilter, debounceSearch, getPartnershipData, filters])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      getPartnershipData(newPage)
    }
  }

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const handleResetFilters = () => {
    setFilters({ scope: null, docType: null, status: null, archive: null })
  }

  const partnershipColumns = [
    { header: 'No', key: 'no', width: 5 },

    // -- Identitas Utama --
    { header: 'Tahun', key: 'yearIssued', width: 8 },
    { header: 'Nama Mitra', key: 'partnerName', width: 35, style: { alignment: { wrapText: true } } },
    { header: 'Tipe Dokumen', key: 'docType', width: 15 },
    { header: 'Jenis Kerjasama', key: 'partnershipType', width: 15 },
    { header: 'Lingkup', key: 'scope', width: 15 },

    // -- Dokumen & Nomor --
    { header: 'No. Internal', key: 'docNumberInternal', width: 25 },
    { header: 'No. Eksternal', key: 'docNumberExternal', width: 25 },
    { header: 'Link Dokumen', key: 'docLink', width: 30 },

    // -- Tanggal & Durasi --
    { header: 'Tgl Dibuat', key: 'dateCreated', width: 15 },
    { header: 'Tgl TTD', key: 'dateSigned', width: 15 },
    { header: 'Berlaku Hingga', key: 'validUntil', width: 15 },
    { header: 'Durasi', key: 'duration', width: 15 },
    { header: 'Tipe Penandatanganan', key: 'signingType', width: 20 },

    // -- PIC (Person In Charge) --
    { header: 'PIC Internal', key: 'picInternal', width: 20 },
    { header: 'PIC Eksternal', key: 'picExternal', width: 20 },
    { header: 'Telp PIC Eksternal', key: 'picExternalPhone', width: 20 },

    // -- ACTIVITIES (Sub-Kolom Visual) --
    // Kita set 'vertical: top' biar sejajar atas kalau datanya banyak
    { header: 'Kegiatan (Tipe)', key: 'actType', width: 20, style: { alignment: { wrapText: true, vertical: 'top' } } },
    { header: 'Kegiatan (Status)', key: 'actStatus', width: 20, style: { alignment: { wrapText: true, vertical: 'top' } } },
    { header: 'Kegiatan (Catatan)', key: 'actNotes', width: 30, style: { alignment: { wrapText: true, vertical: 'top' } } },

    // -- Approval Status (Wadek, Dekan, dll) --
    { header: 'Appr. Wadek 1', key: 'approvalWadek1', width: 15 },
    { header: 'Appr. Wadek 2', key: 'approvalWadek2', width: 15 },
    { header: 'Appr. Kabag KST', key: 'approvalKabagKST', width: 15 },
    { header: 'Appr. Dir SPIO', key: 'approvalDirSPIO', width: 15 },
    { header: 'Appr. Kaur Legal', key: 'approvalKaurLegal', width: 15 },
    { header: 'Appr. Kabag Sekpim', key: 'approvalKabagSekpim', width: 15 },
    { header: 'Appr. Dir SPS', key: 'approvalDirSPS', width: 15 },
    { header: 'Appr. Dekan', key: 'approvalDekan', width: 15 },
    { header: 'Appr. Warek 1', key: 'approvalWarek1', width: 15 },
    { header: 'Appr. Rektor', key: 'approvalRektor', width: 15 },

    // -- Lainnya --
    { header: 'Catatan Umum', key: 'notes', width: 30 },
    { header: 'Hardcopy', key: 'hasHardcopy', width: 12 },
    { header: 'Softcopy', key: 'hasSoftcopy', width: 12 },
    { header: 'Last Updated', key: 'updatedAt', width: 20 },
  ]

  const handleMapData = (item) => {
    const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID') : '-';

    const fmtBool = (b) => b ? "Ada" : "Tidak";

    // --- LOGIC SUB-KOLOM ACTIVITIES ---
    // Kita gabungkan jadi string dengan ENTER (\n) sebagai pemisah
    let actType = "-";
    let actStatus = "-";
    let actNotes = "-";

    if (item.activities && item.activities.length > 0) {
      // Map masing-masing field lalu join dengan Newline
      actType = item.activities.map(a => `• ${a.type}`).join('\n');
      actStatus = item.activities.map(a => a.status).join('\n');
      actNotes = item.activities.map(a => a.notes || '-').join('\n');
    }

    return {
      // Identity
      yearIssued: item.yearIssued,
      partnerName: item.partnerName,
      docType: item.docType,
      partnershipType: item.partnershipType,
      scope: item.scope,

      // Docs
      docNumberInternal: item.docNumberInternal || '-',
      docNumberExternal: item.docNumberExternal || '-',
      docLink: item.docLink || '-',

      // Dates
      dateCreated: fmtDate(item.dateCreated),
      dateSigned: fmtDate(item.dateSigned),
      validUntil: fmtDate(item.validUntil),
      duration: item.duration || '-',
      signingType: item.signingType || '-',

      // PIC
      picInternal: item.picInternal || '-',
      picExternal: item.picExternal || '-',
      picExternalPhone: item.picExternalPhone || '-',

      // 🔥 ACTIVITIES (Displit jadi 3 kolom tapi sejajar barisnya)
      actType: actType,
      actStatus: actStatus,
      actNotes: actNotes,

      // Approvals (Mapping satu-satu biar rapi)
      approvalWadek1: item.approvalWadek1 || '-',
      approvalWadek2: item.approvalWadek2 || '-',
      approvalKabagKST: item.approvalKabagKST || '-',
      approvalDirSPIO: item.approvalDirSPIO || '-',
      approvalKaurLegal: item.approvalKaurLegal || '-',
      approvalKabagSekpim: item.approvalKabagSekpim || '-',
      approvalDirSPS: item.approvalDirSPS || '-',
      approvalDekan: item.approvalDekan || '-',
      approvalWarek1: item.approvalWarek1 || '-',
      approvalRektor: item.approvalRektor || '-',

      // Meta
      notes: item.notes || '-',
      hasHardcopy: fmtBool(item.hasHardcopy),
      hasSoftcopy: fmtBool(item.hasSoftcopy),
      updatedAt: fmtDate(item.updatedAt),
    };
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <FilterTablePartnership
          filters={filters}
          setFilter={setFilters}
          onReset={handleResetFilters}
        />
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan nama mitra...."
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
        <div>
          <ExportExcelButton
            apiEndpoint="/api/partnership"
            fileName="Rekap_Partnership"
            sheetName="Partnership"
            columns={partnershipColumns}
            mapData={handleMapData}
            queryParams={filters}
          />
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={String(rowFilter)}
            onValueChange={(value) => (setRowFilter(parseInt(value)))}
          >
            <SelectTrigger className="w-full sm:w-48 text-start">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">Menampilkan 15 data</SelectItem>
              <SelectItem value="30">Menampilkan 30 data</SelectItem>
              <SelectItem value="3000">Semua Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <AddPartnership getPartnershipData={getPartnershipData} />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-4 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Mencari data...
        </div>
      )}

      {!isLoading && partnershipData.length === 0 && debounceSearch && (
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

      <div className="border border-gray-200 rounded-lg shadow dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ minWidth: '50px' }}>Tahun</TableHead>
              <TableHead style={{ minWidth: '50px' }}>Tipe Dokumen</TableHead>
              <TableHead
                className="max-sm:hidden"
                style={{ minWidth: '100px', maxWidth: '220px' }}>
                Mitra
              </TableHead>
              <TableHead style={{ minWidth: '50px' }} className="max-sm:hidden">Tingkat</TableHead>
              <TableHead style={{ minWidth: '50px' }} className="max-sm:hidden">Persetujuan Dekan</TableHead>
              <TableHead style={{ minWidth: '50px' }} className="max-sm:hidden">Persetujuan Warek 1</TableHead>
              <TableHead style={{ minWidth: '50px' }} className="max-sm:hidden">Persetujuan Rektor</TableHead>
              <TableHead style={{ minWidth: '100px' }} className="max-sm:hidden">Berlaku hingga</TableHead>
              <TableHead>Kelola</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partnershipData.map((partnership) => (
              <TableRow key={partnership.id}>
                <TableCell>{partnership.yearIssued || "-"}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {partnership.docType || "-"}
                  </span>
                </TableCell>
                <TableCell
                  className="uppercase max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
                  title={partnership.partnerName || "-"}
                >
                  {partnership.partnerName || "-"}
                </TableCell>
                <TableCell className="max-sm:hidden block capitalize">{partnership.scope || "-"}</TableCell>
                <TableCell className="max-sm:hidden capitalize">{partnership.approvalDekan || "-"}</TableCell>
                <TableCell className="max-sm:hidden capitalize">{partnership.approvalWarek1 || "-"}</TableCell>
                <TableCell className="max-sm:hidden capitalize">{partnership.approvalRektor || "-"}</TableCell>
                <TableCell className="max-sm:hidden text-green-600 font-medium">
                  {formatDate(partnership.validUntil)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <SubmissionDetailDrawer partnership={partnership} />
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <div className="flex flex-col gap-2 justify-start items-center">
                        <DropdownMenuItem asChild>
                          <EditSubmission
                            partnershipId={partnership.id}
                            partnership={partnership}
                            onSuccess={() => getPartnershipData(currentPage)}
                          />
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <EditApproval
                            partnershipId={partnership.id}
                            partnership={partnership}
                            onSuccess={() => getPartnershipData(currentPage)}
                          />
                        </DropdownMenuItem>
                      </div>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <DeletePartnership
                          partnershipId={partnership.id}
                          isLoading={isLoading}
                          setIsLoading={setIsLoading}
                          onSuccess={() => getPartnershipData(currentPage)}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
              // Tampilkan halaman 1, halaman terakhir, dan halaman di sekitar current page
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
                className={currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default TableSubmission