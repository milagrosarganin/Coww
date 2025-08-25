import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Ventas del Día</CardTitle>
          <CardDescription>Total de ventas hoy.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-green-600">$23,600</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Productos en Stock</CardTitle>
          <CardDescription>Cantidad total de productos.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-blue-600">48</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mesas Abiertas</CardTitle>
          <CardDescription>Mesas actualmente en uso.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-orange-600">1</p>
        </CardContent>
      </Card>
    </div>
  )
}
