"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useAuth } from "@/hooks/use-auth"

import { Mostrador } from "@/components/mostrador"
import { Mesas } from "@/components/mesas"
import { HistorialVentas } from "@/components/historial-ventas"
import { Stock } from "@/components/stock"
import { Gastos } from "@/components/gastos"
import ArqueoCaja from "@/components/arqueo-caja"
import { Proveedores } from "@/components/proveedores"
import { Configuracion } from "@/components/configuracion"
import { Horarios } from "@/components/horarios"

const TITULOS: Record<string, string> = {
  "dashboard": "Dashboard",
  "mostrador": "Mostrador",
  "mesas": "Gestión de Mesas",
  "historial-ventas": "Historial de Ventas",
  "stock": "Gestión de Stock",
  "gastos": "Gestión de Gastos",
  "arqueo-caja": "Arqueo de Caja",
  "proveedores": "Gestión de Proveedores",
  "horarios": "Gestión de Horarios",
  "configuracion": "Configuración del Sistema",
}

const DESCS: Record<string, string> = {
  "dashboard": "Resumen rápido de tu negocio.",
  "mostrador": "Realiza ventas y gestiona transacciones.",
  "mesas": "Administra las mesas del establecimiento.",
  "historial-ventas": "Consulta y filtra tus ventas pasadas.",
  "stock": "Administra tus productos y su inventario.",
  "gastos": "Registra y controla los gastos de tu negocio.",
  "arqueo-caja": "Gestiona los movimientos de efectivo de tu caja.",
  "proveedores": "Administra la información de tus proveedores.",
  "horarios": "Administra los horarios y reservas.",
  "configuracion": "Ajusta las preferencias y configuraciones del sistema.",
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const sp = useSearchParams()
  const tab = sp.get("tab") ?? "dashboard"

  const titulo = TITULOS[tab] ?? "Dashboard"
  const desc   = DESCS[tab]   ?? DESCS["dashboard"]

  const contenido = useMemo(() => {
    switch (tab) {
      case "mostrador":        return <Mostrador />
      case "mesas":            return <Mesas />
      case "historial-ventas": return <HistorialVentas />
      case "stock":            return <Stock />
      case "gastos":           return <Gastos />
      case "arqueo-caja":      return <ArqueoCaja />
      case "proveedores":      return <Proveedores />
      case "horarios":         return <Horarios />
      case "configuracion":    return <Configuracion />
      case "dashboard":
      default:
        return (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Ventas del Día</CardTitle>
                <CardDescription>Total de ventas hoy.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-600">$23,600</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Productos en Stock</CardTitle>
                <CardDescription>Cantidad total de productos.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600">48</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mesas Abiertas</CardTitle>
                <CardDescription>Mesas actualmente en uso.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-orange-600">1</p>
              </CardContent>
            </Card>
          </div>
        )
    }
  }, [tab])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
        <p className="ml-2 text-lg">Cargando…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Redirigiendo al login…</p>
      </div>
    )
  }

  return (
    <main className="flex-1 p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl">{titulo}</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </CardHeader>
        <CardContent>{contenido}</CardContent>
      </Card>
    </main>
  )
}
