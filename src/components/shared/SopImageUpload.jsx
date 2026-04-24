import { useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { T, btn } from '../../styles/tokens'

/**
 * SopImageUpload — rectangular image upload for SOP cover images.
 * Stores in the existing "avatars" bucket with a `sop-{id}.{ext}` filename.
 *
 * Props:
 *   currentUrl    – existing image URL (string | '')
 *   sopId         – stable id used in the filename (falls back to a random id for new SOPs)
 *   onChange(url) – called with new public URL after upload (or '' on remove)
 */
export default function SopImageUpload({ currentUrl, sopId, onChange }) {
  const inputRef                 = useRef()
  const [preview, setPreview]    = useState(currentUrl || '')
  const [uploading, setUploading]= useState(false)
  const [error, setError]        = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return }
    if (file.size > 5 * 1024 * 1024)    { setError('Image must be under 5 MB.');    return }

    setError('')
    setUploading(true)

    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    const id   = sopId || `new-${Math.random().toString(36).slice(2, 10)}`
    const ext  = file.name.split('.').pop().toLowerCase()
    const path = `sop-${id}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadErr) {
      setError('Upload failed — check the "avatars" storage bucket.')
      setPreview(currentUrl || '')
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`
    setPreview(publicUrl)
    onChange(publicUrl)
    setUploading(false)
  }

  const handleRemove = () => {
    setPreview('')
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.thumb}>
        {preview ? (
          <img src={preview} alt="SOP cover" style={styles.img} onError={() => setPreview('')} />
        ) : (
          <div style={styles.placeholder}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        {uploading && (
          <div style={styles.overlay}>
            <div style={styles.spinner} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <label style={{ cursor: uploading ? 'default' : 'pointer' }}>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFile}
              disabled={uploading}
            />
            <span style={{ ...btn('ghost'), padding: '8px 16px', fontSize: 13, pointerEvents: 'none', opacity: uploading ? .5 : 1 }}>
              {uploading ? 'Uploading…' : preview ? '🖼️ Replace image' : '🖼️ Upload image'}
            </span>
          </label>
          {preview && !uploading && (
            <button type="button" onClick={handleRemove}
              style={{ ...btn('ghost'), padding: '8px 16px', fontSize: 13, color: '#c0392b', borderColor: 'rgba(192,57,43,.25)' }}>
              Remove
            </button>
          )}
        </div>
        <p style={styles.hint}>
          JPG, PNG or WebP · max 5 MB · used in the SOP card and as a fallback when there's no video.
        </p>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  )
}

const styles = {
  wrap:        { display: 'flex', alignItems: 'flex-start', gap: 20 },
  thumb:       {
    position: 'relative',
    width: 128, height: 96, borderRadius: 12,
    background: 'rgba(55,74,62,.06)', overflow: 'hidden', flexShrink: 0,
  },
  img:         { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  placeholder: {
    width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: T.heading, opacity: .3,
  },
  overlay:     {
    position: 'absolute', inset: 0, background: 'rgba(36,47,40,.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  spinner:     {
    width: 24, height: 24, border: '3px solid rgba(198,221,102,.3)',
    borderTopColor: '#C6DD66', borderRadius: '50%', animation: 'spin .7s linear infinite',
  },
  hint:        { fontSize: 12, color: T.text, opacity: .5, margin: 0 },
  error:       { fontSize: 12, color: '#c0392b', background: '#fdf0ee', padding: '6px 10px', borderRadius: 8, margin: 0 },
}
