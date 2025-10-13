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
import { AlarmClock, AlarmClockIcon, CalendarIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ReminderPage = () => {
    const [open, setOpen] = useState(false)
    const [schedules, setSchedules] = useState([])

    const [recipientName, setRecipientName] = useState("")
    const [phone, setPhone] = useState("")
    const [message, setMessage] = useState("")
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState("09:00")

    const canSave = useMemo(() => {
        return recipientName.trim() && phone.trim() && message.trim() && date && time
    }, [recipientName, phone, message, date, time])

    const reminders = [
        { id: 1, date: "2025-10-08", title: "Rapat Fakultas", description: "Rapat koordinasi mingguan bersama dosen." },
        { id: 2, date: "2025-10-10", title: "Meeting Dekan", description: "Presentasi hasil evaluasi kinerja fakultas." },
        { id: 3, date: "2025-10-14", title: "Evaluasi Mingguan", description: "Review progress proyek akademik." },
    ]

    // helper: cek apakah tanggal punya reminder
    const getReminderByDate = (day) => {
        // Ensure 'day' is a valid Date object before proceeding
        if (!day || !(day instanceof Date) || isNaN(day.getTime())) {
            return [];
        }
        const d = day.toISOString().split("T")[0]
        return reminders.filter(r => r.date === d)
      }

    function StatusBadge({ status }) {
        const isPending = status === "pending"
        return (
            <Badge
                className={cn(
                    "capitalize",
                    isPending
                        ? "bg-(--color-warning) text-(--color-warning-foreground) hover:bg-(--color-warning)"
                        : "bg-(--color-success) text-(--color-success-foreground) hover:bg-(--color-success)",
                )}
            >
                {status}
            </Badge>
        )
    }

    const handleSave = async () => {

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

                            <div className="grid gap-2">
                                <Label htmlFor="message">Isi Pesan Reminder</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Tulis pesan pengingat di sini..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            {/* Waktu Pengiriman */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Waktu Pengiriman (Date Picker) */}
                                <div className="flex-1 grid gap-2">
                                    <Label>Waktu Pengiriman</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Jam (Time Input) */}
                                <div className="flex-1 grid gap-2">
                                    <Label htmlFor="time-picker">Jam</Label>
                                    <Input
                                        type="time"
                                        id="time-picker"
                                        step="1"
                                        defaultValue="10:30:00"
                                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Batal
                            </Button>
                            <Button onClick={handleSave} disabled={!canSave}>
                                Simpan Jadwal
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border shadow-sm w-full max-w-lg"
                        modifiers={{
                            hasReminder: (day) => getReminderByDate(day).length > 0,
                        }}
                        components={{
                            Day: ({ date, modifiers, ...props }) => {
                                if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
                                    return <span {...props} className="w-full aspect-square" />;
                                }
                                const remindersToday = getReminderByDate(date)
                                const label = date.getDate()

                                if (remindersToday.length === 0) {
                                    return (
                                        <div
                                            {...props}
                                            className={cn(
                                                "relative w-full aspect-square text-sm rounded-md transition-colors flex items-center justify-center hover:bg-accent",
                                            )}
                                        >
                                            {label}
                                        </div>
                                    );
                                }

                                return (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <span
                                                {...props}
                                                role="button"
                                                tabIndex={0}
                                                className="relative w-full aspect-square rounded-md border border-green-300 bg-green-50 hover:bg-green-100 text-green-800 p-1 transition cursor-pointer"
                                            >
                                                <span className="text-xs font-semibold">{label}</span>
                                                <span className="text-[10px] truncate leading-tight mt-1 font-medium">
                                                    {remindersToday[0].title}
                                                </span>
                                                {remindersToday.length > 1 && (
                                                    <span className="text-[10px] text-muted-foreground">
                                                        +{remindersToday.length - 1} lagi
                                                    </span>
                                                )}
                                            </span>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-64" align="center">
                                            <div className="flex flex-col gap-2">
                                                <p className="text-sm font-semibold mb-1">
                                                    Agenda{" "}
                                                    {date.toLocaleDateString("id-ID", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                                {remindersToday.map((r) => (
                                                    <div
                                                        key={r.id}
                                                        className="rounded-md border p-2 flex justify-between items-start gap-2 hover:bg-muted transition"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-medium">{r.title}</p>
                                                            <p className="text-xs text-muted-foreground">{r.description}</p>
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-5 w-5"
                                                                title="Edit Reminder"
                                                            >
                                                                <Pencil className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-5 w-5 text-destructive"
                                                                title="Hapus Reminder"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                );
                            },
                        }}
                    />
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                        Jadwal Mendatang
                    </h3>
                    <div className="space-y-2">
                        {reminders.map((r, i) => (
                            <div
                                key={i}
                                className="flex justify-between rounded-lg border p-2 hover:bg-muted"
                            >
                                <span>{r.title}</span>
                                <span className="text-muted-foreground text-sm">
                                    {new Date(r.date).toLocaleDateString("id-ID", {
                                        weekday: "short",
                                        day: "2-digit",
                                        month: "short",
                                    })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[160px]">Penerima</TableHead>
                            <TableHead className="min-w-[260px]">Deskripsi Reminder</TableHead>
                            <TableHead className="min-w-[200px]">Waktu Pengingat</TableHead>
                            <TableHead className="min-w-[120px]">Status</TableHead>
                            <TableHead className="min-w-[80px] text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schedules.map((schedule, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{schedule.recipientName}</span>
                                        <span className="text-sm text-muted-foreground">+{schedule.phone}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[420px]">
                                    <p className="text-pretty">{schedule.message}</p>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{format(schedule.sendAt, "PPP")}</span>
                                        <span className="text-sm text-muted-foreground">{format(schedule.sendAt, "p")}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={schedule.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => handleDelete(schedule.id)}
                                        aria-label={`Hapus jadwal untuk ${schedule.recipientName}`}
                                        title="Hapus"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Hapus</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {schedules.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    Belum ada jadwal reminder.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
 
export default ReminderPage;