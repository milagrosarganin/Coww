"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSpinner } from "@/components/loading-spinner"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
  if (!loading) {
    if (!user && pathname !== "/login") {
      router.replace("/login")
    } else if (user && pathname === "/login") {
      router.replace("/")
    }
  }
}, [user, loading, router, pathname])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">Cargando sistema...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario y no estamos en login, no mostrar nada (se redirige)
  if (!user && pathname !== "/login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  // Si hay usuario y estamos en login, no mostrar nada (se redirige)
  if (user && pathname === "/login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">Accediendo al sistema...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
