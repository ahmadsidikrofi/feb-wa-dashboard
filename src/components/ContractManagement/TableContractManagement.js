"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import {
  Ellipsis,
  FileEditIcon,
  Loader2,
  PackageOpenIcon,
  PlusCircle,
  Search,
  SearchX,
  Trash2,
  X,
  Edit,
} from "lucide-react";
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

import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import FilterTablePartnership from "../PartnershipMonitoring/filter-table";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date)) return "-";
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return formatter.format(date);
};

const formatRangeInfo = (pagination, currentPage) => {
  const total = pagination?.totalItems ?? 0;
  const pageSize = pagination?.pageSize ?? 0;

  if (total === 0 || pageSize === 0) {
    return "0–0 dari 0";
  }

  const safePage = Math.max(currentPage || 1, 1);
  const start = (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, total);

  return `${start} – ${end} dari ${total} data`;
};

// Data dummy untuk kontrak management
const dummyContractData = [
  {
    id: 1,
    quarterly: "TW-2",
    responsibility: "Kelengkapan Dokumen Akademik",
    unit: "%",
    weight: 3,
    target: 90,
    realization: 100.0,
    achievement: 111.11,
    max: 105,
    min: 80,
    persReal: 105,
    value: 3.15,
    Input: "Kelengkapan Dokumen Semester Genap",
    Monitor: "-",
  },
  {
    id: 2,
    quarterly: "TW-2",
    responsibility: "Jumlah mahasiswa aktif",
    unit: "Jumlah",
    weight: "-",
    target: "-",
    realization: "-",
    achievement: "-",
    max: "-",
    min: "-",
    persReal: "-",
    value: "-",
    Input: "-",
    Monitor: "-",
  },
  {
    id: 3,
    quarterly: "TW-2",
    responsibility: "Jumlah dosen tetap dengan jabatan fungsional",
    unit: "Jumlah",
    weight: 3,
    target: 10,
    realization: 19.0,
    achievement: 190.0,
    max: 110,
    min: 80,
    persReal: 110,
    value: 3.3,
    Input: "-",
    Monitor: "-",
  },
  {
    id: 4,
    quarterly: "TW-2",
    responsibility: "Jumlah mahasiswa yang mengikuti MBKM",
    unit: "Jumlah",
    weight: "-",
    target: "-",
    realization: "-",
    achievement: "-",
    max: "-",
    min: "-",
    persReal: "-",
    value: "-",
    Input: "-",
    Monitor: "-",
  },
  {
    id: 5,
    quarterly: "TW-2",
    responsibility: "Persentase dosen berkualifikasi S3",
    unit: "%",
    weight: "-",
    target: "-",
    realization: "-",
    achievement: "-",
    max: "-",
    min: "-",
    persReal: "-",
    value: "-",
    Input: "-",
    Monitor: "-",
  },
  {
    id: 6,
    quarterly: "TW-2",
    responsibility: "Persentase dosen dengan sertifikasi internasional",
    unit: "%",
    weight: "-",
    target: "-",
    realization: "-",
    achievement: "-",
    max: "-",
    min: "-",
    persReal: "-",
    value: "-",
    Input: "Jumlah Dosen Bersertifikat",
    Monitor: "-",
  },
  {
    id: 7,
    quarterly: "TW-2",
    responsibility: "Jumlah HKI yang terdaftar",
    unit: "Jumlah",
    weight: "-",
    target: "-",
    realization: "-",
    achievement: "-",
    max: "-",
    min: "-",
    persReal: "-",
    value: "-",
    Input: "-",
    Monitor: "-",
  },
  {
    id: 8,
    quarterly: "TW-2",
    responsibility: "Tim Startup Berbasis Riset",
    unit: "Jumlah",
    weight: "-",
    target: "-",
    realization: "-",
    achievement: "-",
    max: "-",
    min: "-",
    persReal: "-",
    value: "-",
    Input: "-",
    Monitor: "-",
  },
  {
    id: 9,
    quarterly: "TW-2",
    responsibility: "Penelitian Dosen yang dipublikasi di jurnal internasional",
    unit: "Jumlah",
    weight: 10,
    target: 20,
    realization: 46.0,
    achievement: 230.0,
    max: 110,
    min: 80,
    persReal: 110,
    value: 11,
    Input: "https://telkom.university.ac.id/research",
    Monitor: "-",
  },
  {
    id: 10,
    quarterly: "TW-2",
    responsibility: "Inovasi dan Entrepreneurship mahasiswa",
    unit: "-",
    weight: "-",
    target: "-",
    realization: "-",
    achievement: "-",
    max: "-",
    min: "-",
    persReal: "-",
    value: "-",
    Input: "-",
    Monitor: "-",
  },
  {
    id: 11,
    quarterly: "TW-1",
    responsibility: "Rasio dosen terhadap mahasiswa",
    unit: "Rasio",
    weight: 5,
    target: 30,
    realization: 28.5,
    achievement: 95.0,
    max: 105,
    min: 80,
    persReal: 95,
    value: 4.75,
    Input: "Data Rasio Semester 1",
    Monitor: "Sedang Dipantau",
  },
  {
    id: 12,
    quarterly: "TW-1",
    responsibility:
      "Publikasi hasil penelitian di jurnal nasional terakreditasi",
    unit: "Jumlah",
    weight: 8,
    target: 15,
    realization: 18.0,
    achievement: 120.0,
    max: 110,
    min: 80,
    persReal: 110,
    value: 8.8,
    Input: "https://sinta.kemdikbud.go.id",
    Monitor: "Selesai",
  },
  {
    id: 13,
    quarterly: "TW-3",
    responsibility: "Kerjasama dengan industri",
    unit: "Jumlah",
    weight: 6,
    target: 8,
    realization: 12.0,
    achievement: 150.0,
    max: 110,
    min: 80,
    persReal: 110,
    value: 6.6,
    Input: "MoU dengan 12 Perusahaan",
    Monitor: "Selesai",
  },
  {
    id: 14,
    quarterly: "TW-3",
    responsibility: "Program pengabdian masyarakat",
    unit: "Jumlah",
    weight: 4,
    target: 12,
    realization: 10.0,
    achievement: 83.33,
    max: 105,
    min: 80,
    persReal: 83,
    value: 3.32,
    Input: "Laporan PkM Semester Ganjil",
    Monitor: "-",
  },
  {
    id: 15,
    quarterly: "TW-4",
    responsibility: "Akreditasi program studi",
    unit: "%",
    weight: 7,
    target: 100,
    realization: 100.0,
    achievement: 100.0,
    max: 105,
    min: 80,
    persReal: 100,
    value: 7,
    Input: "Sertifikat Akreditasi Unggul",
    Monitor: "Selesai",
  },
];

