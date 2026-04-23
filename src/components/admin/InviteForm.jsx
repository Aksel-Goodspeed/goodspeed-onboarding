import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Logo from '../shared/Logo'
import { T, btn } from '../../styles/tokens'

export default function InviteForm() {
  const { addEmployee } = useApp()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', role: '', startDate: '',
    managerName: 'Aksel',
    personalMessage: '',
  })
  const [created, setCreated] = useState(null)
  const [copied,  setCopied]  = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const emp = addEmployee(form)
    setCreated(emp)
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
      <div style={styles.page}>
        <header style={styles.header}>
          <Logo width={110} />
          <button onClick={() => navigate('/admin')} style={{ ...btn('ghost'), padding: '8px 16px', fontSize: 13 }}>
            ← Dashboard
          </button>
        </header>
        <div style={styles.main}>
          <div style={styles.successCard} className="animate-fadeUp">
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
            <h2 style={{ ...styles.h2, marginBottom: 8 }}>Invite created!</h2>
            <p style={{ fontSize: 15, opacity: .7, marginBottom: 28, maxWidth: 380, margin: '0 auto 28px' }}>
              Share this link with <strong>{created.name}</strong>. They'll use it to set up their account and start onboarding.
            </p>

            <div style={styles.linkBox}>
              <span style={styles.linkText}>{inviteUrl}</span>
              <button onClick={copyLink} style={{ ...btn('primary'), padding: '10px 20px', fontSize: 14, flexShrink: 0 }}>
                {copied ? '✓ Copied!' : 'Copy link'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
              <button onClick={() => { setCreated(null); setForm({ name:'',email:'',role:'',startDate:'',managerName:'Aksel',personalMessage:'' }) }} style={btn('ghost')}>
                Invite another
              </button>
              <button onClick={() => navigate('/admin')} style={btn('dark')}>
                Back to dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <Logo width={110} />
        <button onClick={() => navigate('/admin')} style={{ ...btn('ghost'), padding: '8px 16px', fontSize: 13 }}>
          ← Dashboard
        </button>
      </header>

      <div style={styles.main}>
        <div className="animate-fadeUp">
          <div style={{ marginBottom: 32 }}>
            <h1 style={styles.h1}>Invite a new employee</h1>
            <p style={{ fontSize: 15, opacity: .65 }}>Fill in their details. You'll get a shareable onboarding link.</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Name + Email */}
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

            {/* Role + Start date */}
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Role *</label>
                <input required value={form.role} onChange={e => set('role', e.target.value)} placeholder="Product Designer" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Start date</label>
                <input value={form.startDate} onChange={e => set('startDate', e.target.value)} placeholder="April 22, 2026" />
              </div>
            </div>

            {/* Manager */}
            <div style={styles.field}>
              <label style={styles.label}>Manager name</label>
              <input value={form.managerName} onChange={e => set('managerName', e.target.value)} placeholder="Aksel" />
            </div>

            {/* Personal message */}
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

            <button type="submit" style={{ ...btn('primary'), alignSelf: 'flex-start' }}>
              Create invite →
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page:    { minHeight: '100vh', background: T.bg },
  header:  {
    position: 'sticky', top: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 40px', height: 64,
    background: T.bg, borderBottom: `1px solid rgba(55,74,62,.08)`,
  },
  main:    { maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' },
  h1:      { fontFamily: "'Inter',sans-serif", fontSize: 30, fontWeight: 800, color: T.heading, marginBottom: 6 },
  h2:      { fontFamily: "'Inter',sans-serif", fontSize: 26, fontWeight: 800, color: T.heading, textAlign: 'center' },
  form:    { display: 'flex', flexDirection: 'column', gap: 20 },
  row:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field:   { display: 'flex', flexDirection: 'column', gap: 6 },
  label:   { fontSize: 13, fontWeight: 600, color: T.heading },
  successCard: {
    background: T.card, borderRadius: 20, padding: '48px 32px',
    textAlign: 'center', maxWidth: 520, margin: '0 auto',
  },
  linkBox: {
    display: 'flex', alignItems: 'center', gap: 12,
    background: T.bg, border: `1.5px solid rgba(55,74,62,.15)`,
    borderRadius: 12, padding: '10px 10px 10px 16px',
    textAlign: 'left',
  },
  linkText: { fontSize: 13, color: T.text, opacity: .6, flex: 1, wordBreak: 'break-all', fontFamily: 'monospace' },
}
