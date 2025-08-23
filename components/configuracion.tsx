"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"

export function Configuracion() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  const [businessName, setBusinessName] = useState("Coww")
  const [contactEmail, setContactEmail] = useState("coww.sistema@gmail.com")
  const [contactPhone, setContactPhone] = useState("+54 2923644365")

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar la configuración en la base de datos o en un contexto global
    console.log("Guardando configuración:", { businessName, contactEmail, contactPhone, theme })
    toast({
      title: "Configuración Guardada",
      description: "Los cambios se han guardado correctamente.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información General del Negocio</CardTitle>
          <CardDescription>Actualiza los datos básicos de tu centro de pádel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nombre del Negocio</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Nombre de tu centro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de Contacto</Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="email@ejemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Teléfono de Contacto</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+54 9 11 1234-5678"
              />
            </div>
            <Button type="submit">Guardar Cambios</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferencias de Interfaz</CardTitle>
          <CardDescription>Personaliza la apariencia de la aplicación.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode">Modo Oscuro</Label>
            <Switch
              id="darkMode"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Activa el modo oscuro para una experiencia visual más cómoda en entornos de poca luz.
          </p>
        </CardContent>
      </Card>

      {/* Puedes añadir más secciones de configuración aquí, por ejemplo:
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>Administra los usuarios con acceso al sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Gestionar Usuarios</Button>
        </CardContent>
      </Card>
      */}
    </div>
  )
}
