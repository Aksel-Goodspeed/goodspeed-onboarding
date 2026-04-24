import { useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { T, btn } from '../../styles/tokens'

/**
 * AvatarUpload
 * Props:
 *   currentUrl   – existing profile picture URL (string | '')
 *   initials     – fallback initials string
 *   avatarColor  – fallback bg color
 *   avatarText   – fallback text color
 *   employeeId   – used as the storage filename
 *   onChange(url)– called with the new public URL after upload
 */
export default function AvatarUpload({ currentUrl, initials, avatarColor, avatarText, employeeId, onChange }) {
  const inputRef   = useRef()
  const [preview,    setPreview]    = useState(currentUrl || '')
  const [uploading,  setUploading]  = useState(false)
  const [error,      setError]      = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return }
    if (file.size > 5 * 1024 * 1024)    { setError('Image must be under 5 MB.');    return }

    setError('')
    setUploading(true)

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    const ext  = file.name.split('.').pop().toLowerCase()
    const path = `${employeeId}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadErr) {
      setError('Upload failed — make sure the "avatars" storage bucket exists and is public.')
      setPreview(currentUrl || '')
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    // Bust cache with timestamp so updated photo shows immediately
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
      {/* Avatar display */}
      <div style={styles.avatarWrap}>
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            style={styles.img}
            onError={() => setPreview('')}
          />
        ) : (
          <div style={{ ...styles.initials, background: avatarColor || T.dark, color: avatarText || T.accent }}>
            {(initials || '??').toUpperCase()}
          </div>
        )}
        {uploading && (
          <div style={styles.uploadOverlay}>
            <div style={styles.spinner} />
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
              {uploading ? 'Uploading…' : '📷 Upload photo'}
            </span>
          </label>
          {preview && !uploading && (
            <button type="button" onClick={handleRemove} style={{ ...btn('ghost'), padding: '8px 16px', fontSize: 13, color: '#c0392b', borderColor: 'rgba(192,57,43,.25)' }}>
              Remove
            </button>
          )}
        </div>
        <p style={styles.hint}>JPG, PNG or WebP · max 5 MB</p>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  )
}

const styles = {
  wrap:          { display: 'flex', alignItems: 'center', gap: 20 },
  avatarWrap:    { position: 'relative', width: 80, height: 80, flexShrink: 0 },
  img:           { width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', display: 'block' },
  initials:      { width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 26 },
  uploadOverlay: { position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(36,47,40,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  spinner:       { width: 24, height: 24, border: '3px solid rgba(198,221,102,.3)', borderTopColor: '#C6DD66', borderRadius: '50%', animation: 'spin .7s linear infinite' },
  hint:          { fontSize: 12, color: T.text, opacity: .45, margin: 0 },
  error:         { fontSize: 12, color: '#c0392b', background: '#fdf0ee', padding: '6px 10px', borderRadius: 8, margin: 0 },
}
