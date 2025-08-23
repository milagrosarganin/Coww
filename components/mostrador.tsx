"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProducts } from "@/hooks/use-products"
import { useSales } from "@/hooks/use-sales"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"

type CartItem = { id: string; name: string; price: number; quantity: number; unit: "unidad" | "kg" }

export function Mostrador() {
  const { products, loading: productsLoading, error: productsError, fetchProducts } = useProducts()
  const { addSale } = useSales()
  const { toast } = useToast()

  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [paymentMethod, setPaymentMethod] = useState<string>("efectivo")
  const [processing, setProcessing] = useState(false)   // evita doble submit

  useEffect(() => {
    if (products.length && !selectedProduct) setSelectedProduct(products[0].id)
  }, [products, selectedProduct])

  const handleAddToCart = () => {
    const p = products.find((x) => x.id === selectedProduct)
    if (!p) return toast({ title: "Error", description: "Producto no encontrado", variant: "destructive" })
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return toast({ title: "Cantidad inválida", description: "Debe ser mayor a cero", variant: "destructive" })
    }
    if (p.unit === "unidad" && !Number.isInteger(quantity)) {
      return toast({ title: "Cantidad inválida", description: "Para 'unidad' debe ser entera", variant: "destructive" })
    }
    if (p.stock < quantity) {
      return toast({
        title: "Stock insuficiente",
        description: `Quedan ${p.stock} ${p.unit === "kg" ? "kg" : "u"}`,
        variant: "destructive",
      })
    }

    setCart((prev) => {
      const ex = prev.find((i) => i.id === p.id)
      return ex
        ? prev.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + quantity } : i))
        : [...prev, { id: p.id, name: p.name, price: p.price, quantity, unit: p.unit }]
    })
    // ⚠️ NO tocar stock acá nunca
  }

  const handleRemoveFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id))

  const total = cart.reduce((t, i) => t + i.price * i.quantity, 0)

  const handleProcessSale = async () => {
    if (!cart.length) return toast({ title: "Carrito vacío", variant: "destructive" })
    if (processing) return
    setProcessing(true)

    const sale_items = cart.map((item) => {
      const p = products.find((pp) => pp.id === item.id)!
      return {
        product_id: item.id,
        quantity: item.quantity,
        price_at_sale: item.price,
        quantity_unit: p.unit,
      }
    })

    const { error } = await addSale({
      total_amount: total,
      payment_method: paymentMethod,
      sale_items,
    })

    setProcessing(false)

    if (error) return toast({ title: "Error al procesar", description: error.message, variant: "destructive" })

    setCart([])
    await fetchProducts() // stock actualizado por trigger de sale_items
    toast({ title: "Venta registrada" })
  }

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
        <p className="ml-2 text-lg">Cargando productos…</p>
      </div>
    )
  }
  if (productsError) return <div className="p-8 text-center text-red-500">Error: {productsError}</div>

  const current = products.find((x) => x.id === selectedProduct)
  const step = current?.unit === "kg" ? "0.01" : "1"
  const min = current?.unit === "kg" ? "0.01" : "1"

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Añadir productos</CardTitle>
          <CardDescription>Seleccioná y añadí al carrito</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Producto</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="text-foreground">
                <SelectValue placeholder="Seleccioná producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.unit === "kg" ? "kg" : "u"}) • Stock: {p.stock} • ${p.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cantidad {current?.unit === "kg" ? "(kg)" : "(unidades)"}</Label>
            <Input
              type="number"
              step={step}
              min={min}
              value={quantity}
              onChange={(e) => {
                const n = Number(e.target.value)
                setQuantity(Number.isFinite(n) ? n : current?.unit === "kg" ? 0.5 : 1)
              }}
            />
          </div>

          <Button className="w-full" onClick={handleAddToCart} disabled={!selectedProduct}>
            Añadir al carrito
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Carrito</CardTitle>
          <CardDescription>Revisá y confirmá</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Cant.</TableHead>
                <TableHead className="text-right">P. Unit</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">El carrito está vacío.</TableCell>
                </TableRow>
              ) : (
                cart.map((i) => {
                  return (
                    <TableRow key={i.id}>
                      <TableCell>{i.name}</TableCell>
                      <TableCell>{i.quantity} {i.unit === "kg" ? "kg" : "u"}</TableCell>
                      <TableCell className="text-right">${i.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${(i.price * i.quantity).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveFromCart(i.id)}>
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          <div className="space-y-2">
            <Label>Método de pago</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="text-foreground">
                <SelectValue placeholder="Seleccioná método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="mercado pago">Mercado Pago</SelectItem>
                <SelectItem value="qr">QR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Button className="w-full" onClick={handleProcessSale} disabled={!cart.length || processing}>
            {processing ? <LoadingSpinner className="mr-2" /> : null}
            Procesar venta
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Mostrador
