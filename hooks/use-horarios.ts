"use client"
import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase"

export function useHorarios() {
  const supabase = createClient()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setItems([]); setLoading(false); return }
    const { data } = await supabase.from("horarios").select("*").eq("user_id", user.id).order("fecha", { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchAll() }, [fetchAll])

  const add = async (row: { empleado: string; fecha: string; hora_inicio: string; hora_fin: string; notas?: string }) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: new Error("Sin sesión") }
    const { error } = await supabase.from("horarios").insert({ user_id: user.id, ...row })
    if (!error) await fetchAll()
    return { error }
  }

  return { items, loading, fetchAll, add }
}
