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
import { AlarmClock, AlarmClockIcon, ArrowLeft, CalendarIcon, Loader2, LoaderCircle, MoreHorizontal, Pencil, PencilLine, Plus, PlusCircle, Trash2, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { compareAsc, format, isSameDay } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import DeleteSchedule from "@/components/Scheduler/delete-schedule";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

export const scheduleSchema = z.object({
    eventTitle: z.string().min(1, "Judul kegiatan wajib diisi"),
    recepients: z.array(        
        z.object({
            name: z.string().min(1, "Nama penerima wajib diisi"),
            phone: z.string()
                .min(9, "Nomor tujuan terlalu pendek")
                .max(15, "Nomor whatsapp terlalu panjang")
                .regex(/^[0-9]+$/, "Nomor WhatsApp hanya boleh berisi angka.")
                .refine(value => !value.startsWith("62"), {
                    message: "Nomor WhatsApp tidak boleh diawali dengan 62."
                }),
        }),
    ).min(1, "Minimal 1 penerima."),
    eventDescription: z.string().min(1, "Deskripsi kegiatan wajib diisi"),
    eventDate: z.date({ required_error: "Tanggal kegiatan wajib dipilih." }),
    reminderDate: z.date({ required_error: "Tanggal reminder wajib dipilih." }),
})


function hasEventsOnDate(schedule, date) {
    return schedule.some((ev) => isSameDay(ev.reminderTime, date))
}

function formatHumanDate(date) {
    return format(date, "d MMMM yyyy", { locale: localeId })
}

const handleDeleteSuccess = (deletedScheduleId) => {
    // Hapus schedule dari state tanpa perlu reload
    setSchedules(prevSchedules => 
        prevSchedules.filter(schedule => schedule.id !== deletedScheduleId)
    )
}

function EventRow({ event, onViewDetail, onCancel, isLoading, scheduleEvents }) {
    return (
        <div className={cn("flex items-start justify-between gap-4 py-3", "first:pt-0 last:pb-0")}>
            <div className="min-w-0 flex-1 space-y-1">
                <div className="text-sm text-muted-foreground">Akan dikirim pada: {format(event.reminderTime, "HH:mm")}</div>
                <div className="truncate font-medium">{event.eventTitle}</div>
                <div className="text-pretty text-sm text-muted-foreground">{event.eventDescription}</div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <Badge className="capitalize" variant={event.status === "sent" ? "default" : "secondary"}>{event.status}</Badge>
                {event.status === "pending" ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" aria-label="Opsi">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-40">
                            <DropdownMenuItem disabled><PencilLine className="size-4 mr-2" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onCancel(event.id)} className="text-destructive">
                                {isLoading ? <Loader2 className="size-4 mr-2 animate-spin" /> : <X className="text-destructive size-4 mr-2" />} Batalkan
                            </DropdownMenuItem>
                            <DeleteSchedule event={event} onDeleteSuccess={handleDeleteSuccess} scheduleEvents={scheduleEvents} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <DeleteSchedule event={event} onDeleteSuccess={handleDeleteSuccess} scheduleEvents={scheduleEvents} />
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
    const [errors, setErrors] = useState({
        eventTitle: "",
        recipientName: "",
        phone: "",
        eventDescription: "",
        eventDate: "",
        reminderDate: "",
    })
    const [recipients, setRecipients] = useState([
        { name: "", phoneNumber: "" },
    ])

    const scheduleEvents = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/schedules`)
        if (res) {
            setSchedules(res.data)
        }
    }

    const createSchedule = async () => {
        const [eventHours, eventMinutes] = time.split(':').map(Number)
        const combinedEventDateTime = new Date(eventDate)
        combinedEventDateTime.setHours(eventHours, eventMinutes, 0, 0)

        const [reminderHours, reminderMinutes] = reminderTime.split(':').map(Number)
        const combinedReminderDateTime = new Date(reminderDate)
        combinedReminderDateTime.setHours(reminderHours, reminderMinutes, 0, 0)

        const validatedData = scheduleSchema.parse({
            eventTitle,
            recipientName,
            phone,
            eventDescription,
            eventDate,
            reminderDate
        })
        setErrors({})
        setIsLoading(true)

        try {
            const formattedPhone = `62${validatedData.phone.replace(/^0+/, '')}`
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/schedules`, {
                targetPerson: validatedData.recipientName,
                targetPhoneNumber: `${formattedPhone}@c.us`,
                eventTitle: validatedData.eventTitle,
                eventDescription: validatedData.eventDescription,
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
            const res = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/schedules/${scheduleId}/cancel`, {
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

    const { register, handleSubmit, control } = useForm({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
          eventTitle: "",
          recipients: [{ name: "", phoneNumber: "" }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'recipients'
    })

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

                        <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1 space-y-3">
                            <div className="grid gap-2">
                                <Label htmlFor="eventTitle">Judul kegiatan</Label>
                                <Input
                                    id="eventTitle"
                                    placeholder="Kegiatan yang akan dihadiri"
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
                                />
                                {errors.eventTitle && <p className="text-xs text-red-500">{errors.eventTitle}</p>}
                            </div>

                            {recipients.map((recipient, i) => (
                                <div key={i} className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto] gap-2 items-end border p-3 rounded-xl bg-muted/40">
                                    <div className="grid gap-2">
                                        <Label htmlFor={`recipient-${i}`}>Nama Penerima</Label>
                                        <Input
                                            id={`recipient-${i}`}
                                            placeholder="Contoh: Akbar Pasaribu"
                                            value={recipient.name}
                                            onChange={(e) => {
                                                const updated = [...recipients]
                                                updated[index].name = e.target.value
                                                setRecipients(updated)
                                            }}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor={`phone-${i}`}>Nomor WhatsApp Tujuan</Label>
                                        <div className="flex">
                                            <Button disabled variant="ghost" size="icon">+62</Button>
                                            <Input
                                                id={`phone-${i}`}
                                                placeholder="85128xxxxxxxxx"
                                                value={recipient.phoneNumber}
                                                onChange={(e) => {
                                                    const updated = [...recipients];
                                                    updated[index].phoneNumber = e.target.value;
                                                    setRecipients(updated);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {recipients.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() =>
                                                setRecipients(recipients.filter((_, index) => index !== index))
                                            }
                                        >
                                            <Trash2 className="size-4"/>
                                        </Button>
                                    )}
                                </div>
                            ))}

                            <div className="flex justify-center">
                                <Button type="button" className="text-white"
                                    onClick={() => {
                                        setRecipients([...recipients, { name: "", phoneNumber: "" }])
                                    }}
                                >Tambah penerima</Button>
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
                                                <Calendar mode="single" selected={eventDate} onSelect={setEventDate} disabled={{ before: new Date() }} initialFocus />
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
                                                <Calendar mode="single" selected={reminderDate} onSelect={setReminderDate} disabled={{ before: new Date() }} initialFocus />
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
                <div className="flex-1 flex justify-center h-[80%]">
                    {isMounted ? (
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(d) => d && setSelectedDate(d)}
                            className="rounded-md border shadow-sm w-full max-w-md h-full"
                            modifiers={{
                                busy: (date) => hasEventsOnDate(schedules, date),
                            }}
                            modifiersClassNames={{
                                busy: `after:content-[''] after:block after:mx-auto after:-mt-3
                                 after:h-1.5 after:w-1.5 after:rounded-full after:bg-red-600`,
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
                                  <EventRow scheduleEvents={scheduleEvents} key={event.id} event={event} onViewDetail={handleViewDetail} onCancel={handleCancelSchedule} isLoading={isLoading} />
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