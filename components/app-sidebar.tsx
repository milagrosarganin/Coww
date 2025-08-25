"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ShoppingCart, Package, Users, DollarSign, CalendarDays, Settings,
  BarChart, Coffee, Home,
} from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { tab: "dashboard", label: "Dashboard", icon: Home },
  { tab: "mostrador", label: "Mostrador", icon: ShoppingCart },
  { tab: "mesas", label: "Mesas", icon: Coffee },
  { tab: "historial-ventas", label: "Historial Ventas", icon: BarChart },
  { tab: "stock", label: "Stock", icon: Package },
  { tab: "gastos", label: "Gastos", icon: DollarSign },
  { tab: "arqueo-caja", label: "Arqueo Caja", icon: CalendarDays },
  { tab: "proveedores", label: "Proveedores", icon: Users },
  { tab: "horarios", label: "Horarios", icon: CalendarDays },
  { tab: "configuracion", label: "Configuración", icon: Settings },
]

export default function AppSidebar() {
  const sp = useSearchParams()
  const current = sp.get("tab") ?? "dashboard"

  return (
    <aside className="flex w-64 flex-col border-r bg-background">
      <div className="p-4 text-center border-b">
        <h1 className="text-2xl font-bold">Coww</h1>
        <p className="text-sm text-muted-foreground">Sistema de Gestión</p>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {items.map(({ tab, label, icon: Icon }) => (
          <Link
            key={tab}
            href={`/?tab=${encodeURIComponent(tab)}`}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
              current === tab ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
