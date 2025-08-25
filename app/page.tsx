"use client"

import { useState } from "react"
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
import { Horarios } from "@/components/horarios"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
        <p className="ml-2 text-lg">Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Redirigiendo al login...</p>
      </div>
    )
  }

  return (
    <main className="flex-1 p-6">
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
            {activeTab === "horarios" && "Gestión de Horarios"}
            {activeTab === "configuracion" && "Configuración del Sistema"}
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
              {/* contenido de Dashboard */}
              <p>Bienvenido al panel de control.</p>
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
            <TabsContent value="horarios">
              <Horarios />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
