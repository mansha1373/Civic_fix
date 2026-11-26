import { TransitionLink } from "./TransitionProvider.jsx"
import { useAuth } from "../auth/AuthContext.jsx"

export default function Navbar({ loginUrl, signupUrl }) {
  const { user } = useAuth()
  return (
    <nav className="cf-nav" aria-label="Main navigation">
      <a className="cf-brand" href="#civic-home">CivicFix<span style={{ color: "#A37A00" }}>.</span></a>
      <div className="cf-navlinks">
        <a href="#civic-product">The platform</a>
        <a href="#civic-steps">How it works</a>
        <a href="#civic-features">Community impact</a>
      </div>
      <div className="cf-actions">
        {user ? (
          <TransitionLink
            className="cf-button"
            to={user.role === "admin" ? "/admin" : "/dashboard"}
          >
            {user.role === "admin" ? "Admin Console" : "Dashboard"}
          </TransitionLink>
        ) : (
          <>
            <TransitionLink to={loginUrl}>Log in</TransitionLink>
            <TransitionLink className="cf-button" to={signupUrl}>Get started</TransitionLink>
          </>
        )}
      </div>
    </nav>
  )
}
