"use client"
import { useState } from "react"
import { useHorarios } from "@/hooks/use-horarios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default function HorariosPage() {
  const { items, loading, add } = useHorarios()
  const [form, setForm] = useState({ empleado: "", fecha: "", hora_inicio: "", hora_fin: "", notas: "" })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Cargar horas</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-5 gap-2">
          <Input placeholder="Empleado" value={form.empleado} onChange={(e) => setForm({ ...form, empleado: e.target.value })} />
          <Input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
          <Input type="time" value={form.hora_inicio} onChange={(e) => setForm({ ...form, hora_inicio: e.target.value })} />
          <Input type="time" value={form.hora_fin} onChange={(e) => setForm({ ...form, hora_fin: e.target.value })} />
          <div className="flex gap-2">
            <Input placeholder="Notas" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
            <Button onClick={async () => { await add(form); setForm({ empleado: "", fecha: "", hora_inicio: "", hora_fin: "", notas: "" }) }}>
              Guardar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Historial</CardTitle></CardHeader>
        <CardContent>
          {loading ? "Cargando..." : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.empleado}</TableCell>
                    <TableCell>{r.fecha}</TableCell>
                    <TableCell>{r.hora_inicio}</TableCell>
                    <TableCell>{r.hora_fin}</TableCell>
                    <TableCell>{r.notas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
