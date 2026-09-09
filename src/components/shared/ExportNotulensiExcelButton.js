"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import api from "@/lib/axios";

/**
 * ExportNotulensiExcelButton
 *
 * Props:
 * - meetingId: string | number  → ID rapat (untuk fetch data terbaru dari API)
 * - isIconOnly?: boolean        → tampilkan hanya ikon (untuk tabel)
 *
 * Kalau dipakai di form, meetingId wajib ada.
 */
export default function ExportNotulensiExcelButton({ meetingId, isIconOnly = false }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleExport = async () => {
        try {
            setIsLoading(true);

            if (!meetingId) {
                toast.warning("Simpan notulensi terlebih dahulu sebelum export", {
                    position: "bottom-center",
                    style: { background: "#fef08a", color: "#92400e" },
                    className: "border border-yellow-500",
                });
                return;
            }

            // Ambil data terbaru dari API
            const res = await api.get(`/api/meetings/${meetingId}`);
            const fullData = res.data?.data;

            if (!fullData) {
                toast.error("Gagal mengambil data notulensi", { position: "bottom-center" });
                return;
            }

            const workbook = new ExcelJS.Workbook();
            const ws = workbook.addWorksheet("Notulensi Rapat");

            // ── 1. Lebar Kolom ──────────────────────────────────────────
            ws.columns = [
                { key: "A", width: 8 },   // No
                { key: "B", width: 28 },  // Agenda/Topik
                { key: "C", width: 35 },  // Pembahasan
                { key: "D", width: 35 },  // Keputusan
                { key: "E", width: 28 },  // Tugas Tindak Lanjut
                { key: "F", width: 20 },  // PIC
                { key: "G", width: 15 },  // Deadline
                { key: "H", width: 12 },  // Status
            ];

            // ── 2. KOP SURAT (Row 1-4) ─────────────────────────────────
            ws.mergeCells("A1:A4");
            ws.getCell("A1").value = "LOGO";
            ws.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };

            ws.mergeCells("B1:F1");
            ws.getCell("B1").value = "TELKOM UNIVERSITY";
            ws.getCell("B1").font = { bold: true, size: 12 };
            ws.getCell("B1").alignment = { vertical: "middle", horizontal: "center" };

            ws.mergeCells("B2:F2");
            ws.getCell("B2").value = "Jl. Telekomunikasi No. 1 Ters. Buah Batu Bandung 40257";
            ws.getCell("B2").alignment = { vertical: "middle", horizontal: "center" };

            ws.mergeCells("B3:F4");
            ws.getCell("B3").value = "NOTULENSI RAPAT";
            ws.getCell("B3").font = { bold: true, size: 14 };
            ws.getCell("B3").alignment = { vertical: "middle", horizontal: "center" };

            const docControls = [
                ["No. Formulir", "FEB-NOT-001"],
                ["Revisi", "0"],
                ["Berlaku Efektif", "2024"],
                ["Hal.", "1 dari 1"],
            ];
            docControls.forEach((item, i) => {
                ws.getCell(`G${i + 1}`).value = item[0];
                ws.getCell(`G${i + 1}`).font = { bold: true };
                ws.getCell(`G${i + 1}`).alignment = { vertical: "middle", horizontal: "center" };
                ws.getCell(`H${i + 1}`).value = item[1];
                ws.getCell(`H${i + 1}`).alignment = { vertical: "middle", horizontal: "left" };
            });

            // Border kop
            for (let r = 1; r <= 4; r++) {
                for (let c = 1; c <= 8; c++) {
                    ws.getCell(r, c).border = {
                        top: { style: "thin" }, left: { style: "thin" },
                        bottom: { style: "thin" }, right: { style: "thin" },
                    };
                }
            }

            // ── 3. METADATA RAPAT (Row 6-10) ───────────────────────────
            const dateObj = fullData.date ? new Date(fullData.date) : null;
            const formattedDate = dateObj
                ? dateObj.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                : "-";

            const startTime = fullData.startTime ? new Date(fullData.startTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }) : "-";
            const endTime = fullData.endTime ? new Date(fullData.endTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }) : "-";

            const metadata = [
                ["Tanggal", formattedDate],
                ["Waktu", `${startTime} – ${endTime} WIB`],
                ["Tempat", fullData.room || "-"],
                ["Pemimpin Rapat", fullData.leader || "-"],
                ["Notulen", fullData.notetaker || "-"],
            ];

            metadata.forEach(([label, val], i) => {
                const row = 6 + i;
                ws.getCell(`A${row}`).value = label;
                ws.getCell(`A${row}`).font = { bold: true };
                ws.getCell(`A${row}`).alignment = { vertical: "top", horizontal: "left" };
                ws.mergeCells(`B${row}:H${row}`);
                ws.getCell(`B${row}`).value = `: ${val}`;
                ws.getCell(`B${row}`).alignment = { wrapText: true, vertical: "top" };
            });

            // Peserta
            const pesertaStr = Array.isArray(fullData.participants) && fullData.participants.length > 0
                ? fullData.participants.join(", ")
                : "-";
            ws.getCell("A11").value = "Peserta";
            ws.getCell("A11").font = { bold: true };
            ws.getCell("A11").alignment = { vertical: "top", horizontal: "left" };
            ws.mergeCells("B11:H11");
            ws.getCell("B11").value = `: ${pesertaStr}`;
            ws.getCell("B11").alignment = { wrapText: true, vertical: "top" };

            // ── 4. HEADER TABEL NOTULENSI (Row 13) ─────────────────────
            const headerRow = ws.getRow(13);
            headerRow.values = [
                "No", "Agenda / Topik", "Pembahasan", "Keputusan",
                "Tugas Tindak Lanjut", "PIC", "Deadline", "Status"
            ];
            headerRow.eachCell(cell => {
                cell.font = { bold: true };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFC6EFCE" } };
                cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
                cell.border = {
                    top: { style: "thin" }, left: { style: "thin" },
                    bottom: { style: "thin" }, right: { style: "thin" },
                };
            });

            // ── 5. ISI TABEL (Row 14 dst) ──────────────────────────────
            let currentRow = 14;
            const agendas = fullData.agendas || [];

            agendas.forEach((ag, agIdx) => {
                const actionItems = ag.actionItems || [];
                const rowCount = Math.max(1, actionItems.length);

                if (rowCount === 1) {
                    const ai = actionItems[0];
                    const row = ws.getRow(currentRow);
                    row.values = [
                        agIdx + 1,
                        ag.title || "",
                        ag.discussion || "",
                        ag.decision || "",
                        ai ? (ai.task || "") : "",
                        ai ? (ai.pic || "") : "",
                        ai?.deadline ? new Date(ai.deadline).toLocaleDateString("id-ID") : "",
                        ai ? (ai.status || "") : "",
                    ];
                    row.eachCell((cell, col) => {
                        cell.border = {
                            top: { style: "thin" }, left: { style: "thin" },
                            bottom: { style: "thin" }, right: { style: "thin" },
                        };
                        cell.alignment = {
                            vertical: "top",
                            horizontal: [1, 7, 8].includes(col) ? "center" : "left",
                            wrapText: true,
                        };
                    });
                    currentRow++;
                } else {
                    // Merge cells A, B, C, D untuk baris multi action item
                    actionItems.forEach((ai, aiIdx) => {
                        const row = ws.getRow(currentRow);
                        row.values = [
                            aiIdx === 0 ? (agIdx + 1) : "",
                            aiIdx === 0 ? (ag.title || "") : "",
                            aiIdx === 0 ? (ag.discussion || "") : "",
                            aiIdx === 0 ? (ag.decision || "") : "",
                            ai.task || "",
                            ai.pic || "",
                            ai.deadline ? new Date(ai.deadline).toLocaleDateString("id-ID") : "",
                            ai.status || "",
                        ];
                        row.eachCell((cell, col) => {
                            cell.border = {
                                top: { style: "thin" }, left: { style: "thin" },
                                bottom: { style: "thin" }, right: { style: "thin" },
                            };
                            cell.alignment = {
                                vertical: "top",
                                horizontal: [1, 7, 8].includes(col) ? "center" : "left",
                                wrapText: true,
                            };
                        });
                        currentRow++;
                    });
                }
            });

            if (agendas.length === 0) {
                const row = ws.getRow(currentRow);
                ws.mergeCells(`A${currentRow}:H${currentRow}`);
                ws.getCell(`A${currentRow}`).value = "Belum ada data agenda";
                ws.getCell(`A${currentRow}`).alignment = { horizontal: "center" };
                currentRow++;
            }

            // ── 6. TANDA TANGAN ─────────────────────────────────────────
            currentRow += 2;

            const signDate = dateObj
                ? dateObj.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })
                : "-";

            ws.getCell(`D${currentRow}`).value = `Bandung, ${signDate}`;
            ws.getCell(`D${currentRow}`).alignment = { horizontal: "center" };
            currentRow++;

            ws.getCell(`B${currentRow}`).value = "Dibuat oleh,";
            ws.getCell(`E${currentRow}`).value = "Diperiksa oleh,";
            ws.getCell(`H${currentRow}`).value = "Disetujui oleh,";
            ["B", "E", "H"].forEach(col => ws.getCell(`${col}${currentRow}`).alignment = { horizontal: "center" });

            currentRow += 4;

            ws.getCell(`B${currentRow}`).value = fullData.preparedByName || "-";
            ws.getCell(`E${currentRow}`).value = fullData.reviewedByName || "-";
            ws.getCell(`H${currentRow}`).value = fullData.approvedByName || "-";
            ["B", "E", "H"].forEach(col => ws.getCell(`${col}${currentRow}`).alignment = { horizontal: "center" });
            currentRow++;

            ws.getCell(`B${currentRow}`).value = fullData.preparedByPosition || "Notulen";
            ws.getCell(`E${currentRow}`).value = fullData.reviewedByPosition || "Pejabat Terkait";
            ws.getCell(`H${currentRow}`).value = fullData.approvedByPosition || "Pimpinan Rapat";
            ["B", "E", "H"].forEach(col => {
                ws.getCell(`${col}${currentRow}`).font = { bold: true };
                ws.getCell(`${col}${currentRow}`).alignment = { horizontal: "center" };
            });

            // ── Download ────────────────────────────────────────────────
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const title = fullData.title ? fullData.title.replace(/[/\\?%*:|"<>]/g, "_").substring(0, 40) : "Notulensi";
            saveAs(blob, `Notulensi_${title}.xlsx`);

            toast.success("Notulensi berhasil diexport ke Excel!", {
                style: { background: "#f0fdf4", color: "#166534", fontWeight: "bold" },
                className: "border border-green-500 font-bold",
            });

        } catch (error) {
            console.error("Export error:", error);
            toast.error("Gagal melakukan export Excel");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={isIconOnly ? "ghost" : "outline"}
            size={isIconOnly ? "icon" : "default"}
            onClick={handleExport}
            disabled={isLoading}
            title="Export Notulensi ke Excel"
            className={
                isIconOnly
                    ? "h-7 w-7 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-sky-700 dark:text-sky-400 border-0 shadow-none"
                    : "gap-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 dark:bg-green-900 dark:text-green-50 dark:border-green-200 dark:hover:bg-green-100 dark:hover:text-green-800"
            }
        >
            {isLoading
                ? <Loader2 className={isIconOnly ? "size-3.5 animate-spin" : "size-4 animate-spin"} />
                : <FileSpreadsheet className={isIconOnly ? "size-3.5" : "size-4"} />
            }
            {!isIconOnly && (isLoading ? "Menyiapkan File..." : "Export Excel")}
        </Button>
    );
}
