"use client"

import { useHorarios } from "@/hooks/use-horario"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function Horarios() {
  const { horarios, loading, error } = useHorarios()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Cargando horarios...</span>
      </div>
    )
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Horarios</h2>
          <p className="text-muted-foreground">Administra los turnos y horarios de los empleados.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Horario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {horarios.map((horario) => (
          <Card key={horario.id}>
            <CardHeader>
              <CardTitle>Empleado: {horario.empleado}</CardTitle>
              <CardDescription>
                {/* Se agrega T00:00:00 para evitar problemas de zona horaria al parsear la fecha */}
                {format(new Date(horario.fecha + "T00:00:00"), "PPP", { locale: es })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                <b>Turno:</b> {horario.hora_inicio} - {horario.hora_fin}
              </p>
              {horario.notas && (
                <p className="mt-2 text-sm text-muted-foreground">
                  <b>Notas:</b> {horario.notas}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
