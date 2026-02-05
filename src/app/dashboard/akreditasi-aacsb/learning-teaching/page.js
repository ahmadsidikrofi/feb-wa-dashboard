"use client";

import AACSBPageTemplate from "@/components/AkreditasiAACSB/aacsb-page-template";
import { BookOpen } from "lucide-react";

export default function LearningTeachingPage() {
  const pageData = {
    title: "Learning & Teaching",
    description: "Database kurikulum, pedagogi, dan metode pembelajaran AACSB",
    icon: BookOpen,
    columns: [
      { key: "item", label: "Item", type: "text" },
      {
        key: "kategori",
        label: "Kategori",
        type: "select",
        options: [
          "Curriculum Design",
          "Learning Goals",
          "Assessment",
          "Teaching Methods",
          "Course Material",
        ],
      },
      { key: "program", label: "Program", type: "text" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Implemented", "Under Review", "Planned"],
      },
      { key: "keterangan", label: "Keterangan", type: "textarea" },
    ],
    mockData: [
      {
        id: 1,
        item: "Learning Goals & Objectives 2024",
        kategori: "Learning Goals",
        program: "All Programs",
        status: "Implemented",
        keterangan: "Comprehensive learning goals aligned with AACSB standards",
        tanggalUpload: "2024-01-05",
        uploadedBy: "Academic Committee",
      },
      {
        id: 2,
        item: "Case-Based Learning Initiative",
        kategori: "Teaching Methods",
        program: "MBA Program",
        status: "Implemented",
        keterangan: "Harvard Business School case methodology",
        tanggalUpload: "2024-02-20",
        uploadedBy: "Faculty Development",
      },
      {
        id: 3,
        item: "Assurance of Learning (AOL) Report",
        kategori: "Assessment",
        program: "All Programs",
        status: "Under Review",
        keterangan: "Annual assessment of learning outcomes",
        tanggalUpload: "2024-06-15",
        uploadedBy: "Assessment Team",
      },
      {
        id: 4,
        item: "Curriculum Revision 2025",
        kategori: "Curriculum Design",
        program: "Undergraduate Programs",
        status: "Planned",
        keterangan: "Integration of sustainability and ethics",
        tanggalUpload: "2024-11-10",
        uploadedBy: "Curriculum Committee",
      },
    ],
  };

  return <AACSBPageTemplate pageData={pageData} />;
}
