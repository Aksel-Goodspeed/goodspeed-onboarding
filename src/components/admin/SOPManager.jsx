import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { T, btn } from '../../styles/tokens'

const BLANK = {
  title: '', description: '', category: '', icon: '📋',
  duration: '', owner: '', videoUrl: '', documentUrl: '',
  steps: [{ title: '', desc: '' }],
}

export default function SOPManager() {
  const { sops, addSop, updateSop, deleteSop } = useApp()
  const [editing, setEditing] = useState(null)   // null | 'new' | sop-id
  const [form,    setForm]    = useState(BLANK)
  const [saving,  setSaving]  = useState(false)

  const openNew  = () => { setForm(BLANK); setEditing('new') }
  const openEdit = (s) => {
    setForm({
      title: s.title, description: s.description, category: s.category,
      icon: s.icon, duration: s.duration, owner: s.owner,
      videoUrl: s.videoUrl || '', documentUrl: s.documentUrl || '',
      steps: s.steps?.length ? s.steps.map(st => ({ title: st.title, desc: st.desc })) : [{ title: '', desc: '' }],
    })
    setEditing(s.id)
  }
  const cancel = () => setEditing(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const setStep = (i, k, v) => setForm(f => {
    const steps = [...f.steps]
    steps[i] = { ...steps[i], [k]: v }
    return { ...f, steps }
  })
  const addStep    = () => setForm(f => ({ ...f, steps: [...f.steps, { title: '', desc: '' }] }))
  const removeStep = (i) => setForm(f => ({ ...f, steps: f.steps.filter((_, j) => j !== i) }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const data = {
      ...form,
      steps: form.steps.filter(s => s.title.trim() || s.desc.trim()),
    }
    try {
      if (editing === 'new') await addSop(data)
      else await updateSop(editing, data)
      setEditing(null)
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this SOP? This cannot be undone.')) return
    await deleteSop(editing)
    setEditing(null)
  }

  if (editing !== null) {
    return (
      <div>
        <button onClick={cancel} style={styles.backBtn}>← Back to SOPs</button>
        <h2 style={styles.sectionTitle}>{editing === 'new' ? 'Add SOP' : 'Edit SOP'}</h2>
        <form onSubmit={save} style={styles.form}>
          {/* Basic info */}
          <div style={styles.row}>
            <Field label="Title *" required value={form.title} onChange={v => set('title', v)} placeholder="How to run a client call" />
            <Field label="Category *" required value={form.category} onChange={v => set('category', v)} placeholder="Client Relations" />
          </div>
          <div style={styles.row}>
            <Field label="Icon (emoji)" value={form.icon} onChange={v => set('icon', v)} placeholder="📋" maxLength={4} />
            <Field label="Duration" value={form.duration} onChange={v => set('duration', v)} placeholder="12 min" />
          </div>
          <div style={styles.row}>
            <Field label="Owner" value={form.owner} onChange={v => set('owner', v)} placeholder="Harish" />
          </div>
          <TextareaField label="Description" value={form.description} onChange={v => set('description', v)} rows={3} placeholder="Short description of what this SOP covers..." />

          {/* Links */}
          <div style={styles.fieldset}>
            <div style={styles.fieldsetLabel}>Links</div>
            <div style={styles.row}>
              <Field label="Video URL (YouTube or other)" value={form.videoUrl} onChange={v => set('videoUrl', v)} placeholder="https://youtube.com/watch?v=..." />
              <Field label="Google Drive document URL" value={form.documentUrl} onChange={v => set('documentUrl', v)} placeholder="https://docs.google.com/..." />
            </div>
          </div>

          {/* Steps */}
          <div style={styles.fieldset}>
            <div style={styles.fieldsetLabel}>Step-by-step breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {form.steps.map((step, i) => (
                <div key={i} style={styles.stepRow}>
                  <div style={styles.stepNum}>{i + 1}</div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input
                      value={step.title}
                      onChange={e => setStep(i, 'title', e.target.value)}
                      placeholder={`Step ${i + 1} title`}
                    />
                    <textarea
                      value={step.desc}
                      onChange={e => setStep(i, 'desc', e.target.value)}
                      rows={2}
                      placeholder="Description (optional)"
                    />
                  </div>
                  {form.steps.length > 1 && (
                    <button type="button" onClick={() => removeStep(i)} style={styles.removeBtn}>✕</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addStep} style={{ ...btn('ghost'), marginTop: 8, fontSize: 13 }}>
              + Add step
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" disabled={saving} style={{ ...btn('primary'), opacity: saving ? .6 : 1 }}>
              {saving ? 'Saving…' : editing === 'new' ? 'Add SOP' : 'Save changes'}
            </button>
            <button type="button" onClick={cancel} style={btn('ghost')}>Cancel</button>
          </div>
        </form>

        {editing !== 'new' && (
          <>
            <div style={styles.divider} />
            <div style={styles.dangerSection}>
              <div style={styles.dangerLabel}>Danger zone</div>
              <p style={styles.dangerDesc}>Permanently delete this SOP. This cannot be undone.</p>
              <button onClick={handleDelete} style={{ ...btn('ghost'), color: '#c0392b', borderColor: 'rgba(192,57,43,.3)' }}>
                Delete SOP
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={styles.sectionTitle}>Standard Operating Procedures</h2>
        <button onClick={openNew} style={btn('primary')}>+ Add SOP</button>
      </div>

      {sops.length === 0 ? (
        <div style={styles.empty}>No SOPs yet. Add your first one.</div>
      ) : (
        <div style={styles.list}>
          {sops.map(s => (
            <div key={s.id} style={styles.sopRow}>
              <div style={styles.sopIcon}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: T.heading }}>{s.title}</div>
                <div style={{ fontSize: 13, opacity: .55 }}>{s.category} · {s.duration} · {s.steps?.length || 0} steps</div>
              </div>
              {s.videoUrl    && <span style={styles.tag}>▶ Video</span>}
              {s.documentUrl && <span style={styles.tag}>📄 Doc</span>}
              <button onClick={() => openEdit(s)} style={{ ...btn('card'), padding: '7px 14px', fontSize: 13 }}>✏️ Edit</button>
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
  backBtn:      { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: T.heading, opacity: .6, fontFamily: 'inherit', marginBottom: 20, padding: 0 },
  sectionTitle: { fontFamily: "'Inter',sans-serif", fontSize: 20, fontWeight: 700, color: T.heading, marginBottom: 20 },
  form:         { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 },
  row:          { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  fieldset:     { display: 'flex', flexDirection: 'column', gap: 12, background: T.card, borderRadius: 12, padding: '16px 18px' },
  fieldsetLabel:{ fontSize: 12, fontWeight: 700, color: T.heading, opacity: .5, textTransform: 'uppercase', letterSpacing: '.07em' },
  stepRow:      { display: 'flex', gap: 12, alignItems: 'flex-start' },
  stepNum:      { width: 28, height: 28, borderRadius: '50%', background: T.dark, color: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0, marginTop: 8 },
  removeBtn:    { background: 'none', border: 'none', cursor: 'pointer', color: T.text, opacity: .4, fontSize: 16, padding: '8px 4px', fontFamily: 'inherit', marginTop: 6 },
  list:         { display: 'flex', flexDirection: 'column', gap: 8 },
  sopRow:       { display: 'flex', alignItems: 'center', gap: 14, background: T.card, borderRadius: 12, padding: '14px 16px' },
  sopIcon:      { width: 40, height: 40, borderRadius: 10, background: T.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
  tag:          { fontSize: 11, fontWeight: 600, background: 'rgba(55,74,62,.08)', color: T.heading, padding: '3px 10px', borderRadius: 100, opacity: .7 },
  empty:        { background: T.card, borderRadius: 14, padding: '32px', textAlign: 'center', color: T.text, opacity: .6 },
  divider:      { maxWidth: 720, borderTop: '1.5px solid rgba(55,74,62,.08)', margin: '28px 0 0' },
  dangerSection:{ maxWidth: 720, paddingTop: 20 },
  dangerLabel:  { fontSize: 13, fontWeight: 700, color: '#c0392b', marginBottom: 4 },
  dangerDesc:   { fontSize: 13, color: T.text, opacity: .6, marginBottom: 12 },
}
