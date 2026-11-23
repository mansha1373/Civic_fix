import { useState } from "react"
import { areas, metrics, levelOf, levelLabel, scoreOf } from "../data/areas.js"

const roads = "M-20 100H720M-20 260H720M160-20V420M420-20V420M620-20V420"

export default function ImpactMap() {
  const [selected, setSelected] = useState("s17")
  const [metric, setMetric] = useState("Overall")
  const a = areas.find((x) => x.id === selected)
  const overall = scoreOf(a, "Overall")
  const level = levelOf(overall)

  return (
    <div className="cf-impact-grid">
      <div className="cf-demo-map">
        <div className="cf-map-toolbar">
          <span>Click an area to see what improved</span>
          <b>DEMO MAP</b>
        </div>
        <div className="cf-map-filters" role="group" aria-label="Show improvement for">
          {metrics.map((m) => (
            <button key={m} className={metric === m ? "on" : ""} aria-pressed={metric === m} onClick={() => setMetric(m)}>{m}</button>
          ))}
        </div>
        <div className="cf-map-art">
          <svg viewBox="0 0 700 400" preserveAspectRatio="none" aria-hidden="true">
            <path d={roads} stroke="#FFFAEC" strokeWidth="27" />
            <path d={roads} stroke="#E8D9BC" strokeWidth="1" strokeDasharray="5 7" />
          </svg>
          {areas.map((x) => {
            const p = scoreOf(x, metric)
            return (
              <button
                key={x.id}
                className={"cf-area " + levelOf(p) + (selected === x.id ? " active" : "")}
                style={{ left: x.x + "%", top: x.y + "%", width: x.w + "%", height: x.h + "%" }}
                aria-pressed={selected === x.id}
                aria-label={x.name + ": " + p + "% of " + metric.toLowerCase() + " issues fixed"}
                onClick={() => setSelected(x.id)}
              >
                <span className="cf-area-name">{x.name}</span>
                <span className="cf-area-pct">{p}%</span>
              </button>
            )
          })}
        </div>
        <div className="cf-map-legend">
          <i className="high" /> Greatly improved <i className="mid" /> Improving <i className="low" /> Just starting
          <span>Illustrative data</span>
        </div>
      </div>

      <article className="cf-demo-review cf-area-detail" aria-live="polite">
        <span className="cf-pill">{levelLabel[level].toUpperCase()}</span>
        <h3 className="cf-area-title">{a.name}</h3>
        <div className="cf-area-big"><b>{overall}%</b><span>of reported issues fixed</span></div>
        <div className="cf-bars">
          {[["Roads", a.roads], ["Waste", a.waste], ["Drainage", a.drainage], ["Lights", a.lights]].map(([n, v]) => (
            <div key={n} className="cf-bar"><span>{n}</span><i><u className={levelOf(v)} style={{ width: v + "%" }} /></i><b>{v}%</b></div>
          ))}
        </div>
        <div className="cf-ba">
          <div><small>BEFORE</small><p>{a.before}</p></div>
          <div><small>NOW</small><p>{a.after}</p></div>
        </div>
        <div className="cf-area-stats"><span><b>{a.fixed}</b> issues fixed</span><span><b>{a.days} days</b> average fix time</span></div>
        <blockquote>“{a.quote}” <small>· {a.who}, sample voice</small></blockquote>
      </article>
    </div>
  )
}
