import Words from "./Words.jsx"
import { steps } from "../data/steps.js"

export default function Steps({ cloudImage }) {
  return (
    <section className="cf-steps" id="civic-steps">
      <div className="cf-steps-inner">
        <img className="cf-cloud" src={cloudImage} alt="" style={{ left: -110, top: -35 }} />
        <img className="cf-cloud" src={cloudImage} alt="" style={{ right: "20%", top: 240, width: 260 }} />
        <h2 data-words><Words text="People step in. Communities move forward." /></h2>
        <div className="cf-track">
          {steps.map(([title, desc, status], i) => (
            <article className="cf-step" key={title}>
              <div className="cf-step-num">{i + 1}</div>
              <div className="cf-step-copy">
                <small>{status}</small>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
