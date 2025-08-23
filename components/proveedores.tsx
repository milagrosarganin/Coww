"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useSuppliers } from "@/hooks/use-suppliers"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "./loading-spinner"

export function Proveedores() {
  const { suppliers, loading, error, addSupplier, deleteSupplier } = useSuppliers()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      toast({
        title: "Error",
        description: "El nombre del proveedor es obligatorio.",
        variant: "destructive",
      })
      return
    }

    const newSupplier = {
      name,
      contact_person: contactPerson,
      phone,
      email,
      address,
    }

    const { error: addError } = await addSupplier(newSupplier)
    if (addError) {
      toast({
        title: "Error al añadir proveedor",
        description: addError.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Proveedor añadido",
        description: "El proveedor se ha registrado correctamente.",
      })
      setName("")
      setContactPerson("")
      setPhone("")
      setEmail("")
      setAddress("")
    }
  }

  const handleDeleteSupplier = async (id: string) => {
    const { error: deleteError } = await deleteSupplier(id)
    if (deleteError) {
      toast({
        title: "Error al eliminar proveedor",
        description: deleteError.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Proveedor eliminado",
        description: "El proveedor ha sido eliminado.",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
        <p className="ml-2 text-lg">Cargando proveedores...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error al cargar proveedores: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registrar Nuevo Proveedor</CardTitle>
          <CardDescription>Añade la información de un nuevo proveedor.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSupplier} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Proveedor</Label>
              <Input
                id="name"
                placeholder="Nombre de la empresa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Persona de Contacto</Label>
              <Input
                id="contactPerson"
                placeholder="Nombre del contacto"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Ej: +54 9 11 1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contacto@proveedor.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                placeholder="Dirección completa del proveedor"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <Button type="submit" className="md:col-span-2">
              Añadir Proveedor
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Proveedores</CardTitle>
          <CardDescription>Todos los proveedores registrados.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.contact_person || "-"}</TableCell>
                  <TableCell>{supplier.phone || "-"}</TableCell>
                  <TableCell>{supplier.email || "-"}</TableCell>
                  <TableCell>{supplier.address || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteSupplier(supplier.id)}>
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
