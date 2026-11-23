import { TransitionLink } from "../components/TransitionProvider.jsx"

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="cf cf-auth-page">
      <aside className="cf-auth-side">
        <TransitionLink to="/" className="cf-brand">CivicFix<span>.</span></TransitionLink>
        <div className="cf-auth-pitch">
          <span className="cf-pill">CITIZEN POWERED. INDIA FOCUSED.</span>
          <h2>Spot it.<br />Report it.<br /><em>Help fix it.</em></h2>
          <p>Join your neighbours in turning everyday problems into resolved reports.</p>
        </div>
        <div className="cf-report-float cf-auth-card">
          <span className="cf-status-tag">Resolved</span>
          <strong>One cleaner street.<br />A thousand better journeys.</strong>
          <p>Small action. Real impact.</p>
        </div>
      </aside>

      <main className="cf-auth-main">
        <div className="cf-auth-box">
          <TransitionLink to="/" className="cf-auth-back">← Back to home</TransitionLink>
          <h1>{title}</h1>
          <p className="cf-auth-sub">{subtitle}</p>
          {children}
          <p className="cf-auth-switch">{footer}</p>
        </div>
      </main>
    </div>
  )
}
