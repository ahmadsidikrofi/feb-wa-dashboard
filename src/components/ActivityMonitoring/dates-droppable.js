import { useDroppable } from '@dnd-kit/core'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

// Komponen untuk setiap kotak hari di layer background
export const DroppableDayCell = ({ day, isToday, children }) => {
    const dateKey = day.fullDate.toISOString().split("T")[0]
    const { isOver, setNodeRef } = useDroppable({
        id: dateKey,
    });

    return (
        <div
            ref={setNodeRef}
            className={`border-r border-b border-border/60 p-1 transition-colors
                ${!day.isCurrentMonth ? "bg-muted/30" : ""}
                ${isOver ? "bg-blue-100/50 dark:bg-blue-900/30" : ""}
            `}
        >
            <div className="flex justify-center mb-4">
                <div className={`
                    w-7 h-7 flex items-center justify-center text-xs rounded-full
                    ${!day.isCurrentMonth ? "text-muted-foreground" : ""}
                    ${isToday ? "bg-blue-600 text-white font-semibold" : ""}
                `}>
                    {day.date}
                </div>
            </div>
            {children}
        </div>
    )
}

export const DraggableEventBlock = ({ eventData, styleProps, onEdit }) => {
    const { event, isStart, isEnd, colStart } = eventData;

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        // ID harus unik! Kalau event nyebrang 2 minggu, id-nya kita bedakan
        id: `${event.id}-${styleProps.weekIndex}`,
        data: { originalEvent: event }
    })

    const mergedStyle = {
        ...styleProps.style,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 50 : styleProps.style.zIndex,
        cursor: isDragging ? 'grabbing' : 'pointer'
    }

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={mergedStyle}
            onClick={() => onEdit && onEdit(event)}
            className={`absolute pointer-events-auto`}
        >
            <div
                className={`
                    h-full flex items-center px-2 text-[11px] font-medium
                    transition-all duration-150 hover:brightness-95 hover:shadow-md
                    ${event.hasConflict ? "bg-red-500 text-white" : "bg-blue-500 text-white"}
                    ${isStart ? "rounded-l-md" : ""}
                    ${isEnd ? "rounded-r-md" : ""}
                    ${!isStart ? "pl-1" : ""}
                `}
                style={{ borderLeft: !isStart ? "2px dashed rgba(255,255,255,0.4)" : undefined }}
            >
                {(isStart || colStart === 0) && (
                    <span className="truncate select-none">
                        {event.waktuMulai && `${event.waktuMulai} · `}{event.namaKegiatan}
                    </span>
                )}
            </div>
        </div>
    );
};