const TableContractManagement = () => {
  const [contractData, setContractData] = useState(dummyContractData);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalItems: dummyContractData.length,
    totalPages: Math.ceil(dummyContractData.length / 15),
    currentPage: 1,
    pageSize: 15,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [rowFilter, setRowFilter] = useState(15);
  const debounceSearch = useDebounce(searchTerm, 500);
  const [filters, setFilters] = useState({
    scope: null,
    docType: null,
    status: null,
    archive: null,
  });

  const getContractData = React.useCallback(
    async (page = 1) => {
      try {
        setIsLoading(true);

        // Filter data berdasarkan search
        let filteredData = dummyContractData;
        if (debounceSearch) {
          filteredData = dummyContractData.filter(
            (item) =>
              item.responsibility
                ?.toLowerCase()
                .includes(debounceSearch.toLowerCase()) ||
              item.quarterly
                ?.toLowerCase()
                .includes(debounceSearch.toLowerCase())
          );
        }

        // Pagination
        const startIndex = (page - 1) * rowFilter;
        const endIndex = startIndex + rowFilter;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setContractData(paginatedData);
        setPagination({
          totalItems: filteredData.length,
          totalPages: Math.ceil(filteredData.length / rowFilter),
          currentPage: page,
          pageSize: rowFilter,
        });
        setCurrentPage(page);
      } catch (err) {
        console.error("Gagal fetch data:", err);
        setContractData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [rowFilter, debounceSearch, filters]
  );

  useEffect(() => {
    console.log("🔄 useEffect triggered - debounceSearch:", debounceSearch);
    getContractData(1);
  }, [rowFilter, debounceSearch, getContractData, filters]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      getContractData(newPage);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleResetFilters = () => {
    setFilters({ scope: null, docType: null, status: null, archive: null });
  };

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
            onValueChange={(value) => setRowFilter(parseInt(value))}
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
              <TableHead style={{ minWidth: "50px" }}>No</TableHead>
              <TableHead style={{ minWidth: "50px" }}>Triwulan</TableHead>
              <TableHead style={{ minWidth: "50px" }}>Responsibility</TableHead>
              <TableHead style={{ minWidth: "50px" }} className="max-sm:hidden">
                Unit
              </TableHead>
              <TableHead style={{ minWidth: "50px" }} className="max-sm:hidden">
                Bobot
              </TableHead>
              <TableHead style={{ minWidth: "50px" }} className="max-sm:hidden">
                Target
              </TableHead>
              <TableHead style={{ minWidth: "50px" }} className="max-sm:hidden">
                Realisasi
              </TableHead>
              <TableHead
                style={{ minWidth: "100px" }}
                className="max-sm:hidden"
              >
                Pencapaian
              </TableHead>
              <TableHead
                style={{ minWidth: "100px" }}
                className="max-sm:hidden"
              >
                Max
              </TableHead>
              <TableHead
                style={{ minWidth: "100px" }}
                className="max-sm:hidden"
              >
                Min
              </TableHead>
              <TableHead
                style={{ minWidth: "100px" }}
                className="max-sm:hidden"
              >
                % Real
              </TableHead>
              <TableHead
                style={{ minWidth: "100px" }}
                className="max-sm:hidden"
              >
                Nilai
              </TableHead>
              <TableHead
                style={{ minWidth: "100px" }}
                className="max-sm:hidden"
              >
                Input
              </TableHead>
              <TableHead
                style={{ minWidth: "100px" }}
                className="max-sm:hidden"
              >
                Monitor
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contractData.map((row, idx) => {
              const rowNumber = (currentPage - 1) * rowFilter + idx + 1;
              return (
                <TableRow key={row.id || idx}>
                  <TableCell className="max-sm:hidden">{rowNumber}</TableCell>
                  <TableCell>{row.quarterly || "-"}</TableCell>
                  <TableCell className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {row.responsibility || "-"}
                  </TableCell>
                  <TableCell className="">{row.unit || "-"}</TableCell>
                  <TableCell className="">{row.weight || "-"}</TableCell>
                  <TableCell className="max-sm:hidden">
                    {row.target || "-"}
                  </TableCell>
                  <TableCell className="max-sm:hidden">
                    {row.realization || "-"}
                  </TableCell>
                  <TableCell className="max-sm:hidden">
                    {row.achievement || "-"}
                  </TableCell>
                  <TableCell className="max-sm:hidden">
                    {row.max || "-"}
                  </TableCell>
                  <TableCell className="max-sm:hidden">
                    {row.min || "-"}
                  </TableCell>
                  <TableCell className="max-sm:hidden">
                    {row.persReal || "-"}
                  </TableCell>
                  <TableCell className="max-sm:hidden">
                    {row.value || "-"}
                  </TableCell>
                  <TableCell
                    style={{ minWidth: "50px" }}
                    className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap max-sm:hidden"
                  >
                    {row.Input || "-"}
                  </TableCell>
                  <TableCell className="max-sm:hidden">
                    {row.Monitor || "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-600 mt-2">
        {formatRangeInfo(pagination, currentPage)}
      </div>

      <div className="flex justify-start">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => {
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
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              }
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage === pagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default TableContractManagement;
