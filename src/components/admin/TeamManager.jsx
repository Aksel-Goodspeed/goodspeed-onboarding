import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { T, btn } from '../../styles/tokens'

// Only the display/profile fields — core fields (email, role, etc.) are managed via the People tab
const BLANK_DISPLAY = { initials: '', avatarColor: '#374A3E', avatarText: '#C6DD66', bio: '', funFacts: ['', '', ''], slack: '', department: '' }

export default function TeamManager() {
  const { employees, updateTeamMember, deleteTeamMember } = useApp()
  const [editing, setEditing] = useState(null)   // null | employee-id
  const [form,    setForm]    = useState(null)
  const [saving,  setSaving]  = useState(false)

  const openEdit = (emp) => {
    setForm({
      initials:    emp.initials    || emp.name.slice(0, 2).toUpperCase(),
      avatarColor: emp.avatarColor || '#374A3E',
      avatarText:  emp.avatarText  || '#C6DD66',
      bio:         emp.bio         || '',
      funFacts:    [...(emp.funFacts || []), '', '', ''].slice(0, 3),
      slack:       emp.slack       || '',
      department:  emp.department  || '',
    })
    setEditing(emp.id)
  }
  const cancel = () => setEditing(null)

  const set     = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setFact = (i, v) => setForm(f => { const ff = [...f.funFacts]; ff[i] = v; return { ...f, funFacts: ff } })

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const data = { ...form, funFacts: form.funFacts.filter(f => f.trim()) }
    try {
      updateTeamMember(editing, data)
      setEditing(null)
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('Remove this employee? This will permanently delete their account.')) return
    await deleteTeamMember(id)
  }

  const editingEmployee = editing ? employees.find(e => e.id === editing) : null

  if (editing !== null && editingEmployee) {
    return (
      <div>
        <button onClick={cancel} style={styles.backBtn}>← Back to team</button>
        <h2 style={styles.sectionTitle}>Edit profile — {editingEmployee.name}</h2>
        <div style={styles.readOnly}>
          <span style={styles.readOnlyLabel}>Name</span> {editingEmployee.name}
          <span style={{ margin: '0 16px', opacity: .3 }}>·</span>
          <span style={styles.readOnlyLabel}>Role</span> {editingEmployee.role}
          <span style={{ margin: '0 16px', opacity: .3 }}>·</span>
          <span style={styles.readOnlyLabel}>Email</span> {editingEmployee.email}
        </div>
        <form onSubmit={save} style={styles.form}>
          <div style={styles.row}>
            <Field label="Initials" value={form.initials} onChange={v => set('initials', v)} placeholder="MA" maxLength={3} />
            <Field label="Department" value={form.department} onChange={v => set('department', v)} placeholder="Design" />
          </div>
          <div style={styles.row}>
            <Field label="Avatar background" value={form.avatarColor} onChange={v => set('avatarColor', v)} placeholder="#374A3E" />
            <Field label="Avatar text colour" value={form.avatarText} onChange={v => set('avatarText', v)} placeholder="#C6DD66" />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <div style={{ ...styles.avatarPreview, background: form.avatarColor, color: form.avatarText }}>
              {(form.initials || editingEmployee.name.slice(0, 2) || '??').toUpperCase()}
            </div>
            <span style={{ fontSize: 12, opacity: .5 }}>Preview</span>
          </div>
          <TextareaField label="Bio" value={form.bio} onChange={v => set('bio', v)} rows={3} placeholder="Short bio..." />
          <div style={styles.field}>
            <label style={styles.label}>Fun facts (up to 3)</label>
            {form.funFacts.map((f, i) => (
              <input key={i} value={f} onChange={e => setFact(i, e.target.value)} placeholder={`Fun fact ${i + 1}`} style={{ marginBottom: 6 }} />
            ))}
          </div>
          <Field label="Slack handle" value={form.slack} onChange={v => set('slack', v)} placeholder="@maya" />
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" disabled={saving} style={{ ...btn('primary'), opacity: saving ? .6 : 1 }}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" onClick={cancel} style={btn('ghost')}>Cancel</button>
          </div>
        </form>
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
        <div style={styles.empty}>No employees yet. Invite your first one from the People tab.</div>
      ) : (
        <div style={styles.list}>
          {employees.map(emp => (
            <div key={emp.id} style={styles.row2}>
              <div style={{ ...styles.avatar, background: emp.avatarColor, color: emp.avatarText }}>
                {emp.initials || emp.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: T.heading }}>{emp.name}</div>
                <div style={{ fontSize: 13, opacity: .55 }}>
                  {emp.role}{emp.department ? ` · ${emp.department}` : ''}{emp.email ? ` · ${emp.email}` : ''}
                </div>
              </div>
              {emp.isFounder && <span style={styles.founderBadge}>Founder</span>}
              {!emp.bio && <span style={styles.incompleteBadge}>Profile incomplete</span>}
              <button onClick={() => openEdit(emp)} style={{ ...btn('card'), padding: '7px 14px', fontSize: 13 }}>Edit profile</button>
              <button onClick={() => remove(emp.id)} style={{ ...btn('ghost'), padding: '7px 14px', fontSize: 13, color: '#c0392b' }}>Remove</button>
            </div>
          ))}
        </div>
      )}
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
  form:           { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 680 },
  row:            { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field:          { display: 'flex', flexDirection: 'column', gap: 6 },
  label:          { fontSize: 13, fontWeight: 600, color: T.heading },
  avatarPreview:  { width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 },
  list:           { display: 'flex', flexDirection: 'column', gap: 8 },
  row2:           { display: 'flex', alignItems: 'center', gap: 14, background: T.card, borderRadius: 12, padding: '14px 16px' },
  avatar:         { width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 },
  founderBadge:   { fontSize: 11, fontWeight: 700, background: T.accent, color: T.dark, padding: '2px 8px', borderRadius: 100 },
  incompleteBadge:{ fontSize: 11, fontWeight: 600, background: 'rgba(234,158,131,.2)', color: '#a0412a', padding: '2px 8px', borderRadius: 100 },
  empty:          { background: T.card, borderRadius: 14, padding: '32px', textAlign: 'center', color: T.text, opacity: .6 },
}
