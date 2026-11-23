import React, { useRef, useState, useEffect } from "react"
import { Icon } from "./Icons.jsx"
import {
  validateImageFile,
  createPreviewUrl,
  revokePreviewUrl,
  formatBytes,
  compressImageForStorage
} from "../../utils/imageUtils.js"

export default function ImageUploader({
  photos = [],
  setPhotos,
  onPhotoAdded,
  error
}) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [processing, setProcessing] = useState(false)

  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      photos.forEach((p) => {
        if (p.previewUrl) {
          revokePreviewUrl(p.previewUrl)
        }
      })
    }
  }, [])

  // Process incoming files (from file input, camera, or drag-and-drop)
  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return

    setUploadError("")
    const incoming = Array.from(fileList)

    // Check maximum total images limit (e.g., 5 photos)
    if (photos.length + incoming.length > 5) {
      setUploadError("You can upload a maximum of 5 photographs per complaint.")
      return
    }

    setProcessing(true)
    const newItems = []
    let firstAdded = null

    for (const file of incoming) {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setUploadError(validation.error || "Invalid file detected.")
        continue
      }

      // Check if file is already added
      const isDuplicate = photos.some(
        (p) => p.name === file.name && p.size === file.size
      )
      if (isDuplicate) {
        setUploadError(`"${file.name}" has already been uploaded.`)
        continue
      }

      // Generate instant preview via Object URL
      const previewUrl = createPreviewUrl(file)

      // Generate compressed thumbnail for reliable localStorage persistence
      const compressedDataUrl = await compressImageForStorage(file)

      const photoItem = {
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file,
        previewUrl,
        storageThumbnail: compressedDataUrl
      }

      newItems.push(photoItem)
      if (!firstAdded) firstAdded = photoItem
    }

    setProcessing(false)

    if (newItems.length > 0) {
      const updated = [...photos, ...newItems]
      setPhotos(updated)
      if (onPhotoAdded && firstAdded) {
        onPhotoAdded(firstAdded)
      }
    }
  }

  // Remove individual photo
  const handleRemovePhoto = (idToRemove) => {
    const toRemove = photos.find((p) => p.id === idToRemove)
    if (toRemove && toRemove.previewUrl) {
      revokePreviewUrl(toRemove.previewUrl)
    }
    setPhotos(photos.filter((p) => p.id !== idToRemove))
  }

  // Drag-and-drop events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  return (
    <div className="cf-image-uploader-wrapper">
      {/* Hidden Native File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="cf-hidden-input"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ""
        }}
        aria-label="Upload photographs from file browser"
      />

      {/* Mobile Camera Dedicated Input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="cf-hidden-input"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ""
        }}
        aria-label="Capture photograph directly with camera"
      />

      {/* Main Drag-and-Drop Dropzone */}
      <div
        className={`cf-dropzone-box ${dragActive ? "drag-active" : ""} ${
          error || uploadError ? "has-error" : ""
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click()
          }
        }}
        aria-label="Drag and drop photos here or click to browse"
      >
        <div className="cf-dropzone-inner">
          <div className="cf-dropzone-icon-circle">
            <Icon name="camera" size={28} />
          </div>

          <div className="cf-dropzone-copy">
            <strong className="cf-dropzone-heading">
              {dragActive ? "Drop your images here" : "Drag & drop photos here, or browse files"}
            </strong>
            <p className="cf-dropzone-sub">
              Upload clear photographs of the pothole, waste dump, or broken infrastructure.
            </p>
            <span className="cf-dropzone-meta">
              Formats: <strong>JPG, PNG, WebP</strong> · Max <strong>10MB</strong> per photo · Up to <strong>5 photos</strong>
            </span>
          </div>

          <div
            className="cf-dropzone-action-buttons"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="cf-button cf-browse-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={processing}
            >
              <Icon name="upload" size={16} />
              <span>Browse Gallery / Files</span>
            </button>

            <button
              type="button"
              className="cf-button dark cf-camera-btn"
              onClick={() => cameraInputRef.current?.click()}
              disabled={processing}
              title="Open camera on mobile device to capture live photo"
            >
              <Icon name="camera" size={16} />
              <span>Take Photo with Camera</span>
            </button>
          </div>
        </div>

        {processing && (
          <div className="cf-upload-processing-overlay">
            <span className="cf-spinner" />
            <span>Processing and optimizing images...</span>
          </div>
        )}
      </div>

      {/* Error Feedback */}
      {(uploadError || error) && (
        <div className="cf-uploader-error-alert" role="alert">
          <Icon name="alertTriangle" size={17} color="#B91C1C" />
          <span>{uploadError || error}</span>
          {uploadError && (
            <button
              type="button"
              className="cf-alert-close"
              onClick={() => setUploadError("")}
              aria-label="Dismiss error"
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
      )}

      {/* Uploaded Photographs Gallery Preview */}
      {photos.length > 0 && (
        <div className="cf-uploaded-gallery">
          <div className="cf-gallery-header">
            <span className="cf-gallery-count">
              <Icon name="image" size={15} />
              <span>
                Uploaded Photographs ({photos.length} / 5)
              </span>
            </span>
            <span className="cf-gallery-tip">
              The first photograph serves as the primary municipal work ticket thumbnail.
            </span>
          </div>

          <div className="cf-gallery-grid">
            {photos.map((item, index) => (
              <div key={item.id} className="cf-gallery-card">
                <div className="cf-gallery-media">
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    loading="lazy"
                  />
                  {index === 0 && (
                    <span className="cf-primary-photo-tag">Primary</span>
                  )}
                  <button
                    type="button"
                    className="cf-remove-photo-btn"
                    onClick={() => handleRemovePhoto(item.id)}
                    title={`Remove ${item.name}`}
                    aria-label={`Remove photo ${item.name}`}
                  >
                    <Icon name="close" size={14} />
                  </button>
                </div>

                <div className="cf-gallery-info">
                  <span className="cf-gallery-filename" title={item.name}>
                    {item.name}
                  </span>
                  <span className="cf-gallery-filesize">
                    {formatBytes(item.size)}
                  </span>
                </div>
              </div>
            ))}

            {/* Add More button if under limit */}
            {photos.length < 5 && (
              <button
                type="button"
                className="cf-gallery-add-card"
                onClick={() => fileInputRef.current?.click()}
                title="Upload additional photograph"
              >
                <div className="cf-add-icon-circle">
                  <Icon name="plusCircle" size={24} />
                </div>
                <span>Add More</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
