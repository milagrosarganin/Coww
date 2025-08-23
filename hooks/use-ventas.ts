"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase"
import { useAuth } from "./use-auth"

interface Sale {
  id: string
  user_id: string
  sale_date: string
  total_amount: number
  payment_method: string | null
  created_at: string
}

export function useSales() {
  const supabase = createClient()
  const { user } = useAuth()
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSales = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from("sales")
        .select("*")
        .eq("user_id", user.id)
        .order("sale_date", { ascending: false })

      if (fetchError) throw fetchError
      setSales(data || [])
    } catch (err: any) {
      setError(err)
      console.error("Error fetching sales:", err.message)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

  const addSale = async (
    newSale: Omit<Sale, "id" | "user_id" | "sale_date" | "created_at"> & {
      items: { product_id: string; quantity: number; price_at_sale: number }[]
    },
  ) => {
    if (!user) throw new Error("User not authenticated.")
    setLoading(true)
    setError(null)
    try {
      const { data: saleData, error: saleError } = await supabase
        .from("sales")
        .insert({
          user_id: user.id,
          total_amount: newSale.total_amount,
          payment_method: newSale.payment_method,
        })
        .select()
        .single()

      if (saleError) throw saleError

      const saleId = saleData.id

      const saleItemsToInsert = newSale.items.map((item) => ({
        sale_id: saleId,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_sale: item.price_at_sale,
      }))

      const { error: itemsError } = await supabase.from("sale_items").insert(saleItemsToInsert)

      if (itemsError) throw itemsError

      await fetchSales() // Re-fetch sales to update the list
      // Note: Product stock updates are handled by database triggers,
      // but you might want to re-fetch products in the UI if needed.

      return saleData
    } catch (err: any) {
      setError(err)
      console.error("Error adding sale:", err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { sales, addSale, loading, error, fetchSales }
}
