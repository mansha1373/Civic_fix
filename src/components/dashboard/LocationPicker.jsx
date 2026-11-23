import React, { useEffect, useRef, useState } from "react"
import L from "leaflet"
import { Icon } from "./Icons.jsx"

// Custom SVG Pin Icon for Leaflet matching CivicFix design identity
const createCivicPinIcon = () => {
  return L.divIcon({
    className: "cf-leaflet-custom-marker",
    html: `
      <div class="cf-leaflet-pin-wrapper">
        <div class="cf-leaflet-pin-bubble">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#281719" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#FFD20A" />
            <circle cx="12" cy="10" r="3" fill="#59343B" />
          </svg>
        </div>
        <div class="cf-leaflet-pin-pulse"></div>
      </div>
    `,
    iconSize: [36, 46],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40]
  })
}

// Preset locations in Tricity & surrounding region
export const REGIONAL_PRESETS = [
  {
    name: "Sector 17, Chandigarh",
    fullAddress: "Near Neelam Theatre, Sector 17-C, Chandigarh",
    lat: 30.7415,
    lng: 76.7794
  },
  {
    name: "Sector 22-B, Chandigarh",
    fullAddress: "Aroma Roundabout, Sector 22-B Market, Chandigarh",
    lat: 30.7298,
    lng: 76.7712
  },
  {
    name: "Sector 16, Chandigarh",
    fullAddress: "Rose Garden Gate 2 Walkway, Sector 16, Chandigarh",
    lat: 30.7485,
    lng: 76.7820
  },
  {
    name: "Phase 7, Mohali",
    fullAddress: "Main Commercial Belt, Phase 7, SAS Nagar, Mohali",
    lat: 30.7046,
    lng: 76.7179
  },
  {
    name: "Model Town, Karnal",
    fullAddress: "Opposite Community Park, Model Town, Karnal",
    lat: 29.6857,
    lng: 76.9905
  }
]

