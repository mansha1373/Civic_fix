import { useEffect, useRef, useState } from "react"
import { config } from "../config.js"

const SRC = "https://accounts.google.com/gsi/client"

function loadGsi() {
  if (window.google?.accounts?.id) return Promise.resolve()
  return new Promise((resolve, reject) => {
    let tag = document.querySelector(`script[src="${SRC}"]`)
    if (!tag) {
      tag = document.createElement("script")
      tag.src = SRC; tag.async = true; tag.defer = true
      document.head.appendChild(tag)
    }
    tag.addEventListener("load", resolve)
    tag.addEventListener("error", () => reject(new Error("Could not load Google sign-in. Check your internet connection.")))
  })
}

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
)

export default function GoogleButton({ onCredential }) {
  const box = useRef(null)
  const handler = useRef(onCredential)
  handler.current = onCredential
  const [error, setError] = useState("")
  const id = config.googleClientId

  useEffect(() => {
    if (!id) return
    let live = true
    loadGsi().then(() => {
      if (!live || !box.current) return
      window.google.accounts.id.initialize({
        client_id: id,
        callback: (res) => {
          try { handler.current(res.credential) } catch { setError("Google sign-in failed. Please try again.") }
        },
      })
      window.google.accounts.id.renderButton(box.current, {
        theme: "outline", size: "large", shape: "pill", text: "continue_with",
        width: Math.min(400, box.current.offsetWidth || 400),
      })
    }).catch((e) => live && setError(e.message))
    return () => { live = false }
  }, [id])

  // No Client ID yet: show the button, explain what is missing when clicked.
  if (!id) {
    return (
      <div className="cf-google">
        <button type="button" className="cf-google-fallback" onClick={() => setError("Google sign-in needs a Client ID. Add VITE_GOOGLE_CLIENT_ID to a .env file and restart (steps are in the README).")}>
          <GoogleLogo /> Continue with Google
        </button>
        {error && <p className="cf-error" role="alert">{error}</p>}
      </div>
    )
  }
  return (
    <div className="cf-google">
      <div ref={box} className="cf-google-slot" />
      {error && <p className="cf-error" role="alert">{error}</p>}
    </div>
  )
}
