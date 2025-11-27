import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the base URL for backend API requests.
 *
 * Reads NEXT_PUBLIC_API_URL from the environment and falls back to
 * http://localhost:8000/api for local development if not set.
 */
export function getApiBaseUrl(): string {
  const fromEnv =
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_API_URL
      : undefined

  return (fromEnv || 'http://localhost:8000/api').replace(/\/+$/, '')
}

/**
 * Helper to build fully-qualified API URLs from a relative path.
 */
export function buildApiUrl(path: string): string {
  const base = getApiBaseUrl()
  const cleanedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${cleanedPath}`
}
