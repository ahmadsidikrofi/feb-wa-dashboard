'use client'

import * as React from "react"
import { useEffect, useState } from 'react'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarFooter } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Home, Inbox, List, LogOut, Menu, ScreenShare, ScreenShareOff,Moon, Sun, AlarmClock } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Ticket Archive', href: '/dashboard/ticket-archive', icon: List },
  { name: 'Open Ticket', href: '/dashboard/tickets', icon: Inbox, disable: true },
  { name: 'Reminder', href: "/dashboard/reminder", icon: AlarmClock },
  { name: 'Fullscreen', action: "fullscreen", icon: ScreenShare },
]

export function ModeToggle() {
  const { setTheme } = useTheme()

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


export default function DashboardLayout({ children, onLogout }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isFullscreen, setIsFullscreen] = useState(false)

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
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">ST</span>
              </div>
              <span className="font-semibold">Smart Ticket</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu className="px-2">
              {navigation.map((item, index) => (
                item.action === 'fullscreen' ? (
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
                ) : (
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
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-2">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Admin User</p>
                  <p className="text-xs text-muted-foreground truncate">admin@smartticket.com</p>
                </div>
                <div>
                  <ModeToggle />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
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