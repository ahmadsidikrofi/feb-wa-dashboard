import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Close as PopoverClose } from "@radix-ui/react-popover"
import { DndContext, pointerWithin } from "@dnd-kit/core";
import { DraggableEventBlock, DroppableDayCell } from "./dates-droppable";
import { XIcon } from "../ui/x-icon";
import { WalletMinimalIcon } from "../ui/wallet-minimal-icon";

const CalendarDesktopView = ({
    sensors,
    handleDragEnd,
    currentDate,
    setCurrentDate,
    monthLabel,
    weeks,
    processedWeekEvents,
    MAX_VISIBLE_ROWS,
    DATE_NUMBER_HEIGHT,
    EVENT_HEIGHT,
    EVENT_GAP,
    toDateKey,
    isDateInSelection,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    onEdit
}) => {
    return (
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
                <h2 className="text-lg font-medium capitalize flex items-center gap-2"><WalletMinimalIcon className="size-8" /> {monthLabel}</h2>
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
                                        <Popover key={dateKey}>
                                            <PopoverTrigger asChild>
                                                <div
                                                    className="absolute text-[10px] font-medium text-muted-foreground hover:text-foreground pointer-events-auto cursor-pointer select-none px-1 py-0.5 rounded hover:bg-muted/50 transition-colors"
                                                    style={{
                                                        left: `calc(${dayIndex * CELL_WIDTH_PERCENT}% + 4px)`,
                                                        width: `calc(${CELL_WIDTH_PERCENT}% - 8px)`,
                                                        top: topPx,
                                                        zIndex: 20,
                                                    }}
                                                >
                                                    +{hiddenEvents.length} lainnya
                                                </div>
                                            </PopoverTrigger>

                                            <PopoverContent
                                                className="w-64 p-2 z-[100] bg-white dark:bg-slate-950 shadow-xl border-border/50 relative"
                                                align="center"
                                                side="left"
                                            >
                                                <PopoverClose className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none cursor-pointer">
                                                    <XIcon className="size-4" />
                                                    <span className="sr-only">Close</span>
                                                </PopoverClose>
                                                <div className="mb-2 pr-6 px-1 pb-2 border-b border-border/50 text-xs font-semibold text-foreground flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 flex items-center justify-center">
                                                        {day.date}
                                                    </div>
                                                    {day.fullDate.toLocaleDateString("id-ID", { weekday: 'long', month: 'long', year: 'numeric' })}
                                                </div>

                                                {/* List Acara (Scrollable kalau banyak) */}
                                                <div className="flex flex-col gap-1.5 max-h-[250px] overflow-y-auto pr-1">
                                                    {weekEvs.filter(ev => ev.colStart <= dayIndex && ev.colEnd >= dayIndex).map((ev, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => {
                                                                if (onEdit) onEdit(ev.event);
                                                            }}
                                                            className={`
                                                                text-xs px-2 py-1.5 rounded-md cursor-pointer
                                                                transition-all hover:brightness-95 hover:scale-[1.02]
                                                                ${ev.event.hasConflict ? "bg-red-500 text-white" : "bg-blue-500 text-white"}
                                                            `}
                                                        >
                                                            <div className="font-semibold truncate">
                                                                {ev.event.waktuMulai && `${ev.event.waktuMulai} · `}{ev.event.namaKegiatan}
                                                            </div>
                                                            {ev.event.ruangan && (
                                                                <div className="text-[10px] opacity-90 truncate mt-0.5">
                                                                    📍 {ev.event.ruangan}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </PopoverContent>
                                        </Popover>

                                    )
                                })}
                            </div>

                        </div>
                    )
                })}
            </div>
        </DndContext>
    )
}

export default CalendarDesktopView