"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useToast } from "./use-toast"

export interface Product {
  id: string
  user_id: string
  name: string
  description: string | null
  price: number
  stock: number
  unit: "unidad" | "kg"                 // <-- NUEVO
  created_at: string
}

export interface NewProduct {
  name: string
  description?: string | null
  price: number
  stock: number
  unit?: "unidad" | "kg"                // <-- NUEVO (opcional, default 'unidad')
}

export interface UpdateProduct {
  name?: string
  description?: string | null
  price?: number
  stock?: number
  unit?: "unidad" | "kg"                // <-- NUEVO
}

export function useProducts() {
  const supabase = createClient()
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError) {
      setLoading(false)
      setError(userError.message)
      return
    }

    // Con RLS podríamos no filtrar, pero igual lo hacemos por performance
    const { data, error: qError } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })

    if (qError) {
      setError(qError.message)
      setLoading(false)
      return
    }

    setProducts((data as Product[]) ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const addProduct = async (newProduct: NewProduct) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      toast({ title: "Error", description: userError?.message ?? "Sin sesión", variant: "destructive" })
      return { data: null, error: userError ?? new Error("No user") }
    }

    const { data, error: insertError } = await supabase
      .from("products")
      .insert({
        user_id: user.id,
        name: newProduct.name,
        description: newProduct.description ?? null,
        price: newProduct.price,
        stock: newProduct.stock,
        unit: newProduct.unit ?? "unidad",   // <-- NUEVO
      })

      .select()
      .single()

    if (insertError) {
      toast({ title: "Error al agregar", description: insertError.message, variant: "destructive" })
      return { data: null, error: insertError }
    }

    setProducts((prev) => [data as Product, ...prev])
    toast({ title: "Producto agregado", description: "Se guardó correctamente." })
    return { data: data as Product, error: null }
  }

  const updateProduct = async (id: string, patch: UpdateProduct) => {
    const { data, error: upError } = await supabase
      .from("products")
      .update({
        ...(patch.unit !== undefined ? { unit: patch.unit } : {}),
        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.description !== undefined ? { description: patch.description } : {}),
        ...(patch.price !== undefined ? { price: patch.price } : {}),
        ...(patch.stock !== undefined ? { stock: patch.stock } : {}),
      })
      .eq("id", id)
      .select()
      .single()

    if (upError) {
      toast({ title: "Error al actualizar", description: upError.message, variant: "destructive" })
      return { data: null, error: upError }
    }

    setProducts((prev) => prev.map((p) => (p.id === id ? (data as Product) : p)))
    toast({ title: "Producto actualizado" })
    return { data: data as Product, error: null }
  }

  const deleteProduct = async (id: string) => {
    const { error: delError } = await supabase.from("products").delete().eq("id", id)
    if (delError) {
      toast({ title: "Error al borrar", description: delError.message, variant: "destructive" })
      return { error: delError }
    }
    setProducts((prev) => prev.filter((p) => p.id !== id))
    toast({ title: "Producto eliminado" })
    return { error: null }
  }

  return { products, loading, error, fetchProducts, addProduct, updateProduct, deleteProduct }
}
