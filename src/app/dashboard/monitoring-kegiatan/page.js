"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Filter,
  Plus,
  Search,
  Building2,
  UserCheck,
  Download,
  CalendarPlus,
  LayoutGrid,
  CalendarDays,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import TableActivityMonitoring from "@/components/ActivityMonitoring/table-activity-monitoring";
import { useDebounce } from "@/hooks/use-debounce";
import AddActivity from "@/components/ActivityMonitoring/add-activity";
import { formatCamelCaseLabel } from "@/lib/utils";

// Data dummy untuk unit dan prodi
const units = [
  "Dekan",
  "Wakil Dekan I",
  "Wakil Dekan II",
  "Urusan Sekretariat Dekan",
  "Urusan Layanan Akademik",
  "Urusan Laboratorium",
  "Urusan SDM Keuangan",
  "Urusan Kemahasiswaan",
  "Prodi S1 Manajemen",
  "Prodi S1 Administrasi Bisnis",
  "Prodi S1 Akuntansi",
  "Prodi S1 Leisure Management",
  "Prodi S1 Bisnis Digital",
  "Prodi S2 Manajemen",
  "Prodi S2 Manajemen PJJ",
  "Prodi S2 Administrasi Bisnis",
  "Prodi S2 Akuntansi",
  "Prodi S3 Manajemen",
];

const prodiList = [
  "S1 Manajemen",
  "S1 Administrasi Bisnis",
  "S1 Akuntansi",
  "S1 Leisure Management",
  "S1 Bisnis Digital",
  "S2 Manajemen",
  "S2 Manajemen PJJ",
  "S2 Administrasi Bisnis",
  "S2 Akuntansi",
  "S3 Manajemen",
];

const rooms = [
  "Ruang Rapat Manterawu lt. 2",
  "Ruang Rapat Miossu lt. 1",
  "Ruang Rapat Miossu lt. 2",
  "Ruang Rapat Maratua lt. 1",
  "Aula FEB",
  "Aula Manterawu",
  "Lainnya",
];

const officials = [
  "Rektor",
  "Wakil Rektor 1",
  "Wakil Rektor 2",
  "Wakil Rektor 3",
  "Wakil Rektor 4",
  "Dekan",
  "Wakil Dekan I",
  "Wakil Dekan II",
  "Kaur Sekretariat Dekan",
  "Kaur Akademik",
  "Kaur Laboratorium",
  "Kaur SDM Keuangan",
  "Kaur Kemahasiswaan",
  "Kaprodi S1 Manajemen",
  "Kaprodi S1 Administrasi Bisnis",
  "Kaprodi S1 Akuntansi",
  "Kaprodi S1 Leisure Management",
  "Kaprodi S1 Bisnis Digital",
  "Kaprodi S2 Manajemen",
  "Kaprodi S2 Manajemen PJJ",
  "Kaprodi S2 Administrasi Bisnis",
  "Kaprodi S2 Akuntansi",
  "Kaprodi S3 Manajemen",
]

