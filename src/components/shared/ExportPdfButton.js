// src/components/common/ExportPdfButton.jsx
"use client";

import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PrinterCheck } from 'lucide-react'
import { Button } from '@/components/ui/button';
import MeetingDocument from './MeetingDocument';
import { toast } from 'sonner';

export default function ExportPdfButton({ data, fileName = "Dokumen" }) {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: fileName,
        onAfterPrint: () => toast.success("Yess... Laporan berhasil di export", {
            style: { background: "#f0fdf4", color: "#166534", fontWeight: "bold" },
            className: "border border-green-500 font-bold"
        }),
    })

    return (
        <>
            <Button variant="outline" size="sm" onClick={handlePrint}
                className="gap-2 dark:bg-red-900 dark:text-red-50 dark:border-red-200 dark:hover:bg-red-100 dark:hover:text-red-800 bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
            >
                <PrinterCheck className="h-4 w-4 mr-2" />
                Export Laporan
            </Button>

            {/* Hidden Document (Hanya dirender saat print) */}
            <div style={{ display: 'none' }}>
                <MeetingDocument ref={componentRef} data={data} />
            </div>
        </>
    )
}