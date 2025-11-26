'use client'

import { useEffect, useState } from "react"
import { CalendarDaysIcon } from "lucide-react"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

const GoogleCalendar = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()
    const isConnected = searchParams.get("connected")
    
    const fetchEvents = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/google/events`, {
                headers: {
                    "ngrok-skip-browser-warning": true
                }
            })
            setEvents(mapGoogleEventsToCalendar(res.data))
            console.log(res.data);
            
        } catch (err) {
            console.error("Gagal fetch events:", err)
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        if (isConnected === "true") {
            toast.success("Google Calendar berhasil terhubung!");
        } else if (isConnected === "false") {
            toast.error("Gagal menghubungkan Google Calendar.");
        }
        fetchEvents()
    }, [isConnected])

    function mapGoogleEventsToCalendar(events) {
        return events.map(e => {
            const start = e.start?.dateTime || e.start?.date;
            const end = e.end?.dateTime || e.end?.date;

            return {
                id: e.id,
                title: e.summary,
                start: start ? new Date(start).toISOString() : null,
                end: end ? new Date(end).toISOString() : null,
            };
        }).filter(e => e.start);
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
                    <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-8">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                        />
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                        />
                    </div>
                )}

            </div>
        </div>
    )
}

export default GoogleCalendar