export default function MonitoringKegiatanPage() {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const debounceSearch = useDebounce(searchQuery, 500)
  const [filterUnit, setFilterUnit] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState("table")
  const [editingId, setEditingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10
  })
  const pageSize = 10

  const [formData, setFormData] = useState({
    namaKegiatan: "",
    tanggal: "",
    waktuMulai: "",
    waktuSelesai: "",
    unit: "",
    prodi: "",
    ruangan: "",
    pejabat: [],
    jumlahPeserta: "",
    keterangan: "",
  })

  // Helper function to parse conflict types from status
  const parseConflictTypes = (status) => {
    if (!status || status === "Normal") {
      return []
    }

    const conflictTypes = []
    const statusLower = status.toLowerCase()

    // Handle DoubleConflict - means 2 conflicts, typically including pejabat
    if (status === "DoubleConflict" || statusLower === "doubleconflict") {
      // DoubleConflict usually means pejabat conflict + another conflict (ruangan or waktu)
      conflictTypes.push("pejabat")
      conflictTypes.push("ruangan") // Common second conflict, could also be waktu
      return conflictTypes
    }

    // Check for specific conflict types
    if (statusLower.includes("official") || statusLower.includes("pejabat")) {
      conflictTypes.push("pejabat")
    }
    if (statusLower.includes("room") || statusLower.includes("ruangan")) {
      conflictTypes.push("ruangan")
    }
    if (statusLower.includes("time") || statusLower.includes("waktu")) {
      conflictTypes.push("waktu")
    }

    // If status contains "Conflict" but no specific type found
    if (statusLower.includes("conflict") && conflictTypes.length === 0) {
      conflictTypes.push("pejabat") // Default to pejabat as user mentioned it's the focus
    }

    return conflictTypes
  }

  const mapApiDataToComponent = (apiData) => {
    return apiData.map((item) => {
      const date = new Date(item.date)
      const startTime = new Date(item.startTime)
      const endTime = new Date(item.endTime)
      
      const conflictTypes = parseConflictTypes(item.status)
      const hasConflict = item.status !== "Normal" && item.status !== null
      
      return {
        id: item.id,
        namaKegiatan: item.title,
        keterangan: item.description,
        tanggal: date.toISOString().split("T")[0],
        waktuMulai: startTime.toTimeString().slice(0, 5),
        waktuSelesai: endTime.toTimeString().slice(0, 5),
        unit: formatCamelCaseLabel(item.unit),
        prodi: formatCamelCaseLabel(item.prodi),
        ruangan: formatCamelCaseLabel(item.room),
        tempat: formatCamelCaseLabel(item.room),
        pejabat: (item.officials || []).map(formatCamelCaseLabel),
        jumlahPeserta: item.participants || 0,
        status: item.status || "Normal",
        hasConflict: hasConflict,
        conflictTypes: conflictTypes, // Array of conflict types
        conflictType: conflictTypes.length > 0 ? conflictTypes[0] : null, // For backward compatibility
      }
    })
  }

  const fetchActivities = useCallback(async (page = 1) => {
    try {
      setIsLoading(true)
      
      const params = {
        page,
        limit: pageSize,
        search: debounceSearch || "",
        unit: filterUnit !== "all" ? filterUnit : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      }

      // Remove undefined params
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key])

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/activity-monitoring`,
        {
          params,
          headers: {
            "ngrok-skip-browser-warning": true,
          },
        }
      )

      if (res.data?.success) {
        const mappedData = mapApiDataToComponent(res.data.data || [])
        setActivities(mappedData)

        if (res.data.pagination) {
          setPagination(res.data.pagination)
          setCurrentPage(res.data.pagination.currentPage)
        }
      }
    } catch (err) {
      console.error("Gagal fetch data:", err)
      toast.error("Gagal memuat data kegiatan")
      setActivities([])
    } finally {
      setIsLoading(false)
    }
  }, [debounceSearch, filterUnit, filterStatus, pageSize])

  useEffect(() => {
    setCurrentPage(1)
    fetchActivities(1)
  }, [debounceSearch, filterUnit, filterStatus])

  // Fetch data when page changes
  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchActivities(page)
  }

  // Stats calculation
  const totalActivities = pagination.totalItems || 0
  const upcomingActivities = activities.filter(
    (a) => new Date(a.tanggal) >= new Date()
  ).length
  const conflictActivities = activities.filter((a) => a.hasConflict).length
  const todayActivities = activities.filter((a) => {
    const today = new Date().toISOString().split("T")[0]
    return a.tanggal === today
  }).length

  const filteredActivities = activities

  const getStatusBadge = (activity) => {
    if (activity.hasConflict && activity.conflictTypes && activity.conflictTypes.length > 0) {
      const conflictLabels = activity.conflictTypes.map((type) => {
        switch (type) {
          case "pejabat":
            return "Pejabat"
          case "ruangan":
            return "Ruangan"
          case "waktu":
            return "Waktu"
          case "multiple":
            return "Multiple"
          default:
            return type
        }
      })

      // If multiple conflicts (e.g., DoubleConflict), show all badges
      if (conflictLabels.length > 1) {
        return (
          <div className="flex flex-wrap gap-1">
            {conflictLabels.map((label, idx) => (
              <Badge key={idx} variant="destructive" className="gap-1 text-xs">
                <AlertTriangle className="h-3 w-3" />
                Konflik {label}
              </Badge>
            ))}
          </div>
        )
      }

      // Single conflict
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Konflik {conflictLabels[0]}
        </Badge>
      )
    }

    // Fallback for backward compatibility
    if (activity.hasConflict) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Konflik{" "}
          {activity.conflictType === "pejabat"
            ? "Pejabat"
            : activity.conflictType === "ruangan"
            ? "Ruangan"
            : "Waktu"}
        </Badge>
      )
    }

    return (
      <Badge
        variant="default"
        className="bg-green-600 hover:bg-green-700 gap-1"
      >
        <CheckCircle2 className="h-3 w-3" />
        Normal
      </Badge>
    );
  };


  // Function to export to Google Calendar
  const exportToGoogleCalendar = (activity) => {
    const startDateTime = `${activity.tanggal}T${activity.waktuMulai}:00`;
    const endDateTime = `${activity.tanggal}T${activity.waktuSelesai}:00`;

    const ruangan = activity.ruangan || activity.tempat || "";
    
    const details = `
Unit: ${activity.unit}
Prodi: ${activity.prodi}
Ruangan: ${ruangan}
Pejabat: ${activity.pejabat.join(", ")}
Jumlah Peserta: ${activity.jumlahPeserta}

${activity.keterangan}`;

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      activity.namaKegiatan
    )}&dates=${startDateTime.replace(/[-:]/g, "")}/${endDateTime.replace(
      /[-:]/g,
      ""
    )}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
      ruangan
    )}`;

    window.open(googleCalendarUrl, "_blank");
    toast.success("Membuka Google Calendar");
  };

  const exportAllToGoogleCalendar = () => {
    const upcomingActivities = activities.filter(
      (a) => new Date(a.tanggal) >= new Date()
    );

    if (upcomingActivities.length === 0) {
      toast.error("Tidak ada kegiatan mendatang untuk di-export");
      return;
    }

    toast.success(
      `Membuka ${upcomingActivities.length} kegiatan di Google Calendar`,
      {
        description: "Window akan terbuka untuk setiap kegiatan",
      }
    );

    upcomingActivities.forEach((activity, index) => {
      setTimeout(() => {
        exportToGoogleCalendar(activity);
      }, index * 500); // Delay to avoid popup blocker
    });
  };

  const detectConflicts = (newActivity, excludeId = null) => {
    // Filter out the activity being edited from conflict detection
    const activitiesToCheck = excludeId
      ? activities.filter((a) => a.id !== excludeId)
      : activities;

    // Check for room conflicts
    const roomConflict = activitiesToCheck.find(
      (a) =>
        a.tanggal === newActivity.tanggal &&
        (a.ruangan === newActivity.ruangan || a.tempat === newActivity.ruangan) &&
        ((newActivity.waktuMulai >= a.waktuMulai &&
          newActivity.waktuMulai < a.waktuSelesai) ||
          (newActivity.waktuSelesai > a.waktuMulai &&
            newActivity.waktuSelesai <= a.waktuSelesai))
    );

    if (roomConflict) {
      return {
        hasConflict: true,
        type: "ruangan",
        message: `Ruangan ${newActivity.ruangan} sudah digunakan untuk "${roomConflict.namaKegiatan}"`,
      }
    }

    // Check for official conflicts
    const officialConflict = activitiesToCheck.find((a) => {
      if (a.tanggal !== newActivity.tanggal) return false;

      const timeOverlap =
        (newActivity.waktuMulai >= a.waktuMulai &&
          newActivity.waktuMulai < a.waktuSelesai) ||
        (newActivity.waktuSelesai > a.waktuMulai &&
          newActivity.waktuSelesai <= a.waktuSelesai);

      if (!timeOverlap) return false;

      return newActivity.pejabat.some((p) => a.pejabat.includes(p));
    });

    if (officialConflict) {
      const conflictingOfficials = newActivity.pejabat.filter((p) =>
        officialConflict.pejabat.includes(p)
      );
      return {
        hasConflict: true,
        type: "pejabat",
        message: `${conflictingOfficials.join(", ")} sudah terjadwal di "${
          officialConflict.namaKegiatan
        }"`,
      };
    }

    return { hasConflict: false };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#e31e25]">
            Daftar Agenda
          </h1>
          <p className="text-muted-foreground">
            Pantau dan kelola agenda kegiatan unit dan program studi untuk
            menghindari konflik jadwal
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportAllToGoogleCalendar}
            className="gap-2"
          >
            <CalendarPlus className="h-4 w-4" />
            Export ke Google Calendar
          </Button>

          <AddActivity 
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            editingId={editingId}
            formData={formData}
            setFormData={setFormData}
            units={units}
            prodiList={prodiList}
            rooms={rooms}
            officials={officials}
            onSuccess={() => fetchActivities(currentPage)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Kegiatan
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivities}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Terjadwal dan aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayActivities}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Kegiatan berlangsung
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mendatang</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingActivities}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Kegiatan terjadwal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Konflik Terdeteksi
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {conflictActivities}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Perlu perhatian
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats by Resource */}
      {/* <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Ruangan Tersibuk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Aula Utama", "Ruang Seminar A", "Lab Komputer 1"].map(
                (room, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{room}</span>
                    <Badge variant="secondary">
                      {2} kegiatan
                    </Badge>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Unit Paling Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Dekan", "Wakil Dekan I", "Prodi S1 Manajemen"].map(
                (unit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{unit}</span>
                    <Badge variant="secondary">
                      {2} kegiatan
                    </Badge>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Pejabat Tersibuk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Dekan", "Wakil Dekan I", "Wakil Dekan II"].map(
                (official, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{official}</span>
                    <Badge variant="secondary">
                      {2} kegiatan
                    </Badge>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* View Toggle and Filters */}
      <TableActivityMonitoring 
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterUnit={filterUnit}
        setFilterUnit={setFilterUnit}
        units={units}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filteredActivities={filteredActivities}
        isLoading={isLoading}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        getStatusBadge={getStatusBadge}
        exportToGoogleCalendar={exportToGoogleCalendar}
        onSuccess={() => fetchActivities(currentPage)}
        onEdit={(activity) => {
          setFormData({
            namaKegiatan: activity.namaKegiatan,
            tanggal: activity.tanggal,
            waktuMulai: activity.waktuMulai,
            waktuSelesai: activity.waktuSelesai,
            unit: activity.unit,
            prodi: activity.prodi,
            ruangan: activity.ruangan,
            pejabat: activity.pejabat,
            jumlahPeserta: activity.jumlahPeserta,
            keterangan: activity.keterangan,
          })
          setEditingId(activity.id)
          setIsDialogOpen(true)
        }}
      />
    </div>
  );
}
