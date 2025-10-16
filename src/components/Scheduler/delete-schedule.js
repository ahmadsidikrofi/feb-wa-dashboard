'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button";
import { ArrowLeft, LoaderCircle, Trash2 } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

const DeleteSchedule = ({ event, onDeleteSuccess, scheduleEvents }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const isInsideDropdown = event.status === 'pending'

    const handleDeleteSchedule = async (eventId) => {
        setIsLoading(true)
        try {
          const res = await axios.delete(`http://localhost:3001/api/schedules/${eventId}`)
          if (res.status === 200) {
            await new Promise(resolve => setTimeout(resolve, 3000))
            if (onDeleteSuccess) {
                onDeleteSuccess(eventId)
            }  
          }  
        } catch (error) {
            console.error("Gagal menghapus jadwal:", error)
        } finally {
            setIsLoading(false)
            setIsOpen(false)
            scheduleEvents()
        }
    }
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                {isInsideDropdown ? (
                    // Jika di dalam dropdown, pemicunya adalah DropdownMenuItem
                    <DropdownMenuItem
                        className="text-destructive"
                        onSelect={(e) => e.preventDefault()} // Mencegah dropdown menutup
                    >
                        <Trash2 className="size-4 mr-2 text-destructive" /> Hapus
                    </DropdownMenuItem>
                ) : (
                    // Jika berdiri sendiri, pemicunya adalah Button
                    <Button variant="outline" size="icon" aria-label="Hapus">
                        <Trash2 className="size-4 text-destructive" />
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda telah mempertimbangkan dengan seksama penghapusan jadwal ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Perlu kami sampaikan bahwa tindakan ini bersifat final dan tidak dapat dibatalkan. Penghapusan ini akan secara permanen menghapus data jadwal yang bersangkutan dari arsip sistem kami.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        <ArrowLeft className="size-4" /> Kembali
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button 
                            onClick={() => handleDeleteSchedule(event.id)} 
                            variant="destructive" 
                            className="dark:text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="size-4 animate-spin mr-2" />
                                    Menghapus...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="size-4 mr-2" /> 
                                    Lanjutkan
                                </>
                            )}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
 
export default DeleteSchedule;