import React from "react"
import { Icon } from "./Icons.jsx"

export default function AiSuggestionCard({
  suggestion,
  analyzing,
  currentCategory,
  onApplySuggestion,
  onDismiss
}) {
  if (analyzing) {
    return (
      <div className="cf-ai-assistant-card analyzing">
        <div className="cf-ai-analyzing-spinner">
          <Icon name="sparkles" size={20} className="cf-sparkle-spin" />
        </div>
        <div className="cf-ai-analyzing-text">
          <strong>CivicFix AI Assistant is analyzing photograph...</strong>
          <small>Evaluating surface features, road contours and hazard markers</small>
        </div>
      </div>
    )
  }

  if (!suggestion) return null

  const isAlreadySelected = currentCategory === suggestion.categoryKey

  return (
    <div className="cf-ai-assistant-card">
      <div className="cf-ai-card-badge-row">
        <div className="cf-ai-badge">
          <Icon name="sparkles" size={15} color="#59343B" />
          <span>CivicFix AI Assistant</span>
        </div>
        <span className="cf-ai-simulation-tag">
          SIMULATED DEMO PREVIEW
        </span>
      </div>

      <div className="cf-ai-card-content">
        <div className="cf-ai-statement">
          Based on your uploaded photograph, this issue may be classified as:
          <span className="cf-ai-suggested-pill">
            <strong>{suggestion.label}</strong>
            <small>({suggestion.confidence}% simulated confidence)</small>
          </span>
        </div>

        <p className="cf-ai-explanation">
          "{suggestion.explanation}"
        </p>

        {suggestion.tags && suggestion.tags.length > 0 && (
          <div className="cf-ai-tags-row">
            <span className="cf-ai-tags-lbl">Visual markers detected:</span>
            {suggestion.tags.map((t) => (
              <span key={t} className="cf-ai-tag-chip">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="cf-ai-disclaimer">
          <Icon name="info" size={14} />
          <span>
            Demo Preview: A full computer vision endpoint can be integrated here.
            Your selected category will not be changed automatically.
          </span>
        </div>
      </div>

      <div className="cf-ai-actions-row">
        {!isAlreadySelected ? (
          <button
            type="button"
            className="cf-button cf-use-suggestion-btn"
            onClick={() => onApplySuggestion(suggestion.categoryKey)}
          >
            <Icon name="check" size={15} />
            <span>Use Suggestion: {suggestion.label}</span>
          </button>
        ) : (
          <div className="cf-ai-applied-tag">
            <Icon name="checkCircle" size={16} color="#15803D" />
            <span>Category is already set to {suggestion.label}</span>
          </div>
        )}

        <button
          type="button"
          className="cf-button dark cf-dismiss-btn"
          onClick={onDismiss}
        >
          Keep Manual Category
        </button>
      </div>
    </div>
  )
}
