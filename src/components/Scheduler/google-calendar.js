"use client"

import { useCallback, useEffect, useState } from "react"
import { CalendarDaysIcon } from "lucide-react"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

export function parsePlannerDescription(description) {
    if (!description) return null;

    const lines = description.split("\n").map(l => l.trim()).filter(Boolean);

    const progress = lines.find(l => l.toLowerCase().startsWith("progress")) || null;
    const checklist = lines.find(l => l.toLowerCase().startsWith("checklist")) || null;

    // Extract bullet list (line starting with "-", "*", or "•")
    const bullets = lines
        .filter(l => l.startsWith("-") || l.startsWith("*") || l.startsWith("•"))
        .map(l => l.replace(/^[-*•]\s*/, ""));

    // Find Planner link
    const plannerLink = lines.find(l => l.startsWith("http")) || null;

    return {
        progress,      // e.g. "Progress: Not started"
        checklist,     // e.g. "Checklist 0 / 1 complete"
        bullets,       // array berisi bullet point
        plannerLink    // URL
    };
}
  

const GoogleCalendar = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()
    const isConnected = searchParams.get("connected")
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/google/events`,
                    {
                        headers: {
                            "ngrok-skip-browser-warning": true,
                        },
                    }
                );
                setEvents(mapGoogleEventsToCalendar(res.data));
                console.log(res.data);
            } catch (err) {
                console.error("Gagal fetch events:", err);
            } finally {
                setLoading(false);
            }
        }
    
        if (isConnected === "true") {
            toast.success("Google Calendar berhasil terhubung!");
        } else if (isConnected === "false") {
            toast.error("Gagal menghubungkan Google Calendar.");
        }
    
        fetchEvents()
    }, [isConnected])

    const COLORS = [
        "#1a73e8", // Google Blue
        "#e8710a", // Orange
        "#188038", // Green
        "#a142f4", // Purple
        "#d93025", // Red
    ];
    
    function mapGoogleEventsToCalendar(events) {
        return events.map((e, idx) => {
            const start = e.start?.dateTime || e.start?.date;
            const end = e.end?.dateTime || e.end?.date;
            const color = COLORS[idx % COLORS.length]
    
            return {
                id: e.id,
                title: e.summary,
                start: start ? new Date(start).toISOString() : null,
                end: end ? new Date(end).toISOString() : null,
                extendedProps: {
                    description: e.description,
                    color,
                    planner: parsePlannerDescription(e.description || "")
                }
            };
        }).filter(e => e.start);
    }
      
    function renderEventContent(info) {
        const planner = info.event.extendedProps.planner;
    
        return (
            <div className="fc-event-custom" style={{ "--event-color": info.event.extendedProps.color }}>
                <div className="font-semibold text-[13px] leading-tight text-red-500">
                    {info.event.title}
                </div>
    
                {planner?.progress && (
                    <div className="text-[11px] text-gray-600">
                        {planner.progress}
                    </div>
                )}
    
                {planner?.bullets?.length > 0 && (
                    <ul className="text-[11px] text-gray-700 ml-3 list-disc">
                        {planner.bullets.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                )}
    
                {planner?.plannerLink && (
                    <a
                        href={planner.plannerLink}
                        target="_blank"
                        className="text-[11px] text-blue-600 underline"
                    >
                        Open task
                    </a>
                )}
            </div>
        );
    }
    

    
    
    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start mt-1 gap-3">
                    <div className="bg-[#e31e25] rounded-full w-14 h-14 flex justify-center items-center">
                        <CalendarDaysIcon className="size-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#e31e25]">
                            Kalender <span className="text-sm">by Google Calendar</span>
                        </h1>
                        <p className="text-muted-foreground">
                            Pantau seluruh kegiatan FEB dari Kalender ini
                        </p>
                    </div>
                </div>

                {/* CONNECT BUTTON */}
                <a
                    href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/google/login`}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    Connect Google Calendar
                </a>
            </div>

            {/* EVENTS LIST */}
            <div className="space-y-3">
                {loading && <p>Loading events...</p>}

                {!loading && events.length === 0 && (
                    <p className="text-muted-foreground">Belum ada event ditemukan.</p>
                )}

                {!loading && (
                    <div className="grid xl:grid-cols-2 gap-4">
                        <div className="bg-slate-100 shadow-sm border border-gray-200 rounded-xl p-4">
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                events={events}
                                eventContent={renderEventContent}
                            />
                        </div>
                        <div className="bg-slate-100 shadow-sm border border-gray-200 rounded-xl p-4">
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                events={events}
                                eventContent={renderEventContent}
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default GoogleCalendar