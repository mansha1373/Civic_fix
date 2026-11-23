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
      footer={<>New to CivicFix? <TransitionLink to="/signup">Create an account</TransitionLink></>}
    >
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
