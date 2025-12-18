"use client";

import AACSBPageTemplate from "@/components/AkreditasiAACSB/aacsb-page-template";
import { Briefcase } from "lucide-react";

export default function AcademicEngagementPage() {
  const pageData = {
    title: "Academic & Professional Engagement",
    description:
      "Database penelitian, publikasi, dan engagement dengan praktisi",
    icon: Briefcase,
    columns: [
      { key: "judul", label: "Judul/Kegiatan", type: "text" },
      {
        key: "kategori",
        label: "Kategori",
        type: "select",
        options: [
          "Research",
          "Publication",
          "Conference",
          "Industry Partnership",
          "Consulting",
          "Professional Service",
        ],
      },
      { key: "tahun", label: "Tahun", type: "number" },
      { key: "pic", label: "PIC/Author", type: "text" },
      { key: "keterangan", label: "Keterangan", type: "textarea" },
    ],
    mockData: [
      {
        id: 1,
        judul: "Digital Transformation in Indonesian SMEs",
        kategori: "Research",
        tahun: 2024,
        pic: "Dr. Ahmad Santoso",
        keterangan: "Published in Journal of Business Research (Scopus Q1)",
        tanggalUpload: "2024-03-15",
        uploadedBy: "Research Office",
      },
      {
        id: 2,
        judul: "Partnership with Bank Indonesia",
        kategori: "Industry Partnership",
        tahun: 2024,
        pic: "Dean Office",
        keterangan: "Collaborative research on fintech adoption",
        tanggalUpload: "2024-05-20",
        uploadedBy: "Partnership Office",
      },
      {
        id: 3,
        judul: "AOM Annual Meeting 2024",
        kategori: "Conference",
        tahun: 2024,
        pic: "Prof. Dr. Siti Rahayu",
        keterangan: "Presented paper on corporate governance",
        tanggalUpload: "2024-08-10",
        uploadedBy: "Faculty Member",
      },
      {
        id: 4,
        judul: "Strategic Consulting for PT XYZ",
        kategori: "Consulting",
        tahun: 2024,
        pic: "Faculty Consulting Team",
        keterangan: "Business process improvement project",
        tanggalUpload: "2024-07-01",
        uploadedBy: "Consulting Services",
      },
      {
        id: 5,
        judul: "Editorial Board - Asian Business Review",
        kategori: "Professional Service",
        tahun: 2024,
        pic: "Dr. Budi Hartono",
        keterangan: "Associate Editor position",
        tanggalUpload: "2024-01-15",
        uploadedBy: "Faculty Member",
      },
    ],
  };

  return <AACSBPageTemplate pageData={pageData} />;
}
