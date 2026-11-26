import { useState } from "react"
import AuthLayout from "./AuthLayout.jsx"
import { TransitionLink, useWaveNavigate } from "../components/TransitionProvider.jsx"
import { useAuth } from "../auth/AuthContext.jsx"
import GoogleButton from "../components/GoogleButton.jsx"

export default function Login() {
  const { login, googleLogin } = useAuth()
  const go = useWaveNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError("")
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email address.")
    if (!form.password) return setError("Enter your password.")
    setBusy(true)
    try {
      await login(form.email, form.password)
      go("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Log in to track your reports."
      footer={
        <>
          New to CivicFix? <TransitionLink to="/signup">Create an account</TransitionLink>
          <span style={{ margin: "0 8px", color: "#e9dfc2" }}>•</span>
          <TransitionLink to="/admin/login" style={{ fontWeight: 600, color: "#59343B" }}>
            Admin Portal →
          </TransitionLink>
        </>
      }
    >
      {/* Role Selection Switcher */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px",
          marginBottom: "16px",
          padding: "4px",
          backgroundColor: "#FFF9EA",
          border: "1px solid #EAE3D5",
          borderRadius: "14px"
        }}
      >
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: "700",
            textAlign: "center",
            backgroundColor: "#59343B",
            color: "#FFF9EA",
            boxShadow: "0 1px 2px rgba(0,0,0,0.08)"
          }}
        >
          Citizen / Resident
        </div>
        <button
          type="button"
          onClick={() => go("/admin/login")}
          style={{
            padding: "8px 12px",
            borderRadius: "10px",
            border: "none",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            backgroundColor: "transparent",
            color: "#59343B",
            transition: "all 0.15s ease"
          }}
        >
          Municipal Admin →
        </button>
      </div>

      <GoogleButton onCredential={(cred) => { googleLogin(cred); go("/dashboard") }} />
      <div className="cf-or"><span>or use email</span></div>
      <form className="cf-form" onSubmit={submit} noValidate>
        <label>Email
          <input type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
        </label>
        <label>Password
          <span className="cf-pass">
            <input type={show ? "text" : "password"} autoComplete="current-password" placeholder="Your password" value={form.password} onChange={set("password")} />
            <button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
          </span>
        </label>
        {error && <p className="cf-error" role="alert">{error}</p>}
        <button className="cf-button cf-submit" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
      </form>
    </AuthLayout>
  )
}