export default function LocationPicker({
  locationAddress,
  setLocationAddress,
  coordinates,
  setCoordinates,
  error
}) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)

  const [geoState, setGeoState] = useState({
    status: "idle", // 'idle' | 'locating' | 'success' | 'error'
    message: ""
  })

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Prevent re-initialization if map instance already exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize()
      return
    }

    const initialLat = coordinates?.lat || 30.7415
    const initialLng = coordinates?.lng || 76.7794

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      zoomControl: false,
      scrollWheelZoom: "center"
    })

    // Custom OpenStreetMap tile layer with warm tone
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map)

    // Position Zoom control in top-right
    L.control.zoom({ position: "topright" }).addTo(map)

    // Add Draggable Marker
    const marker = L.marker([initialLat, initialLng], {
      icon: createCivicPinIcon(),
      draggable: true,
      autoPan: true
    }).addTo(map)

    marker.bindPopup("<strong>Selected Issue Location</strong><br>Drag to adjust exact spot.").openPopup()

    // Handle marker drag
    marker.on("dragend", (e) => {
      const pos = e.target.getLatLng()
      const newCoords = { lat: Number(pos.lat.toFixed(5)), lng: Number(pos.lng.toFixed(5)) }
      setCoordinates(newCoords)
      // Provide a friendly default address if user hasn't typed one
      if (!locationAddress || locationAddress === "Sector 17, Chandigarh") {
        setLocationAddress(`Location at (${newCoords.lat}, ${newCoords.lng}), Chandigarh Region`)
      }
    })

    // Handle map click to reposition marker
    map.on("click", (e) => {
      const { lat, lng } = e.latlng
      const newCoords = { lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) }
      marker.setLatLng([lat, lng])
      setCoordinates(newCoords)
      if (!locationAddress || locationAddress === "Sector 17, Chandigarh") {
        setLocationAddress(`Selected landmark (${newCoords.lat}, ${newCoords.lng})`)
      }
    })

    mapInstanceRef.current = map
    markerRef.current = marker

    // Invalidate size after layout settles
    const timeout = setTimeout(() => {
      map.invalidateSize()
    }, 250)

    return () => {
      clearTimeout(timeout)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  // Pan to preset location
  const handleSelectPreset = (preset) => {
    setLocationAddress(preset.fullAddress)
    const newCoords = { lat: preset.lat, lng: preset.lng }
    setCoordinates(newCoords)

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([preset.lat, preset.lng], 15, { duration: 1.2 })
      markerRef.current.setLatLng([preset.lat, preset.lng])
      markerRef.current.bindPopup(`<strong>${preset.name}</strong><br>${preset.fullAddress}`).openPopup()
    }
  }

  // Handle HTML5 Browser Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoState({
        status: "error",
        message: "Geolocation is not supported by your current browser."
      })
      return
    }

    setGeoState({ status: "locating", message: "Acquiring GPS coordinates..." })

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(5))
        const lng = Number(position.coords.longitude.toFixed(5))
        const accuracy = Math.round(position.coords.accuracy)

        const newCoords = { lat, lng }
        setCoordinates(newCoords)
        setLocationAddress(`Current GPS Location (${lat}, ${lng}) - Sector Ward`)

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.4 })
          markerRef.current.setLatLng([lat, lng])
          markerRef.current.bindPopup(`<strong>Your Location</strong><br>Accuracy: within ${accuracy}m`).openPopup()
        }

        setGeoState({
          status: "success",
          message: `GPS location acquired (accurate within ${accuracy}m).`
        })
      },
      (err) => {
        let errMsg = "Unable to retrieve your location."
        if (err.code === 1) {
          errMsg = "Location access was denied. You can select your location on the map below or pick a preset."
        } else if (err.code === 2) {
          errMsg = "Location signal unavailable. Please pinpoint your street manually on the map."
        } else if (err.code === 3) {
          errMsg = "Location request timed out. Please try again or pick your sector from presets."
        }
        setGeoState({ status: "error", message: errMsg })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  return (
    <div className="cf-location-picker-wrapper">
      {/* Top Controls: Manual Address & GPS Geolocation */}
      <div className="cf-location-inputs-bar">
        <div className="cf-form-group flex-1">
          <label htmlFor="report-location-address" className="cf-field-label">
            Street Address or Landmark <span className="cf-required-star">*</span>
          </label>
          <div className="cf-input-with-icon">
            <Icon name="mapPin" size={18} className="input-icon" />
            <input
              id="report-location-address"
              type="text"
              className={`cf-input with-icon ${error ? "has-error" : ""}`}
              placeholder="e.g., Near Sector 17 Plaza fountain, Madhya Marg, Chandigarh"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              aria-required="true"
              aria-invalid={Boolean(error)}
            />
          </div>
          {error && <span className="cf-field-error-text">{error}</span>}
        </div>

        <div className="cf-gps-action-group">
          <label className="cf-field-label desktop-only">&nbsp;</label>
          <button
            type="button"
            className={`cf-button cf-gps-btn ${geoState.status === "locating" ? "busy" : ""}`}
            onClick={handleUseCurrentLocation}
            disabled={geoState.status === "locating"}
            title="Detect current device location using browser GPS"
          >
            <Icon name="locate" size={17} />
            <span>{geoState.status === "locating" ? "Locating..." : "Use Current Location"}</span>
          </button>
        </div>
      </div>

      {/* Geolocation feedback notification */}
      {geoState.status !== "idle" && (
        <div className={`cf-geo-alert ${geoState.status}`}>
          <Icon name={geoState.status === "success" ? "checkCircle" : "info"} size={16} />
          <span>{geoState.message}</span>
          <button
            type="button"
            className="cf-alert-close"
            onClick={() => setGeoState({ status: "idle", message: "" })}
            aria-label="Dismiss location message"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      {/* Quick Regional Sector Presets */}
      <div className="cf-location-preset-pills">
        <span className="cf-preset-hint">Quick Select Sector:</span>
        <div className="cf-presets-scroll">
          {REGIONAL_PRESETS.map((preset) => (
            <button
              type="button"
              key={preset.name}
              className={`cf-preset-pill ${locationAddress === preset.fullAddress ? "active" : ""}`}
              onClick={() => handleSelectPreset(preset)}
            >
              <Icon name="mapPin" size={13} />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Leaflet Map Canvas */}
      <div className="cf-leaflet-map-card">
        <div className="cf-map-banner-header">
          <div className="cf-map-banner-title">
            <span className="cf-live-dot" />
            <span>Interactive Map · OpenStreetMap</span>
          </div>
          <span className="cf-map-banner-sub">
            Drag marker or click anywhere on the map to pin issue
          </span>
        </div>

        <div
          ref={mapContainerRef}
          className="cf-leaflet-canvas"
          aria-label="Interactive map for selecting issue location"
        />

        {/* Selected Coordinates Chip */}
        <div className="cf-coordinates-bar">
          <div className="cf-coord-chip">
            <Icon name="locate" size={14} />
            <span>GPS Pin: <strong>{coordinates.lat}° N, {coordinates.lng}° E</strong></span>
          </div>
          <span className="cf-coord-note">
            Municipal crews receive exact geotagged coordinates.
          </span>
        </div>
      </div>
    </div>
  )
}
