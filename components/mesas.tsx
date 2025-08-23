"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useMesas } from "@/hooks/use-mesas"
import { useProducts } from "@/hooks/use-products"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Plus, Play, Square, Trash2, ShoppingCart, X } from "lucide-react"

export function Mesas() {
  const { mesas, loading, createMesa, openMesa, closeMesa, addItemToMesa, removeItemFromMesa, deleteMesa } = useMesas()
  const { products } = useProducts()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)
  const [selectedMesa, setSelectedMesa] = useState<string | null>(null)

  const [newMesaName, setNewMesaName] = useState("")   // string
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [paymentMethod, setPaymentMethod] = useState("efectivo")

  const handleCreateMesa = async () => {
    if (!newMesaName.trim()) return
    const result = await createMesa({ numero_mesa: newMesaName.trim() })
    if (result.error === null) {
      setIsCreateDialogOpen(false)
      setNewMesaName("")
    }
  }

  const handleOpenMesa = async (mesaId: string) => { await openMesa(mesaId) }

  const handleCloseMesa = async () => {
    if (!selectedMesa) return
    const result = await closeMesa(selectedMesa, paymentMethod)
    if (result.error === null) {
      setIsCloseDialogOpen(false)
      setSelectedMesa(null)
      setPaymentMethod("efectivo")
    }
  }

  const handleAddItem = async () => {
    if (!selectedMesa || !selectedProduct || !quantity) return
    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    const q = Number.parseFloat(quantity)
    if (!Number.isFinite(q) || q <= 0) return

    const result = await addItemToMesa(selectedMesa, {
      product_id: selectedProduct,
      quantity: q,
      price_at_time: product.price,
      quantity_unit: product.unit,
    })

    if (result.error === null) {
      setIsAddItemDialogOpen(false)
      setSelectedProduct("")
      setQuantity("1")
      setSelectedMesa(null)
    }
  }

  const handleRemoveItem = async (itemId: string) => { await removeItemFromMesa(itemId) }

  const handleDeleteMesa = async (mesaId: string) => {
    if (confirm("¿Eliminar esta mesa?")) await deleteMesa(mesaId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Cargando mesas...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Mesas</h2>
          <p className="text-muted-foreground">Administra las mesas del establecimiento</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva mesa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nueva mesa</DialogTitle>
              <DialogDescription>Ingresá el nombre/identificador (texto).</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="numero" className="text-right">Nombre</Label>
                <Input
                  id="numero"
                  type="text"
                  value={newMesaName}
                  onChange={(e) => setNewMesaName(e.target.value)}
                  className="col-span-3"
                  placeholder="Ej: Patio 1, VIP, 12A..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateMesa} disabled={!newMesaName.trim()}>Crear mesa</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mesas.map((mesa) => {
          const total = Number(mesa.total_actual ?? 0)
          return (
            <Card key={mesa.id} className={mesa.estado === "abierta" ? "border-green-500 bg-green-50" : "border-gray-200"}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Mesa {mesa.numero_mesa}</CardTitle>
                  <Badge variant={mesa.estado === "abierta" ? "default" : "secondary"}>
                    {mesa.estado === "abierta" ? "Abierta" : "Cerrada"}
                  </Badge>
                </div>
                <CardDescription>Total actual: ${total.toFixed(2)}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {mesa.mesa_items && mesa.mesa_items.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Productos:</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {mesa.mesa_items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm bg-white p-2 rounded-md border">
                            <span>{item.products?.name} x{item.quantity} {item.quantity_unit === "kg" ? "kg" : ""}</span>
                            <div className="flex items-center gap-2">
                              <span>${(item.quantity * item.price_at_time).toFixed(2)}</span>
                              {mesa.estado === "abierta" && (
                                <Button size="sm" variant="ghost" onClick={() => handleRemoveItem(item.id)}>
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {mesa.estado === "cerrada" ? (
                      <Button size="sm" onClick={() => handleOpenMesa(mesa.id)} className="flex-1">
                        <Play className="mr-2 h-4 w-4" /> Abrir
                      </Button>
                    ) : (
                      <>
                        <Dialog
                          open={isAddItemDialogOpen && selectedMesa === mesa.id}
                          onOpenChange={(open) => { setIsAddItemDialogOpen(open); setSelectedMesa(open ? mesa.id : null) }}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              <ShoppingCart className="mr-2 h-4 w-4" /> Agregar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Agregar a {mesa.numero_mesa}</DialogTitle>
                              <DialogDescription>Elegí producto y cantidad.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Producto</Label>
                                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Seleccionar producto" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {products.filter((p) => p.stock > 0).map((p) => (
                                      <SelectItem key={p.id} value={p.id}>
                                        {p.name} - ${p.price.toFixed(2)} (Stock: {p.stock})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                {(() => {
                                  const product = products.find(p => p.id === selectedProduct);
                                  const step = product?.unit === 'kg' ? '0.01' : '1';
                                  const min = product?.unit === 'kg' ? '0.01' : '1';
                                  return <>
                                <Label className="text-right">Cantidad</Label>
                                <Input
                                  type="number"
                                  min={min}
                                  step={step}
                                  value={quantity}
                                  onChange={(e) => setQuantity(e.target.value)}
                                  className="col-span-3"
                                />
                                  </>
                                })()}
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleAddItem} disabled={!selectedProduct || !quantity}>Agregar producto</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={isCloseDialogOpen && selectedMesa === mesa.id}
                          onOpenChange={(open) => { setIsCloseDialogOpen(open); setSelectedMesa(open ? mesa.id : null) }}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" className="flex-1">
                              <Square className="mr-2 h-4 w-4" /> Cerrar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cerrar {mesa.numero_mesa}</DialogTitle>
                              <DialogDescription>Total a cobrar: ${total.toFixed(2)}</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Método de pago</Label>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                  <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="efectivo">Efectivo</SelectItem>
                                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                    <SelectItem value="transferencia">Transferencia</SelectItem>
                                    <SelectItem value="mercado pago">Mercado Pago</SelectItem>
                                    <SelectItem value="qr">QR</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleCloseMesa}>Cerrar mesa y cobrar</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteMesa(mesa.id)}
                    className="w-full"
                    disabled={mesa.estado === "abierta"}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar mesa
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {mesas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No hay mesas creadas</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Crear primera mesa
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
