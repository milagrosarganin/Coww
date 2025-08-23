"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useToast } from "./use-toast"
import type { PostgrestError } from "@supabase/supabase-js"

export interface Sale {
  id: string
  user_id: string
  sale_date: string
  total_amount: number
  payment_method: string | null
  created_at: string
}

export interface NewSaleItem {
  product_id: string
  quantity: number
  price_at_sale: number
  quantity_unit?: "unidad" | "kg"   // <-- NUEVO
}


export interface NewSale {
  total_amount: number
  payment_method?: string | null
  sale_items: NewSaleItem[]
}

export function useSales() {
  const supabase = createClient()
  const { toast } = useToast()

  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSales = useCallback(async () => {
    setLoading(true)
    setError(null)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError) {
      setError(userError.message)
      setLoading(false)
      return
    }

    const { data, error: qError }: { data: Sale[] | null; error: PostgrestError | null } = await supabase
      .from("sales")
      .select("*")
      .eq("user_id", user!.id)
      .order("sale_date", { ascending: false })

    if (qError) {
      setError(qError.message)
      setLoading(false)
      return
    }

    setSales(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

  /**
   * Crea una venta y sus items. Los triggers de tu SQL:
   * - descuentan stock al insertar en sale_items
   */
  const addSale = async (newSale: NewSale) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      toast({ title: "Error", description: userError?.message ?? "Sin sesión", variant: "destructive" })
      return { data: null, error: userError ?? new Error("No user") }
    }

    // 1) Crear venta (sin .single(); insert devuelve array)
    const {
      data: inserted,
      error: saleError,
    }: { data: Sale[] | null; error: PostgrestError | null } = await supabase
      .from("sales")
      .insert({
        user_id: user.id,
        total_amount: newSale.total_amount,
        payment_method: newSale.payment_method ?? null,
      })
      .select()

    if (saleError || !inserted || inserted.length === 0) {
      toast({
        title: "Error al registrar venta",
        description: saleError?.message ?? "No se pudo insertar la venta",
        variant: "destructive",
      })
      return { data: null, error: saleError ?? new Error("Insert sales vacío") }
    }

    const sale = inserted[0]

    // 2) Insertar items (trigger actualiza stock)
    if (newSale.sale_items.length > 0) {
      const itemsPayload = newSale.sale_items.map((it) => ({
      sale_id: sale.id,
      product_id: it.product_id,
      quantity: it.quantity,
      price_at_sale: it.price_at_sale,
      quantity_unit: it.quantity_unit ?? "unidad",   // <-- NUEVO
    }))
      const { error: itemsError }: { error: PostgrestError | null } = await supabase
        .from("sale_items")
        .insert(itemsPayload)

      if (itemsError) {
        toast({ title: "Error en items", description: itemsError.message, variant: "destructive" })
        return { data: null, error: itemsError }
      }
    }

    setSales((prev) => [sale, ...prev])
    toast({ title: "Venta registrada", description: "Se actualizó el stock automáticamente." })
    return { data: sale, error: null }
  }

  const deleteSale = async (id: string) => {
    // Borrar en sales borra items por FK (ON DELETE CASCADE).
    // Tus triggers revierten el stock en DELETE de sale_items.
    const { error: delError }: { error: PostgrestError | null } = await supabase
      .from("sales")
      .delete()
      .eq("id", id)

    if (delError) {
      toast({ title: "Error al borrar venta", description: delError.message, variant: "destructive" })
      return { error: delError }
    }

    setSales((prev) => prev.filter((s) => s.id !== id))
    toast({ title: "Venta eliminada" })
    return { error: null }
  }

  return { sales, loading, error, fetchSales, addSale, deleteSale }
}
