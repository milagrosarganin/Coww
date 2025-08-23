export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={`animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100 ${className || ""}`}
    ></div>
  )
}
