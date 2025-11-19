'use client'

import * as React from "react"
import { useEffect, useState } from 'react'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarFooter, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Home, Inbox, List, LogOut, Menu, ScreenShare, ScreenShareOff,Moon, Sun, AlarmClock, LoaderIcon, ChevronRightIcon, CornerRightDown, ParkingMeter } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Ticket Archive', href: '/dashboard/ticket-archive', icon: List },
  { name: 'Open Ticket', href: '/dashboard/tickets', icon: Inbox, disable: true },
  { name: 'Reminder', href: "/dashboard/reminder", icon: AlarmClock },
  { name: 'Partnership Monitoring', href: "/dashboard/partnership-monitoring", icon: ParkingMeter },
  { name: 'Fullscreen', action: "fullscreen", icon: ScreenShare },
]

export function ModeToggle() {
  const { setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { user, logout, isLoading } = useAuth()

  const handleNavigation = (href) => {
    router.push(href)
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      }).catch((err) => {
        console.error('Error attempting to exit fullscreen:', err)
      })
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md flex items-center justify-center">
                <Image
                  src="/logo-feb.png"
                  alt="MIRA Logo"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-md">MIRA</span>
                <span className="font-semibold text-[12px]">Media Informasi dan Relasi Akses</span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu className="px-2">
              {navigation.map((item, index) => {
                // Jika menu Reminder, render sebagai collapsible
                if (item.name === 'Reminder') {
                  return (
                    <Collapsible key={item.name} defaultOpen className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={pathname === item.href ? 'bg-primary text-white font-semibold' : ''}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.name}</span>
                            <span className="transition-transform duration-200 ml-auto group-data-[state=open]/collapsible:rotate-90">
                              <ChevronRightIcon className="size-4 ml-auto transition-transform duration-200" />
                            </span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                onClick={() => handleNavigation('/dashboard/reminder/tambah-penerima')}
                                isActive={pathname === '/dashboard/reminder/tambah-penerima'}
                              >
                                Tambah penerima
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                onClick={() => handleNavigation('/dashboard/reminder/buat-jadwal')}
                                isActive={pathname === '/dashboard/reminder/buat-jadwal'}
                              >
                                Buat jadwal
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }

                // Jika menu adalah fullscreen
                if (item.action === 'fullscreen') {
                  return (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild>
                        <Button
                          variant={isFullscreen ? 'default' : 'link'}
                          className={`${isFullscreen ? 'shadow-lg' : 'text-black dark:text-white'} hover:bg-secondary flex items-center justify-start`}
                          onClick={handleFullscreen}
                        >
                          {isFullscreen ? <ScreenShareOff className="h-4 w-4" /> : <item.icon className="h-4 w-4" />}
                          <span>{isFullscreen ? 'Exit Fullscreen' : item.name}</span>
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }
                // Menu lainnya
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.href)}
                      className={pathname === item.href ? 'bg-primary text-white font-semibold' : ''}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-2">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {user?.fullName?.split(' ')[0]?.substring(0, 2)?.toUpperCase() || 'AD'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.fullName || 'Admin User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.username || 'admin@smartticket.com'}</p>
                </div>
                <div>
                  <ModeToggle />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isLoading ? <LoaderIcon className="animate-spin size-4" /> : 'Keluar'}
              </Button>
            </Card>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
              <SidebarTrigger className="md:hidden" />
              <div className="flex-1" />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}