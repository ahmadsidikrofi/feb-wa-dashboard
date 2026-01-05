"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import {
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Download,
  Plus,
  TrendingUp,
  Loader2,
  CalendarCheck,
} from "lucide-react";
import axios from "axios";
import TableMeetingMinutes from "@/components/MeetingMinutes/table-meeting-minutes";
import AddMeeting from "@/components/MeetingMinutes/add-meeting";

export default function NotulensiRapatPage() {
  const [meetings, setMeetings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const today = new Date().toISOString().split("T")[0]
  const [formData, setFormData] = useState({
    judulRapat: "",
    tanggal: "",
    waktuMulai: "",
    waktuSelesai: "",
    tempat: "",
    pemimpin: "",
    notulen: "",
    keterangan: "",
  })

  // Calculate stats
  const totalMeetings = meetings.length;
  const completedMeetings = meetings.filter(
    (m) => m.status === "Selesai"
  ).length;
  const scheduledMeetings = meetings.filter(
    (m) => m.status === "Terjadwal"
  ).length;
  const withNotulensi = meetings.filter((m) => m.hasNotulensi).length
  // const pendingNotulensi = completedMeetings - withNotulensi
  const pendingNotulensi = meetings.filter(
    (m) => m.status === "Selesai" && !m.hasNotulensi
  ).length
  const activeTodayMeetings = meetings.filter(m =>
    m.tanggal?.startsWith(today) &&
    (m.status === "Berlangsung" || m.status === "Terjadwal")
  ).length

  const mapMeetingApiToState = (data = []) =>
    data.map((item) => ({
      id: item.id,
      judulRapat: item.title,
      tanggal: item.date,
      waktu: `${new Date(item.startTime).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${new Date(item.endTime).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      tempat: item.location,
      pemimpin: item.leader,
      notulen: item.notetaker,
      status: item.status,
      hasNotulensi: item.hasNotulensi,
  }))

  const fetchMeetings = useCallback(async () => {
    try {
      setIsLoading(true)

      const params = {
        search: searchQuery || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      }

      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key]
      )

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meetings`,
        {
          params,
          headers: {
            "ngrok-skip-browser-warning": true,
          },
        }
      )

      if (res.data?.success) {
        const mapped = mapMeetingApiToState(res.data.data || [])
        setMeetings(mapped)
      }
    } catch (err) {
      console.error("Gagal fetch meetings:", err)
      toast.error("Gagal memuat data rapat")
      setMeetings([])
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, filterStatus])

  useEffect(() => {
    fetchMeetings()
  }, [fetchMeetings])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#e31e25]">
            Notulensi Rapat
          </h1>
          <p className="text-muted-foreground">
            Kelola dan dokumentasi notulensi rapat fakultas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Laporan
          </Button>

          <AddMeeting 
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            formData={formData}
            setFormData={setFormData}
            onSuccess={() => fetchMeetings()}
          />
        </div>
      </div>

      {/* Stats Cards - Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rapat</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Semua rapat tercatat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapat Selesai</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Rapat terlaksana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terjadwal</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Rapat akan datang
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Notulensi Tersedia
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{withNotulensi}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dokumen lengkap
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Notulensi
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingNotulensi}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Menunggu dokumentasi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Tingkat Dokumentasi</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {completedMeetings > 0
                ? Math.round((withNotulensi / completedMeetings) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Rapat selesai dengan notulensi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rapat Aktif Hari Ini
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeTodayMeetings}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Terjadwal & sedang berlangsung
            </p>
          </CardContent>
        </Card>
      </div>

      <TableMeetingMinutes isLoading={isLoading} meetings={meetings} 
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        setSearchQuery={setSearchQuery}
      />

    </div>
  );
}
