import { useRef, useState } from 'react'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { sellerService } from '../../services/sellerService.js'

export default function ImageUpload({ sellerId, currentImageUrl, onUploaded }) {
  const [preview, setPreview] = useState(currentImageUrl || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)

    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be smaller than 2MB')
      return
    }

    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const { productImageUrl } = await sellerService.uploadImage(sellerId, file)
      setPreview(productImageUrl)
      onUploaded?.(productImageUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    setUploading(true)
    try {
      await sellerService.removeImage(sellerId)
      setPreview(null)
      onUploaded?.(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  if (!sellerId) {
    return (
      <p className="text-sm text-slate-400">Save this seller profile first, then you can add a product photo.</p>
    )
  }

  return (
    <div>
      <label className="label">Product photo</label>
      <div className="flex items-center gap-4">
        <div className="h-24 w-24 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
          {preview ? (
            <img src={preview} alt="Product" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6 text-slate-300" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="btn-secondary text-sm"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {preview ? 'Change photo' : 'Upload photo'}
          </button>
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="text-sm text-rose-600 flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </div>
      {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}
    </div>
  )
}