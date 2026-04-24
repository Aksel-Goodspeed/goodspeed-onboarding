import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { T, btn } from '../../styles/tokens'

export default function EditProfile() {
  const { currentEmployee, updateEmployee } = useApp()
  const emp = currentEmployee

  const [form,   setForm]   = useState({
    initials:    emp.initials    || emp.name.slice(0, 2).toUpperCase(),
    avatarColor: emp.avatarColor || '#374A3E',
    avatarText:  emp.avatarText  || '#C6DD66',
    bio:         emp.bio         || '',
    funFacts:    [...(emp.funFacts || []), '', '', ''].slice(0, 3),
    slack:       emp.slack       || '',
    location:    emp.location    || '',
    locationLat: emp.locationLat ?? '',
    locationLng: emp.locationLng ?? '',
    profilePicture: emp.profilePicture || '',
  })
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)

  const set     = (k, v) => { setForm(f => ({ ...f, [k]: v })); setSaved(false) }
  const setFact = (i, v) => setForm(f => {
    const ff = [...f.funFacts]
    ff[i] = v
    return { ...f, funFacts: ff }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const data = {
      ...form,
      locationLat: form.locationLat !== '' ? parseFloat(form.locationLat) : null,
      locationLng: form.locationLng !== '' ? parseFloat(form.locationLng) : null,
      funFacts:   form.funFacts.filter(f => f.trim()),
    }
    try {
      await updateEmployee(emp.id, data)
      setSaved(true)
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="animate-fadeUp">
      <div style={{ marginBottom: 28 }}>
        <h1 style={styles.h1}>My Profile</h1>
        <p style={styles.sub}>How you appear to your teammates.</p>
      </div>

      {/* Avatar preview card */}
      <div style={styles.previewCard}>
        <div style={styles.previewAvatar}>
          {form.profilePicture ? (
            <img
              src={form.profilePicture}
              alt={emp.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          ) : (
            <div style={{ ...styles.avatarCircle, background: form.avatarColor, color: form.avatarText }}>
              {(form.initials || emp.name.slice(0, 2)).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: T.heading }}>{emp.name}</div>
          <div style={{ fontSize: 14, opacity: .55, marginTop: 2 }}>{form.role || emp.role}</div>
          {form.location && <div style={{ fontSize: 13, opacity: .45, marginTop: 2 }}>📍 {form.location}</div>}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>

        {/* Bio */}
        <div style={styles.field}>
          <label style={styles.label}>Bio</label>
          <textarea
            value={form.bio}
            onChange={e => set('bio', e.target.value)}
            rows={3}
            placeholder="A short intro — who you are, what you do, what you're into."
          />
        </div>

        {/* Fun facts */}
        <div style={styles.field}>
          <label style={styles.label}>Fun facts (up to 3)</label>
          <p style={styles.hint}>Teammates can reveal these on the Meet the Team page.</p>
          {form.funFacts.map((f, i) => (
            <input
              key={i}
              value={f}
              onChange={e => setFact(i, e.target.value)}
              placeholder={`Fun fact ${i + 1}`}
              style={{ marginBottom: 8 }}
            />
          ))}
        </div>

        {/* Slack */}
        <Field label="Slack handle" value={form.slack} onChange={v => set('slack', v)} placeholder="@yourname" />

        <div style={styles.divider} />
        <div style={styles.sectionLabel}>Avatar</div>

        {/* Initials + colors */}
        <div style={styles.row}>
          <Field label="Initials" value={form.initials} onChange={v => set('initials', v)} placeholder="AB" maxLength={3} />
          <div style={styles.field}>
            <label style={styles.label}>Preview</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ ...styles.avatarCircle, background: form.avatarColor, color: form.avatarText, width: 44, height: 44, fontSize: 15, flexShrink: 0 }}>
                {(form.initials || emp.name.slice(0, 2) || '??').toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <input value={form.avatarColor} onChange={e => set('avatarColor', e.target.value)} placeholder="#374A3E" style={{ fontSize: 13 }} />
                <input value={form.avatarText}  onChange={e => set('avatarText',  e.target.value)} placeholder="#C6DD66" style={{ fontSize: 13 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Profile picture */}
        <div style={styles.field}>
          <label style={styles.label}>Profile picture URL</label>
          <p style={styles.hint}>Paste a link to an image. This will replace your initials avatar.</p>
          <input
            value={form.profilePicture}
            onChange={e => set('profilePicture', e.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
          {form.profilePicture && (
            <img
              src={form.profilePicture}
              alt="Preview"
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginTop: 10 }}
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          )}
        </div>

        <div style={styles.divider} />
        <div style={styles.sectionLabel}>Location</div>
        <p style={{ ...styles.hint, marginTop: -8 }}>Used to place you on the team globe.</p>

        <Field label="City / Country" value={form.location} onChange={v => set('location', v)} placeholder="Sydney, Australia" />
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Latitude</label>
            <input
              type="number"
              step="any"
              value={form.locationLat}
              onChange={e => set('locationLat', e.target.value)}
              placeholder="-33.8688"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Longitude</label>
            <input
              type="number"
              step="any"
              value={form.locationLng}
              onChange={e => set('locationLng', e.target.value)}
              placeholder="151.2093"
            />
          </div>
        </div>

        {/* Save */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
          <button
            type="submit"
            disabled={saving}
            style={{ ...btn('primary'), opacity: saving ? .6 : 1 }}
          >
            {saving ? 'Saving…' : 'Save profile'}
          </button>
          {saved && (
            <span style={{ fontSize: 14, fontWeight: 600, color: T.dark, opacity: .7 }}>
              ✓ Saved
            </span>
          )}
        </div>
      </form>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, maxLength }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: T.heading }}>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </div>
  )
}

const styles = {
  h1:           { fontFamily: "'Inter',sans-serif", fontSize: 'clamp(24px,3.5vw,34px)', fontWeight: 800, color: T.heading, marginBottom: 6 },
  sub:          { fontSize: 15, color: T.text, opacity: .6 },
  previewCard:  { display: 'flex', alignItems: 'center', gap: 16, background: T.card, borderRadius: 16, padding: '20px 24px', marginBottom: 32 },
  previewAvatar:{ width: 64, height: 64, borderRadius: '50%', flexShrink: 0, overflow: 'hidden' },
  avatarCircle: { width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22 },
  form:         { display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 680 },
  row:          { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field:        { display: 'flex', flexDirection: 'column', gap: 6 },
  label:        { fontSize: 13, fontWeight: 600, color: T.heading },
  hint:         { fontSize: 12, color: T.text, opacity: .5, marginBottom: 4 },
  divider:      { borderTop: '1.5px solid rgba(55,74,62,.08)', margin: '6px 0 2px' },
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: T.heading, opacity: .45 },
}
