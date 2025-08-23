"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useToast } from "./use-toast"
import type { PostgrestError } from "@supabase/supabase-js"

export interface Horario {
  id: string
  user_id: string
  empleado: string
  fecha: string // "YYYY-MM-DD"
  hora_inicio: string // "HH:mm"
  hora_fin: string // "HH:mm"
  notas?: string | null
  created_at: string
}

export interface NewHorario {
  empleado: string
  fecha: string
  hora_inicio: string
  hora_fin: string
  notas?: string | null
}

export interface EmployeeHours {
  empleado: string
  totalHours: number
}

export function useHorarios() {
  const supabase = createClient()
  const { toast } = useToast()
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHorarios = useCallback(async () => {
    setLoading(true)
    setError(null)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setHorarios([])
      setLoading(false)
      return
    }
    const { data, error: qError } = await supabase
      .from("horarios")
      .select("*")
      .eq("user_id", user.id)
      .order("fecha", { ascending: false })

    if (qError) {
      setError(qError.message)
      toast({ title: "Error al cargar horarios", description: qError.message, variant: "destructive" })
    } else {
      setHorarios((data as Horario[]) ?? [])
    }
    setLoading(false)
  }, [supabase, toast])

  useEffect(() => {
    fetchHorarios()
  }, [fetchHorarios])

  const addHorario = async (row: NewHorario) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: new Error("Sin sesión") }
    const { error: insertError } = await supabase.from("horarios").insert({ user_id: user.id, ...row })
    if (!insertError) {
      await fetchHorarios()
      toast({ title: "Horario agregado" })
    } else {
      toast({ title: "Error al agregar horario", description: insertError.message, variant: "destructive" })
    }
    return { error: insertError }
  }

  const calculateTotalHoursByEmployee = useCallback(
    (date: string): EmployeeHours[] => {
      const dailyHorarios = horarios.filter((h) => h.fecha === date)
      const hoursByEmployee: Record<string, number> = {}

      dailyHorarios.forEach((horario) => {
        // Se asume que las horas están en formato "HH:mm"
        const start = new Date(`1970-01-01T${horario.hora_inicio}:00`)
        const end = new Date(`1970-01-01T${horario.hora_fin}:00`)

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.error("Formato de hora inválido para el horario:", horario)
          return // Salta este horario si las fechas no son válidas
        }

        const diffMs = end.getTime() - start.getTime()
        const diffHours = diffMs > 0 ? diffMs / (1000 * 60 * 60) : 0

        if (!hoursByEmployee[horario.empleado]) {
          hoursByEmployee[horario.empleado] = 0
        }
        hoursByEmployee[horario.empleado] += diffHours
      })

      return Object.entries(hoursByEmployee).map(([empleado, totalHours]) => ({
        empleado,
        totalHours,
      }))
    },
    [horarios],
  )

  return {
    horarios,
    loading,
    error,
    fetchHorarios,
    addHorario,
    calculateTotalHoursByEmployee,
  }
}
