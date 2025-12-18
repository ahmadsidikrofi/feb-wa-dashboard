'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
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

    // Fungsi untuk mengambil data pengajuan dari localStorage
    const getSubmissionsFromStorage = () => {
      if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('partnershipSubmissions') || '[]');
      }
      return [];
    };

    // Fungsi untuk mengonversi data submission ke format partnership table
    const convertSubmissionToPartnership = (submission) => {
      const yearIssued = new Date(submission.tanggalPengajuan).getFullYear();
      
      // Tentukan tipe dokumen berdasarkan status approval
      let docType = "Pengajuan Baru";
      if (submission.approvalWadek2 === "Returned" || submission.approvalWadek1 === "Returned" || 
          submission.approvalDekan === "Returned") {
        docType = "Permintaan Revisi";
      } else if (submission.approvalRektor === "Approved") {
        docType = "Selesai";
      }
      
      return {
        id: `submission-${submission.id}`,
        yearIssued: yearIssued,
        docType: docType,
        partnerName: submission.namaInstansi,
        scope: submission.ruangLingkup,
        // Status approval untuk setiap level
        approvalWadek2: submission.approvalWadek2 || "Menunggu",
        approvalWadek1: submission.approvalWadek1 || "Menunggu",
        approvalDekan: submission.approvalDekan || "Menunggu",
        approvalKabagKST: submission.approvalKabagKST || "Menunggu",
        approvalDirSPIO: submission.approvalDirSPIO || "Menunggu",
        approvalKaurLegal: submission.approvalKaurLegal || "Menunggu",
        approvalKabagSekpim: submission.approvalKabagSekpim || "Menunggu",
        approvalDirSPS: submission.approvalDirSPS || "Menunggu",
        approvalWarek1: submission.approvalWarek1 || "Menunggu",
        approvalRektor: submission.approvalRektor || "Menunggu",
        validUntil: null,
        status: submission.status,
        category: submission.jenisKerjasama,
        description: submission.deskripsi,
        purpose: submission.tujuan,
        benefit: submission.manfaat,
        duration: submission.durasi,
        contactName: submission.kontak,
        contactEmail: submission.email,
        contactPhone: submission.telepon,
        timeline: submission.timeline,
        submissionDate: submission.tanggalPengajuan,
        note: submission.keterangan,
      };
    };

    const getPartnershipData = React.useCallback(async (page = 1) => {
      try {
        setIsLoading(true)
        
        // Ambil data pengajuan dari localStorage
        const submissions = getSubmissionsFromStorage();
        const convertedSubmissions = submissions.map(convertSubmissionToPartnership);

        // Gabungkan dengan data dummy atau data dari API
        // Untuk saat ini, hanya menggunakan data submissions
        const allData = [...convertedSubmissions];

        // Filter berdasarkan search
        let filteredData = allData;
        if (debounceSearch) {
          filteredData = allData.filter(item => 
            item.partnerName?.toLowerCase().includes(debounceSearch.toLowerCase())
          );
        }

        // Filter berdasarkan filters
        if (filters.scope) {
          filteredData = filteredData.filter(item => item.scope === filters.scope);
        }
        if (filters.docType) {
          filteredData = filteredData.filter(item => item.docType === filters.docType);
        }
        if (filters.status) {
          filteredData = filteredData.filter(item => item.status === filters.status);
        }

        // Pagination
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / rowFilter);
        const startIndex = (page - 1) * rowFilter;
        const endIndex = startIndex + rowFilter;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setPartnershipData(paginatedData);
        setPagination({
          totalItem: totalItems,
          totalPages: totalPages,
          currentPage: page,
          pageSize: rowFilter,
        });
        setCurrentPage(page);

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
      
      // Refresh data ketika halaman menjadi visible
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          getPartnershipData(currentPage);
        }
      };
      
      // Refresh data ketika localStorage berubah (dari tab/window lain)
      const handleStorageChange = (e) => {
        if (e.key === 'partnershipSubmissions' || !e.key) {
          getPartnershipData(currentPage);
        }
      };
      
      // Refresh data ketika ada perubahan dari edit/delete di tab yang sama
      const handleDataChange = () => {
        getPartnershipData(currentPage);
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('partnershipDataChanged', handleDataChange);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('partnershipDataChanged', handleDataChange);
      };
    }, [rowFilter, debounceSearch, getPartnershipData, filters ])

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
          <AddPartnership getPartnershipData={getPartnershipData}/>
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

        <div className="border border-gray-200 rounded-lg shadow dark:border-gray-800 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ minWidth: '50px' }}>No</TableHead>
                <TableHead style={{ minWidth: '70px' }}>Tahun</TableHead>
                <TableHead style={{ minWidth: '150px' }}>Tipe Dokumen</TableHead>
                <TableHead style={{ minWidth: '200px' }}>Mitra</TableHead>
                <TableHead style={{ minWidth: '120px' }}>Ruang Lingkup</TableHead>
                <TableHead style={{ minWidth: '120px' }} className="text-center">Wadek II</TableHead>
                <TableHead style={{ minWidth: '120px' }} className="text-center">Wadek I</TableHead>
                <TableHead style={{ minWidth: '120px' }} className="text-center">Dekan</TableHead>
                <TableHead style={{ minWidth: '120px' }} className="text-center">Kabag KST</TableHead>
                <TableHead style={{ minWidth: '120px' }} className="text-center">Dir. SPIO</TableHead>
                <TableHead style={{ minWidth: '120px' }} className="text-center">Kaur Legal</TableHead>
                <TableHead style={{ minWidth: '120px' }} className="text-center">Kabag Sekpim</TableHead>
                <TableHead style={{ minWidth: '120px' }} className="text-center">Dir. SPS</TableHead>
                <TableHead style={{ minWidth: '120px' }} className="text-center">Warek I</TableHead>
                <TableHead style={{ minWidth: '120px' }} className="text-center">Rektor</TableHead>
                <TableHead style={{ minWidth: '100px' }} className="sticky right-0 bg-white dark:bg-slate-900">Kelola</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partnershipData.map((partnership, index) => {
                const getStatusBadge = (status) => {
                  if (status === "Approved" || status === "Disetujui") {
                    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Disetujui</span>
                  } else if (status === "Returned" || status === "Ditolak") {
                    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Ditolak</span>
                  } else if (status === "Pending") {
                    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
                  } else if (status === "Skipped") {
                    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Dilewati</span>
                  } else {
                    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">Menunggu</span>
                  }
                };

                const getDocTypeBadge = (docType) => {
                  if (docType === "Selesai") {
                    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{docType}</span>
                  } else if (docType === "Permintaan Revisi") {
                    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">{docType}</span>
                  } else {
                    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{docType}</span>
                  }
                };

                return (
                  <TableRow key={`${partnership.id}-${index}`}>
                    <TableCell>{(currentPage - 1) * rowFilter + index + 1}</TableCell>
                    <TableCell>{partnership.yearIssued || "-"}</TableCell>
                    <TableCell>
                      {getDocTypeBadge(partnership.docType)}
                    </TableCell>
                    <TableCell
                      className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                      title={partnership.partnerName || "-"}
                    >
                      {partnership.partnerName || "-"}
                    </TableCell>
                    <TableCell>{partnership.scope || "-"}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(partnership.approvalWadek2)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(partnership.approvalWadek1)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(partnership.approvalDekan)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(partnership.approvalKabagKST)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(partnership.approvalDirSPIO)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(partnership.approvalKaurLegal)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(partnership.approvalKabagSekpim)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(partnership.approvalDirSPS)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(partnership.approvalWarek1)}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(partnership.approvalRektor)}</TableCell>
                    <TableCell className="sticky right-0 bg-white dark:bg-slate-900">
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
                );
              })}
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