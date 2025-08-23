"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useArqueo } from "@/hooks/use-arqueo"

export default function ArqueoCaja() {
  const { arqueo, totales, loading, openShift, closeShift, refresh } = useArqueo()
  const [saldoInicial, setSaldoInicial] = useState<string>("0")
  const [saldoFinal, setSaldoFinal] = useState<string>("0")
  const [comentario, setComentario] = useState<string>("")

  if (loading) return <div className="p-4">Cargando...</div>

  if (!arqueo) {
    return (
      <Card>
        <CardHeader><CardTitle>Iniciar arqueo</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm">Saldo inicial</label>
            <Input type="number" value={saldoInicial} onChange={(e) => setSaldoInicial(e.target.value)} />
          </div>
          <Button onClick={async () => await openShift(Number(saldoInicial))}>Iniciar</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle>Arqueo abierto</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded bg-muted">
            <div className="font-semibold mb-1">Ventas</div>
            <div>Efectivo: ${totales?.ventas.efectivo.toFixed(2)}</div>
            <div>Tarjeta: ${totales?.ventas.tarjeta.toFixed(2)}</div>
            <div>Transferencia: ${totales?.ventas.transferencia.toFixed(2)}</div>
            <div>QR/MP: ${totales?.ventas.qr.toFixed(2)}</div>
            <div className="font-bold mt-1">Total ventas: ${totales?.ventas.total.toFixed(2)}</div>
          </div>
          <div className="p-3 rounded bg-muted">
            <div className="font-semibold mb-1">Gastos</div>
            <div>Efectivo: ${totales?.gastos.efectivo.toFixed(2)}</div>
            <div>Tarjeta: ${totales?.gastos.tarjeta.toFixed(2)}</div>
            <div>Transferencia: ${totales?.gastos.transferencia.toFixed(2)}</div>
            <div>QR/MP: ${totales?.gastos.qr.toFixed(2)}</div>
            <div className="font-bold mt-1">Total gastos: ${totales?.gastos.total.toFixed(2)}</div>
          </div>
        </div>

        <div className="p-3 rounded bg-muted">
          <div>Saldo inicial: ${Number(arqueo.saldo_inicial).toFixed(2)}</div>
          <div>Esperado en caja (efectivo): ${totales ? totales.esperadoEnCaja.toFixed(2) : "0.00"}</div>
          <div>Neto del día (ventas - gastos): ${totales ? totales.neto.toFixed(2) : "0.00"}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-sm">Saldo final contado</label>
            <Input type="number" value={saldoFinal} onChange={(e) => setSaldoFinal(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Comentario</label>
            <Input value={comentario} onChange={(e) => setComentario(e.target.value)} />
          </div>
          <div className="flex gap-2 items-end">
            <Button variant="secondary" onClick={refresh}>Actualizar</Button>
            <Button variant="destructive" onClick={async () => await closeShift(Number(saldoFinal), comentario)}>
              Cerrar arqueo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
