"use client";

import AACSBPageTemplate from "@/components/AkreditasiAACSB/aacsb-page-template";
import { Users } from "lucide-react";

export default function ParticipantsPage() {
  const pageData = {
    title: "Participants (Students, Faculty, Staff)",
    description: "Database data mahasiswa, dosen, dan staf untuk AACSB",
    icon: Users,
    columns: [
      { key: "nama", label: "Nama", type: "text" },
      {
        key: "kategori",
        label: "Kategori",
        type: "select",
        options: ["Student", "Faculty", "Professional Staff"],
      },
      { key: "program", label: "Program/Department", type: "text" },
      { key: "kualifikasi", label: "Kualifikasi", type: "text" },
      { key: "keterangan", label: "Keterangan", type: "textarea" },
    ],
    mockData: [
      {
        id: 1,
        nama: "Dr. Ahmad Santoso, M.M.",
        kategori: "Faculty",
        program: "Management Department",
        kualifikasi: "Academically Qualified (AQ)",
        keterangan: "Research focus: Strategic Management",
        tanggalUpload: "2024-01-10",
        uploadedBy: "HR Department",
      },
      {
        id: 2,
        nama: "Prof. Dr. Siti Rahayu, M.Sc., CPA",
        kategori: "Faculty",
        program: "Accounting Department",
        kualifikasi: "Academically Qualified (AQ)",
        keterangan: "CPA certified, 20+ years experience",
        tanggalUpload: "2024-01-10",
        uploadedBy: "HR Department",
      },
      {
        id: 3,
        nama: "John Doe, MBA",
        kategori: "Professional Staff",
        program: "Career Development Center",
        kualifikasi: "Professional",
        keterangan: "Career counseling specialist",
        tanggalUpload: "2024-02-15",
        uploadedBy: "HR Department",
      },
      {
        id: 4,
        nama: "Student Cohort 2024",
        kategori: "Student",
        program: "MBA Program",
        kualifikasi: "Graduate Student",
        keterangan: "45 students enrolled",
        tanggalUpload: "2024-09-01",
        uploadedBy: "Admissions Office",
      },
    ],
  };

  return <AACSBPageTemplate pageData={pageData} />;
}
