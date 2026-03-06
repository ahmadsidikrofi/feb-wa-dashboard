import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DndContext, PointerSensor, pointerWithin, useSensor, useSensors } from "@dnd-kit/core";
import { DraggableEventBlock, DroppableDayCell } from "./dates-droppable";

const TabsCalendarView = ({ filteredActivities, onEdit, onEventMove, onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isSelecting, setIsSelecting] = useState(false)
    const [selectionStart, setSelectionStart] = useState(null)
    const [selectionEnd, setSelectionEnd] = useState(null)

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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    )

    const handleDragEnd = (event) => {
        const { active, over } = event;

        // Kalau dilepas di luar kotak kalender, abaikan
        if (!over) return;

        const draggedEvent = active.data.current.originalEvent;
        const targetDateKey = over.id; // Ini YYYY-MM-DD dari kotak tujuan

        // Kalau tanggalnya nggak berubah, abaikan
        const originalDateKey = new Date(draggedEvent.tanggal).toISOString().split("T")[0];
        if (targetDateKey === originalDateKey) return;

        // Panggil fungsi ke parent (atau bisa langsung panggil API Axios di sini)
        if (onEventMove) {
            onEventMove(draggedEvent, targetDateKey);
        } else {
            console.log(`Pindah event ${draggedEvent.namaKegiatan} ke tanggal ${targetDateKey}`);
        }
    }

    // Fungsi untuk mengecek apakah suatu tanggal berada di dalam rentang sorotan
    const isDateInSelection = (dateKey) => {
        if (!isSelecting || !selectionStart || !selectionEnd) return false;
        const current = new Date(dateKey).getTime();
        const start = new Date(selectionStart).getTime();
        const end = new Date(selectionEnd).getTime();
        return current >= Math.min(start, end) && current <= Math.max(start, end)
    }

    const handleMouseDown = (dateKey) => {
        setIsSelecting(true);
        setSelectionStart(dateKey);
        setSelectionEnd(dateKey); // Awal klik, start dan end sama
    }

    const handleMouseEnter = (dateKey) => {
        if (isSelecting) {
            setSelectionEnd(dateKey); // Update rentang saat diseret
        }
    }

    const handleMouseUp = () => {
        if (isSelecting && selectionStart && selectionEnd) {
            // Tentukan mana yang lebih awal (karena user bisa seret dari kanan ke kiri)
            const d1 = new Date(selectionStart);
            const d2 = new Date(selectionEnd);
            const startDate = d1 <= d2 ? selectionStart : selectionEnd;
            const endDate = d1 > d2 ? selectionStart : selectionEnd;

            // Panggil fungsi dari Parent untuk buka modal!
            // (Kita akan buat prop onDateSelect nanti di parent)
            if (onDateSelect) {
                // Jika hanya 1 hari, kirim endDate null. Jika lebih, kirim endDate.
                onDateSelect(startDate, startDate === endDate ? null : endDate);
            }
        }

        // Reset state
        setIsSelecting(false);
        setSelectionStart(null);
        setSelectionEnd(null);
    }

    useEffect(() => {
        const handleGlobalMouseUp = () => setIsSelecting(false)
        window.addEventListener('mouseup', handleGlobalMouseUp)
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
    }, [])

    return (
        <Card className="bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-sm">
            <CardHeader>
                <CardTitle>Kalender Interaktif</CardTitle>
                <CardDescription>
                    Tampilan kalender interaktif untuk memantau seluruh kegiatan
                </CardDescription>
            </CardHeader>

            <CardContent>
                <DndContext
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                    collisionDetection={pointerWithin}
                >
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
                                    style={{ minHeight: Math.max(rowHeight, 150) }}
                                >
                                    {/* Sel-sel tanggal (background + nomor) */}
                                    {week.map((day, dayIndex) => {
                                        const isToday = new Date().toDateString() === day.fullDate.toDateString()
                                        const dateKey = toDateKey(day.fullDate)
                                        const isSelected = isDateInSelection(dateKey)

                                        return (
                                            <DroppableDayCell
                                                key={dayIndex}
                                                day={day}
                                                dateKey={dateKey}
                                                isToday={isToday}
                                                isSelected={isSelected}
                                                onMouseDown={() => handleMouseDown(dateKey)}
                                                onMouseEnter={() => handleMouseEnter(dateKey)}
                                                onMouseUp={handleMouseUp}
                                            />
                                        );
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

                                                const styleProps = {
                                                    weekIndex, // Lempar buat id unik
                                                    style: {
                                                        left: `calc(${leftPercent}% + ${ev.isStart ? 4 : 0}px)`,
                                                        width: `calc(${widthPercent}% - ${ev.isStart ? 4 : 0}px - ${ev.isEnd ? 4 : 0}px)`,
                                                        top: topPx,
                                                        height: EVENT_HEIGHT,
                                                        zIndex: 10,
                                                    }
                                                };
                                                return (
                                                    <DraggableEventBlock
                                                        key={evIdx}
                                                        eventData={{ event, isStart, isEnd, colStart }}
                                                        styleProps={styleProps}
                                                        onEdit={onEdit}
                                                    />
                                                );
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
                </DndContext>
            </CardContent>
        </Card>
    )
}
export default TabsCalendarView