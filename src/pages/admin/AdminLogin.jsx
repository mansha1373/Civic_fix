import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, X } from "lucide-react"
import { useAuth } from "../../auth/AuthContext.jsx"

export default function AdminLogin() {
  const { adminLogin } = useAuth()
  const navigate = useNavigate()

  // Strict Security Requirement: Inputs must mount completely empty with no pre-filled credentials
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Please enter your admin email address.")
      return
    }
    if (!password) {
      setError("Please enter your admin access password.")
      return
    }

    setLoading(true)
    try {
      await adminLogin(email.trim(), password)
      // Clear inputs upon successful login
      setEmail("")
      setPassword("")
      navigate("/admin")
    } catch (err) {
      setError(err.message || "Invalid administrator credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cf-admin-login-wrapper min-h-screen bg-[#FFF9EA] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Top-Right Close (X) Button to Return to Main Landing Page */}
      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Back to Home"
        title="Back to Home"
        className="absolute top-5 right-5 sm:top-7 sm:right-7 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-[#59343B] hover:text-[#281719] border border-[#EAE3D5] shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer group"
      >
        <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90 stroke-[2.2]" />
      </button>

      {/* Subtle Warm Brand Aura */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#FFD20A]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#59343B]/10 blur-3xl pointer-events-none" />

      {/* Main Login Card - Clean White with Soft Beige Border */}
      <div className="cf-admin-login-card w-full max-w-md bg-white border border-[#EAE3D5] rounded-3xl p-8 shadow-civic relative z-10 space-y-6 text-[#281719]">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="cf-admin-logo-badge w-16 h-16 rounded-2xl bg-[#59343B] flex items-center justify-center shadow-lg shadow-[#59343B]/20 mx-auto text-[#FFD20A]">
            <ShieldCheck className="w-9 h-9 stroke-[2.2]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#281719] font-serif tracking-tight">
            CivicFix<span className="text-[#FFD20A]">.</span> Admin
          </h2>
          <p className="text-xs text-[#695154]">
            Municipal Corporation Grievance Redressal Portal
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="cf-role-switcher p-1 rounded-2xl bg-[#FFF9EA] border border-[#EAE3D5] grid grid-cols-2 text-center text-xs font-bold">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="py-2.5 rounded-xl text-[#59343B] hover:text-[#281719] transition"
          >
            Citizen / User
          </button>
          <div className="py-2.5 rounded-xl bg-[#59343B] text-white shadow-sm flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FFD20A]" />
            <span>Administrator</span>
          </div>
        </div>

        {/* Official Verification Notice */}
        <div className="p-3.5 rounded-2xl bg-[#FFF9EA] border border-[#EAE3D5] text-[#281719] space-y-1">
          <p className="font-bold text-xs flex items-center gap-1.5 text-[#59343B]">
            <CheckCircle2 className="w-4 h-4 text-[#236336]" />
            Authorized Personnel Only
          </p>
          <p className="text-[11px] text-[#695154] leading-relaxed">
            Admin accounts are securely verified by the backend with bcrypt hashing and JWT role validation.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#FAECEE] border border-[#EFC3C6] text-[#8C2329] text-xs flex items-center gap-2 font-bold animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#281719] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#59343B] absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@civicfix.gov"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] placeholder-[#695154] focus:outline-none focus:ring-2 focus:ring-[#59343B] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#281719] mb-1.5">
              Access Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#59343B] absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3D5] bg-[#FFF9EA] text-[#281719] placeholder-[#695154] focus:outline-none focus:ring-2 focus:ring-[#59343B] font-medium"
              />
            </div>
          </div>

          {/* Primary Submit Button: Civic Yellow (#FFD20A) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#FFD20A] hover:bg-[#EBBF00] text-[#281719] font-bold text-xs shadow-md shadow-[#281719]/10 transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <span>{loading ? "Authenticating Administrator…" : "Sign In to Admin Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center space-y-2 border-t border-[#EAE3D5]">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-xs font-semibold text-[#59343B] hover:text-[#281719] hover:underline transition block w-full cursor-pointer"
          >
            ← Switch to Citizen / Resident Login
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-[11px] text-[#695154] hover:text-[#281719] transition block w-full cursor-pointer"
          >
            Return to Public Homepage
          </button>
        </div>

        <p className="text-center text-[11px] text-[#695154]">
          CivicFix Municipal Platform • Unified Design System
        </p>
      </div>
    </div>
  )
}
