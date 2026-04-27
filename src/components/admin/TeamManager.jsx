import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import AvatarUpload from '../shared/AvatarUpload'
import LocationInput from '../shared/LocationInput'
import { T, btn } from '../../styles/tokens'

export default function TeamManager() {
  const { employees, updateTeamMember, deleteTeamMember, generateResetToken } = useApp()
  const [editing,    setEditing]    = useState(null)   // null | employee-id
  const [form,       setForm]       = useState(null)
  const [saving,     setSaving]     = useState(false)
  const [resetLink,  setResetLink]  = useState(null)   // null | string URL
  const [generating, setGenerating] = useState(false)
  const [copied,     setCopied]     = useState(false)
  const [search,     setSearch]     = useState('')
  const [filterRole, setFilterRole] = useState('All')
  const [filterDept, setFilterDept] = useState('All')

  const openEdit = (emp) => {
    setForm({
      initials:       emp.initials       || emp.name.slice(0, 2).toUpperCase(),
      avatarColor:    emp.avatarColor    || '#374A3E',
      avatarText:     emp.avatarText     || '#C6DD66',
      bio:            emp.bio            || '',
      funFacts:       [...(emp.funFacts || []), '', '', ''].slice(0, 3),
      slack:          emp.slack          || '',
      department:     emp.department     || '',
      role:           emp.role           || '',
      startDate:      emp.startDate      || '',
      location:       emp.location       || '',
      locationLat:    emp.locationLat    ?? '',
      locationLng:    emp.locationLng    ?? '',
      profilePicture: emp.profilePicture || '',
    })
    setEditing(emp.id)
    setResetLink(null)
    setCopied(false)
  }
  const cancel = () => { setEditing(null); setResetLink(null) }

  const set     = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setFact = (i, v) => setForm(f => { const ff = [...f.funFacts]; ff[i] = v; return { ...f, funFacts: ff } })

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const data = {
      ...form,
      funFacts:    form.funFacts.filter(f => f.trim()),
      locationLat: form.locationLat === '' ? null : form.locationLat,
      locationLng: form.locationLng === '' ? null : form.locationLng,
    }
    try {
      updateTeamMember(editing, data)
      setEditing(null)
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleGenerateResetLink = async () => {
    setGenerating(true)
    try {
      const newToken = await generateResetToken(editing)
      const url = `${window.location.origin}${window.location.pathname}#/reset/${newToken}`
      setResetLink(url)
    } catch (err) {
      alert('Failed to generate reset link: ' + err.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(resetLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!confirm(`Delete ${editingEmployee?.name}'s account? This cannot be undone.`)) return
    await deleteTeamMember(editing)
    setEditing(null)
  }

  const editingEmployee = editing ? employees.find(e => e.id === editing) : null

  if (editing !== null && editingEmployee) {
    return (
      <div>
        <button onClick={cancel} style={styles.backBtn}>← Back to team</button>
        <h2 style={styles.sectionTitle}>Edit profile — {editingEmployee.name}</h2>
        <div style={styles.readOnly}>
          <span style={styles.readOnlyLabel}>Email</span> {editingEmployee.email}
        </div>
        <form onSubmit={save} style={styles.form}>
          <div style={styles.row}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: T.heading }}>Role</label>
              <select value={form.role} onChange={e => set('role', e.target.value)}>
                <option value="">Select a role…</option>
                <option value="Developer">Developer</option>
                <option value="AI Developer">AI Developer</option>
                <option value="Designer">Designer</option>
                <option value="Operations">Operations</option>
                <option value="Operations">Founder</option>
              </select>
            </div>
            <Field label="Department" value={form.department} onChange={v => set('department', v)} placeholder="Design" />
          </div>
          <div style={styles.row}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: T.heading }}>Start date</label>
              <input type="date" value={form.startDate || ''} onChange={e => set('startDate', e.target.value)} />
            </div>
            <Field label="Slack handle" value={form.slack} onChange={v => set('slack', v)} placeholder="@maya" />
          </div>
          <div style={styles.row}>
            <Field label="Initials" value={form.initials} onChange={v => set('initials', v)} placeholder="MA" maxLength={3} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: T.heading }}>Avatar preview</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ ...styles.avatarPreview, background: form.avatarColor, color: form.avatarText }}>
                  {(form.initials || editingEmployee.name.slice(0, 2) || '??').toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <input value={form.avatarColor} onChange={e => set('avatarColor', e.target.value)} placeholder="#374A3E" style={{ fontSize: 12 }} />
                  <input value={form.avatarText}  onChange={e => set('avatarText',  e.target.value)} placeholder="#C6DD66" style={{ fontSize: 12 }} />
                </div>
              </div>
            </div>
          </div>
          <TextareaField label="Bio" value={form.bio} onChange={v => set('bio', v)} rows={3} placeholder="Short bio..." />
          <div style={styles.field}>
            <label style={styles.label}>Fun facts (up to 3)</label>
            {form.funFacts.map((f, i) => (
              <input key={i} value={f} onChange={e => setFact(i, e.target.value)} placeholder={`Fun fact ${i + 1}`} style={{ marginBottom: 6 }} />
            ))}
          </div>

          {/* Location */}
          <LocationInput
            value={form.location}
            lat={form.locationLat}
            lng={form.locationLng}
            onChange={({ location, locationLat, locationLng }) =>
              setForm(f => ({ ...f, location, locationLat, locationLng }))
            }
          />

          {/* Profile picture */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: T.heading }}>Profile picture</label>
            <AvatarUpload
              currentUrl={form.profilePicture}
              initials={form.initials || editingEmployee.name.slice(0, 2)}
              avatarColor={form.avatarColor}
              avatarText={form.avatarText}
              employeeId={editingEmployee.id}
              onChange={url => set('profilePicture', url)}
            />
          </div>

          {/* Save / Cancel */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" disabled={saving} style={{ ...btn('primary'), opacity: saving ? .6 : 1 }}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" onClick={cancel} style={btn('ghost')}>Cancel</button>
          </div>
        </form>

        {/* Password reset link */}
        <div style={styles.divider} />
        <div style={styles.utilSection}>
          <div style={styles.utilLabel}>Password reset</div>
          <p style={styles.utilDesc}>Generate a single-use link you can send to {editingEmployee.name} to let them set a new password.</p>
          {!resetLink ? (
            <button onClick={handleGenerateResetLink} disabled={generating} style={{ ...btn('ghost'), opacity: generating ? .6 : 1 }}>
              {generating ? 'Generating…' : 'Generate reset link'}
            </button>
          ) : (
            <div style={styles.resetBox}>
              <span style={styles.resetUrl}>{resetLink}</span>
              <button onClick={handleCopy} style={{ ...btn('primary'), flexShrink: 0, padding: '6px 14px', fontSize: 13 }}>
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div style={styles.divider} />
        <div style={styles.utilSection}>
          <div style={{ ...styles.utilLabel, color: '#c0392b' }}>Danger zone</div>
          <p style={styles.utilDesc}>Permanently delete {editingEmployee.name}'s account. This cannot be undone.</p>
          <button onClick={handleDelete} style={{ ...btn('ghost'), color: '#c0392b', borderColor: 'rgba(192,57,43,.3)' }}>
            Delete account
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={styles.sectionTitle}>Team profiles</h2>
        <p style={{ fontSize: 13, color: T.text, opacity: .55, marginTop: -12 }}>
          Team members are your employees. Add people via the People tab → Invite employee.
        </p>
      </div>

      {employees.length === 0 ? (
        <div style={styles.empty}>No employees yet. Invite your first one from the Onboarding tab.</div>
      ) : (() => {
        const roles = ['All', ...new Set(employees.map(e => e.role).filter(Boolean))]
        const depts = ['All', ...new Set(employees.map(e => e.department).filter(Boolean))]
        const q = search.trim().toLowerCase()
        const filtered = employees.filter(emp => {
          if (filterRole !== 'All' && emp.role !== filterRole) return false
          if (filterDept !== 'All' && emp.department !== filterDept) return false
          if (!q) return true
          const hay = [emp.name, emp.email, emp.role, emp.department, emp.location, emp.slack].filter(Boolean).join(' ').toLowerCase()
          return hay.includes(q)
        })

        return (
          <>
            <div style={styles.toolbar}>
              <div style={styles.searchWrap}>
                <span style={styles.searchIcon}>🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, email, role, location…"
                  style={styles.searchInput}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={styles.clearBtn}>✕</button>
                )}
              </div>
              <div style={styles.filtersRow}>
                <div style={styles.filterGroup}>
                  <span style={styles.filterLabel}>Role</span>
                  <div style={styles.chipRow}>
                    {roles.map(r => (
                      <button key={r} onClick={() => setFilterRole(r)}
                        style={{ ...styles.chip, ...(filterRole === r ? styles.chipActive : {}) }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                {depts.length > 1 && (
                  <div style={styles.filterGroup}>
                    <span style={styles.filterLabel}>Department</span>
                    <div style={styles.chipRow}>
                      {depts.map(d => (
                        <button key={d} onClick={() => setFilterDept(d)}
                          style={{ ...styles.chip, ...(filterDept === d ? styles.chipActive : {}) }}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div style={styles.resultCount}>
                {filtered.length} of {employees.length} {employees.length === 1 ? 'member' : 'members'}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={styles.empty}>No team members match these filters.</div>
            ) : (
              <div style={styles.list}>
                {filtered.map(emp => (
                  <div key={emp.id} style={styles.row2}>
                    {emp.profilePicture ? (
                      <img src={emp.profilePicture} alt={emp.name}
                        style={{ ...styles.avatar, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ ...styles.avatar, background: emp.avatarColor, color: emp.avatarText }}>
                        {emp.initials || emp.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: T.heading }}>{emp.name}</div>
                      <div style={{ fontSize: 13, opacity: .55 }}>
                        {emp.role}{emp.department ? ` · ${emp.department}` : ''}{emp.email ? ` · ${emp.email}` : ''}
                      </div>
                    </div>
                    {emp.isFounder && <span style={styles.founderBadge}>Founder</span>}
                    {!emp.bio && <span style={styles.incompleteBadge}>Profile incomplete</span>}
                    <button onClick={() => openEdit(emp)} style={{ ...btn('card'), padding: '7px 14px', fontSize: 13 }}>✏️ Edit profile</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )
      })()}
    </div>
  )
}

function Field({ label, value, onChange, required, placeholder, maxLength }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: T.heading }}>{label}</label>
      <input required={required} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} />
    </div>
  )
}

function TextareaField({ label, value, onChange, rows, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: T.heading }}>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} />
    </div>
  )
}

const styles = {
  backBtn:        { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: T.heading, opacity: .6, fontFamily: 'inherit', marginBottom: 20, padding: 0 },
  sectionTitle:   { fontFamily: "'Inter',sans-serif", fontSize: 20, fontWeight: 700, color: T.heading, marginBottom: 20 },
  readOnly:       { fontSize: 13, color: T.text, opacity: .6, background: T.card, borderRadius: 10, padding: '10px 14px', marginBottom: 20 },
  readOnlyLabel:  { fontWeight: 700, opacity: .5, marginRight: 4 },
  form:           { display: 'flex', flexDirection: 'column', gap: 16 },
  row:            { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field:          { display: 'flex', flexDirection: 'column', gap: 6 },
  label:          { fontSize: 13, fontWeight: 600, color: T.heading },
  avatarPreview:  { width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 },
  list:           { display: 'flex', flexDirection: 'column', gap: 8 },
  row2:           { display: 'flex', alignItems: 'center', gap: 14, background: T.card, borderRadius: 12, padding: '14px 16px' },
  avatar:         { width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 },
  founderBadge:   { fontSize: 11, fontWeight: 700, background: T.accent, color: T.dark, padding: '2px 8px', borderRadius: 100 },
  incompleteBadge:{ fontSize: 11, fontWeight: 600, background: 'rgba(234,158,131,.2)', color: '#a0412a', padding: '2px 8px', borderRadius: 100 },
  empty:          { background: T.card, borderRadius: 14, padding: '32px', textAlign: 'center', color: T.text, opacity: .6 },
  toolbar:        { display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 },
  searchWrap:     { position: 'relative', width: '100%' },
  searchIcon:     { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: .5, pointerEvents: 'none' },
  searchInput:    { width: '100%', padding: '10px 36px 10px 38px', borderRadius: 10, border: `1.5px solid rgba(55,74,62,.12)`, background: T.card, fontSize: 14, fontFamily: 'inherit', color: T.heading, boxSizing: 'border-box' },
  clearBtn:       { position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: T.text, opacity: .5, fontSize: 14, padding: 6 },
  filtersRow:     { display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' },
  filterGroup:    { display: 'flex', flexDirection: 'column', gap: 6 },
  filterLabel:    { fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: T.heading, opacity: .55 },
  chipRow:        { display: 'flex', gap: 6, flexWrap: 'wrap' },
  chip:           { padding: '5px 12px', borderRadius: 100, border: `1.5px solid rgba(55,74,62,.16)`, background: 'transparent', color: T.heading, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  chipActive:     { background: T.dark, color: T.accent, border: `1.5px solid ${T.dark}` },
  resultCount:    { fontSize: 12, color: T.text, opacity: .5, fontWeight: 600 },
  divider:        { maxWidth: 680, borderTop: '1.5px solid rgba(55,74,62,.08)', margin: '28px 0 0' },
  utilSection:    { maxWidth: 680, paddingTop: 20, paddingBottom: 4 },
  utilLabel:      { fontSize: 13, fontWeight: 700, color: T.heading, marginBottom: 4 },
  utilDesc:       { fontSize: 13, color: T.text, opacity: .6, marginBottom: 12 },
  resetBox:       { display: 'flex', gap: 10, alignItems: 'center', background: T.card, borderRadius: 10, padding: '10px 14px' },
  resetUrl:       { flex: 1, fontSize: 12, color: T.text, opacity: .7, wordBreak: 'break-all', fontFamily: 'monospace' },
}
