"use client"

import type React from "react"
import "./globals.css"
import { usePathname } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"

const PUBLIC_PATHS = new Set([
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

  return (
    <html lang="es">
      <body>
        {isPublic ? children : <AuthGuard>{children}</AuthGuard>}
      </body>
    </html>
  )
}
