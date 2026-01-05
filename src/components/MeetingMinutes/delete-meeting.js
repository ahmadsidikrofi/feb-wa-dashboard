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
import { ArrowLeft, LoaderCircle, LoaderIcon, Trash2 } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DeleteMeeting = ({ isLoading, setIsLoading, meetingId }) => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    const handleDelete = async () => {
        if (!meetingId) return

        try {
            setIsLoading(true)
            await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meetings/${meetingId}`, {
                headers: {
                    "ngrok-skip-browser-warning": true,
                },
            })
            
            toast.success("Data notulensi dan meeting berhasil dihapus")
            router.push("/dashboard/notulensi-rapat")
            // onSuccess?.()
        } catch (error) {
            console.error("Gagal hapus data:", error);
            toast.error("Gagal menghapus data");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => {
            if (!isLoading) setIsOpen(open)
        }}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    className="text-left max-sm:p-2 max-sm:w-10 max-sm:h-10 max-sm:rounded-full"
                    size="sm"
                    aria-label="Hapus"
                >
                    <Trash2 className="size-4 mr-2 max-sm:mr-0" />
                    <span className="max-sm:hidden">Hapus data notulensi</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda telah mempertimbangkan dengan seksama penghapusan data notulensi rapat ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Perlu kami sampaikan bahwa tindakan ini bersifat final dan tidak dapat dibatalkan. Penghapusan ini akan secara permanen menghapus data laporan yang bersangkutan dari arsip sistem kami.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        <ArrowLeft className="size-4" /> Kembali
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                        }}
                        asChild
                    >
                        <Button
                            variant="destructive"
                            className="dark:text-white"
                            disabled={isLoading}
                            onClick={handleDelete}
                        >
                            {isLoading ? (
                                <>
                                    <LoaderIcon className="size-4 animate-spin mr-2" />
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

export default DeleteMeeting