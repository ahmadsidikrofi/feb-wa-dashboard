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
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [updatingTicketId, setUpdatingTicketId] = useState(null)
    const [apiResponse, setApiResponse] = useState(null)

    useEffect(() => {
        if (!open || !conversationId) return

        let isCancelled = false
        async function fetchConversation() {
            setIsLoading(true)
            setError(null)
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/conversations/${conversationId}`)
                if (!res.ok) throw new Error(`Gagal memuat data (${res.status})`)
                const data = await res.json()
                if (isCancelled) return

                const segmentData = data.conversationSegment
                const mapped = mapApiToTicket(segmentData)
                setApiResponse(mapped)
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

    const messagesToDisplay = apiResponse?.conversation || []
    const activeTicket = apiResponse?.activeTicket

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="ml-auto h-screen w-full max-w-full bg-background p-0 sm:max-w-lg">
                <div className="flex h-full flex-col">
                    <DrawerHeader className="flex items-start justify-between gap-4 border-b bg-card px-4 py-3">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center gap-16">
                                <DrawerTitle className="text-pretty">
                                    {apiResponse ? `Percakapan dengan ${apiResponse.userName}` : "Percakapan"}
                                </DrawerTitle>
                                <DrawerClose asChild className="mx-auto">
                                    <Button variant="ghost" size="icon" aria-label="Tutup">
                                        <X className="h-5 w-5" />
                                    </Button>
                                </DrawerClose>
                            </div>
                            <DrawerDescription>
                                {apiResponse?.nim ? `NIM: ${apiResponse.nim}` : "Identifier: -"}
                            </DrawerDescription>
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
                            {!isLoading && !error && messagesToDisplay.length > 0 && (
                                messagesToDisplay.map((msg) => (
                                    <ChatBubble
                                        key={msg.id}
                                        message={msg}
                                        flagged={msg.flagged}
                                        tickets={msg.tickets}
                                    />
                                ))
                            )}
                            {!isLoading && !error && messagesToDisplay.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground">
                                    Tidak ada pesan dalam percakapan ini.
                                </p>
                            )}
                        </div>
                    </div>

                    <DrawerFooter className="border-t bg-card">

                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

function ChatBubble({ message, flagged, tickets }) {
    const isUser = message.role === "user"
    return (
        <div className="flex flex-col gap-2">
            <div className={cn("flex items-start gap-2", isUser ? "justify-end" : "justify-start")}>
                {!isUser && flagged && <Flag className="mt-1 h-4 w-4 text-destructive" aria-hidden="true" />}

                <div
                    className={cn(
                        "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                        isUser ? "ml-auto bg-primary text-primary-foreground" : "bg-muted text-foreground",
                    )}
                >
                    <p className="text-pretty whitespace-pre-wrap">{message.text}</p>
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

            {tickets && tickets.length > 0 && (
                <div className={cn("flex gap-2 items-center", isUser ? "justify-end pr-6" : "justify-start pl-6")}>
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">Tiket #{ticket.id}:</span>
                            <Badge
                                variant={ticket.status === 'open' ? 'default' :
                                    ticket.status === 'in_progress' ? 'secondary' : 'outline'}
                                className="text-[10px] py-0 px-2 h-5"
                            >
                                {ticket.status === 'open' ? 'Open' :
                                    ticket.status === 'in_progress' ? 'In Progress' :
                                        ticket.status === 'resolved' ? 'Resolved' : ticket.status}
                            </Badge>
                            {ticket.assignedTo && (
                                <span className="text-muted-foreground">• {ticket.assignedTo}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

    )
}

function mapApiToTicket(segmentData) {
    if (!segmentData) return null;

    const conversation = segmentData.conversation || {}
    const messages = segmentData.messages || []
    const activeTicket = segmentData.activeTicket || null

    const userName = conversation.user?.name ?? "-"
    const nim = conversation.user?.identifier ?? "-"

    const conversationMessages = messages.map((m) => {
        const tickets = (m.unresolved || []).map((ticket) => ({
            id: ticket.id,
            status: ticket.status,
            assignedTo: ticket.assignedTo,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
        }));

        return {
            id: m.id,
            role: m.sender,
            text: m.message_text,
            timestamp: formatDateTime(m.createdAt),
            flagged: Boolean(m.need_human) || Boolean(m.feedback),
            tickets: tickets,
        };
    });

    return {
        id: conversation.id,
        userName,
        nim,
        conversation: conversationMessages,
        activeTicket: activeTicket ? {
            id: activeTicket.id,
            status: activeTicket.status,
            assignedTo: activeTicket.assignedTo,
            messageId: activeTicket.messageId,
        } : null,
    };
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