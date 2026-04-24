import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { T, btn } from '../../styles/tokens'

export default function InviteForm({ onBack }) {
  const { addEmployee } = useApp()

  const [form, setForm] = useState({
    name: '', email: '', role: '', startDate: '',
    managerName: 'Harish',
    personalMessage: '',
  })
  const [created,    setCreated]    = useState(null)
  const [copied,     setCopied]     = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const emp = await addEmployee(form)
      setCreated(emp)
    } catch (err) {
      console.error('Failed to create invite:', err)
      alert('Something went wrong. Check your Supabase connection.')
    } finally {
      setSubmitting(false)
    }
  }

  const inviteUrl = created
    ? `${window.location.origin}${window.location.pathname}#/join/${created.token}`
    : ''

  const copyLink = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (created) {
    return (
      <div>
        <button onClick={onBack} style={styles.backBtn}>← Back to employees</button>
        <h2 style={styles.sectionTitle}>Invite created!</h2>
        <p style={{ fontSize: 14, color: T.text, opacity: .65, marginBottom: 20, marginTop: -12 }}>
          Share this link with <strong>{created.name}</strong>. They'll use it to set up their account and start onboarding.
        </p>

        <div style={{ maxWidth: 680 }}>
          <div style={styles.resetBox}>
            <span style={styles.resetUrl}>{inviteUrl}</span>
            <button onClick={copyLink} style={{ ...btn('primary'), flexShrink: 0, padding: '6px 14px', fontSize: 13 }}>
              {copied ? '✓ Copied!' : 'Copy link'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button
              onClick={() => { setCreated(null); setForm({ name: '', email: '', role: '', startDate: '', managerName: 'Harish', personalMessage: '' }) }}
              style={btn('primary')}
            >
              Invite another
            </button>
            <button onClick={onBack} style={btn('ghost')}>Back to employees</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <button onClick={onBack} style={styles.backBtn}>← Back to employees</button>
      <h2 style={styles.sectionTitle}>Invite a new employee</h2>
      <p style={{ fontSize: 14, color: T.text, opacity: .65, marginBottom: 24, marginTop: -12 }}>
        Fill in their details. You'll get a shareable onboarding link.
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>First name *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Alex" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email address *</label>
            <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="alex@goodspeed.studio" />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Role *</label>
            <select required value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="">Select a role…</option>
              <option value="Developer">Developer</option>
              <option value="AI Developer">AI Developer</option>
              <option value="Designer">Designer</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Start date</label>
            <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} style={{ colorScheme: 'light' }} />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Manager name</label>
          <input value={form.managerName} onChange={e => set('managerName', e.target.value)} placeholder="Aksel" />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Personal welcome message</label>
          <p style={{ fontSize: 13, opacity: .55, marginBottom: 6 }}>
            This will be shown to {form.name || 'the employee'} during their onboarding.
          </p>
          <textarea
            value={form.personalMessage}
            onChange={e => set('personalMessage', e.target.value)}
            placeholder={`Hey ${form.name || 'there'}! I'm really excited you're joining the team. You're going to do great things here...`}
            rows={5}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" disabled={submitting} style={{ ...btn('primary'), opacity: submitting ? .6 : 1 }}>
            {submitting ? 'Creating…' : 'Create invite →'}
          </button>
          <button type="button" onClick={onBack} style={btn('ghost')}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

const styles = {
  backBtn:      { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: T.heading, opacity: .6, fontFamily: 'inherit', marginBottom: 20, padding: 0 },
  sectionTitle: { fontFamily: "'Inter',sans-serif", fontSize: 20, fontWeight: 700, color: T.heading, marginBottom: 20 },
  form:         { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 680 },
  row:          { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field:        { display: 'flex', flexDirection: 'column', gap: 6 },
  label:        { fontSize: 13, fontWeight: 600, color: T.heading },
  resetBox:     { display: 'flex', gap: 10, alignItems: 'center', background: T.card, borderRadius: 10, padding: '10px 14px' },
  resetUrl:     { flex: 1, fontSize: 12, color: T.text, opacity: .7, wordBreak: 'break-all', fontFamily: 'monospace' },
}
