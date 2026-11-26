import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthContext.jsx"

/**
 * ProtectedRoute Guard
 * Ensures only authenticated users with authorized roles can access routes.
 * Supports role-based access for "citizen" and "admin".
 */
export default function ProtectedRoute({ children, allowedRoles = ["citizen"] }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFF9EA",
          color: "#59343B",
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              border: "3px solid #EAE3D5",
              borderTopColor: "#FFD20A",
              borderRadius: "50%",
              margin: "0 auto 12px",
              animation: "cf-spin 0.8s linear infinite"
            }}
          />
          <style>{`@keyframes cf-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>
            Verifying security session...
          </p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    const isTargetAdmin = allowedRoles.includes("admin") && !allowedRoles.includes("citizen")
    const loginPath = isTargetAdmin ? "/admin/login" : "/login"
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  // Authenticated but unauthorized role
  const userRole = user.role || "citizen"
  if (!allowedRoles.includes(userRole)) {
    if (userRole === "admin") {
      return <Navigate to="/admin" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}
