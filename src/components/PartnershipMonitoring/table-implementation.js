'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { ChevronDownIcon, CircleFadingArrowUpIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"

const TableImplementation = () => {
    const [partnershipData, setPartnershipData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getPartnershipData = async () => {
        try {
            setIsLoading(true)
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partnership`, {
                headers: {
                    "ngrok-skip-browser-warning": true,
                },
            })
            console.log(res.data.data)
            setPartnershipData(res.data.data)
        } catch (err) {
            console.error("Gagal fetch contacts:", err)
            setContacts([])
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        getPartnershipData()
    }, [])

    return (
        <div className="border border-gray-200 rounded-lg shadow dark:border-gray-800">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead style={{ minWidth: '90px' }}>Tahun/Year</TableHead>
                        <TableHead  style={{ minWidth: '100px' }}>Doc. Type</TableHead>
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
                                {partnership.validUntil
                                    ? (() => {
                                        const date = new Date(partnership.validUntil);
                                        if (isNaN(date)) return "-";
                                        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
                                        const day = String(date.getDate()).padStart(2, '0');
                                        const month = months[date.getMonth()];
                                        const year = date.getFullYear();
                                        return `${day}-${month}-${year}`;
                                      })()
                                    : "-"
                                }
                            </TableCell>
                            <TableCell className="">
                                <Button variant="outline" size="icon" className="rounded-full">
                                    <CircleFadingArrowUpIcon />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        {/* <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination> */}
      </div>
    )
}

export default TableImplementation