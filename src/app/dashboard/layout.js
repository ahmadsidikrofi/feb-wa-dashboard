"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  Inbox,
  List,
  LogOut,
  Menu,
  ScreenShare,
  ScreenShareOff,
  Moon,
  Sun,
  AlarmClock,
  LoaderIcon,
  ChevronRightIcon,
  CornerRightDown,
  ParkingMeter,
  Ellipsis,
  UserCog2,
  TicketXIcon,
  Newspaper,
  GraduationCap,
  Award,
  Users,
  Settings2,
  Monitor,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";

const navigation = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Ticket Management",
    href: "/dashboard/ticket-management",
    icon: TicketXIcon,
    submenu: [
      { name: "Dashboard", href: "/dashboard/ticket-management" },
      { name: "Ticket Archive", href: "/dashboard/ticket-management/ticket-archive" },
      { name: "Tickets", href: "/dashboard/ticket-management/tickets" },
    ],
  },
  {
    name: "Daftar Agenda",
    href: "/dashboard/monitoring-kegiatan",
    icon: List,
  },
  {
    name: "Reminder",
    href: "/dashboard/reminder",
    icon: AlarmClock,
    submenu: [
      { name: "Tambah Penerima", href: "/dashboard/reminder/tambah-penerima" },
      { name: "Buat Jadwal", href: "/dashboard/reminder/buat-jadwal" },
      { name: "Google Calendar", href: "/dashboard/reminder/google-calendar" },
    ],
  },
  {
    name: "Notulensi Rapat",
    href: "/dashboard/notulensi-rapat",
    icon: Inbox,
  },
  {
    name: "Partnership Monitoring",
    href: "/dashboard/partnership-monitoring",
    icon: ParkingMeter,
    submenu: [
      { name: "Pengajuan", href: "/dashboard/partnership-monitoring/pengajuan" },
      { name: "Persetujuan", href: "/dashboard/partnership-monitoring/persetujuan" },
      { name: "Penerapan", href: "/dashboard/partnership-monitoring/penerapan" },
    ],
  },
  {
    name: "Kontrak Manajemen",
    href: "/dashboard/kontrak-management",
    icon: Newspaper,
  },
  {
    name: "Laporan Manajemen",
    href: "/dashboard/laporan-management",
    icon: Newspaper,
  },
  {
    name: "Akreditasi LAMEMBA",
    href: "/dashboard/akreditasi-lamemba",
    icon: GraduationCap,
  },
  {
    name: "Akreditasi AACSB",
    href: "/dashboard/akreditasi-aacsb",
    icon: Award,
  },
  {
    name: "Jumlah Pegawai",
    href: "/dashboard/jumlah-pegawai",
    icon: Users,
  },
  { name: "Fullscreen", action: "fullscreen", icon: ScreenShare },
];

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserButton({ user }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.fullName
                ?.split(" ")[0]
                ?.substring(0, 2)
                ?.toUpperCase() || "AD"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" sideOffset={8}>
        <DropdownMenuItem>
          <Settings2 /> Manage Account
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserCog2 /> User Management
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const handleNavigation = (href) => {
    router.push(href);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
        })
        .catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((err) => {
          console.error("Error attempting to exit fullscreen:", err);
        });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r" collapsible="icon">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0">
                <Image
                  src="/logo-feb.png"
                  alt="MIRA Logo"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold text-md truncate">MIRA</span>
                <span className="font-semibold text-[10px] truncate leading-tight">
                  Media Informasi dan Relasi Anda
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="overflow-y-auto">
            <SidebarMenu className="px-2 cursor-pointer">
              {navigation.map((item, index) => {
                // Jika menu adalah fullscreen
                if (item.action === "fullscreen") {
                  return (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild>
                        <Button
                          variant={isFullscreen ? "default" : "link"}
                          className={`${isFullscreen
                            ? "shadow-lg"
                            : "text-black dark:text-white"
                            } hover:bg-secondary flex items-center justify-start w-full`}
                          onClick={handleFullscreen}
                        >
                          {isFullscreen ? (
                            <ScreenShareOff className="h-4 w-4 shrink-0" />
                          ) : (
                            <item.icon className="h-4 w-4 shrink-0" />
                          )}
                          <span className="truncate">
                            {isFullscreen ? "Exit Fullscreen" : item.name}
                          </span>
                        </Button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                // Jika menu memiliki submenu
                if (item.submenu && item.submenu.length > 0) {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href);

                  return (
                    <Collapsible
                      key={item.name}
                      defaultOpen={false}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={
                              isActive
                                ? "bg-primary text-white font-semibold"
                                : ""
                            }
                          >
                            <item.icon className="w-4 h-4 shrink-0" />
                            <span className="truncate">{item.name}</span>
                            <ChevronRightIcon className="size-4 ml-auto shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.submenu.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.href}>
                                <SidebarMenuSubButton
                                  onClick={() => handleNavigation(subItem.href)}
                                  isActive={pathname === subItem.href}
                                >
                                  {subItem.name}
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // Menu tanpa submenu
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.href)}
                      className={
                        pathname === item.href
                          ? "bg-primary text-white font-semibold"
                          : ""
                      }
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-2 border-t">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <UserButton user={user} logout={logout} isLoading={isLoading} />
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm font-medium truncate">
                    {user?.fullName || "Admin User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.username || "admin@smartticket.com"}
                  </p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <ModeToggle />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2 shrink-0" />
                <span className="truncate">
                  {isLoading ? (
                    <LoaderIcon className="animate-spin size-4" />
                  ) : (
                    "Keluar"
                  )}
                </span>
              </Button>
            </Card>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
            <div className="flex h-14 items-center px-4 gap-2">
              <SidebarTrigger className="-ml-1" />
              <div className="flex-1" />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}