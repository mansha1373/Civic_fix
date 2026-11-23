import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import gsap from "gsap"

const TransitionContext = createContext(() => {})
export const useWaveNavigate = () => useContext(TransitionContext)

/** Wavy leading edge, drawn as an SVG path that is stretched to full height. */
function edgePath(phase) {
  const pts = []
  for (let y = 0; y <= 1000; y += 20) pts.push(`${(58 + 48 * Math.sin((y / 1000) * Math.PI * 6 + phase)).toFixed(1)} ${y}`)
  return `M120 0 L${pts.join(" L")} L120 1000 Z`
}

/** Link that slides a wave across the screen before changing page. */
export function TransitionLink({ to, children, ...props }) {
  const go = useWaveNavigate()
  const onClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    go(to)
  }
  return <a href={to} onClick={onClick} {...props}>{children}</a>
}

export default function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const l1 = useRef(null), l2 = useRef(null), brand = useRef(null), wrap = useRef(null)
  const busy = useRef(false)

  // keep the layers parked off-screen to the right
  useLayoutEffect(() => {
    gsap.set([l1.current, l2.current], { x: window.innerWidth + 140 })
  }, [])

  const go = useCallback((to) => {
    if (busy.current) return
    if (window.location.pathname === to) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      navigate(to); window.scrollTo(0, 0); return
    }
    busy.current = true
    const W = window.innerWidth
    const off = W + 140
    wrap.current.style.pointerEvents = "all"
    gsap.set([l1.current, l2.current], { x: off })
    gsap.set(brand.current, { opacity: 0, y: 20 })

    gsap.timeline({
      onComplete: () => {
        gsap.set([l1.current, l2.current], { x: off })
        wrap.current.style.pointerEvents = "none"
        busy.current = false
      },
    })
      // wave comes in from the right
      .to(l1.current, { x: 0, duration: 0.75, ease: "power3.inOut" })
      .to(l2.current, { x: 0, duration: 0.75, ease: "power3.inOut" }, 0.12)
      .to(brand.current, { opacity: 1, y: 0, duration: 0.3 }, 0.6)
      // swap the page while it is fully covered
      .call(() => { navigate(to); window.scrollTo(0, 0) })
      .to({}, { duration: 0.35 })
      // wave carries on to the left, revealing the new page
      .to(brand.current, { opacity: 0, duration: 0.2 })
      .to(l2.current, { x: -W - 10, duration: 0.75, ease: "power3.inOut" }, ">-0.1")
      .to(l1.current, { x: -W - 10, duration: 0.75, ease: "power3.inOut" }, "<0.12")
  }, [navigate])

  const value = useMemo(() => go, [go])

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div className="cf-wave" ref={wrap} aria-hidden="true">
        <div className="cf-wave-layer cf-wave-one" ref={l1}>
          <svg className="cf-wave-edge" viewBox="0 0 120 1000" preserveAspectRatio="none"><path d={edgePath(0)} /></svg>
        </div>
        <div className="cf-wave-layer cf-wave-two" ref={l2}>
          <svg className="cf-wave-edge" viewBox="0 0 120 1000" preserveAspectRatio="none"><path d={edgePath(1.6)} /></svg>
          <div className="cf-wave-brand" ref={brand}>CivicFix<span>.</span></div>
        </div>
      </div>
    </TransitionContext.Provider>
  )
}
