"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "./use-toast"

interface CashRegisterMovement {
  id: string
  user_id: string
  movement_date: string
  type: "initial_balance" | "deposit" | "withdrawal" | "closing_balance"
  amount: number
  description: string | null
  created_at: string
}

interface NewMovement {
  amount: number
  type: "initial_balance" | "deposit" | "withdrawal" | "closing_balance"
  description?: string
}

const demoMovements: CashRegisterMovement[] = [
  {
    id: "1",
    user_id: "demo-user-123",
    movement_date: new Date().toISOString(),
    type: "initial_balance",
    amount: 10000,
    description: "Saldo inicial del día",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo-user-123",
    movement_date: new Date(Date.now() - 3600000).toISOString(),
    type: "deposit",
    amount: 5000,
    description: "Venta en efectivo",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
]

export function useCashRegisterMovements() {
  const { toast } = useToast()
  const [movements, setMovements] = useState<CashRegisterMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMovements = useCallback(async () => {
    setLoading(true)
    setError(null)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const savedMovements = localStorage.getItem("demo_movements")
    if (savedMovements) {
      setMovements(JSON.parse(savedMovements))
    } else {
      setMovements(demoMovements)
      localStorage.setItem("demo_movements", JSON.stringify(demoMovements))
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchMovements()
  }, [fetchMovements])

  const addMovement = async (newMovement: NewMovement) => {
    const movement: CashRegisterMovement = {
      id: Date.now().toString(),
      user_id: "demo-user-123",
      movement_date: new Date().toISOString(),
      type: newMovement.type,
      amount: newMovement.amount,
      description: newMovement.description || null,
      created_at: new Date().toISOString(),
    }

    const updatedMovements = [movement, ...movements]
    setMovements(updatedMovements)
    localStorage.setItem("demo_movements", JSON.stringify(updatedMovements))

    return { data: movement, error: null }
  }

  const deleteMovement = async (id: string) => {
    const updatedMovements = movements.filter((m) => m.id !== id)
    setMovements(updatedMovements)
    localStorage.setItem("demo_movements", JSON.stringify(updatedMovements))

    return { error: null }
  }

  return { movements, loading, error, addMovement, deleteMovement, fetchMovements }
}
