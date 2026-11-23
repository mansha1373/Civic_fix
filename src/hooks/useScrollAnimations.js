import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger)

/** GSAP scroll effects + Lenis smooth scrolling for the whole page. */
export default function useScrollAnimations(rootRef) {
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let lenis, ticker
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const ctx = gsap.context(() => {
      if (reduced) { el.classList.add("runtime-reduced"); return }


      gsap.from(".cf-hero h1", { y: 30, opacity: 0, duration: 0.8, delay: 0.65 })

      el.querySelectorAll("[data-words]").forEach((h) => {
        gsap.fromTo(h.querySelectorAll("span"), { opacity: 0.12 }, {
          opacity: 1, stagger: 0.1, ease: "none",
          scrollTrigger: { trigger: h, start: "top 92%", end: "top 30%", scrub: 1.8 },
        })
      })

      el.querySelectorAll("[data-count]").forEach((n) => {
        const target = Number(n.getAttribute("data-count"))
        const suffix = n.getAttribute("data-suffix") || ""
        const o = { v: 0 }
        gsap.to(o, {
          v: target, ease: "none",
          scrollTrigger: { trigger: n, start: "top 95%", end: "top 35%", scrub: 1.8 },
          onUpdate: () => { n.textContent = Math.round(o.v).toLocaleString() + suffix },
        })
      })

      gsap.to(".cf-pine", { y: -85, ease: "none", scrollTrigger: { trigger: ".cf-tickets", start: "top 70%", end: "bottom top", scrub: 1.8 } })
      gsap.from(".cf-footer", { y: 25, ease: "none", scrollTrigger: { trigger: ".cf-footer", start: "top bottom", end: "top 65%", scrub: 1.8 } })
      gsap.from(".cf-impact-head", { y: 18, opacity: 0, scrollTrigger: { trigger: ".cf-impact", start: "top 95%", end: "top 65%", scrub: 1.8 } })

      // Pinned horizontal "how it works" track (desktop only)
      const mm = gsap.matchMedia()
      mm.add("(min-width: 768px)", () => {
        const track = el.querySelector(".cf-track")
        gsap.to(track, {
          x: () => -(track.scrollWidth - el.clientWidth), ease: "none",
          scrollTrigger: {
            trigger: ".cf-steps-inner", pin: true, scrub: 2, start: "top top",
            end: () => "+=" + Math.round(track.scrollWidth * 1.6), invalidateOnRefresh: true,
          },
        })
      })

      gsap.to(".cf-cloud", { x: 40, ease: "none", scrollTrigger: { trigger: ".cf-steps", start: "top bottom", end: "bottom top", scrub: 1.8 } })
    }, el)

    ScrollTrigger.refresh()

    if (!reduced) {
      lenis = new Lenis({ duration: 1.55, wheelMultiplier: 0.65, touchMultiplier: 0.85, smoothWheel: true })
      lenis.on("scroll", ScrollTrigger.update)
      ticker = (t) => lenis.raf(t * 1000)
      gsap.ticker.add(ticker)
      gsap.ticker.lagSmoothing(0)
    }

    // top progress bar + sticky nav background
    const progress = () => {
      const r = el.getBoundingClientRect()
      const p = Math.max(0, Math.min(1, -r.top / (el.offsetHeight - innerHeight)))
      const bar = el.querySelector(".cf-progress")
      if (bar) bar.style.transform = "scaleX(" + p + ")"
      el.querySelector(".cf-nav")?.classList.toggle("scrolled", r.top < -40)
    }
    window.addEventListener("scroll", progress, { passive: true })
    progress()

    return () => {
      window.removeEventListener("scroll", progress)
      ctx.revert()
      if (ticker) gsap.ticker.remove(ticker)
      lenis?.destroy()
    }
  }, [rootRef])
}
