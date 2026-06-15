import { useState, useCallback, useRef } from "react"
import Cropper, { type Area } from "react-easy-crop"

interface PhotoUploadCropModalProps {
  isOpen: boolean
  onClose: () => void
  onCropComplete: (blob: Blob) => Promise<void>
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "anonymous")
    image.src = url
  })
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("Canvas is empty"))
        }
      },
      "image/jpeg",
      0.95,
    )
  })
}

export function PhotoUploadCropModal({ isOpen, onClose, onCropComplete }: PhotoUploadCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh hợp lệ")
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("Kích thước ảnh không được vượt quá 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
      setZoom(1)
      setCrop({ x: 0, y: 0 })
    }
    reader.readAsDataURL(file)
  }, [])

  const onCropChangeHandler = useCallback((location: { x: number; y: number }) => {
    setCrop(location)
  }, [])

  const onZoomChangeHandler = useCallback((zoom: number) => {
    setZoom(zoom)
  }, [])

  const onCropAreaComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return

    try {
      setIsProcessing(true)
      setError(null)
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels)
      await onCropComplete(blob)
    } catch (err: any) {
      setError(err?.message || "Không thể xử lý ảnh")
    } finally {
      setIsProcessing(false)
    }
  }, [imageSrc, croppedAreaPixels, onCropComplete])

  const handleReset = useCallback(() => {
    setImageSrc(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const handleClose = useCallback(() => {
    handleReset()
    onClose()
  }, [handleReset, onClose])

  if (!isOpen) return null

  return (
    <dialog className="modal modal-open" onClick={handleClose}>
      <div className="modal-box max-w-lg" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg mb-4">📷 Cập nhật ảnh đại diện</h3>

        {error && (
          <div className="alert alert-error text-sm py-2 mb-4" role="alert">
            <span>{error}</span>
          </div>
        )}

        {!imageSrc ? (
          /* Upload area */
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-32 h-32 rounded-full bg-base-200 flex items-center justify-center text-base-content/30">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm text-base-content/60 text-center">
              Chọn ảnh từ máy tính của bạn<br />
              <span className="text-xs">(JPG, PNG — tối đa 5MB)</span>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered file-input-primary w-full max-w-xs"
            />
          </div>
        ) : (
          /* Crop area */
          <div className="flex flex-col gap-4">
            <div className="relative w-full h-72 bg-base-200 rounded-lg overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={onCropChangeHandler}
                onZoomChange={onZoomChangeHandler}
                onCropComplete={onCropAreaComplete}
              />
            </div>

            {/* Zoom control */}
            <div className="flex items-center gap-3 px-2">
              <svg className="w-4 h-4 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="range range-primary range-xs flex-1"
              />
              <svg className="w-5 h-5 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleReset}
                disabled={isProcessing}
              >
                🔄 Chọn lại
              </button>
            </div>
          </div>
        )}

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={handleClose} disabled={isProcessing}>
            Hủy
          </button>
          {imageSrc && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <><span className="loading loading-spinner loading-sm"></span> Đang xử lý...</>
              ) : (
                "Xác nhận"
              )}
            </button>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  )
}
