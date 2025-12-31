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
import FilterTableContractManagement from "./filter-table"

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
    category: null,
    quarterly: null,
    unit: null,
  })

  const getContractData = React.useCallback(async (page = 1) => {
    try {
      setIsLoading(true)

      const filterParams = {}
      if (filters.category) filterParams.category = filters.category
      if (filters.quarterly) filterParams.quarterly = filters.quarterly
      if (filters.unit) filterParams.unit = filters.unit


      const params = {
        page,
        limit: rowFilter,
        search: debounceSearch || "",
        category: filters.category || undefined,
        quarterly: filters.quarterly || undefined,
        unit: filters.unit || undefined
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
  }, [rowFilter, debounceSearch, getContractData, filters])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      getContractData(newPage)
    }
  }

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const handleResetFilters = () => {
    setFilters({ category: null, quarterly: null, unit: null })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <FilterTableContractManagement
          filters={filters}
          setFilters={setFilters}
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

        <AddContract getContractData={getContractData} />
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

      <div className="relative border border-gray-200 rounded-lg shadow dark:border-gray-800">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="sticky left-0 z-20 bg-white dark:bg-gray-900"
                  style={{ minWidth: '60px' }}
                >
                  No
                </TableHead>

                <TableHead
                  className="sticky left-[60px] z-20 bg-white dark:bg-gray-900"
                  style={{ minWidth: '90px' }}
                >
                  Triwulan
                </TableHead>

                <TableHead
                  className="sticky left-[150px] z-20 bg-white dark:bg-gray-900"
                  style={{ minWidth: '280px' }}
                >
                  Responsibility
                </TableHead>
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
                    <TableCell
                      className="sticky left-0 z-10 bg-white dark:bg-gray-900"
                      style={{ minWidth: '60px' }}
                    >
                      {rowNumber}
                    </TableCell>

                    <TableCell
                      className="sticky left-[60px] z-10 bg-white dark:bg-gray-900"
                      style={{ minWidth: '90px' }}
                    >
                      {row.quarterly || "-"}
                    </TableCell>

                    <TableCell
                      className="sticky left-[150px] z-10 bg-white dark:bg-gray-900"
                      style={{ minWidth: '280px' }}
                    >
                      {row.responsibility || "-"}
                    </TableCell>

                    {/* kolom scrollable */}
                    <TableCell style={{ minWidth: '100px' }}>
                      {row.unit || "-"}
                    </TableCell>
                    <TableCell style={{ minWidth: '100px' }}>
                      {row.weight || "-"}
                    </TableCell>
                    <TableCell style={{ minWidth: '100px' }}>
                      {row.target || "-"}
                    </TableCell>
                    <TableCell style={{ minWidth: '100px' }}>
                      {row.realization || "-"}
                    </TableCell>
                    <TableCell style={{ minWidth: '100px' }}>
                      {row.achievement || "-"}
                    </TableCell>
                    <TableCell style={{ minWidth: '100px' }}>
                      {row.max || "-"}
                    </TableCell>
                    <TableCell style={{ minWidth: '100px' }}>
                      {row.min || "-"}
                    </TableCell>
                    <TableCell style={{ minWidth: '100px' }}>
                      {row.persReal || "-"}
                    </TableCell>
                    <TableCell style={{ minWidth: '100px' }}>
                      {row.value || "-"}
                    </TableCell>
                    <TableCell style={{ minWidth: '100px' }}>
                      {row.Input || "-"}
                    </TableCell>
                    <TableCell style={{ minWidth: '100px' }}>
                      {row.Monitor || "-"}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
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