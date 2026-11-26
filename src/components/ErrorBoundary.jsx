import React from "react"

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("[CivicFix ErrorBoundary Caught Error]:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#FFF9EA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            fontFamily: "Inter, sans-serif"
          }}
        >
          <div
            style={{
              maxWidth: "520px",
              width: "100%",
              backgroundColor: "#FFFFFF",
              border: "1px solid #EAE3D5",
              borderRadius: "24px",
              padding: "36px",
              boxShadow: "0 10px 30px rgba(40,23,25,0.06)",
              textAlign: "center"
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: "#FAECEE",
                color: "#8C2329",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: "24px",
                fontWeight: "bold"
              }}
            >
              ⚠
            </div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                color: "#281719",
                marginBottom: "10px"
              }}
            >
              Application Error Encountered
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "#695154",
                lineHeight: "1.6",
                marginBottom: "20px"
              }}
            >
              CivicFix caught a runtime error. Your session and data in MongoDB remain secure.
            </p>
            {this.state.error?.message && (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#FAECEE",
                  border: "1px solid #EFC3C6",
                  borderRadius: "12px",
                  color: "#8C2329",
                  fontSize: "12px",
                  textAlign: "left",
                  marginBottom: "24px",
                  wordBreak: "break-word"
                }}
              >
                {this.state.error.message}
              </div>
            )}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.href = "/dashboard"
                }}
                style={{
                  padding: "12px 20px",
                  backgroundColor: "#FFD20A",
                  color: "#281719",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                Return to Dashboard
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  padding: "12px 20px",
                  backgroundColor: "#59343B",
                  color: "#FFF9EA",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
