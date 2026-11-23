import React from "react"
import { Icon } from "./Icons.jsx"
import { mockCategories } from "../../data/mockReports.js"

export default function CategorySelector({ selectedCategory, onSelectCategory, error }) {
  return (
    <div className="cf-category-selector-wrapper">
      <div className="cf-category-cards-grid" role="radiogroup" aria-label="Select civic issue category">
        {mockCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id

          return (
            <div
              key={cat.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              className={`cf-category-card ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectCategory(cat.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelectCategory(cat.id)
                }
              }}
            >
              <div className="cf-category-card-top">
                <div className="cf-category-card-icon">
                  <Icon name={cat.icon} size={22} />
                </div>
                {isSelected && (
                  <span className="cf-category-check-badge">
                    <Icon name="check" size={14} />
                  </span>
                )}
              </div>

              <div className="cf-category-card-body">
                <strong className="cf-category-card-title">{cat.label}</strong>
                <p className="cf-category-card-desc">{cat.description}</p>
              </div>

              <div className="cf-category-card-dept">
                <small>{cat.department.split(" ")[0]} Wing</small>
              </div>
            </div>
          )
        })}
      </div>

      {error && (
        <span className="cf-field-error-text" role="alert" style={{ marginTop: "8px", display: "block" }}>
          {error}
        </span>
      )}
    </div>
  )
}
