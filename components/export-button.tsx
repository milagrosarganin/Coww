"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"
import { useToast } from "@/hooks/use-toast"

interface ExportButtonProps {
  data: Record<string, any>[]
  fileName: string
  sheetName?: string
  headers?: { key: string; label: string }[] // Optional headers for specific order/labels
}

export function ExportButton({ data, fileName, sheetName = "Data", headers }: ExportButtonProps) {
  const { toast } = useToast()

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast({
        title: "No hay datos para exportar",
        description: "La tabla está vacía.",
        variant: "destructive",
      })
      return
    }

    try {
      let exportData = data

      // If headers are provided, map data to match the header order and labels
      if (headers && headers.length > 0) {
        exportData = data.map((row) => {
          const newRow: Record<string, any> = {}
          headers.forEach((header) => {
            newRow[header.label] = row[header.key]
          })
          return newRow
        })
      }

      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, sheetName)
      XLSX.writeFile(wb, `${fileName}.xlsx`)
      toast({
        title: "Exportación exitosa",
        description: `Los datos se han exportado a ${fileName}.xlsx`,
      })
    } catch (error) {
      console.error("Error al exportar:", error)
      toast({
        title: "Error de exportación",
        description: "No se pudieron exportar los datos. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button onClick={handleExport} className="flex items-center gap-2">
      <Download className="h-4 w-4" />
      Exportar a Excel
    </Button>
  )
}
