"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "./use-toast"

interface Supplier {
  id: string
  user_id: string
  name: string
  contact_person: string | null
  phone: string | null
  email: string | null
  address: string | null
  created_at: string
}

interface NewSupplier {
  name: string
  contact_person?: string
  phone?: string
  email?: string
  address?: string
}

const demoSuppliers: Supplier[] = [
  {
    id: "1",
    user_id: "demo-user-123",
    name: "Wilson Sports Argentina",
    contact_person: "Carlos Mendez",
    phone: "+54 11 4567-8901",
    email: "carlos@wilson.com.ar",
    address: "Av. Corrientes 1234, CABA",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo-user-123",
    name: "Head Deportes",
    contact_person: "Ana Rodriguez",
    phone: "+54 11 2345-6789",
    email: "ana@head.com.ar",
    address: "Av. Santa Fe 5678, CABA",
    created_at: new Date().toISOString(),
  },
]

export function useSuppliers() {
  const { toast } = useToast()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSuppliers = useCallback(async () => {
    setLoading(true)
    setError(null)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const savedSuppliers = localStorage.getItem("demo_suppliers")
    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers))
    } else {
      setSuppliers(demoSuppliers)
      localStorage.setItem("demo_suppliers", JSON.stringify(demoSuppliers))
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  const addSupplier = async (newSupplier: NewSupplier) => {
    const supplier: Supplier = {
      id: Date.now().toString(),
      user_id: "demo-user-123",
      name: newSupplier.name,
      contact_person: newSupplier.contact_person || null,
      phone: newSupplier.phone || null,
      email: newSupplier.email || null,
      address: newSupplier.address || null,
      created_at: new Date().toISOString(),
    }

    const updatedSuppliers = [...suppliers, supplier]
    setSuppliers(updatedSuppliers)
    localStorage.setItem("demo_suppliers", JSON.stringify(updatedSuppliers))

    return { data: supplier, error: null }
  }

  const deleteSupplier = async (id: string) => {
    const updatedSuppliers = suppliers.filter((s) => s.id !== id)
    setSuppliers(updatedSuppliers)
    localStorage.setItem("demo_suppliers", JSON.stringify(updatedSuppliers))

    return { error: null }
  }

  return { suppliers, loading, error, addSupplier, deleteSupplier, fetchSuppliers }
}
