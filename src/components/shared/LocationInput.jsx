import { useState } from 'react'
import { T } from '../../styles/tokens'

/**
 * LocationInput — type a place name, auto-geocodes on blur via Nominatim.
 * Props:
 *   value       – current location display string
 *   lat / lng   – current coordinates (number | null)
 *   onChange({ location, locationLat, locationLng }) – called after successful geocode or clear
 */
export default function LocationInput({ value, lat, lng, onChange }) {
  const [status, setStatus] = useState(
    lat != null ? 'found' : value ? 'idle' : 'idle'
  ) // 'idle' | 'loading' | 'found' | 'notfound'

  const geocode = async (query) => {
    if (!query.trim()) {
      onChange({ location: '', locationLat: null, locationLng: null })
      setStatus('idle')
      return
    }
    setStatus('loading')
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (data.length > 0) {
        const { lat: resLat, lon: resLng } = data[0]
        onChange({
          location:    query,
          locationLat: parseFloat(resLat),
          locationLng: parseFloat(resLng),
        })
        setStatus('found')
      } else {
        setStatus('notfound')
      }
    } catch {
      setStatus('notfound')
    }
  }

  const handleChange = (e) => {
    // Update display text immediately; coordinates updated on blur
    onChange({ location: e.target.value, locationLat: lat, locationLng: lng })
    if (status === 'found' || status === 'notfound') setStatus('idle')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={styles.label}>Location</label>
      <div style={{ position: 'relative' }}>
        <input
          value={value}
          onChange={handleChange}
          onBlur={e => geocode(e.target.value)}
          placeholder="e.g. Sydney, Australia"
          style={{ paddingRight: 36 }}
        />
        {status === 'loading' && (
          <div style={styles.iconSlot}>
            <div style={styles.spinner} />
          </div>
        )}
        {status === 'found' && (
          <div style={{ ...styles.iconSlot, color: '#4a7c3f', fontSize: 16 }}>✓</div>
        )}
      </div>
      {status === 'found' && lat != null && (
        <span style={styles.coordHint}>
          📍 {parseFloat(lat).toFixed(4)}, {parseFloat(lng).toFixed(4)}
        </span>
      )}
      {status === 'notfound' && (
        <span style={styles.errorHint}>Location not found — try being more specific.</span>
      )}
    </div>
  )
}

const styles = {
  label:      { fontSize: 13, fontWeight: 600, color: T.heading },
  iconSlot:   { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' },
  spinner:    { width: 16, height: 16, border: '2px solid rgba(55,74,62,.2)', borderTopColor: T.heading, borderRadius: '50%', animation: 'spin .7s linear infinite' },
  coordHint:  { fontSize: 12, color: T.text, opacity: .5 },
  errorHint:  { fontSize: 12, color: '#c0392b' },
}
