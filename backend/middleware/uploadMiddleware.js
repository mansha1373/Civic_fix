import multer from "multer"

// Store incoming files in memory as Buffers for streaming to Cloudinary
const storage = multer.memoryStorage()

// Allowed image MIME types (JPEG, PNG, WEBP, JPG, HEIC, HEIF)
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/heic",
  "image/heif"
]

const fileFilter = (req, file, cb) => {
  const mime = file.mimetype ? file.mimetype.toLowerCase() : ""
  if (ALLOWED_MIME_TYPES.includes(mime)) {
    cb(null, true)
  } else {
    cb(
      new Error(
        `Invalid file format: ${file.mimetype || "unknown"}. Supported formats: JPEG, PNG, WEBP, HEIC.`
      ),
      false
    )
  }
}

// Multer instance with 10MB per-file size limit & max 5 files
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 Megabytes limit
    files: 5 // max 5 files per complaint
  },
  fileFilter
})

/**
 * Middleware wrapper to safely handle Multer errors and return clean JSON responses
 */
export const handleUploadErrors = (multerMiddleware) => {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File is too large. Maximum allowed file size is 10MB."
          })
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            success: false,
            message: "Too many files uploaded. Maximum allowed is 5 photographs."
          })
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            success: false,
            message: `Unexpected file field: ${err.field}. Please use 'photos' for complaints or 'image' for single upload.`
          })
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
        })
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Failed to process image upload."
        })
      }
      next()
    })
  }
}

export const uploadPhotos = handleUploadErrors(upload.array("photos", 5))
export const uploadSingleImage = handleUploadErrors(upload.single("image"))
