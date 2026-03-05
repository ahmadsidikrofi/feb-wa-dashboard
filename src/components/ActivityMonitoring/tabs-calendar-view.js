import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"


// TabsCalendarView.jsx - Multi-day spanning calendar
// Ganti komponen lama kamu dengan ini

const TabsCalendarView = ({ filteredActivities, onEdit }) => {
    const [currentDate, setCurrentDate] = useState(new Date())

    // ===== Helper =====
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startDay = startOfMonth.getDay()
    const daysInMonth = endOfMonth.getDate()

    const calendarDays = useMemo(() => {
        const days = []
        const prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()

        for (let i = startDay - 1; i >= 0; i--) {
            days.push({
                date: prevMonthLastDate - i,
                isCurrentMonth: false,
                fullDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthLastDate - i)
            })
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: i,
                isCurrentMonth: true,
                fullDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
            })
        }
        while (days.length < 42) {
            const nextDay = days.length - (startDay + daysInMonth) + 1
            days.push({
                date: nextDay,
                isCurrentMonth: false,
                fullDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, nextDay)
            })
        }
        return days
    }, [currentDate])

    // Bagi calendarDays menjadi array of weeks (per 7 hari)
    const weeks = useMemo(() => {
        const result = []
        for (let i = 0; i < calendarDays.length; i += 7) {
            result.push(calendarDays.slice(i, i + 7))
        }
        return result
    }, [calendarDays])

    const toDateKey = (date) => {
        const d = new Date(date)
        d.setHours(0, 0, 0, 0)
        return d.toISOString().split("T")[0]
    }

    // ===== Proses events untuk spanning =====
    // Untuk setiap event multi-hari, kita hitung posisi dan lebar di setiap baris minggu
    const processedWeekEvents = useMemo(() => {
        // weekEvents[weekIndex] = array of { event, colStart, colEnd, isStart, isEnd, row }
        const weekEvents = weeks.map(() => [])

        filteredActivities.forEach((activity) => {
            const eventStart = new Date(activity.tanggal)
            eventStart.setHours(0, 0, 0, 0)

            const eventEnd = activity.tanggalBerakhir
                ? new Date(activity.tanggalBerakhir)
                : new Date(activity.tanggal)
            eventEnd.setHours(0, 0, 0, 0)

            // Cek setiap minggu, apakah event ini ada di minggu tersebut
            weeks.forEach((week, weekIndex) => {
                const weekStart = new Date(week[0].fullDate)
                weekStart.setHours(0, 0, 0, 0)
                const weekEnd = new Date(week[6].fullDate)
                weekEnd.setHours(0, 0, 0, 0)

                // Event tidak ada di minggu ini
                if (eventEnd < weekStart || eventStart > weekEnd) return

                // Hitung kolom mulai dan akhir dalam minggu ini (0-6)
                const colStart = eventStart >= weekStart
                    ? Math.round((eventStart - weekStart) / (1000 * 60 * 60 * 24))
                    : 0

                const colEnd = eventEnd <= weekEnd
                    ? Math.round((eventEnd - weekStart) / (1000 * 60 * 60 * 24))
                    : 6

                const isStart = eventStart >= weekStart
                const isEnd = eventEnd <= weekEnd

                weekEvents[weekIndex].push({
                    event: activity,
                    colStart,
                    colEnd,
                    isStart,
                    isEnd,
                })
            })
        })

        // Assign row (vertical stacking) agar events tidak overlap
        weekEvents.forEach((events) => {
            // Sort: event yang mulai lebih awal duluan, lalu yang lebih panjang
            events.sort((a, b) => a.colStart - b.colStart || b.colEnd - a.colEnd)

            events.forEach((ev) => {
                let row = 0
                while (true) {
                    const conflict = events.find(
                        (other) =>
                            other !== ev &&
                            other.row === row &&
                            other.colStart <= ev.colEnd &&
                            other.colEnd >= ev.colStart
                    )
                    if (!conflict) break
                    row++
                }
                ev.row = row
            })
        })

        return weekEvents
    }, [filteredActivities, weeks])

    const monthLabel = currentDate.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
    })

    const EVENT_HEIGHT = 22      // px tinggi satu event bar
    const EVENT_GAP = 2          // px gap antar event
    const DATE_NUMBER_HEIGHT = 28 // px ruang untuk nomor tanggal
    const MAX_VISIBLE_ROWS = 3   // berapa baris event yang ditampilkan sebelum "+N lainnya"

    return (
        <Card className="bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-sm">
            <CardHeader>
                <CardTitle>Kalender Interaktif</CardTitle>
                <CardDescription>
                    Tampilan kalender interaktif untuk memantau seluruh kegiatan
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* Header Navigation */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                        className="p-2 rounded-full hover:bg-accent transition"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <h2 className="text-lg font-medium capitalize">{monthLabel}</h2>
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                        className="p-2 rounded-full hover:bg-accent transition"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Weekday Header */}
                <div className="grid grid-cols-7 text-xs uppercase text-muted-foreground mb-2">
                    {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                        <div key={day} className="text-center py-2">{day}</div>
                    ))}
                </div>

                {/* Calendar Grid - per row/week */}
                <div className="border-l border-t border-border/60">
                    {weeks.map((week, weekIndex) => {
                        const weekEvs = processedWeekEvents[weekIndex]
                        const maxRow = weekEvs.length > 0 ? Math.max(...weekEvs.map(e => e.row)) : -1
                        const visibleRows = Math.min(maxRow + 1, MAX_VISIBLE_ROWS)

                        // Tinggi row = ruang tanggal + ruang events
                        const rowHeight = DATE_NUMBER_HEIGHT + visibleRows * (EVENT_HEIGHT + EVENT_GAP) + 12

                        return (
                            <div
                                key={weekIndex}
                                className="relative grid grid-cols-7"
                                style={{ minHeight: Math.max(rowHeight, 140) }}
                            >
                                {/* Sel-sel tanggal (background + nomor) */}
                                {week.map((day, dayIndex) => {
                                    const isToday = new Date().toDateString() === day.fullDate.toDateString()
                                    return (
                                        <div
                                            key={dayIndex}
                                            className={`border-r border-b border-border/60 p-1
                                                ${!day.isCurrentMonth ? "bg-muted/30" : ""}
                                            `}
                                        >
                                            {/* Nomor tanggal */}
                                            <div className="flex justify-center mb-4">
                                                <div className={`
                                                    w-7 h-7 flex items-center justify-center text-xs rounded-full
                                                    ${!day.isCurrentMonth ? "text-muted-foreground" : ""}
                                                    ${isToday ? "bg-blue-600 text-white font-semibold" : ""}
                                                `}>
                                                    {day.date}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}

                                {/* ===== LAYER EVENT (absolute, di atas grid) ===== */}
                                <div
                                    className="absolute inset-0 pointer-events-none mt-2"
                                    style={{ top: DATE_NUMBER_HEIGHT }}
                                >
                                    {weekEvs
                                        .filter(ev => ev.row < MAX_VISIBLE_ROWS)
                                        .map((ev, evIdx) => {
                                            const { event, colStart, colEnd, isStart, isEnd, row } = ev
                                            const spanCols = colEnd - colStart + 1

                                            // Width: berapa kolom yang di-span, dikurangi sedikit padding
                                            const CELL_WIDTH_PERCENT = 100 / 7
                                            const leftPercent = colStart * CELL_WIDTH_PERCENT
                                            // Kurangi 2px kanan agar ada gap visual antar kolom
                                            const widthPercent = spanCols * CELL_WIDTH_PERCENT

                                            const topPx = row * (EVENT_HEIGHT + EVENT_GAP) + EVENT_GAP

                                            return (
                                                <div
                                                    key={evIdx}
                                                    onClick={() => onEdit && onEdit(event)}
                                                    className="pointer-events-auto absolute cursor-pointer"
                                                    style={{
                                                        left: `calc(${leftPercent}% + ${isStart ? 4 : 0}px)`,
                                                        width: `calc(${widthPercent}% - ${isStart ? 4 : 0}px - ${isEnd ? 4 : 0}px)`,
                                                        top: topPx,
                                                        height: EVENT_HEIGHT,
                                                        zIndex: 10,
                                                    }}
                                                >
                                                    <div
                                                        className={`
                                                            h-full flex items-center px-2
                                                            text-[11px] font-medium
                                                            transition-all duration-150
                                                            hover:brightness-95 hover:shadow-md
                                                            ${event.hasConflict
                                                                ? "bg-red-500 text-white"
                                                                : "bg-blue-500 text-white"
                                                            }
                                                            ${isStart ? "rounded-l-md" : ""}
                                                            ${isEnd ? "rounded-r-md" : ""}
                                                            ${!isStart ? "pl-1" : ""}
                                                        `}
                                                        style={{
                                                            // Kalau tidak di awal minggu, tambah visual "sambungan"
                                                            borderLeft: !isStart ? "2px dashed rgba(255,255,255,0.4)" : undefined,
                                                        }}
                                                    >
                                                        {/* Hanya tampilkan teks kalau ini awal event atau awal minggu */}
                                                        {(isStart || colStart === 0) && (
                                                            <span className="truncate">
                                                                {event.waktuMulai && `${event.waktuMulai} · `}{event.namaKegiatan}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}

                                    {/* "+N lainnya" per kolom hari */}
                                    {week.map((day, dayIndex) => {
                                        const dateKey = toDateKey(day.fullDate)
                                        // Hitung berapa event yang hidden di hari ini
                                        const hiddenEvents = weekEvs.filter(ev =>
                                            ev.colStart <= dayIndex &&
                                            ev.colEnd >= dayIndex &&
                                            ev.row >= MAX_VISIBLE_ROWS
                                        )
                                        if (hiddenEvents.length === 0) return null

                                        const CELL_WIDTH_PERCENT = 100 / 7
                                        const topPx = MAX_VISIBLE_ROWS * (EVENT_HEIGHT + EVENT_GAP) + EVENT_GAP

                                        return (
                                            <div
                                                key={dateKey}
                                                className="absolute text-[10px] text-muted-foreground pointer-events-auto cursor-default select-none"
                                                style={{
                                                    left: `calc(${dayIndex * CELL_WIDTH_PERCENT}% + 4px)`,
                                                    width: `calc(${CELL_WIDTH_PERCENT}% - 8px)`,
                                                    top: topPx,
                                                }}
                                            >
                                                +{hiddenEvents.length} lainnya
                                            </div>
                                        )
                                    })}
                                </div>

                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
export default TabsCalendarView