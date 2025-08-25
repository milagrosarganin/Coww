"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  CalendarDays,
  Settings,
  BarChart,
  Coffee,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/mostrador", label: "Mostrador", icon: ShoppingCart },
  { href: "/mesas", label: "Mesas", icon: Coffee },
  { href: "/historial-ventas", label: "Historial Ventas", icon: BarChart },
  { href: "/stock", label: "Stock", icon: Package },
  { href: "/gastos", label: "Gastos", icon: DollarSign },
  { href: "/arqueo", label: "Arqueo Caja", icon: CalendarDays },
  { href: "/proveedores", label: "Proveedores", icon: Users },
  { href: "/configuracion", label: "Configuración", icon: Settings },
  { href: "/horarios", label: "Horarios", icon: CalendarDays },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col border-r bg-background">
      <div className="p-4 text-center border-b">
        <h1 className="text-2xl font-bold">Coww</h1>
        <p className="text-sm text-muted-foreground">Sistema de Gestión</p>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
              pathname === href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
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
