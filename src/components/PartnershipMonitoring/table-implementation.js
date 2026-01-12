'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { Ellipsis, Loader2, PackageOpenIcon, Search, SearchX, X } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
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
import ImplementationDetailDrawer from "./implementation-detail-drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import EditApproval from "./edit-approval"
import { Button } from "../ui/button"
import EditStatusActivityPartnership from "./edit-status-activity-partnership"
import FilterTablePartnership from "./filter-table"

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

const TableImplementation = () => {
  // Data dummy partnership
  const dummyPartnershipData = [
    {
      id: 1,
      partnerName: "PT Telkom Indonesia",
      scope: "Nasional",
      docType: "MoU",
      docNumber: "001/MoU/FEB-TELKOM/2024",
      signedDate: "2024-01-15",
      expiryDate: "2027-01-15",
      status: "Aktif",
      category: "Akademik",
      activities: ["Magang", "Research Collaboration"],
      pic: "Prof. Dr. Budiman",
      archive: false
    },
    {
      id: 2,
      partnerName: "Universitas Gadjah Mada",
      scope: "Nasional",
      docType: "MoA",
      docNumber: "002/MoA/FEB-UGM/2024",
      signedDate: "2024-02-20",
      expiryDate: "2026-02-20",
      status: "Aktif",
      category: "Penelitian",
      activities: ["Joint Research", "Student Exchange"],
      pic: "Dr. Siti Nurhaliza",
      archive: false
    },
    {
      id: 3,
      partnerName: "Bank Mandiri",
      scope: "Nasional",
      docType: "IA",
      docNumber: "003/IA/FEB-MANDIRI/2024",
      signedDate: "2024-03-10",
      expiryDate: "2025-03-10",
      status: "Aktif",
      category: "Akademik",
      activities: ["Guest Lecture", "Internship Program"],
      pic: "Ahmad Susanto, M.M.",
      archive: false
    },
    {
      id: 4,
      partnerName: "Singapore Management University",
      scope: "Internasional",
      docType: "MoU",
      docNumber: "004/MoU/FEB-SMU/2023",
      signedDate: "2023-06-15",
      expiryDate: "2026-06-15",
      status: "Aktif",
      category: "Akademik",
      activities: ["Student Exchange", "Faculty Exchange", "Joint Program"],
      pic: "Prof. Dr. Budiman",
      archive: false
    },
    {
      id: 5,
      partnerName: "PT Unilever Indonesia",
      scope: "Nasional",
      docType: "MoA",
      docNumber: "005/MoA/FEB-UNILEVER/2024",
      signedDate: "2024-04-01",
      expiryDate: "2026-04-01",
      status: "Aktif",
      category: "Abdimas",
      activities: ["CSR Program", "Community Development"],
      pic: "Dr. Lina Marlina",
      archive: false
    },
    {
      id: 6,
      partnerName: "Deloitte Indonesia",
      scope: "Nasional",
      docType: "MoU",
      docNumber: "006/MoU/FEB-DELOITTE/2024",
      signedDate: "2024-05-20",
      expiryDate: "2027-05-20",
      status: "Aktif",
      category: "Penelitian",
      activities: ["Research Partnership", "Training Program"],
      pic: "Prof. Dr. Eko Prasetyo",
      archive: false
    },
    {
      id: 7,
      partnerName: "Pemerintah Kota Bandung",
      scope: "Lokal",
      docType: "IA",
      docNumber: "007/IA/FEB-PEMKOT/2023",
      signedDate: "2023-08-10",
      expiryDate: "2024-08-10",
      status: "Kadaluarsa",
      category: "Abdimas",
      activities: ["Community Service", "Policy Research"],
      pic: "Dr. Dewi Lestari",
      archive: false
    },
    {
      id: 8,
      partnerName: "Ernst & Young Indonesia",
      scope: "Nasional",
      docType: "MoA",
      docNumber: "008/MoA/FEB-EY/2024",
      signedDate: "2024-07-15",
      expiryDate: "2026-07-15",
      status: "Aktif",
      category: "Akademik",
      activities: ["Internship", "Workshop", "Certification Program"],
      pic: "Ahmad Susanto, M.M.",
      archive: false
    },
    {
      id: 9,
      partnerName: "University of Melbourne",
      scope: "Internasional",
      docType: "MoU",
      docNumber: "009/MoU/FEB-UMELB/2023",
      signedDate: "2023-09-01",
      expiryDate: "2026-09-01",
      status: "Aktif",
      category: "Akademik",
      activities: ["Double Degree Program", "Research Collaboration"],
      pic: "Prof. Dr. Budiman",
      archive: false
    },
    {
      id: 10,
      partnerName: "Google Indonesia",
      scope: "Nasional",
      docType: "MoU",
      docNumber: "010/MoU/FEB-GOOGLE/2024",
      signedDate: "2024-08-20",
      expiryDate: "2027-08-20",
      status: "Aktif",
      category: "Akademik",
      activities: ["Digital Marketing Training", "Data Analytics Workshop"],
      pic: "Dr. Siti Nurhaliza",
      archive: false
    },
    {
      id: 11,
      partnerName: "BCA",
      scope: "Nasional",
      docType: "IA",
      docNumber: "011/IA/FEB-BCA/2024",
      signedDate: "2024-09-10",
      expiryDate: "2025-09-10",
      status: "Aktif",
      category: "Akademik",
      activities: ["Guest Lecture", "Career Development"],
      pic: "Dr. Lina Marlina",
      archive: false
    },
    {
      id: 12,
      partnerName: "Universitas Indonesia",
      scope: "Nasional",
      docType: "MoA",
      docNumber: "012/MoA/FEB-UI/2023",
      signedDate: "2023-10-15",
      expiryDate: "2025-10-15",
      status: "Aktif",
      category: "Penelitian",
      activities: ["Joint Publication", "Conference Collaboration"],
      pic: "Prof. Dr. Eko Prasetyo",
      archive: false
    },
    {
      id: 13,
      partnerName: "KPMG Indonesia",
      scope: "Nasional",
      docType: "MoU",
      docNumber: "013/MoU/FEB-KPMG/2024",
      signedDate: "2024-11-01",
      expiryDate: "2027-11-01",
      status: "Aktif",
      category: "Akademik",
      activities: ["Audit Training", "Tax Workshop", "Consulting Project"],
      pic: "Ahmad Susanto, M.M.",
      archive: false
    },
    {
      id: 14,
      partnerName: "Gojek Indonesia",
      scope: "Nasional",
      docType: "MoA",
      docNumber: "014/MoA/FEB-GOJEK/2024",
      signedDate: "2024-12-05",
      expiryDate: "2026-12-05",
      status: "Aktif",
      category: "Akademik",
      activities: ["Startup Mentoring", "Internship", "Case Study"],
      pic: "Dr. Dewi Lestari",
      archive: false
    },
    {
      id: 15,
      partnerName: "Ministry of Finance Singapore",
      scope: "Internasional",
      docType: "MoU",
      docNumber: "015/MoU/FEB-MOFSING/2023",
      signedDate: "2023-05-20",
      expiryDate: "2026-05-20",
      status: "Aktif",
      category: "Penelitian",
      activities: ["Policy Research", "Expert Exchange"],
      pic: "Prof. Dr. Budiman",
      archive: false
    }
  ]

  const [partnershipData, setPartnershipData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    totalItem: 0,
    totalPages: 1,
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
    archive: null
  })

  const listRef = useRef(null)

  // Filter data berdasarkan search dan filters
  const getFilteredData = React.useCallback(() => {
    // Gabungkan dummy data dengan data dari localStorage
    let allData = [...dummyPartnershipData];

    if (typeof window !== 'undefined') {
      const implementations = JSON.parse(localStorage.getItem('partnershipImplementations') || '[]');
      allData = [...allData, ...implementations];
    }

    let filtered = allData;

    // Apply search
    if (debounceSearch) {
      filtered = filtered.filter(item =>
        item.partnerName?.toLowerCase().includes(debounceSearch.toLowerCase()) ||
        item.docNumber?.toLowerCase().includes(debounceSearch.toLowerCase()) ||
        item.pic?.toLowerCase().includes(debounceSearch.toLowerCase())
      )
    }

    // Apply filters
    if (filters.scope) {
      filtered = filtered.filter(item => item.scope === filters.scope)
    }
    if (filters.docType) {
      filtered = filtered.filter(item => item.docType === filters.docType)
    }
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status)
    }
    if (filters.archive !== null) {
      filtered = filtered.filter(item => item.archive === filters.archive)
    }

    // Pagination
    const totalPages = Math.ceil(filtered.length / rowFilter)
    const start = (currentPage - 1) * rowFilter
    const paginatedData = filtered.slice(start, start + rowFilter)

    setPartnershipData(paginatedData)
    setPagination({
      totalItem: filtered.length,
      totalPages: totalPages,
      currentPage: currentPage,
      pageSize: rowFilter
    })
  }, [debounceSearch, filters, currentPage, rowFilter])

  useEffect(() => {
    setCurrentPage(1) // Reset to page 1 when filters change
  }, [debounceSearch, filters, rowFilter])

  useEffect(() => {
    getFilteredData()

    // Refresh data ketika ada perubahan dari pengajuan yang disetujui
    const handleDataChange = () => {
      getFilteredData();
    };

    // Refresh data ketika localStorage berubah (dari tab/window lain)
    const handleStorageChange = (e) => {
      if (e.key === 'partnershipImplementations' || !e.key) {
        getFilteredData();
      }
    };

    window.addEventListener('partnershipDataChanged', handleDataChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('partnershipDataChanged', handleDataChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [getFilteredData])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [pagination.currentPage])

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4" ref={listRef}>
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
        <div className="flex items-center gap-4">
          <Select
            value={String(rowFilter)}
            onValueChange={(value) => (setRowFilter(parseInt(value)))}
          >
            <SelectTrigger className="w-full sm:w-48 text-start">
              {/* <PackageOpenIcon className="w-4 h-4" /> */}
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">Menampilkan 15 data</SelectItem>
              <SelectItem value="30">Menampilkan 30 data</SelectItem>
              <SelectItem value="3000">Semua Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
              <TableHead style={{ minWidth: '50px' }} className="max-sm:hidden">Jenis Kerjasama</TableHead>
              <TableHead style={{ minWidth: '50px' }} className="max-sm:hidden">PIC</TableHead>
              <TableHead style={{ minWidth: '100px' }} className="max-sm:hidden">Progres Pelaksanaan Aktivitas</TableHead>
              <TableHead style={{ minWidth: '100px' }} className="max-sm:hidden">Berlaku hingga</TableHead>
              <TableHead>Detail</TableHead>
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
                <TableCell className="max-sm:hidden capitalize">{partnership.scope || "-"}</TableCell>
                <TableCell className="max-sm:hidden">{partnership.partnershipType || "-"}</TableCell>
                <TableCell className="max-sm:hidden capitalize">{partnership.picInternal || "-"}</TableCell>
                <TableCell className="max-sm:hidden">
                  {(() => {
                    const activities = partnership.activities || [];
                    const completedActivities = activities.filter(a =>
                      typeof a === 'object' ? a.status?.toLowerCase() === 'terlaksana' : false
                    ).length;
                    const totalActivities = activities.length;
                    const percentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

                    return (
                      <div className="flex flex-col gap-1.5 min-w-[180px]">
                        <div className="flex justify-between items-center gap-2">
                          {/* <span className="text-[10px] font-medium text-slate-600 truncate">
                            Progress Pelaksanaan Aktivitas
                          </span> */}
                          <span className="text-[10px] font-bold text-[#e31e25] whitespace-nowrap">
                            {completedActivities}/{totalActivities} Terlaksana
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                          <div
                            className="h-full bg-gradient-to-r from-red-400 to-[#e31e25] transition-all duration-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </TableCell>
                <TableCell className="max-sm:hidden text-green-600 font-medium">
                  {formatDate(partnership.validUntil)}
                </TableCell>
                <TableCell className="">
                  {/* <ImplementationDetailDrawer partnership={partnership} /> */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <div className="">
                        <DropdownMenuItem asChild>
                          <ImplementationDetailDrawer partnership={partnership} />
                        </DropdownMenuItem>
                      </div>

                      <DropdownMenuSeparator />

                      <div className="flex flex-col gap-2 justify-start items-center">
                        <DropdownMenuItem asChild>
                          <EditStatusActivityPartnership
                            partnershipId={partnership.id}
                            partnership={partnership}
                            activities={partnership.activities}
                            onSuccess={() => getPartnershipData(currentPage)}
                          />
                        </DropdownMenuItem>
                      </div>
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

export default TableImplementation