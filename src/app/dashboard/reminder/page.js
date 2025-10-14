'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AlarmClock, AlarmClockIcon, CalendarIcon, Loader2, LoaderCircle, MoreHorizontal, Pencil, PencilLine, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { compareAsc, format, isSameDay } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";


function hasEventsOnDate(schedule, date) {
    return schedule.some((ev) => isSameDay(ev.reminderTime, date))
}

function formatHumanDate(date) {
    return format(date, "d MMMM yyyy", { locale: localeId })
}

function formatTime(date) {
    return format(date, "HH:mm")
}

function EventRow({ event, onViewDetail, onCancel, isLoading }) {
    return (
      <div className={cn("flex items-start justify-between gap-4 py-3", "first:pt-0 last:pb-0")}>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="text-sm text-muted-foreground">Akan dikirim pada: {format(event.reminderTime, "HH:mm")}</div>
          <div className="truncate font-medium">{event.eventTitle}</div>
          <div className="text-pretty text-sm text-muted-foreground">{event.eventDescription}</div>
        </div>
  
        <div className="flex shrink-0 items-center gap-2">
          <Badge className="capitalize" variant={event.status === "sent" ? "default" : "secondary"}>{event.status}</Badge>
          {event.status === "cancelled" || event.status === "sent" ? (
            <Button variant="outline" size="icon"><Trash2 className="size-4 text-destructive" /></Button>
          ) : (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" aria-label="Opsi">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-40">
                    <DropdownMenuItem><PencilLine className="size-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCancel(event.id)} className="text-destructive">
                        {isLoading ? <Loader2 className="size-4" /> : <X className="text-destructive size-4" /> } Batalkan
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive"><Trash2 className="text-destructive size-4" /> Hapus</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    )
  }

  
const ReminderPage = () => {
    const [open, setOpen] = useState(false)
    const [schedules, setSchedules] = useState([])
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isMounted, setIsMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [recipientName, setRecipientName] = useState("")
    const [phone, setPhone] = useState("")
    const [eventDescription, setEventDescription] = useState("")
    const [eventTitle, setEventTitle] = useState("")
    const [eventDate, setEventDate] = useState(new Date())
    const [time, setTime] = useState("09:00")
    const [reminderDate, setReminderDate] = useState(new Date())
    const [reminderTime, setReminderTime] = useState("08:00")

    const scheduleEvents = async () => {
        const res = await axios.get('http://localhost:3001/api/schedules')
        if (res) {
            setSchedules(res.data)
        }
    }

    const createSchedule = async () => {
        setIsLoading(true)
        const [eventHours, eventMinutes] = time.split(':').map(Number)
        const combinedEventDateTime = new Date(eventDate)
        combinedEventDateTime.setHours(eventHours, eventMinutes, 0, 0)

        const [reminderHours, reminderMinutes] = reminderTime.split(':').map(Number)
        const combinedReminderDateTime = new Date(reminderDate)
        combinedReminderDateTime.setHours(reminderHours, reminderMinutes, 0, 0)

        try {
            const res = await axios.post('http://localhost:3001/api/schedules', {
                targetPerson: recipientName,
                targetPhoneNumber: `${phone}@c.us`,
                eventTitle: eventTitle,
                eventDescription: eventDescription,
                eventTime: combinedEventDateTime,
                reminderTime: combinedReminderDateTime,
                createdBy: '6282318572605@c.us'
            })
            if (res.status === 201) {
                // console.log("Jadwal berhasil dibuat:", res.data)
                await new Promise(resolve => setTimeout(resolve, 1500))
            }
        } catch (error) {
            console.error("Gagal membuat jadwal:", error)
        } finally {
            setIsLoading(false)
            setOpen(false)
            scheduleEvents()
        }
    }

    const handleCancelSchedule = async (scheduleId) => {
        setIsLoading(true)
        try {
            const res = await axios.put(`http://localhost:3001/api/schedules/${scheduleId}/cancel`, {
                status: 'cancelled'
            })
            if (res.status === 200) {
                await new Promise(resolve => setTimeout(resolve, 3000))
            }
        } catch (error) {
            console.error("Gagal membuat jadwal:", error)
        } finally {
            setIsLoading(false)
            scheduleEvents()
        }
    }

    useEffect(() => {
        scheduleEvents()
        setIsMounted(true)
    }, [])

    const eventsForDay = useMemo(() => {
        return schedules
            .filter((ev) => isSameDay(ev.reminderTime, selectedDate))
            .sort((a, b) => compareAsc(a.reminderTime, b.reminderTime))
    }, [schedules, selectedDate])

    function handleViewDetail(ev) {
        setSelectedEvent(ev)
        setIsDrawerOpen(true)
    }

    return ( 
        <div className="space-y-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start mt-1 gap-3">
                    <AlarmClockIcon className="size-10 text-emerald-600" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-emerald-600">Reminder Ibu Dekan</h1>
                        <p className="text-muted-foreground">
                            Pengingat kegiatan penting agar tidak terlewat
                        </p>
                    </div>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">+ Buat Jadwal Baru</Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Buat Reminder Baru</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="eventTitle">Judul kegiatan</Label>
                                <Input
                                    id="eventTitle"
                                    placeholder="Kegiatan yang akan dihadiri"
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="recipient">Nama Penerima</Label>
                                    <Input
                                        id="recipient"
                                        placeholder="Ibu Dekan"
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Nomor WhatsApp Tujuan</Label>
                                    <Input
                                        id="phone"
                                        placeholder="628xxxxxxxxxx"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="eventDescription">Isi Pesan Reminder</Label>
                                <Textarea
                                    id="eventDescription"
                                    placeholder="Tulis pesan pengingat di sini..."
                                    value={eventDescription}
                                    onChange={(e) => setEventDescription(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            {/* --- WAKTU KEGIATAN (Event Time) --- */}
                            <div className="grid gap-2">
                                <Label>Waktu Kegiatan</Label>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className={cn("w-full justify-start text-left font-semibold", !eventDate && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {eventDate ? format(eventDate, "PPP") : <span>Pilih tanggal kegiatan</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={eventDate} onSelect={setEventDate} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {/* Time Input untuk Event */}
                                    <div className="flex-1">
                                        <Input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Waktu Reminder */}
                            <div className="grid gap-2">
                                {/* Waktu Reminder (Date Picker) */}
                                <Label>Waktu Pengiriman Reminder</Label>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn("w-full justify-start text-left font-semibold", !reminderDate && "text-muted-foreground")}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {reminderDate ? format(reminderDate, "PPP") : <span>Pilih tanggal dikirim</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={reminderDate} onSelect={setReminderDate} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {/* Jam (Time Input) */}
                                    <div className="flex-1">
                                        <Input
                                            type="time"
                                            value={reminderTime}
                                            onChange={(e) => setReminderTime(e.target.value)}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Batal
                            </Button>
                            <Button onClick={createSchedule}>
                                {isLoading ? <LoaderCircle className="size-4 animate-spin"/> : "Simpan jadwal"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Two panel Layout */}
            <section className="flex flex-col lg:flex-row gap-6">
                 {/* Left Panel: calender */}
                 <div className="flex-1 flex justify-center">
                     {isMounted ? (
                         <Calendar
                             mode="single"
                             selected={selectedDate}
                             onSelect={(d) => d && setSelectedDate(d)}
                             className="rounded-md border shadow-sm w-full max-w-md"
                             modifiers={{ 
                                 busy: (date) => hasEventsOnDate(schedules, date),
                             }}
                             modifiersClassNames={{ 
                                 busy: `after:content-[''] after:block after:mx-auto after:mt-1 
                                 after:h-1.5 after:w-1.5 after:rounded-full after:bg-primary`,
                             }}
                         />
                     ) : (
                         <div className="rounded-md border shadow-sm w-full max-w-md h-[350px] flex items-center justify-center">
                             <div className="text-muted-foreground">Loading calendar...</div>
                         </div>
                     )}
                 </div>
                
                {/* Right Panel: Event Details */}
                <div className="flex-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Jadwal pengingat untuk {formatHumanDate(selectedDate)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {eventsForDay.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Tidak ada jadwal untuk tanggal ini.</p>
                            ) : (
                                <div className="divide-y">
                                {eventsForDay.map((event) => (
                                  <EventRow key={event.id} event={event} onViewDetail={handleViewDetail} onCancel={handleCancelSchedule} isLoading={isLoading} />
                                ))}
                              </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
 
export default ReminderPage;