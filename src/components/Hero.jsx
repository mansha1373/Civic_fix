import { TransitionLink } from "./TransitionProvider.jsx"
import Words from "./Words.jsx"
import { stats, categories } from "../data/steps.js"

const icons = [
  <><ellipse cx="12" cy="14" rx="9" ry="4" /><path d="m5 5 2 3m12-3-2 3M12 3v4" /></>,
  <path d="m7 3-4 18m14-18 4 18M12 3v4m0 3v4m0 3v4" />,
  <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M7 7v10m5-10v10m5-10v10" /></>,
  <path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" />,
]

export default function Hero({ heading, signupUrl, bannerImage, pineImage }) {
  return (
    <section className="cf-hero" id="civic-home">
      <div className="cf-india-banner">
        <img className="cf-city-banner" src={bannerImage} alt="An Indian neighbourhood with clean streets, local shops, solar rooftops and a public park" />
        <div className="cf-banner-wash" />
        <div className="cf-civic-copy">
          <span className="cf-pill"><i className="cf-live-dot" /> CITIZEN POWERED. INDIA FOCUSED.</span>
          <h1>{heading}<br /><em>Your say.</em></h1>
          <p className="cf-civic-description">A pothole fixed. A street cleaned. A neighbourhood transformed. India moves forward when we do.</p>
          <div className="cf-civic-buttons">
            <TransitionLink className="cf-button" to={signupUrl}>Report an issue</TransitionLink>
            <a className="cf-secondary" href="#civic-steps">See how change happens</a>
          </div>
          <div className="cf-civic-promise"><span>Spot it.</span><i /><span>Report it.</span><i /><span>Help fix it.</span></div>
        </div>

        <div className="cf-report-float cf-report-one">
          <div className="cf-report-top"><span className="cf-live-dot" /><small>COMMUNITY REPORT</small><span>01</span></div>
          <strong>Safer roads start here.</strong>
          <p>Pothole spotted · Location added</p>
          <div className="cf-report-bottom"><span className="cf-status-tag">Reported</span><span>Chandigarh, Punjab</span></div>
        </div>
        <div className="cf-map-pin cf-pin-one"><span /></div>
        <div className="cf-map-pin cf-pin-two"><span /></div>
        <div className="cf-report-float cf-report-two">
          <span className="cf-status-tag">Resolved</span>
          <strong>One cleaner street.<br />A thousand better journeys.</strong>
          <p>Small action. Real impact.</p>
        </div>

      
        <div className="cf-banner-caption">YOUR STREET. YOUR VOICE. OUR INDIA.</div>
        <div className="cf-hero-stamp">NOT JUST<br />A REPORT.<br /><b>A START.</b></div>
        <div className="cf-action-ribbon"><span>01 / SPOT A PROBLEM</span><span>02 / MAKE IT HEARD</span><span>03 / MOVE INDIA FORWARD</span></div>
      </div>

      <div id="civic-product">
        <h2 className="cf-stats-title" data-words><Words text="Every report is a step towards a better tomorrow." /></h2>
        <div className="cf-tickets">
          {stats.map(([label, num, count, suffix]) => (
            <div className="cf-ticket" key={label}>
              <small>{label}</small>
              <div className="cf-number" data-count={count} data-suffix={suffix}>{num}</div>
            </div>
          ))}
        </div>
        <div className="cf-strip">
          {categories.map((x, i) => (
            <span key={x}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{icons[i]}</svg>
              {x}
            </span>
          ))}
        </div>
        <p className="cf-demo">Illustrative platform metrics · not live usage data</p>
      </div>
      <img className="cf-pine" src={pineImage} alt="" />
    </section>
  )
}
