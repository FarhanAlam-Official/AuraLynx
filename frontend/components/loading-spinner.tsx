'use client'

interface LoadingSpinnerProps {
  children: React.ReactNode
}

export default function LoadingSpinner({ children }: LoadingSpinnerProps) {
  return (
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}
