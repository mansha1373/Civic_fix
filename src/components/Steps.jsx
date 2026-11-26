import React, { useState, useEffect, useRef } from "react"
import Words from "./Words.jsx"
import { steps } from "../data/steps.js"

export default function Steps({ cloudImage }) {
  const [currentStep, setCurrentStep] = useState(0)
  const timerRef = useRef(null)

  const totalSteps = steps.length // Exactly 5 original steps

  // Fully automatic 4000ms infinite loop: Step 1 -> 2 -> 3 -> 4 -> 5 -> 1
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % totalSteps)
    }, 4000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [totalSteps])

  return (
    <section className="cf-steps-fullwidth-section" id="civic-steps">
      <div className="cf-steps-fullwidth-inner">
        {/* Decorative cloud assets preserved */}
        {cloudImage && (
          <>
            <img className="cf-cloud" src={cloudImage} alt="" style={{ left: -110, top: -35 }} />
            <img className="cf-cloud" src={cloudImage} alt="" style={{ right: "12%", top: 120, width: 260 }} />
          </>
        )}

        {/* Section Header */}
        <div className="cf-steps-main-header">
          <span className="cf-pill">STEPS TO CHANGE SOCIETY</span>
          <h2 data-words>
            <Words text="People step in. Communities move forward." />
          </h2>
          <p className="cf-steps-main-subhead">
            The five-stage civic redressal pipeline connecting citizens to verified municipal results.
          </p>
        </div>

        {/* Full-Width Seamless Automatic Slider Viewport */}
        <div className="cf-fullwidth-slider-viewport">
          <div
            className="cf-fullwidth-slider-track"
            style={{
              transform: `translateX(-${currentStep * 100}%)`
            }}
          >
            {steps.map(([title, desc, status], i) => (
              <div
                className={`cf-fullwidth-slide ${currentStep === i ? "is-active" : ""}`}
                key={title}
              >
                <div className={`cf-step-presentation cf-step-theme-${i + 1}`}>
                  {/* Huge Fraunces Numeral */}
                  <div className="cf-step-huge-num-box">
                    <span className="cf-step-huge-num">{i + 1}</span>
                  </div>

                  {/* Step Detailed Content */}
                  <div className="cf-step-detail-box">
                    <div className="cf-step-meta-row">
                      <span className="cf-step-status-tag">{status}</span>
                      <span className="cf-step-index-label">
                        Phase 0{i + 1} of 0{totalSteps}
                      </span>
                    </div>

                    <h3 className="cf-step-main-title">{title}</h3>
                    <p className="cf-step-main-desc">{desc}</p>

                    {/* Elegant 4-Second Automatic Progression Bar */}
                    <div className="cf-step-progression-bar">
                      <div className="cf-step-progress-track">
                        <div
                          className="cf-step-progress-fill"
                          key={`progress-${currentStep}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full-Width Bottom Step Tracker strip (Visual feedback for all 5 stages) */}
        <div className="cf-steps-overview-strip">
          {steps.map(([title, , status], i) => (
            <div
              key={title}
              className={`cf-overview-step-tab ${currentStep === i ? "active" : ""}`}
            >
              <div className="cf-tab-indicator" />
              <div className="cf-tab-text">
                <span className="cf-tab-num">0{i + 1}</span>
                <span className="cf-tab-title">{title}</span>
                <span className="cf-tab-status">{status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
