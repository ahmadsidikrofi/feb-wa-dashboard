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
import { Eye, CheckCircle, AlertCircle, Clock, ArrowLeft } from "lucide-react";

const mockData = [
  {
    id: 1,
    programStudi: "S1 Manajemen",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "In Progress",
    tahunMulai: 2023,
    targetSelesai: 2026,
    progress: 65,
    pic: "Dr. Ahmad Santoso, M.M.",
  },
  {
    id: 2,
    programStudi: "S1 Akuntansi",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "Planning",
    tahunMulai: 2024,
    targetSelesai: 2027,
    progress: 25,
    pic: "Prof. Dr. Siti Rahayu, M.Sc.",
  },
  {
    id: 3,
    programStudi: "S2 Manajemen",
    fakultas: "Fakultas Ekonomi dan Bisnis",
    statusAkreditasi: "In Progress",
    tahunMulai: 2023,
    targetSelesai: 2026,
    progress: 45,
    pic: "Dr. Budi Hartono, M.M.",
  },
];

export default function TableAkreditasiAACSB({ searchQuery }) {
  const [data] = useState(mockData)
  const [selectedItem, setSelectedItem] = useState(null)

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
    <div className="relative overflow-x-auto">
      <div className="flex min-w-full gap-4">
        <div
          className={`transition-all duration-300 ${selectedItem ? "min-w-[60%]" : "min-w-full"
            }`}
        >
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
                  filteredData.map((item) => {
                    const isActive = selectedItem?.id === item.id;

                    return (
                      <TableRow
                        key={item.id}
                        className={isActive ? "bg-muted/50" : ""}
                      >
                        <TableCell className="font-medium">
                          {item.programStudi}
                        </TableCell>
                        <TableCell>{item.fakultas}</TableCell>
                        <TableCell>
                          {getStatusBadge(item.statusAkreditasi)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
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
                        <TableCell className="text-sm">
                          {item.pic}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setSelectedItem(
                                isActive ? null : item
                              )
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* =========================
            DETAIL PANEL
        ========================= */}
        {selectedItem && (
          <div className="min-w-[40%] max-w-[40%] border rounded-md p-4 bg-background transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedItem.programStudi}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Detail Akreditasi AACSB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Fakultas</p>
                <p className="font-medium">
                  {selectedItem.fakultas}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Status</p>
                {getStatusBadge(selectedItem.statusAkreditasi)}
              </div>

              <div>
                <p className="text-muted-foreground">PIC</p>
                <p className="font-medium">{selectedItem.pic}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Target Selesai</p>
                <p className="font-medium">
                  {selectedItem.targetSelesai}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1">Progress</p>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${selectedItem.progress}%`,
                      }}
                    />
                  </div>
                  <span className="font-medium">
                    {selectedItem.progress}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
