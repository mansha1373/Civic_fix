import { TransitionLink } from "./TransitionProvider.jsx"

export default function Footer({ signupUrl, loginUrl }) {
  return (
    <footer className="cf-footer" id="civic-team">
      <div className="cf-foot-cta">
        <h2>Ready to fix your street?</h2>
        <TransitionLink className="cf-button" to={signupUrl}>Report an issue</TransitionLink>
      </div>

      <div className="cf-foot-grid">
        <div className="cf-foot-about">
          <a href="#civic-home" className="cf-brand">CivicFix<span>.</span></a>
          <p>A citizen-first platform to report civic issues, track every update and see problems resolved.</p>
        </div>
        <nav aria-label="Platform">
          <h4>Platform</h4>
          <a href="#civic-product">Overview</a>
          <a href="#civic-steps">How it works</a>
          <a href="#civic-features">Community impact</a>
        </nav>
        <nav aria-label="Issue categories">
          <h4>Categories</h4>
          <span>Potholes</span>
          <span>Damaged roads</span>
          <span>Drainage</span>
          <span>Garbage</span>
        </nav>
        <nav aria-label="Account">
          <h4>Account</h4>
          <TransitionLink to={loginUrl}>Log in</TransitionLink>
          <TransitionLink to={signupUrl}>Create account</TransitionLink>
        </nav>
      </div>

      <div className="cf-foot-bottom">
        <span>© {new Date().getFullYear()} CivicFix. All rights reserved.</span>
        <span>Citizen powered. India focused.</span>
      </div>
    </footer>
  )
}
