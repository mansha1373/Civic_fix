import { useState } from "react"
import AuthLayout from "./AuthLayout.jsx"
import { TransitionLink, useWaveNavigate } from "../components/TransitionProvider.jsx"
import { useAuth } from "../auth/AuthContext.jsx"
import GoogleButton from "../components/GoogleButton.jsx"

export default function Signup() {
  const { signup, googleLogin } = useAuth()
  const go = useWaveNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError("")
    if (form.name.trim().length < 2) return setError("Enter your full name.")
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email address.")
    if (form.password.length < 6) return setError("Password must be at least 6 characters.")
    if (form.password !== form.confirm) return setError("Passwords do not match.")
    setBusy(true)
    try {
      await signup(form.name, form.email, form.password)
      go("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      title="Make your voice count."
      subtitle="Create a free citizen account in a minute."
      footer={<>Already have an account? <TransitionLink to="/auth">Log in</TransitionLink></>}
    >
      <GoogleButton onCredential={(cred) => { googleLogin(cred); go("/dashboard") }} />
      <div className="cf-or"><span>or use email</span></div>
      <form className="cf-form" onSubmit={submit} noValidate>
        <label>Full name
          <input type="text" autoComplete="name" placeholder="Your name" value={form.name} onChange={set("name")} />
        </label>
        <label>Email
          <input type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
        </label>
        <label>Password
          <span className="cf-pass">
            <input type={show ? "text" : "password"} autoComplete="new-password" placeholder="At least 6 characters" value={form.password} onChange={set("password")} />
            <button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
          </span>
        </label>
        <label>Confirm password
          <input type={show ? "text" : "password"} autoComplete="new-password" placeholder="Repeat password" value={form.confirm} onChange={set("confirm")} />
        </label>
        {error && <p className="cf-error" role="alert">{error}</p>}
        <button className="cf-button cf-submit" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
      </form>
    </AuthLayout>
  )
}
