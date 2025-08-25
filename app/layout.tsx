"use client"

import type React from "react"
import "./globals.css"

import { usePathname } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"

// Rutas públicas que NO requieren sesión
const PUBLIC_PATHS = new Set<string>([
  "/login",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
])

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublic =
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/")

  // Shell público: se usa para /login y assets públicos
  const PublicShell = (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster />
    </ThemeProvider>
  )

  // Shell privado: **única** sidebar global (AppSidebar)
  const PrivateShell = (
    <AuthGuard>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SidebarProvider>
          <div className="min-h-screen flex">
            <AppSidebar />
            <SidebarInset className="flex-1">
              <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold">Coww</h1>
              </header>
              {/* Área de contenido principal para tus páginas */}
              <main className="p-4">{children}</main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster />
      </ThemeProvider>
    </AuthGuard>
  )

  return (
    <html lang="es">
      <body>{isPublic ? PublicShell : PrivateShell}</body>
    </html>
  )
}
