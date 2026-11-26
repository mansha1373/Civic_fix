import { createContext, useContext, useState, useEffect, useCallback } from "react"
import api from "../services/api.js"

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verify active JWT session with backend on startup
  const checkSession = useCallback(async () => {
    try {
      const res = await api.get("/auth/me")
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user)
      } else {
        setUser(null)
      }
    } catch {
      // No active or valid JWT session
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  /**
   * Register a new citizen account via real backend API
   */
  const signup = async (name, email, password) => {
    const res = await api.post("/auth/register", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    })

    if (res.data?.success && res.data?.user) {
      if (res.data.token) {
        localStorage.setItem("civicfix_token", res.data.token)
      }
      setUser(res.data.user)
      return res.data.user
    }
    throw new Error(res.data?.message || "Registration failed")
  }

  /**
   * Log in user with email & password via real backend API
   */
  const login = async (email, password) => {
    const res = await api.post("/auth/login", {
      email: email.trim().toLowerCase(),
      password
    })

    if (res.data?.success && res.data?.user) {
      if (res.data.token) {
        localStorage.setItem("civicfix_token", res.data.token)
      }
      setUser(res.data.user)
      return res.data.user
    }
    throw new Error(res.data?.message || "Login failed")
  }

  /**
   * Log in administrator with credentials via real backend API
   */
  const adminLogin = async (email, password) => {
    const res = await api.post("/auth/admin-login", {
      email: email.trim().toLowerCase(),
      password
    })

    if (res.data?.success && res.data?.user) {
      if (res.data.token) {
        localStorage.setItem("civicfix_token", res.data.token)
      }
      setUser(res.data.user)
      return res.data.user
    }
    throw new Error(res.data?.message || "Administrator authentication failed")
  }

  /**
   * Log out user & invalidate cookie session
   */
  const logout = async () => {
    try {
      await api.post("/auth/logout")
    } catch {
      // Proceed with client logout even if backend is temporarily unreachable
    } finally {
      localStorage.removeItem("civicfix_token")
      localStorage.removeItem("civicfix_session")
      setUser(null)
    }
  }

  /**
   * Refresh current user profile from backend
   */
  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me")
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user)
        return res.data.user
      }
    } catch (err) {
      console.warn("[AuthContext] Failed to refresh user profile:", err.message)
    }
    return null
  }

  /**
   * Google Identity Services login
   */
  const googleLogin = (credential) => {
    try {
      const b64 = credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
      const json = decodeURIComponent(
        atob(b64)
          .split("")
          .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("")
      )
      const p = JSON.parse(json)
      const googleUser = {
        id: `google_${Date.now()}`,
        name: p.name || p.email.split("@")[0],
        email: p.email,
        picture: p.picture,
        role: "citizen"
      }
      setUser(googleUser)
    } catch (err) {
      console.error("[AuthContext] Google credential parsing error:", err)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        signup,
        login,
        adminLogin,
        logout,
        refreshUser,
        googleLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
