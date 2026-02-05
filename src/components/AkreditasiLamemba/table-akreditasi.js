"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";
import DetailAkreditasiDrawer from "./detail-akreditasi-drawer";
import EditAkreditasiDialog from "./edit-akreditasi";
import DeleteAkreditasiDialog from "./delete-akreditasi";

// Mock data untuk development
const mockData = [
  {
    id: 1,
    programStudi: "S1 Manajemen",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "Unggul",
    nomorSK: "SK/LAMEMBA/2023/001",
    tanggalBerlaku: "2023-01-15",
    tanggalKadaluarsa: "2028-01-14",
    peringkat: "A",
    nilaiAkreditasi: 95,
    keterangan: "Akreditasi berlaku 5 tahun",
  },
  {
    id: 2,
    programStudi: "S1 Akuntansi",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "Unggul",
    nomorSK: "SK/LAMEMBA/2023/002",
    tanggalBerlaku: "2023-03-20",
    tanggalKadaluarsa: "2028-03-19",
    peringkat: "A",
    nilaiAkreditasi: 92,
    keterangan: "Akreditasi berlaku 5 tahun",
  },
  {
    id: 3,
    programStudi: "S1 Ekonomi Pembangunan",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "Baik Sekali",
    nomorSK: "SK/LAMEMBA/2022/089",
    tanggalBerlaku: "2022-11-10",
    tanggalKadaluarsa: "2027-11-09",
    peringkat: "B",
    nilaiAkreditasi: 85,
    keterangan: "Akreditasi berlaku 5 tahun",
  },
  {
    id: 4,
    programStudi: "S2 Manajemen",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "Unggul",
    nomorSK: "SK/LAMEMBA/2024/015",
    tanggalBerlaku: "2024-05-01",
    tanggalKadaluarsa: "2029-04-30",
    peringkat: "A",
    nilaiAkreditasi: 93,
    keterangan: "Program pascasarjana",
  },
  {
    id: 5,
    programStudi: "S3 Ilmu Manajemen",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "Baik Sekali",
    nomorSK: "SK/LAMEMBA/2023/078",
    tanggalBerlaku: "2023-09-15",
    tanggalKadaluarsa: "2028-09-14",
    peringkat: "B",
    nilaiAkreditasi: 88,
    keterangan: "Program doktoral",
  },
];

export default function TableAkreditasiLamemba({
  searchQuery,
  refreshTrigger,
  onRefresh,
}) {
  const [data, setData] = useState(mockData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data.filter(
      (item) =>
        item.programStudi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fakultas.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nomorSK.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.statusAkreditasi.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const getStatusBadge = (status) => {
    const variants = {
      Unggul: "default",
      "Baik Sekali": "secondary",
      Baik: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getPeringkatBadge = (peringkat) => {
    const colors = {
      A: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      B: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      C: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    return <Badge className={colors[peringkat] || ""}>{peringkat}</Badge>;
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleEditSuccess = (updatedItem) => {
    setData((prevData) =>
      prevData.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    toast.success("Data berhasil diperbarui");
    onRefresh?.();
  };

  const handleDeleteSuccess = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
    toast.success("Data berhasil dihapus");
    onRefresh?.();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor(
      (expiry - today) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 365 && daysUntilExpiry >= 0;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Program Studi</TableHead>
              <TableHead>Fakultas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Peringkat</TableHead>
              <TableHead>Nomor SK</TableHead>
              <TableHead>Berlaku Hingga</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  Tidak ada data ditemukan
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.programStudi}
                  </TableCell>
                  <TableCell>{item.fakultas}</TableCell>
                  <TableCell>{getStatusBadge(item.statusAkreditasi)}</TableCell>
                  <TableCell>{getPeringkatBadge(item.peringkat)}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {item.nomorSK}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span
                        className={
                          isExpiringSoon(item.tanggalKadaluarsa)
                            ? "text-orange-600 font-semibold"
                            : ""
                        }
                      >
                        {formatDate(item.tanggalKadaluarsa)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleView(item)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(item)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedItem && (
        <>
          <DetailAkreditasiDrawer
            open={isDetailOpen}
            onOpenChange={setIsDetailOpen}
            data={selectedItem}
          />
          <EditAkreditasiDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            data={selectedItem}
            onSuccess={handleEditSuccess}
          />
          <DeleteAkreditasiDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            data={selectedItem}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </>
  );
}
