'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Ticket, Clock, CheckCircle, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import TicketDrawer from '@/components/ticket-drawer'
import { DailyTrenChart } from '@/components/daily-tren-chart'
import { TicketPerCategoryChart } from '@/components/ticket-per-category-chart'
import api from '@/lib/axios'

export default function Dashboard() {
  const [statusData, setStatusData] = useState({
    openTickets: 0,
    inProgress: 0,
    resolvedToday: 0,
    totalUsers: 0
  })
  const [recentTickets, setRecentTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, ticketsResponse] = await Promise.all([
        api.get('/api/dashboard/stats'),
        api.get('/api/tickets')
      ])

      setStatusData(statsResponse.data)
      setRecentTickets(ticketsResponse.data.slice(0, 5))
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  const handleTicketClick = (ticketId) => {
    setSelected(ticketId)
    setOpen(true)
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview sistem tiket WhatsApp
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiket Terbuka</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusData.openTickets}</div>
            <p className="text-xs text-muted-foreground">
              Menunggu penanganan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sedang Diproses</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusData.inProgressTickets}</div>
            <p className="text-xs text-muted-foreground">
              Dalam penanganan admin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terselesaikan Hari Ini</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusData.resolvedToday}</div>
            <p className="text-xs text-muted-foreground">
              Tiket selesai hari ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusData.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Pengguna terdaftar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <div className='grid grid-cols-2 gap-4'>
        <TicketPerCategoryChart />
        <DailyTrenChart />
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Antrian Tiket Baru</CardTitle>
          <CardDescription>
            5 tiket terbaru dengan status open
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama User</TableHead>
                <TableHead className="hidden xl:table-cell">NIM/Identifier</TableHead>
                <TableHead className="hidden lg:table-cell">Pesan Awal</TableHead>
                <TableHead>Waktu Masuk</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTickets.length > 0 ? (
                recentTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleTicketClick(ticket.message?.conversation?.id)}
                  >
                    <TableCell className="font-medium">
                      {ticket.message?.conversation?.user?.name || 'Unknown User'}
                    </TableCell>
                    <TableCell className='hidden xl:table-cell'>
                      {ticket.message?.conversation?.user?.identifier || '-'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell lg:max-w-xs truncate">
                      {ticket.message?.message_text || '-'}
                    </TableCell>
                    <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{ticket.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Tidak ada tiket baru
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <TicketDrawer open={open} onOpenChange={setOpen} conversationId={selected} />
    </div>
  )
}