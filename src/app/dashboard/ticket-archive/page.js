'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { List, Search, Filter, User, Calendar, Clock, Ticket, Ellipsis, Eye, HandHelpingIcon, LoaderCircle, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import TicketDrawer from '@/components/ticket-drawer'
import axios from 'axios'



export default function TicketArchivePage() {
  const [allTickets, setAllTickets] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [open, onOpenChange] = useState(false)
  const [selected, setSelected] = useState(null)
  const [updatingTicketId, setUpdatingTicketId] = useState(null)
  const router = useRouter()


  useEffect(() => {
    fetchAllTickets()
  }, [])
  
  useEffect(() => {
    applyFilters()
  }, [allTickets, searchTerm, statusFilter])

  const fetchAllTickets = async () => {
    try {
      const token = sessionStorage.getItem('auth_token')

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": true,
        }
      })

      if (response.ok) {
        const tickets = await response.json()
        setAllTickets(tickets)
      }
    } catch (error) {
      console.error('Error fetching all tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...allTickets]

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(ticket => {
        const userName = ticket.message?.conversation?.user?.name?.toLowerCase() || ''
        const identifier = ticket.message?.conversation?.user?.identifier?.toLowerCase() || ''
        const messageText = ticket.message?.message_text?.toLowerCase() || ''

        return userName.includes(search) || identifier.includes(search) || messageText.includes(search)
      })
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    setFilteredTickets(filtered)
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { variant: 'secondary', label: 'Open', className: 'bg-yellow-100 text-yellow-800' },
      in_progress: { variant: 'default', label: 'Sedang Diproses', className: 'bg-blue-100 text-blue-800' },
      resolved: { variant: 'success', label: 'Selesai', className: 'bg-green-100 text-green-800' }
    }

    const config = statusConfig[status] || { variant: 'secondary', label: status, className: '' }
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getTicketCount = (status) => {
    if (status === 'all') return allTickets.length
    return allTickets.filter(ticket => ticket.status === status).length
  }

  const handleAssignTicket = async (ticketId) => {
    if (!ticketId) return
    setUpdatingTicketId(ticketId)

    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${ticketId}/assign`, {
        adminName: 'admin_Rina'
      })
      if (res.status === 200) {
        fetchAllTickets()
      }
    } catch (error) {
      console.error('Gagal menangani tiket:', error)
    } finally {
      setUpdatingTicketId(null)
    }
  }

  const handleResolveTicket = async (ticketId) => {
    if (!ticketId) return
    setUpdatingTicketId(ticketId)
    
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${ticketId}/resolve`)
      if (res.status === 200) {
        fetchAllTickets()
      }  
    } catch (error) {
      console.error('Gagal menyelesaikan tiket:', error)
    } finally {
      setUpdatingTicketId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-start mt-1 gap-3">
          <Ticket className="size-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Semua Tiket</h1>
            <p className="text-muted-foreground">
              Daftar lengkap semua tiket dalam sistem ({filteredTickets.length} dari {allTickets.length} tiket)
            </p>
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
      <div className="flex items-start mt-1 gap-3">
        <Ticket className="size-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Semua Tiket</h1>
          <p className="text-muted-foreground">
            Daftar lengkap semua tiket dalam sistem ({filteredTickets.length} dari {allTickets.length} tiket)
          </p>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 max-sm:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-1">
              <div className="w-2 h-2 bg-yellow-500 mt-1 rounded-full"></div>
              <div>
                <p className="text-md font-medium">Terbuka</p>
                <p className="text-2xl font-bold">{getTicketCount('open')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-1">
              <div className="w-2 h-2 bg-blue-500 mt-1 rounded-full"></div>
              <div>
                <p className="text-md font-medium">Sedang Diproses</p>
                <p className="text-2xl font-bold">{getTicketCount('in_progress')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-1">
              <div className="w-2 h-2 bg-green-500 mt-1 rounded-full"></div>
              <div>
                <p className="text-md font-medium">Selesai</p>
                <p className="text-2xl font-bold">{getTicketCount('resolved')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-1">
              <div className="w-2 h-2 bg-gray-500 mt-1 rounded-full"></div>
              <div>
                <p className="text-md font-medium">Total</p>
                <p className="text-2xl font-bold">{allTickets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama, NIM, atau pesan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 text-start">
                <Filter className="w-4 h-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="open">Terbuka</SelectItem>
                <SelectItem value="in_progress">Sedang Diproses</SelectItem>
                <SelectItem value="resolved">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daftar Tiket
          </CardTitle>
          <CardDescription>
            Menampilkan {filteredTickets.length} tiket berdasarkan filter yang dipilih
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama User</TableHead>
                <TableHead className="hidden xl:table-cell">NIM/Identifier</TableHead>
                <TableHead className="hidden xl:table-cell">Pesan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden xl:table-cell">Waktu Masuk</TableHead>
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
                    <TableCell className='hidden xl:table-cell'>
                      {ticket.message?.conversation?.user?.identifier || '-'}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell xl:max-w-xs">
                      <div className="truncate" title={ticket.message?.message_text || '-'}>
                        {ticket.message?.message_text || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(ticket.status)}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDate(ticket.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Detail</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setSelected(ticket.message?.conversation?.id); onOpenChange(true) }}><span><Eye /></span> Lihat</DropdownMenuItem>
                          {ticket.status === 'open' ? (
                            <DropdownMenuItem onClick={() => handleAssignTicket(ticket.id)} disabled={updatingTicketId === ticket.id}>
                              {updatingTicketId === ticket.id ? (
                                <LoaderCircle className="size-4 animate-spin" />
                              ) : (
                                <HandHelpingIcon className="size-4" />
                              )}
                              {updatingTicketId === ticket.id ? 'Menangani...' : 'Tangani'}
                            </DropdownMenuItem>
                          ) : ticket.status === 'in_progress' ? (
                              <DropdownMenuItem onClick={() => handleResolveTicket(ticket.id)} disabled={updatingTicketId === ticket.id}>
                                {updatingTicketId === ticket.id ? (
                                  <LoaderCircle className="size-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="size-4" />
                                )}
                                {updatingTicketId === ticket.id ? 'Menyelesaikan...' : 'Selesaikan'}
                              </DropdownMenuItem>
                          ) : ""}
                        </DropdownMenuContent>
                      </DropdownMenu>

                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Tidak ada tiket yang sesuai dengan filter'
                      : 'Tidak ada tiket dalam sistem'
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <TicketDrawer open={open} onOpenChange={onOpenChange} conversationId={selected} getStatusBadge={getStatusBadge} />
    </div>
  )
}