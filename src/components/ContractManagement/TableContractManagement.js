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
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import FilterTablePartnership from "../PartnershipMonitoring/filter-table"
import AddContract from "./add-contract"

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

const TableContractManagement = () => {
    const [contractData, setContractData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState({
      totalItems: 0,
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

    const getContractData = React.useCallback(async (page = 1) => {
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

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contract-management`, {
          params: params,
          headers: {
            "ngrok-skip-browser-warning": true,
          },
        })

        if (res.data) {
          const { data = [], pagination: resPagination } = res.data
          setContractData(Array.isArray(data) ? data : [])
          
          if (resPagination) {
            setPagination(resPagination);
            setCurrentPage(resPagination.currentPage);
          } else {
            setPagination({
              totalItems: 0,
              totalPages: 0,
              currentPage: page,
              pageSize: rowFilter,
            });
            setCurrentPage(page);
          }
        }

      } catch (err) {
        console.error("Gagal fetch data:", err)
        setContractData([])
      } finally {
        setIsLoading(false)
      }
    }, [rowFilter, debounceSearch, filters]);

    useEffect(() => {
      console.log('🔄 useEffect triggered - debounceSearch:', debounceSearch)
      getContractData(1)
    }, [rowFilter, debounceSearch, getContractData, filters ])

    const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= pagination.totalPages) {
        getContractData(newPage)
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
              placeholder="Cari berdasarkan responsibility...."
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

          <AddContract getContractData={getContractData}/>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-4 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Mencari data...
          </div>
        )}

        {!isLoading && contractData.length === 0 && debounceSearch && (
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

        {!isLoading && contractData.length === 0 && !debounceSearch && (
          <div className="text-center py-8 text-gray-500">
            <PackageOpenIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Tidak ada data kontrak</p>
          </div>
        )}

        <div className="border border-gray-200 rounded-lg shadow dark:border-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ minWidth: '50px' }}>No</TableHead>
                <TableHead style={{ minWidth: '50px' }}>Triwulan</TableHead>
                <TableHead style={{ minWidth: '50px' }}>Responsibility</TableHead>
                <TableHead style={{ minWidth: '50px' }} className="max-sm:hidden">Unit</TableHead>
                <TableHead style={{ minWidth: '50px' }} className="max-sm:hidden">Bobot</TableHead>
                <TableHead style={{ minWidth: '50px' }} className="max-sm:hidden">Target</TableHead>
                <TableHead style={{ minWidth: '50px' }} className="max-sm:hidden">Realisasi</TableHead>
                <TableHead style={{ minWidth: '100px' }} className="max-sm:hidden">Pencapaian</TableHead>
                <TableHead style={{ minWidth: '100px' }} className="max-sm:hidden">Max</TableHead>
                <TableHead style={{ minWidth: '100px' }} className="max-sm:hidden">Min</TableHead>
                <TableHead style={{ minWidth: '100px' }} className="max-sm:hidden">% Real</TableHead>
                <TableHead style={{ minWidth: '100px' }} className="max-sm:hidden">Nilai</TableHead>
                <TableHead style={{ minWidth: '100px' }} className="max-sm:hidden">Input</TableHead>
                <TableHead style={{ minWidth: '100px' }} className="max-sm:hidden">Monitor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractData.map((row, idx) => {
                const rowNumber = (currentPage - 1) * rowFilter + idx + 1
                return (
                  <TableRow key={row.id || idx}>
                    <TableCell className="max-sm:hidden">{rowNumber}</TableCell>
                    <TableCell>{row.quarterly || "-"}</TableCell>
                    <TableCell className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">{row.responsibility || "-"}</TableCell>
                    <TableCell className="">{row.unit || "-"}</TableCell>
                    <TableCell className="">{row.weight || "-"}</TableCell>
                    <TableCell className="max-sm:hidden">{row.target || "-"}</TableCell>
                    <TableCell className="max-sm:hidden">{row.realization || "-"}</TableCell>
                    <TableCell className="max-sm:hidden">{row.achievement || "-"}</TableCell>
                    <TableCell className="max-sm:hidden">{row.max || "-"}</TableCell>
                    <TableCell className="max-sm:hidden">{row.min || "-"}</TableCell>
                    <TableCell className="max-sm:hidden">{row.persReal || "-"}</TableCell>
                    <TableCell className="max-sm:hidden">{row.value || "-"}</TableCell>
                    <TableCell style={{ minWidth: '50px' }} className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap max-sm:hidden">{row.Input || "-"}</TableCell>
                    <TableCell className="max-sm:hidden">{row.Monitor || "-"}</TableCell>
                  </TableRow>
                )
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

export default TableContractManagement