import { useEffect } from "react"

/** Drives --travel / --lift CSS variables on the hero banner from scroll position. */
export default function useBannerParallax(rootRef) {
  useEffect(() => {
    const el = rootRef.current
    const scene = el?.querySelector(".cf-india-banner")
    if (!scene) return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0
    const update = () => {
      frame = 0
      if (media.matches) {
        scene.style.setProperty("--travel", "0px")
        scene.style.setProperty("--lift", "0px")
        return
      }
      const r = scene.getBoundingClientRect()
      const t = Math.max(0, Math.min(1, -r.top / (r.height * 1.35)))
      scene.style.setProperty("--travel", t * 45 + "px")
      scene.style.setProperty("--lift", -t * 65 + "px")
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener("scroll", onScroll, { passive: true })
    media.addEventListener("change", onScroll)
    update()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      media.removeEventListener("change", onScroll)
    }
  }, [rootRef])
}
