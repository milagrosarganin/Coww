"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase"
import type { PostgrestError } from "@supabase/supabase-js"
import { useToast } from "./use-toast"

export type MesaEstado = "abierta" | "cerrada"

export interface MesaItem {
  id: string
  mesa_id: string
  product_id: string
  quantity: number
  price_at_time: number
  quantity_unit: "unidad" | "kg"
  products?: { name: string } | null
}

export interface Mesa {
  id: string
  user_id: string
  numero_mesa: string      // <— STRING
  estado: MesaEstado
  total_actual: number | null
  created_at: string
  mesa_items?: MesaItem[]
}

export function useMesas() {
  const supabase = createClient()
  const { toast } = useToast()

  const [mesas, setMesas] = useState<Mesa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMesas = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data: { user }, error: uerr } = await supabase.auth.getUser()
    if (uerr || !user) { setError(uerr?.message ?? "Sin sesión"); setLoading(false); return }

    const { data, error: qerr }:
      { data: Mesa[] | null; error: PostgrestError | null } = await supabase
      .from("mesas")
      .select("*, mesa_items(*, products(name))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })

    if (qerr) { setError(qerr.message); setLoading(false); return }
    setMesas(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchMesas() }, [fetchMesas])

  // Crear mesa (no items, estado cerrada por default o según tu SQL; la abrimos explícitamente)
  const createMesa = async ({ numero_mesa }: { numero_mesa: string }) => {
    const { data: { user }, error: uerr } = await supabase.auth.getUser()
    if (uerr || !user) return { error: uerr ?? new Error("Sin sesión") }

    const { data, error } = await supabase
      .from("mesas")
      .insert({ user_id: user.id, numero_mesa: String(numero_mesa), estado: "cerrada" })
      .select("*, mesa_items(*)")

    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return { error } }
    setMesas((prev) => [...(data as Mesa[]), ...prev])
    toast({ title: "Mesa creada" })
    return { error: null }
  }

  const openMesa = async (mesaId: string) => {
    const { data, error } = await supabase.from("mesas").update({ estado: "abierta" }).eq("id", mesaId).select()
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return { error } }
    setMesas((prev) => prev.map((m) => (m.id === mesaId ? (data![0] as Mesa) : m)))
    return { error: null }
  }

  // Cerrar: crea sale + sale_items desde mesa_items (AHÍ se descuenta stock por trigger) y limpia mesa
  const closeMesa = async (mesaId: string, payment_method: string) => {
    const { data: { user }, error: uerr } = await supabase.auth.getUser()
    if (uerr || !user) return { error: uerr ?? new Error("Sin sesión") }

    const { data: items, error: itemsErr } = await supabase
      .from("mesa_items")
      .select("id, product_id, quantity, price_at_time")
      .eq("mesa_id", mesaId)

    if (itemsErr) return { error: itemsErr }

    const total = (items ?? []).reduce((t, it) => t + Number(it.price_at_time) * Number(it.quantity), 0)

    const { data: saleIns, error: saleErr } = await supabase
      .from("sales")
      .insert({ user_id: user.id, total_amount: total, payment_method })
      .select()

    if (saleErr || !saleIns?.length) return { error: saleErr ?? new Error("No se pudo crear la venta") }
    const sale = saleIns[0]

    if ((items ?? []).length) {
      const payload = items!.map((it) => ({
        sale_id: sale.id,
        product_id: it.product_id,
        quantity: it.quantity,
        price_at_sale: it.price_at_time,
        quantity_unit: it.quantity_unit,
      }))
      const { error: siErr } = await supabase.from("sale_items").insert(payload)
      if (siErr) return { error: siErr }
    }

    // limpiar items de mesa y cerrarla
    await supabase.from("mesa_items").delete().eq("mesa_id", mesaId)
    const { data: upd, error: upErr } = await supabase
      .from("mesas")
      .update({ estado: "cerrada", total_actual: 0 })
      .eq("id", mesaId)
      .select("*, mesa_items(*)")

    if (upErr) return { error: upErr }

    setMesas((prev) => prev.map((m) => (m.id === mesaId ? (upd![0] as Mesa) : m)))
    return { error: null }
  }

  // Agregar item a mesa (NO toca stock)
  const addItemToMesa = async (mesaId: string, item: { product_id: string; quantity: number; price_at_time: number; quantity_unit: "unidad" | "kg" }) => {
    const { data, error } = await supabase
      .from("mesa_items")
      .insert({ mesa_id: mesaId, ...item })
      .select()

    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return { error } }
    await fetchMesas() // para ver total_actual actualizado por trigger
    return { error: null }
  }

  const removeItemFromMesa = async (mesaItemId: string) => {
    const { error } = await supabase.from("mesa_items").delete().eq("id", mesaItemId)
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return { error } }
    await fetchMesas()
    return { error: null }
  }

  const deleteMesa = async (mesaId: string) => {
    const { error } = await supabase.from("mesas").delete().eq("id", mesaId)
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return { error } }
    setMesas((prev) => prev.filter((m) => m.id !== mesaId))
    toast({ title: "Mesa eliminada" })
    return { error: null }
  }

  return { mesas, loading, error, fetchMesas, createMesa, openMesa, closeMesa, addItemToMesa, removeItemFromMesa, deleteMesa }
}
