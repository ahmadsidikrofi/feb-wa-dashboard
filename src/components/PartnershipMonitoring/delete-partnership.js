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
import { ArrowLeft, LoaderIcon, Trash2 } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const DeletePartnership = ({ partnershipId, onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleDeleteContact = async (partnershipId) => {
        setIsLoading(true)
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/partnership/${partnershipId}`, {
                headers: {
                    "ngrok-skip-browser-warning": true,
                },
            })
            await new Promise(resolve => setTimeout(resolve, 3000))
            if (res.status === 204) {
              toast.success("Partnership berhasil dihapus dengan baik", {
                  style: { background: "#fee2e2", color: "#991b1b" },
                  className: "border border-red-500"
              })
              if (onSuccess) {
                onSuccess()
              }
            }
        } catch (error) {
            console.error("Gagal menghapus partnership:", error)
            toast.error("Gagal menghapus partnership, silahkan dicoba lagi", {
                style: { background: "#fee2e2", color: "#991b1b" },
                className: "border border-red-500"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => {
            if (!isLoading) setIsOpen(open)
        }}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full text-left sm:w-auto" size="sm">
                    <Trash2 className="size-4 text-destructive" /> Hapus
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda telah mempertimbangkan dengan seksama untuk penghapusan kerja sama</AlertDialogTitle>
                    <AlertDialogDescription>
                        Perlu kami sampaikan bahwa tindakan ini bersifat final dan tidak dapat dibatalkan. Penghapusan ini akan secara permanen menghapus data partnership terpilih dan yang bersangkutan dari arsip sistem kami.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        <ArrowLeft className="size-4" /> Kembali
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            if (!isLoading) {
                                handleDeleteContact(partnershipId)
                            }
                        }}
                        disabled={isLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:text-white"
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
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeletePartnership