'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

  import { Badge } from "@/components/ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Edit3, ExternalLink, PlusCircleIcon, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const TableManagementReport = ({
    searchQuery,
    setSearchQuery,
    filteredIndicators
}) => {
    return (
        <>
            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative flex gap-2 items-center">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari indikator atau link evidence..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                        <div>
                            <Button><PlusCircleIcon /> Buat Pelaporan</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Indicators Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Indikator LAPMAN Fakultas</CardTitle>
                    <CardDescription>
                        Daftar indikator laporan manajemen dengan status per triwulan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[400px]">
                                        Indikator Lapman Fakultas
                                    </TableHead>
                                    <TableHead className="min-w-[200px]">Link Evidence</TableHead>
                                    <TableHead className="text-center">Status TW 1</TableHead>
                                    <TableHead className="text-center">Status TW 2</TableHead>
                                    <TableHead className="text-center">Status TW 3</TableHead>
                                    <TableHead className="text-center">Status TW 4</TableHead>
                                    <TableHead className="text-center">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredIndicators.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center text-muted-foreground py-8"
                                        >
                                            Tidak ada indikator ditemukan
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredIndicators.map((indicator) => (
                                        <TableRow key={indicator.id}>
                                            <TableCell className="font-medium">
                                                {indicator.indikator}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {indicator.linkEvidence.split("\n").map(
                                                        (link, idx) =>
                                                            link.trim() && (
                                                                <a
                                                                    key={idx}
                                                                    href="#"
                                                                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                                                                >
                                                                    {link.trim()}
                                                                    <ExternalLink className="h-3 w-3" />
                                                                </a>
                                                            )
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Checkbox
                                                    checked={indicator.tw1}
                                                    onCheckedChange={(checked) =>
                                                        handleStatusUpdate(indicator.id, "tw1", checked)
                                                    }
                                                    className="mx-auto"
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Checkbox
                                                    checked={indicator.tw2}
                                                    onCheckedChange={(checked) =>
                                                        handleStatusUpdate(indicator.id, "tw2", checked)
                                                    }
                                                    className="mx-auto"
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Checkbox
                                                    checked={indicator.tw3}
                                                    onCheckedChange={(checked) =>
                                                        handleStatusUpdate(indicator.id, "tw3", checked)
                                                    }
                                                    className="mx-auto"
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Checkbox
                                                    checked={indicator.tw4}
                                                    onCheckedChange={(checked) =>
                                                        handleStatusUpdate(indicator.id, "tw4", checked)
                                                    }
                                                    className="mx-auto"
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditIndicator(indicator)}
                                                >
                                                    <Edit3 className="h-3 w-3" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default TableManagementReport