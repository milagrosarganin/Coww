"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "./use-toast"

interface Expense {
  id: string
  user_id: string
  expense_date: string
  description: string
  amount: number
  category: string | null
  created_at: string
}

interface NewExpense {
  description: string
  amount: number
  category?: string
}

const demoExpenses: Expense[] = [
  {
    id: "1",
    user_id: "demo-user-123",
    expense_date: new Date().toISOString(),
    description: "Alquiler del local",
    amount: 50000,
    category: "Alquiler",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo-user-123",
    expense_date: new Date(Date.now() - 86400000).toISOString(),
    description: "Electricidad",
    amount: 8500,
    category: "Servicios",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

export function useExpenses() {
  const { toast } = useToast()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    setError(null)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const savedExpenses = localStorage.getItem("demo_expenses")
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    } else {
      setExpenses(demoExpenses)
      localStorage.setItem("demo_expenses", JSON.stringify(demoExpenses))
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const addExpense = async (newExpense: NewExpense) => {
    const expense: Expense = {
      id: Date.now().toString(),
      user_id: "demo-user-123",
      expense_date: new Date().toISOString(),
      description: newExpense.description,
      amount: newExpense.amount,
      category: newExpense.category || null,
      created_at: new Date().toISOString(),
    }

    const updatedExpenses = [expense, ...expenses]
    setExpenses(updatedExpenses)
    localStorage.setItem("demo_expenses", JSON.stringify(updatedExpenses))

    return { data: expense, error: null }
  }

  const deleteExpense = async (id: string) => {
    const updatedExpenses = expenses.filter((e) => e.id !== id)
    setExpenses(updatedExpenses)
    localStorage.setItem("demo_expenses", JSON.stringify(updatedExpenses))

    return { error: null }
  }

  return { expenses, loading, error, addExpense, deleteExpense, fetchExpenses }
}
