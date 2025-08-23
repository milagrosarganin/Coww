"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useSales } from "@/hooks/use-sales"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { LoadingSpinner } from "./loading-spinner"
import { ExportButton } from "./export-button"

export function HistorialVentas() {
  const { sales, loading, error, deleteSale } = useSales()
  const { toast } = useToast()

  const handleDeleteSale = async (id: string) => {
    const { error: deleteError } = await deleteSale(id)
    if (deleteError) {
      toast({
        title: "Error al eliminar venta",
        description: deleteError.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Venta eliminada",
        description: "La venta ha sido eliminada correctamente.",
      })
    }
  }

  const totalSalesAmount = sales.reduce((sum, sale) => sum + sale.total_amount, 0)

  const salesHeaders = [
    { key: "sale_date", label: "Fecha" },
    { key: "total_amount", label: "Total" },
    { key: "payment_method", label: "Método de Pago" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
        <p className="ml-2 text-lg">Cargando historial de ventas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error al cargar historial de ventas: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Ventas</CardTitle>
          <CardDescription>Total de ventas registradas en el sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">${totalSalesAmount.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Detalle de Ventas</CardTitle>
          <ExportButton data={sales} fileName="historial_ventas_x3_padel" headers={salesHeaders} />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{format(new Date(sale.sale_date), "dd/MM/yyyy HH:mm", { locale: es })}</TableCell>
                  <TableCell>${sale.total_amount.toFixed(2)}</TableCell>
                  <TableCell>{sale.payment_method || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteSale(sale.id)}>
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
