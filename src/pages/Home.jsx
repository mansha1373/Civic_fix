import { useRef } from "react"
import { config } from "../config.js"
import useScrollAnimations from "../hooks/useScrollAnimations.js"
import useBannerParallax from "../hooks/useBannerParallax.js"
import Navbar from "../components/Navbar.jsx"
import Hero from "../components/Hero.jsx"
import Steps from "../components/Steps.jsx"
import Impact from "../components/Impact.jsx"
import Footer from "../components/Footer.jsx"

export default function Home() {
  const root = useRef(null)
  useScrollAnimations(root)
  useBannerParallax(root)

  return (
    <div ref={root} className="cf">
      <div className="cf-progress" />
      <Navbar loginUrl={config.loginUrl} signupUrl={config.signupUrl} />
      <main>
        <Hero
          heading={config.heading}
          signupUrl={config.signupUrl}
          bannerImage={config.bannerImage}
          pineImage={config.pineImage}
        />
        <Steps cloudImage={config.cloudImage} />
        <Impact signupUrl={config.signupUrl} />
      </main>
      <Footer signupUrl={config.signupUrl} loginUrl={config.loginUrl} />
    </div>
  )
}
