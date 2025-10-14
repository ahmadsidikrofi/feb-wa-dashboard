import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

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

const TableSchedule = () => {
    return ( 
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
     );
}
 
export default TableSchedule;