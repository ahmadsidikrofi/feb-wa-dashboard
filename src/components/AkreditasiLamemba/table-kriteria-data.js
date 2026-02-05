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
import { MoreHorizontal, Pencil, Trash2, Eye, FileText } from "lucide-react";
import { toast } from "sonner";

export default function TableKriteriaData({
  data: initialData,
  columns,
  searchQuery,
  refreshTrigger,
  onRefresh,
}) {
  const [data, setData] = useState(initialData);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((item) => {
      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [data, searchQuery]);

  const handleEdit = (item) => {
    toast.info("Fitur edit sedang dalam pengembangan");
  };

  const handleDelete = (item) => {
    setData((prevData) => prevData.filter((d) => d.id !== item.id));
    toast.success("Data berhasil dihapus");
    onRefresh?.();
  };

  const handleView = (item) => {
    toast.info("Fitur detail sedang dalam pengembangan");
  };

  const formatValue = (value, type) => {
    if (value === null || value === undefined || value === "-") return "-";

    if (type === "number" && typeof value === "number") {
      if (value >= 1000000) {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(value);
      }
      return value.toLocaleString("id-ID");
    }

    return value;
  };

  const getColumnType = (key) => {
    const column = columns.find((col) => col.key === key);
    return column?.type || "text";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
            <TableHead>Tanggal Upload</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 2}
                className="text-center text-muted-foreground"
              >
                Tidak ada data ditemukan
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={
                      column.key === columns[0].key ? "font-medium" : ""
                    }
                  >
                    {column.type === "select" && item[column.key] ? (
                      <Badge variant="outline">{item[column.key]}</Badge>
                    ) : (
                      formatValue(item[column.key], column.type)
                    )}
                  </TableCell>
                ))}
                <TableCell className="text-sm text-muted-foreground">
                  {item.tanggalUpload
                    ? new Date(item.tanggalUpload).toLocaleDateString("id-ID")
                    : "-"}
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
  );
}
