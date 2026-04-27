import { useState } from 'react'
import { useApp } from '../../../context/AppContext'
import { T, btn, eyebrow, h1Style, lead } from '../../../styles/tokens'

export default function WelcomeStep({ employee, onNext }) {
  const { updateEmployee } = useApp()
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [error,     setError]     = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8)         { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm)         { setError('Passwords don\'t match.'); return }
    updateEmployee(employee.id, { password })
    setSubmitted(true)
    setTimeout(() => onNext(), 800)
  }

  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <div className="animate-wave" style={{ fontSize: 56, marginBottom: 12 }}>👋</div>
      <h1 style={h1Style}>
        Hey <span style={{ color: T.accent, background: T.dark, padding: '0 12px', borderRadius: 8 }}>{employee.name}</span>.
      </h1>
      <p style={{ ...h1Style, fontSize: 'clamp(22px,3vw,30px)', opacity: .6, fontWeight: 700, marginBottom: 24 }}>
        Welcome to Goodspeed Studio.
      </p>

      <div style={styles.infoCard}>
        <div style={styles.infoIcon}>🎉</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.heading, marginBottom: 2 }}>
            Starting {employee.startDate || 'today'}
          </div>
          <div style={{ fontSize: 13, opacity: .6 }}>
            {employee.role} · Goodspeed Studio
          </div>
        </div>
      </div>

      <p style={{ ...lead, marginBottom: 32 }}>
        Before we start, let's set up your account password. You'll use this to sign in later.
      </p>

      {submitted ? (
        <div style={styles.successMsg}>
          <span>✓</span> Password set! Moving on…
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Create a password</label>
            <input
              type="password" required minLength={8} autoFocus
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Confirm password</label>
            <input
              type="password" required
              value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Same again"
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={{ ...btn('primary'), alignSelf: 'flex-start' }}>
            Set password & continue →
          </button>
        </form>
      )}
    </div>
  )
}

const styles = {
  infoCard: {
    display: 'flex', alignItems: 'center', gap: 12,
    background: T.card, borderRadius: 14, padding: '14px 18px',
    maxWidth: 360, marginBottom: 28,
  },
  infoIcon: {
    width: 40, height: 40, borderRadius: '50%',
    background: T.accent, display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 18, flexShrink: 0,
  },
  form:  { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: T.heading },
  error: { fontSize: 13, color: '#c0392b', background: '#fdf0ee', padding: '8px 12px', borderRadius: 8 },
  successMsg: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(198,221,102,.18)', color: T.dark,
    fontWeight: 700, fontSize: 15, padding: '14px 18px', borderRadius: 12,
  },
}
