'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { ChevronDownIcon, CircleFadingArrowUpIcon } from "lucide-react"
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

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

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

const DetailField = ({ label, value }) => (
  <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-white via-slate-50 to-slate-100/40 p-4 shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="mt-1 text-base font-semibold text-slate-900">{value || "-"}</p>
  </div>
)

const TableImplementation = () => {
    const [partnershipData, setPartnershipData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState({
      totalItem: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 10
    })

    const getPartnershipData = async (page = 1) => {
        try {
            setIsLoading(true)
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partnership`, {
                params: { page },
                headers: {
                    "ngrok-skip-browser-warning": true,
                },
            })

            if (res.data) {
              const { data = [], pagination: resPagination, currentPage: resCurrentPage } = res.data
              setPartnershipData(Array.isArray(data) ? data : [])
              setPagination(resPagination ?? {
                totalItem: 0,
                totalPages: 0,
                currentPage: page,
                pageSize: 10,
              })
              setCurrentPage(resCurrentPage ?? page)
            }

        } catch (err) {
            console.error("Gagal fetch contacts:", err)
            setPartnershipData([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getPartnershipData(1)
    }, [])

    const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= pagination.totalPages) {
        getPartnershipData(newPage)
      }
    }

    return (
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg shadow dark:border-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ minWidth: '90px' }}>Tahun/Year</TableHead>
                <TableHead style={{ minWidth: '100px' }}>Doc. Type</TableHead>
                <TableHead className="max-sm:hidden block" style={{ minWidth: '50px' }}>Mitra/Partner</TableHead>
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
                  <TableCell>{partnership.partnerName || "-"}</TableCell>
                  <TableCell className="max-sm:hidden block capitalize">{partnership.scope || "-"}</TableCell>
                  <TableCell className="text-green-600 font-medium">
                    {formatDate(partnership.validUntil)}
                  </TableCell>
                  <TableCell className="">
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full border-blue-100 text-blue-700 hover:bg-blue-50">
                          <CircleFadingArrowUpIcon className="h-4 w-4" />
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="max-h-[90vh] overflow-y-auto rounded-t-3xl bg-gradient-to-b from-blue-50/80 via-white to-white">
                        <DrawerHeader className="space-y-2 text-left">
                          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                            {partnership.docType || "Dokumen"}
                          </p>
                          <DrawerTitle className="text-2xl font-semibold text-slate-900">
                            {partnership.partnerName || "Detail Kemitraan"}
                          </DrawerTitle>
                          <p className="text-sm text-slate-500">
                            Catatan kemitraan pendidikan ini menampilkan ringkasan status dokumen, cakupan kolaborasi, dan periode berlakunya.
                          </p>
                        </DrawerHeader>
                        <div className="grid gap-4 px-6 pb-2 md:grid-cols-2">
                          <DetailField label="Tahun Penerbitan" value={partnership.yearIssued} />
                          <DetailField label="Berlaku Hingga" value={formatDate(partnership.validUntil)} />
                          <DetailField label="Scope Kolaborasi" value={partnership.scope} />
                          <DetailField label="Institusi Penanggung Jawab" value={partnership.partnerName} />
                          <DetailField label="Status Implementasi" value={partnership.status || partnership.implementationStatus} />
                          <DetailField label="PIC Kampus" value={partnership.picName || partnership.picEmail || "-"} />
                        </div>
                        {partnership.notes && (
                          <div className="px-6 pb-4">
                            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Catatan Kolaborasi</p>
                              <p className="mt-1 text-sm text-amber-800">{partnership.notes}</p>
                            </div>
                          </div>
                        )}
                        <DrawerFooter>
                          <DrawerClose asChild>
                            <Button variant="outline" className="border-slate-300 text-slate-700">
                              Tutup
                            </Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>

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