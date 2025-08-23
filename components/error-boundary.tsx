"use client"

import { Button } from "@/components/ui/button"

import React, { type ErrorInfo } from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Actualiza el estado para que el siguiente renderizado muestre la UI de fallback.
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // También puedes registrar el error en un servicio de informes de errores
    console.error("ErrorBoundary capturó un error:", error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier UI de fallback personalizada
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 p-4 text-red-800">
          <h1 className="mb-4 text-2xl font-bold">¡Algo salió mal!</h1>
          <p className="mb-4 text-center">
            Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta recargar la página.
          </p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="w-full max-w-lg rounded-md bg-red-100 p-4 text-sm">
              <summary className="cursor-pointer font-semibold">Detalles del Error</summary>
              <pre className="mt-2 whitespace-pre-wrap break-words font-mono text-xs">
                {this.state.error.toString()}
                <br />
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
          <Button onClick={() => window.location.reload()} className="mt-6">
            Recargar Página
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
