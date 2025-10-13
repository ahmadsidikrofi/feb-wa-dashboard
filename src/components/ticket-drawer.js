'use client'

import { useEffect, useMemo, useState } from "react"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Flag, LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import axios from "axios"

const TicketDrawer = ({ open, onOpenChange, conversationId }) => {
    const [conversationData, setConversationData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [updatingTicketId, setUpdatingTicketId] = useState(null)

    useEffect(() => {
        if (!open || !conversationId) return

        let isCancelled = false
        async function fetchConversation() {
            setIsLoading(true)
            setError(null)
            try {
                const res = await fetch(`http://localhost:3001/api/conversations/${conversationId}`)
                if (!res.ok) throw new Error(`Gagal memuat data (${res.status})`)
                const data = await res.json()

                if (isCancelled) return

                const mapped = mapApiToTicket(data)
                setConversationData(mapped)
            } catch (e) {
                if (!isCancelled) setError(e?.message ?? "Terjadi kesalahan")
            } finally {
                if (!isCancelled) setIsLoading(false)
            }
        }
        fetchConversation()

        return () => {
            isCancelled = true
        }
    }, [open, conversationId])

    const activeTicket = useMemo(() => {
        if (!conversationData || !Array.isArray(conversationData.conversation)) return null

        for (const msg of conversationData.conversation) {
            if (msg.unresolved && Array.isArray(msg.unresolved) && msg.unresolved.length > 0) {
                return msg.unresolved[0];
            }
        }
        return null
    }, [conversationData])

    const handleUnresolvedTicket = async () => {
        if (!activeTicket) return
        console.log(activeTicket)
        
        try {
            setUpdatingTicketId(activeTicket.id)
            const res = await axios.put(`http://localhost:3001/api/tickets/${activeTicket.id}/assign`, {
                adminName: 'admin_Rina'
            })
            if (res.status === 200) {
                onOpenChange(false)
            }
        } catch (error) {
            console.error('Gagal menangani tiket:', error)
        } finally {
            setUpdatingTicketId(null)
        }
    }
    
    return ( 
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="ml-auto h-screen w-full max-w-full bg-background p-0 sm:max-w-lg">
                <div className="flex h-full flex-col">
                    <DrawerHeader className="flex items-start justify-between gap-4 border-b bg-card px-4 py-3">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center gap-16">
                                <DrawerTitle className="text-pretty">
                                    {conversationData ? `Percakapan dengan ${conversationData.userName}` : "Percakapan"}
                                </DrawerTitle>
                                <DrawerClose asChild className="mx-auto">
                                    <Button variant="ghost" size="icon" aria-label="Tutup">
                                        <X className="h-5 w-5" />
                                    </Button>
                                </DrawerClose>
                            </div>
                            <DrawerDescription>{conversationData ? `NIM: ${conversationData.nim}` : "Identifier: -"}</DrawerDescription>
                        </div>
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto bg-background px-4 py-4">
                        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
                            {isLoading && (
                                <p className="text-center text-sm text-muted-foreground">Memuat percakapan...</p>
                            )}
                            {error && (
                                <p className="text-center text-sm text-destructive">{error}</p>
                            )}
                            {conversationData?.conversation?.map((msg) => (
                                <ChatBubble key={msg.id} message={msg} flagged={msg.flagged} />
                            ))}

                            {!isLoading && !error && !conversationData && (
                                <p className="text-center text-sm text-muted-foreground">Pilih tiket untuk melihat percakapan.</p>
                            )}
                        </div>
                    </div>

                    <DrawerFooter className="border-t bg-card">
                        {conversationData && (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Status:</span>
                                    <Badge variant="secondary" className="capitalize">{activeTicket?.status ?? "—"}</Badge>
                                    {/* {console.log(activeTicket?.status)} */}
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {activeTicket?.status === 'open' ? (
                                        <Button 
                                            size="sm" 
                                            onClick={handleUnresolvedTicket}
                                            disabled={!activeTicket || updatingTicketId === activeTicket?.id}
                                        >
                                            {updatingTicketId === activeTicket?.id ? (
                                                <LoaderCircle className='animate-spin size-5' />
                                            ) : (
                                                <span>Ambil tiket</span>
                                            )}
                                        </Button>
                                    ) : activeTicket?.status === 'in_progress' ? (
                                        <Button variant="destructive">Selesaikan tiket</Button>
                                    ) : ""} 
                                </div>
                            </div>
                        )}
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
     );
}

function ChatBubble({ message, flagged }) {
    const isUser = message.role === "user"
    return (
        <div className={cn("flex items-start gap-2", isUser ? "justify-end" : "justify-start")}>
            {!isUser && flagged && <Flag className="mt-1 h-4 w-4 text-destructive" aria-hidden="true" />}

            <div
                className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                    isUser ? "ml-auto bg-primary text-primary-foreground" : "bg-muted text-foreground",
                )}
            >
                <p className="text-pretty">{message.text}</p>
                <div
                    className={cn(
                        "mt-1 text-[11px] text-muted-foreground",
                        isUser ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                >
                    {message.timestamp}
                </div>
            </div>

            {isUser && flagged && <Flag className="mt-1 h-4 w-4 text-destructive" aria-hidden="true" />}
        </div>
    )
}

function mapApiToTicket(apiData) {
    const userName = apiData?.user?.name ?? "-"
    const nim = apiData?.user?.identifier ?? "-"

    const status = mapStepToStatus(apiData?.step)

    const conversation = Array.isArray(apiData?.messages)
        ? apiData.messages.map((m) => ({
            id: m.id,
            role: m.sender, // "user" | "bot" (asumsi dari API)
            text: m.message_text,
            timestamp: formatDateTime(m.createdAt),
            flagged: Boolean(m.need_human) || Boolean(m.feedback),
            unresolved: m.unresolved
        }))
        : []

    return {
        id: apiData?.id,
        userName,
        nim,
        status,
        conversation,
    }
}

function mapStepToStatus(step) {
    if (!step) return "Open"
    // Map sederhana, sesuaikan dengan kebutuhan
    if (step === "awaiting_feedback") return "In Progress"
    return "Open"
}

function formatDateTime(iso) {
    try {
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return ""
        return new Intl.DateTimeFormat("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(d)
    } catch {
        return ""
    }
}
 
export default TicketDrawer;