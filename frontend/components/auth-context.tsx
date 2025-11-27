"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { buildApiUrl } from "@/lib/utils"

interface AuthContextValue {
  accessToken: string | null
  user: { id: number; username: string; email?: string } | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthContextValue["user"]>(null)

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("auralynx_token") : null
    if (storedToken) {
      setAccessToken(storedToken)
      fetchMe(storedToken).catch(() => {
        localStorage.removeItem("auralynx_token")
        setAccessToken(null)
      })
    }
  }, [])

  const fetchMe = async (token: string) => {
    const res = await fetch(buildApiUrl("/auth/me/"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (res.ok) {
      const data = await res.json()
      setUser(data)
    }
  }

  const login = async (username: string, password: string) => {
    const res = await fetch(buildApiUrl("/auth/token/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) {
      throw new Error("Invalid username or password")
    }
    const data = await res.json()
    const token = data.access as string
    setAccessToken(token)
    if (typeof window !== "undefined") {
      localStorage.setItem("auralynx_token", token)
    }
    await fetchMe(token)
  }

  const register = async (username: string, email: string, password: string) => {
    const res = await fetch(buildApiUrl("/auth/register/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data?.detail || "Registration failed")
    }
    // After successful registration, log the user in
    await login(username, password)
  }

  const logout = () => {
    setAccessToken(null)
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("auralynx_token")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}


