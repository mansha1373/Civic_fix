import { TransitionLink } from "./TransitionProvider.jsx"
import ImpactMap from "./ImpactMap.jsx"

export default function Impact({ signupUrl }) {
  return (
    <section className="cf-impact" id="civic-features">
      <div className="cf-impact-head">
        <div>
          <span className="cf-pill">THE DIFFERENCE, ON THE GROUND</span>
          <h2>Less talk.<br /><em>More streets transformed.</em></h2>
        </div>
        <p>Explore a sample neighbourhood.<br />Click an area to see what changed.<br /><small>Interactive demo · fictional reports and reviews</small></p>
      </div>
      <ImpactMap />
      <div className="cf-impact-cta">
        <strong>Your neighbourhood could be next.</strong>
        <TransitionLink className="cf-button dark" to={signupUrl}>Be part of the change</TransitionLink>
      </div>
    </section>
  )
}
