"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSpinner } from "@/components/loading-spinner"
import ArqueoCaja from "@/components/arqueo-caja"
import { Configuracion } from "@/components/configuracion"
import { Gastos } from "@/components/gastos"
import { HistorialVentas } from "@/components/historial-ventas"
import { Mostrador } from "@/components/mostrador"
import { Proveedores } from "@/components/proveedores"
import { Stock } from "@/components/stock"
import { Mesas } from "@/components/mesas"
import { Horarios } from "@/components/horarios" // Asumo que el componente se llama así
import {
  LogOut,
  Home,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Settings,
  BarChart,
  CalendarDays,
  Clock, // Importar el ícono
  Coffee,
} from "lucide-react"

export default function HomePage() {
  const { user, signOut, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
        <LoadingSpinner />
        <p className="ml-2 text-lg text-gray-700 dark:text-gray-300">Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
        <p className="text-lg text-gray-700 dark:text-gray-300">Redirigiendo al login...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r bg-white p-4 shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Coww</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sistema de Gestión</p>
          <div className="mt-2 px-2 py-1 bg-green-100 border border-green-300 rounded text-green-800 text-xs">
            🐮 Modo Coww activado
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          <Button
            variant={activeTab === "dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("dashboard")}
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "mostrador" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("mostrador")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Mostrador
          </Button>
          <Button
            variant={activeTab === "mesas" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("mesas")}
          >
            <Coffee className="mr-2 h-4 w-4" />
            Mesas
          </Button>
          <Button
            variant={activeTab === "historial-ventas" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("historial-ventas")}
          >
            <BarChart className="mr-2 h-4 w-4" />
            Historial de Ventas
          </Button>
          <Button
            variant={activeTab === "stock" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("stock")}
          >
            <Package className="mr-2 h-4 w-4" />
            Stock
          </Button>
          <Button
            variant={activeTab === "gastos" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("gastos")}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Gastos
          </Button>
          <Button
            variant={activeTab === "arqueo-caja" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("arqueo-caja")}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Arqueo de Caja
          </Button>
          <Button
            variant={activeTab === "proveedores" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("proveedores")}
          >
            <Users className="mr-2 h-4 w-4" />
            Proveedores
          </Button>
          <Button
            variant={activeTab === "configuracion" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("configuracion")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Button>
        </nav>
        {/* AÑADIR ESTE BOTÓN */}
        <Button
          variant={activeTab === "horarios" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("horarios")}
        >
          <Clock className="mr-2 h-4 w-4" />
          Horarios
        </Button>
        <div className="mt-auto">
          <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "mostrador" && "Mostrador"}
              {activeTab === "mesas" && "Gestión de Mesas"}
              {activeTab === "historial-ventas" && "Historial de Ventas"}
              {activeTab === "stock" && "Gestión de Stock"}
              {activeTab === "gastos" && "Gestión de Gastos"}
              {activeTab === "arqueo-caja" && "Arqueo de Caja"}
              {activeTab === "proveedores" && "Gestión de Proveedores"}
              {activeTab === "configuracion" && "Configuración del Sistema"}
              {activeTab === "horarios" && "Gestión de Horarios"}
            </CardTitle>
            <CardDescription>
              {activeTab === "dashboard" && "Resumen rápido de tu negocio."}
              {activeTab === "mostrador" && "Realiza ventas y gestiona transacciones."}
              {activeTab === "mesas" && "Administra las mesas del establecimiento."}
              {activeTab === "historial-ventas" && "Consulta y filtra tus ventas pasadas."}
              {activeTab === "stock" && "Administra tus productos y su inventario."}
              {activeTab === "gastos" && "Registra y controla los gastos de tu negocio."}
              {activeTab === "arqueo-caja" && "Gestiona los movimientos de efectivo de tu caja."}
              {activeTab === "proveedores" && "Administra la información de tus proveedores."}
              {activeTab === "horarios" && "Administra los horarios y reservas."}
              {activeTab === "configuracion" && "Ajusta las preferencias y configuraciones del sistema."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="dashboard">
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
                  <Card>
                    <CardHeader>
                      <CardTitle>Gastos del Mes</CardTitle>
                      <CardDescription>Total de gastos registrados.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-red-600">$58,500</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Balance de Caja</CardTitle>
                      <CardDescription>Efectivo disponible.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-purple-600">$15,000</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Proveedores</CardTitle>
                      <CardDescription>Total de proveedores registrados.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-indigo-600">2</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="mostrador">
                <Mostrador />
              </TabsContent>
              <TabsContent value="mesas">
                <Mesas />
              </TabsContent>
              <TabsContent value="historial-ventas">
                <HistorialVentas />
              </TabsContent>
              <TabsContent value="stock">
                <Stock />
              </TabsContent>
              <TabsContent value="gastos">
                <Gastos />
              </TabsContent>
              <TabsContent value="arqueo-caja">
                <ArqueoCaja />
              </TabsContent>
              <TabsContent value="proveedores">
                <Proveedores />
              </TabsContent>
              <TabsContent value="configuracion">
                <Configuracion />
              </TabsContent>
              {/* AÑADIR ESTE CONTENIDO DE TAB */}
              <TabsContent value="horarios">
                <Horarios />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )

  return <Mostrador />
}
