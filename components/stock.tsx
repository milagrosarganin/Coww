"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProducts } from "@/hooks/use-products"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "./loading-spinner"
import { ExportButton } from "./export-button"

export function Stock() {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProducts()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [unit, setUnit] = useState<"unidad" | "kg">("unidad")
  const [editingProduct, setEditingProduct] = useState<string | null>(null)

  const handleAddOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || isNaN(Number.parseFloat(price)) || !stock || isNaN(Number.parseFloat(stock))) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos y asegúrate de que el precio y el stock sean válidos.",
        variant: "destructive",
      })
      return
    }

    const productData = {
      name,
      description,
      price: Number.parseFloat(price),
      stock: Number.parseFloat(stock),
      unit,
    }

    if (editingProduct) {
      const { error: updateError } = await updateProduct(editingProduct, productData)
      if (updateError) {
        toast({
          title: "Error al actualizar producto",
          description: updateError.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Producto actualizado",
          description: "El producto se ha actualizado correctamente.",
        })
        setEditingProduct(null)
      }
    } else {
      const { error: addError } = await addProduct(productData)
      if (addError) {
        toast({
          title: "Error al añadir producto",
          description: addError.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Producto añadido",
          description: "El producto se ha registrado correctamente.",
        })
      }
    }
    setName("")
    setDescription("")
    setPrice("")
    setStock("")
    setUnit("unidad")
  }

  const handleEditClick = (product: {
    id: string
    name: string
    description: string | null
    price: number
    stock: number
    unit: "unidad" | "kg"
  }) => {
    setEditingProduct(product.id)
    setName(product.name)
    setDescription(product.description || "")
    setPrice(product.price.toString())
    setStock(product.stock.toString())
    setUnit(product.unit)
  }

  const handleDeleteProduct = async (id: string) => {
    const { error: deleteError } = await deleteProduct(id)
    if (deleteError) {
      toast({
        title: "Error al eliminar producto",
        description: deleteError.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado.",
      })
    }
  }

  const productHeaders = [
    { key: "name", label: "Nombre" },
    { key: "description", label: "Descripción" },
    { key: "price", label: "Precio" },
    { key: "stock", label: "Stock" },
    { key: "unit", label: "Unidad" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
        <p className="ml-2 text-lg">Cargando productos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {/* error es string, no object */}
        <p>Error al cargar productos: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingProduct ? "Editar Producto" : "Añadir Nuevo Producto"}</CardTitle>
          <CardDescription>
            {editingProduct
              ? "Modifica los detalles del producto existente."
              : "Registra un nuevo producto en tu inventario."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddOrUpdateProduct} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input
                id="name"
                placeholder="Nombre del producto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción (Opcional)</Label>
              <Input
                id="description"
                placeholder="Descripción del producto"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                step="1"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidad de Medida</Label>
              <Select value={unit} onValueChange={(value) => setUnit(value as "unidad" | "kg")}>
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Seleccionar unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidad">Unidad</SelectItem>
                  <SelectItem value="kg">Kilogramo (kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="md:col-span-2">
              {editingProduct ? "Actualizar Producto" : "Añadir Producto"}
            </Button>
            {editingProduct && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingProduct(null)
                  setName("")
                  setDescription("")
                  setPrice("")
                  setStock("")
                  setUnit("unidad")
                }}
                className="md:col-span-2"
              >
                Cancelar Edición
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Inventario de Productos</CardTitle>
          <ExportButton data={products} fileName="inventario_coww" headers={productHeaders} />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Unidad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description || "-"}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.stock} {product.unit}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(product)}>
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                        Eliminar
                      </Button>
                    </div>
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
