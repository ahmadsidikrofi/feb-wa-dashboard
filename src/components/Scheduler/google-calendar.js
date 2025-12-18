"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDaysIcon,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function parsePlannerDescription(description) {
  if (!description) return null;

  const lines = description
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const progress =
    lines.find((l) => l.toLowerCase().startsWith("progress")) || null;
  const checklist =
    lines.find((l) => l.toLowerCase().startsWith("checklist")) || null;

  // Extract bullet list (line starting with "-", "*", or "•")
  const bullets = lines
    .filter((l) => l.startsWith("-") || l.startsWith("*") || l.startsWith("•"))
    .map((l) => l.replace(/^[-*•]\s*/, ""));

  // Find Planner link
  const plannerLink = lines.find((l) => l.startsWith("http")) || null;

  return {
    progress, // e.g. "Progress: Not started"
    checklist, // e.g. "Checklist 0 / 1 complete"
    bullets, // array berisi bullet point
    plannerLink, // URL
  };
}

const GoogleCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const isConnected = searchParams.get("connected");

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
    };

    if (isConnected === "true") {
      toast.success("Google Calendar berhasil terhubung!");
    } else if (isConnected === "false") {
      toast.error("Gagal menghubungkan Google Calendar.");
    }

    fetchEvents();
  }, [isConnected]);

  const COLORS = [
    "#1a73e8", // Google Blue
    "#e8710a", // Orange
    "#188038", // Green
    "#a142f4", // Purple
    "#d93025", // Red
  ];

  function mapGoogleEventsToCalendar(events) {
    return events
      .map((e, idx) => {
        const start = e.start?.dateTime || e.start?.date;
        const end = e.end?.dateTime || e.end?.date;
        const color = COLORS[idx % COLORS.length];

        return {
          id: e.id,
          title: e.summary,
          start: start ? new Date(start).toISOString() : null,
          end: end ? new Date(end).toISOString() : null,
          extendedProps: {
            description: e.description,
            color,
            planner: parsePlannerDescription(e.description || ""),
          },
        };
      })
      .filter((e) => e.start);
  }

  function renderEventContent(info) {
    const planner = info.event.extendedProps.planner;

    return (
      <div
        className="fc-event-custom"
        style={{ "--event-color": info.event.extendedProps.color }}
      >
        <div className="font-semibold text-[13px] leading-tight text-red-500">
          {info.event.title}
        </div>

        {planner?.progress && (
          <div className="text-[11px] text-gray-600">{planner.progress}</div>
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

  const upcomingEvents = events
    .filter((e) => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);

  const todayEvents = events.filter((e) => {
    const eventDate = new Date(e.start).toDateString();
    const today = new Date().toDateString();
    return eventDate === today;
  });

  const formatEventTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatEventDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Google Calendar</h1>
          <p className="text-muted-foreground">
            Kelola dan pantau jadwal kegiatan fakultas secara terintegrasi
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/google/login`)
            }
          >
            <CalendarDaysIcon className="h-4 w-4 mr-2" />
            Connect Google Calendar
          </Button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              Event dalam kalender
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayEvents.length}</div>
            <p className="text-xs text-muted-foreground">Event hari ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mendatang</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">Event akan datang</p>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Memuat kalender...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && events.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <CalendarDaysIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Event</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Hubungkan Google Calendar untuk menampilkan event
              </p>
              <Button
                onClick={() =>
                  (window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/google/login`)
                }
              >
                <CalendarDaysIcon className="h-4 w-4 mr-2" />
                Connect Google Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && events.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* CALENDAR VIEW */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Kalender</CardTitle>
                <CardDescription>
                  Tampilan kalender bulanan event fakultas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="month" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="month">Bulanan</TabsTrigger>
                    <TabsTrigger value="week">Mingguan</TabsTrigger>
                  </TabsList>
                  <TabsContent value="month" className="mt-0">
                    <div className="bg-background rounded-lg">
                      <FullCalendar
                        plugins={[
                          dayGridPlugin,
                          timeGridPlugin,
                          interactionPlugin,
                        ]}
                        initialView="dayGridMonth"
                        events={events}
                        eventContent={renderEventContent}
                        height="auto"
                        headerToolbar={{
                          left: "prev,next today",
                          center: "title",
                          right: "",
                        }}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="week" className="mt-0">
                    <div className="bg-background rounded-lg">
                      <FullCalendar
                        plugins={[
                          dayGridPlugin,
                          timeGridPlugin,
                          interactionPlugin,
                        ]}
                        initialView="timeGridWeek"
                        events={events}
                        eventContent={renderEventContent}
                        height="auto"
                        headerToolbar={{
                          left: "prev,next today",
                          center: "title",
                          right: "",
                        }}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* UPCOMING EVENTS SIDEBAR */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Event Hari Ini</CardTitle>
                <CardDescription>
                  {todayEvents.length} kegiatan hari ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                {todayEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Tidak ada event hari ini
                  </p>
                ) : (
                  <div className="space-y-3">
                    {todayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {event.title}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {formatEventTime(event.start)}
                          </div>
                          {event.extendedProps?.planner?.progress && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {event.extendedProps.planner.progress}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Event Mendatang</CardTitle>
                <CardDescription>5 event terdekat</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Tidak ada event mendatang
                  </p>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => {
                      const planner = event.extendedProps?.planner;
                      return (
                        <div
                          key={event.id}
                          className="flex gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
                        >
                          <div
                            className="w-1 rounded-full"
                            style={{
                              backgroundColor: event.extendedProps.color,
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {event.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatEventDate(event.start)}
                            </div>
                            {planner?.bullets && planner.bullets.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {planner.bullets
                                  .slice(0, 2)
                                  .map((bullet, idx) => (
                                    <li
                                      key={idx}
                                      className="text-xs text-muted-foreground flex items-start gap-1"
                                    >
                                      <span className="mt-1">•</span>
                                      <span className="flex-1">{bullet}</span>
                                    </li>
                                  ))}
                              </ul>
                            )}
                            {planner?.plannerLink && (
                              <a
                                href={planner.plannerLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-2"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Buka task
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendar;
