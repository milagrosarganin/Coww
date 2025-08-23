"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Archive, Clock, LayoutGrid } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/">
                    <LayoutGrid />
                    Mostrador
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/arqueo")}>
                  <Link href="/arqueo">
                    <Archive />
                    Arqueo de caja
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 👇 aquí el link a Horarios */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/horarios")}>
                  <Link href="/horarios">
                    <Clock />
                    Horarios
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
