import { useRef, useState } from 'react'
import { Upload, X, ImagePlus } from 'lucide-react'

const MAX_IMAGES = 10
const MAX_DIMENSION = 1000 // longest side, in px, after resize
const JPEG_QUALITY = 0.75

/** Resizes/compresses an image file in-browser and resolves to a base64 JPEG data URL. */
function fileToCompressedDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not load image'))
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function ImageUploader({ images = [], onChange }) {
  const inputRef = useRef(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const remainingSlots = MAX_IMAGES - images.length

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setError(null)

    if (files.length > remainingSlots) {
      setError(`You can add ${remainingSlots} more photo${remainingSlots === 1 ? '' : 's'} (max ${MAX_IMAGES} total).`)
    }
    const filesToProcess = files.slice(0, remainingSlots)

    setProcessing(true)
    try {
      const compressed = await Promise.all(filesToProcess.map(fileToCompressedDataUrl))
      onChange([...images, ...compressed])
    } catch {
      setError('One or more photos could not be processed. Try a different image.')
    } finally {
      setProcessing(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeAt = (index) => {
    onChange(images.filter((_, i) => i !== index))
    setError(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="label mb-0">Product photos</p>
        <span className="text-xs text-slate-400">{images.length}/{MAX_IMAGES} added</span>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
          {images.map((src, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200">
              <img src={src} alt={`Product photo ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
                aria-label="Remove photo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {remainingSlots > 0 ? (
        <label
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-6 cursor-pointer hover:border-brand-300 hover:bg-brand-50/40 transition-colors"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
            disabled={processing}
          />
          {processing ? (
            <span className="text-sm text-slate-500">Processing photos…</span>
          ) : (
            <>
              <span className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                {images.length === 0 ? <ImagePlus className="h-4.5 w-4.5 text-slate-500" /> : <Upload className="h-4.5 w-4.5 text-slate-500" />}
              </span>
              <span className="text-sm text-slate-500">
                Click to upload photos <span className="text-slate-400">(up to {remainingSlots} more)</span>
              </span>
            </>
          )}
        </label>
      ) : (
        <p className="text-xs text-slate-400 text-center py-2">Maximum of {MAX_IMAGES} photos reached.</p>
      )}

      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
    </div>
  )
}