"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase"

type Totales = {
  ventas: { efectivo: number; tarjeta: number; transferencia: number; qr: number; otros: number; total: number }
  gastos: { efectivo: number; tarjeta: number; transferencia: number; qr: number; otros: number; total: number }
  neto: number
  esperadoEnCaja: number // saldo_inicial + ventas.efectivo - gastos.efectivo
}

export function useArqueo() {
  const supabase = createClient()
  const [arqueo, setArqueo] = useState<any | null>(null) // arqueo abierto
  const [loading, setLoading] = useState(true)
  const [totales, setTotales] = useState<Totales | null>(null)

  const getOpenShift = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setArqueo(null); setLoading(false); return }

    const { data, error } = await supabase
      .from("arqueo_caja")
      .select("*")
      .eq("user_id", user.id)
      .is("fecha_cierre", null)
      .order("fecha_apertura", { ascending: false })
      .limit(1)

    if (error) throw error
    setArqueo(data?.[0] ?? null)
    setLoading(false)
  }, [supabase])

  useEffect(() => { getOpenShift() }, [getOpenShift])

  const openShift = async (saldoInicial: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: new Error("Sin sesión") }
    const { error } = await supabase.from("arqueo_caja").insert({ user_id: user.id, saldo_inicial: saldoInicial })
    if (!error) await getOpenShift()
    return { error }
  }

  const calcPreview = useCallback(async () => {
    if (!arqueo) { setTotales(null); return }
    const from = arqueo.fecha_apertura
    const to = new Date().toISOString()

    // Ventas por método
    const { data: ventas } = await supabase
      .from("sales")
      .select("total_amount,payment_method,sale_date")
      .gte("sale_date", from)
      .lte("sale_date", to)

    // Gastos por método (usamos expense.category para método si lo cargás ahí;
    // si usás otro campo, ajustalo)
    const { data: gastos } = await supabase
      .from("expenses")
      .select("amount,category,expense_date")
      .gte("expense_date", from)
      .lte("expense_date", to)

    const sumBy = (rows: any[], field: string, value: string) =>
      rows?.filter(r => (r[field] ?? "").toLowerCase() === value).reduce((a, b) => a + Number(b.total_amount ?? b.amount ?? 0), 0) ?? 0

    const vEf = sumBy(ventas ?? [], "payment_method", "efectivo")
    const vTa = sumBy(ventas ?? [], "payment_method", "tarjeta")
    const vTr = sumBy(ventas ?? [], "payment_method", "transferencia")
    const vQr = sumBy(ventas ?? [], "payment_method", "mercado pago") + sumBy(ventas ?? [], "payment_method", "qr")
    const vOt = (ventas ?? []).reduce((a, b) => {
      const m = (b.payment_method ?? "").toLowerCase()
      return a + (["efectivo","tarjeta","transferencia","mercado pago","qr"].includes(m) ? 0 : Number(b.total_amount ?? 0))
    }, 0)
    const vTot = vEf + vTa + vTr + vQr + vOt

    const gEf = sumBy(gastos ?? [], "category", "efectivo")
    const gTa = sumBy(gastos ?? [], "category", "tarjeta")
    const gTr = sumBy(gastos ?? [], "category", "transferencia")
    const gQr = sumBy(gastos ?? [], "category", "mercado pago") + sumBy(gastos ?? [], "category", "qr")
    const gOt = (gastos ?? []).reduce((a, b) => {
      const m = (b.category ?? "").toLowerCase()
      return a + (["efectivo","tarjeta","transferencia","mercado pago","qr"].includes(m) ? 0 : Number(b.amount ?? 0))
    }, 0)
    const gTot = gEf + gTa + gTr + gQr + gOt

    const neto = vTot - gTot
    const esperadoEnCaja = Number(arqueo.saldo_inicial ?? 0) + vEf - gEf

    setTotales({
      ventas: { efectivo: vEf, tarjeta: vTa, transferencia: vTr, qr: vQr, otros: vOt, total: vTot },
      gastos: { efectivo: gEf, tarjeta: gTa, transferencia: gTr, qr: gQr, otros: gOt, total: gTot },
      neto,
      esperadoEnCaja,
    })
  }, [supabase, arqueo])

  useEffect(() => { calcPreview() }, [calcPreview])

  const closeShift = async (saldoFinal: number, comentario?: string) => {
    if (!arqueo) return { error: new Error("No hay arqueo abierto") }
    const { error } = await supabase
      .from("arqueo_caja")
      .update({ fecha_cierre: new Date().toISOString(), saldo_final: saldoFinal, comentario })
      .eq("id", arqueo.id)
    if (!error) { await getOpenShift(); setTotales(null) }
    return { error }
  }

  return { loading, arqueo, totales, openShift, closeShift, refresh: async () => { await getOpenShift(); await calcPreview() } }
}
