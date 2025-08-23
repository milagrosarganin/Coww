"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useExpenses } from "@/hooks/use-expenses"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { LoadingSpinner } from "./loading-spinner"
import { ExportButton } from "./export-button"

export function Gastos() {
  const { expenses, loading, error, addExpense, deleteExpense } = useExpenses()
  const { toast } = useToast()

  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("General")

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount || isNaN(Number.parseFloat(amount))) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos y asegúrate de que la cantidad sea válida.",
        variant: "destructive",
      })
      return
    }

    const newExpense = {
      description,
      amount: Number.parseFloat(amount),
      category,
    }

    const { error: addError } = await addExpense(newExpense)
    if (addError) {
      toast({
        title: "Error al añadir gasto",
        description: addError.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Gasto añadido",
        description: "El gasto se ha registrado correctamente.",
      })
      setDescription("")
      setAmount("")
      setCategory("General")
    }
  }

  const handleDeleteExpense = async (id: string) => {
    const { error: deleteError } = await deleteExpense(id)
    if (deleteError) {
      toast({
        title: "Error al eliminar gasto",
        description: deleteError.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Gasto eliminado",
        description: "El gasto ha sido eliminado.",
      })
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const expenseHeaders = [
    { key: "expense_date", label: "Fecha" },
    { key: "description", label: "Descripción" },
    { key: "category", label: "Categoría" },
    { key: "amount", label: "Monto" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
        <p className="ml-2 text-lg">Cargando gastos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error al cargar gastos: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Total de Gastos</CardTitle>
          <CardDescription>Suma de todos los gastos registrados.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold text-red-600 dark:text-red-400">${totalExpenses.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registrar Nuevo Gasto</CardTitle>
          <CardDescription>Añade un nuevo gasto a tu registro.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddExpense} className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Descripción del gasto"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Alquiler">Alquiler</SelectItem>
                  <SelectItem value="Servicios">Servicios</SelectItem>
                  <SelectItem value="Sueldos">Sueldos</SelectItem>
                  <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Insumos">Insumos</SelectItem>
                  <SelectItem value="Otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="md:col-span-3">
              Añadir Gasto
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Historial de Gastos</CardTitle>
          <ExportButton data={expenses} fileName="gastos_x3_padel" headers={expenseHeaders} />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{format(new Date(expense.expense_date), "dd/MM/yyyy HH:mm", { locale: es })}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteExpense(expense.id)}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
