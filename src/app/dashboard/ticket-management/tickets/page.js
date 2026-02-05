'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Inbox, Search, Clock, User, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function OpenTicketPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingTicketId, setUpdatingTicketId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchIncomingTickets()
  }, [])

  const fetchIncomingTickets = async () => {
    try {
      const token = sessionStorage.getItem('auth_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": true,
        }
      })
      console.log(response)

      if (response.ok) {
        const data = await response.json()
        // Filter only open tickets for incoming queue
        const openTickets = data.filter(ticket => ticket.status === 'open')
        setTickets(openTickets)
      }
    } catch (error) {
      console.error('Error fetching incoming tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnresolvedTicket = async (ticketId) => {
    try {
      setUpdatingTicketId(ticketId)
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${ticketId}/assign`, {
        adminName: 'admin_Rina'
      })
      if (res.status === 200) {
        fetchIncomingTickets()
      }
    } catch (error) {
      console.error('Gagal menangani tiket:', error)
    } finally {
      setUpdatingTicketId(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredTickets = tickets.filter(ticket => {
    const userName = ticket.message?.conversation?.user?.name?.toLowerCase() || ''
    const identifier = ticket.message?.conversation?.user?.identifier?.toLowerCase() || ''
    const messageText = ticket.message?.message_text?.toLowerCase() || ''
    const search = searchTerm.toLowerCase()
    
    return userName.includes(search) || identifier.includes(search) || messageText.includes(search)
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Inbox className="w-8 h-8  text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Tiket Masuk</h1>
            <p className="text-muted-foreground">Antrian tiket yang menunggu penanganan</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Inbox className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight  text-primary">Tiket Masuk</h1>
          <p className="text-muted-foreground">
            Antrian tiket yang menunggu penanganan ({filteredTickets.length} tiket)
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama, NIM, atau pesan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Tiket Menunggu Penanganan
          </CardTitle>
          <CardDescription>
            Daftar semua tiket dengan status open yang perlu segera ditangani
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama User</TableHead>
                <TableHead className="hidden sm:table-cell">NIM/Identifier</TableHead>
                <TableHead className="hidden xl:table-cell">Pesan</TableHead>
                <TableHead className="hidden lg:table-cell">Waktu Masuk</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {ticket.message?.conversation?.user?.name || 'Unknown User'}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {ticket.message?.conversation?.user?.identifier || '-'}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell xl:max-w-xs">
                      <div className="truncate" title={ticket.message?.message_text || '-'}>
                        {ticket.message?.message_text || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell lg:max-w-xs">{formatDate(ticket.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-yellow-100 capitalize text-yellow-800">
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleUnresolvedTicket(ticket?.id)}
                        disabled={updatingTicketId === ticket.id}
                      >
                        {updatingTicketId === ticket.id ? (
                          <LoaderCircle className='animate-spin size-5' />
                        ) : (
                          <span>Tangani</span>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {searchTerm ? 'Tidak ada tiket yang sesuai dengan pencarian' : 'Tidak ada tiket baru yang menunggu penanganan'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}