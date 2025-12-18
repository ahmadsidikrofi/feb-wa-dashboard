"use client";

import { useState } from "react";
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
import { Eye, CheckCircle, AlertCircle, Clock } from "lucide-react";

const mockData = [
  {
    id: 1,
    programStudi: "S1 Manajemen",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "In Progress",
    tahunMulai: 2023,
    targetSelesai: 2026,
    progress: 65,
    pic: "Kaprodi S1 Manajemen",
  },
  {
    id: 2,
    programStudi: "S1 Administrasi Bisnis",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "Planning",
    tahunMulai: 2024,
    targetSelesai: 2027,
    progress: 30,
    pic: "Kaprodi S1 Administrasi Bisnis",
  },
  {
    id: 3,
    programStudi: "S1 Akuntansi",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "Planning",
    tahunMulai: 2024,
    targetSelesai: 2027,
    progress: 25,
    pic: "Kaprodi S1 Akuntansi",
  },
  {
    id: 4,
    programStudi: "S1 Leisure Management",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "Planning",
    tahunMulai: 2025,
    targetSelesai: 2028,
    progress: 15,
    pic: "Kaprodi S1 Leisure Management",
  },
  {
    id: 5,
    programStudi: "S1 Bisnis Digital",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "Planning",
    tahunMulai: 2025,
    targetSelesai: 2028,
    progress: 20,
    pic: "Kaprodi S1 Bisnis Digital",
  },
  {
    id: 6,
    programStudi: "S2 Manajemen",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "In Progress",
    tahunMulai: 2023,
    targetSelesai: 2026,
    progress: 45,
    pic: "Kaprodi S2 Manajemen",
  },
  {
    id: 7,
    programStudi: "S2 Manajemen PJJ",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "Planning",
    tahunMulai: 2025,
    targetSelesai: 2028,
    progress: 10,
    pic: "Kaprodi S2 Manajemen PJJ",
  },
  {
    id: 8,
    programStudi: "S2 Administrasi Bisnis",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "Planning",
    tahunMulai: 2024,
    targetSelesai: 2027,
    progress: 35,
    pic: "Kaprodi S2 Administrasi Bisnis",
  },
  {
    id: 9,
    programStudi: "S2 Akuntansi",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "Planning",
    tahunMulai: 2024,
    targetSelesai: 2027,
    progress: 28,
    pic: "Kaprodi S2 Akuntansi",
  },
  {
    id: 10,
    programStudi: "S3 Manajemen",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "Planning",
    tahunMulai: 2025,
    targetSelesai: 2028,
    progress: 12,
    pic: "Kaprodi S3 Manajemen",
  },
];

export default function TableAkreditasiAACSB({ searchQuery }) {
  const [data] = useState(mockData);

  const filteredData = searchQuery
    ? data.filter(
        (item) =>
          item.programStudi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.fakultas.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  const getStatusBadge = (status) => {
    const config = {
      Accredited: {
        variant: "default",
        icon: CheckCircle,
        color: "text-green-600",
      },
      "In Progress": {
        variant: "secondary",
        icon: Clock,
        color: "text-blue-600",
      },
      Planning: {
        variant: "outline",
        icon: AlertCircle,
        color: "text-orange-600",
      },
    };
    const { variant, icon: Icon, color } = config[status] || config["Planning"];

    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className={`h-3 w-3 ${color}`} />
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Program Studi</TableHead>
              <TableHead>Fakultas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Target Selesai</TableHead>
              <TableHead>PIC</TableHead>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {item.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{item.targetSelesai}</TableCell>
                  <TableCell className="text-sm">{item.pic}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
