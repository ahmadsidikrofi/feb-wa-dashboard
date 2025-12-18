"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Upload, Award, FileText, Target, Users, BookOpen, Briefcase, ArrowRight } from "lucide-react";
import TableAkreditasiAACSB from "@/components/AkreditasiAACSB/table-akreditasi-aacsb";
import { toast } from "sonner";

export default function AkreditasiAACSBPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleExport = () => {
    toast.info("Fitur export sedang dalam pengembangan");
  };

  const handleImport = () => {
    toast.info("Fitur import sedang dalam pengembangan");
  };

  const standardAACSB = [
    {
      id: 1,
      title: "Strategic Management",
      description: "Mission, strategic planning, and innovation impact",
      icon: Target,
      path: "/dashboard/akreditasi-aacsb/strategic-management",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950",
    },
    {
      id: 2,
      title: "Participants",
      description: "Student admissions and faculty management",
      icon: Users,
      path: "/dashboard/akreditasi-aacsb/participants",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950",
    },
    {
      id: 3,
      title: "Learning & Teaching",
      description: "Curriculum, learning goals, and assurance of learning",
      icon: BookOpen,
      path: "/dashboard/akreditasi-aacsb/learning-teaching",
      color: "bg-green-50 text-green-600 dark:bg-green-950",
    },
    {
      id: 4,
      title: "Academic & Professional Engagement",
      description: "Faculty qualifications and professional engagement",
      icon: Briefcase,
      path: "/dashboard/akreditasi-aacsb/academic-engagement",
      color: "bg-orange-50 text-orange-600 dark:bg-orange-950",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Akreditasi AACSB
          </h1>
          <p className="text-muted-foreground">
            Database akreditasi AACSB (Association to Advance Collegiate Schools
            of Business)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() =>
              toast.info("Navigasi ke submenu untuk menambah data")
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Data
          </Button>
        </div>
      </div>

      {/* AACSB Standards Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Standar Akreditasi AACSB</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {standardAACSB.map((standard) => {
            const Icon = standard.icon;
            return (
              <Card
                key={standard.id}
                className="cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => router.push(standard.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${standard.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <CardTitle className="text-lg mt-3">{standard.title}</CardTitle>
                  <CardDescription>{standard.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Overview Akreditasi AACSB */}
      <Card>
        <CardHeader>
          <CardTitle>Overview Akreditasi AACSB</CardTitle>
          <CardDescription>
            Status dan ringkasan data akreditasi program studi untuk AACSB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari program studi..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TableAkreditasiAACSB searchQuery={searchQuery} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Tentang AACSB
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <p className="text-muted-foreground leading-relaxed mb-4">
                AACSB International (Association to Advance Collegiate Schools
                of Business) adalah lembaga akreditasi terkemuka dunia untuk
                sekolah bisnis yang telah mengakreditasi lebih dari 950
                institusi di lebih dari 60 negara.
              </p>
            </div>
            <div className="text-sm">
              <p className="font-semibold mb-3">Standar yang Dipantau:</p>
              <div className="space-y-2">
                {standardAACSB.map((standard) => {
                  const Icon = standard.icon;
                  return (
                    <div
                      key={standard.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors group"
                      onClick={() => router.push(standard.path)}
                    >
                      <div className={`p-2 rounded-lg ${standard.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{standard.title}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Standar Akreditasi AACSB
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <p className="font-semibold mb-2">9 Standar Utama:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Standard 1: Mission, Impact, and Innovation</li>
                <li>Standard 2: Strategic Planning</li>
                <li>Standard 3: Student Admissions</li>
                <li>Standard 4: Learning & Teaching</li>
                <li>Standard 5: Faculty Sufficiency</li>
                <li>Standard 6: Faculty Management</li>
                <li>Standard 7: Professional Staff</li>
                <li>Standard 8: Academic Resources</li>
                <li>Standard 9: Financial Strategies</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
