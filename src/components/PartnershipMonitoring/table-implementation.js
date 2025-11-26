'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { Loader2, PackageOpenIcon, Search, SearchX, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
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
import PartnershipDetailDrawer from "./partnership-detail-drawer"

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

const TableImplementation = () => {
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

    
    useEffect(() => {
      const getPartnershipData = async (page = 1) => {
          try {
              setIsLoading(true)
              const params = {
                page,
                limit: rowFilter,
                search: debounceSearch || ""
              }
              console.log('🔍 Sending request with params:', params)
  
              const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partnership`, {
                  params: {
                    page,
                    limit: rowFilter,
                    search: debounceSearch || ""
                  },
                  headers: {
                      "ngrok-skip-browser-warning": true,
                  },
              })
  
              console.log('📦 Response from backend:', res.data)
              console.log('📊 Data length:', res.data?.data?.length)
  
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
      }
      console.log('🔄 useEffect triggered - debounceSearch:', debounceSearch)
        getPartnershipData(1)
    }, [rowFilter, debounceSearch])

    const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= pagination.totalPages) {
        getPartnershipData(newPage)
      }
    }

    const handleClearSearch = () => {
      setSearchTerm('')
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
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
          <Select
            value={String(rowFilter)}
            onValueChange={(value) => (setRowFilter(parseInt(value)))}
          >
            <SelectTrigger className="w-full sm:w-38 text-start">
              <PackageOpenIcon className="w-4 h-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="3000">Semua Data</SelectItem>
            </SelectContent>
          </Select>
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
            <p>Tidak ada hasil untuk "{debounceSearch}"</p>
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
                <TableHead style={{ minWidth: '90px' }}>Tahun/Year</TableHead>
                <TableHead style={{ minWidth: '100px' }}>Doc. Type</TableHead>
                <TableHead className="max-sm:hidden block text-wrap" style={{ minWidth: '50px' }}>Mitra/Partner</TableHead>
                <TableHead style={{ minWidth: '50px' }}>Scope</TableHead>
                <TableHead style={{ minWidth: '100px' }}>Valid Until</TableHead>
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
                  <TableCell className="uppercase">{partnership.partnerName || "-"}</TableCell>
                  <TableCell className="max-sm:hidden block capitalize">{partnership.scope || "-"}</TableCell>
                  <TableCell className="text-green-600 font-medium">
                    {formatDate(partnership.validUntil)}
                  </TableCell>
                  <TableCell className="">
                    <PartnershipDetailDrawer partnership={partnership} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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