import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Logo from './shared/Logo'
import { T, btn } from '../styles/tokens'

export default function PasswordReset() {
  const { token }  = useParams()
  const { getByToken, updateEmployee, generateResetToken } = useApp()
  const navigate   = useNavigate()

  const [employee,  setEmployee]  = useState(null)
  const [ready,     setReady]     = useState(false)  // finished looking up token
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [error,     setError]     = useState('')
  const [saving,    setSaving]    = useState(false)
  const [done,      setDone]      = useState(false)

  useEffect(() => {
    getByToken(token).then(emp => {
      setEmployee(emp)
      setReady(true)
    })
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setSaving(true)
    try {
      // Update password and rotate the token so the reset link becomes single-use
      await updateEmployee(employee.id, { password })
      await generateResetToken(employee.id)
      setDone(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!ready) return null

  if (!employee) {
    return (
      <div style={styles.page}>
        <div style={styles.card} className="animate-fadeUp">
          <Logo width={120} />
          <h2 style={{ ...styles.heading, marginTop: 28 }}>Link expired</h2>
          <p style={styles.sub}>This password reset link is no longer valid. Ask your admin to generate a new one.</p>
          <button onClick={() => navigate('/')} style={{ ...btn('ghost'), marginTop: 8 }}>Back to sign in</button>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div style={styles.page}>
        <div style={styles.card} className="animate-fadeUp">
          <Logo width={120} />
          <div style={{ fontSize: 40, margin: '24px 0 8px' }}>✓</div>
          <h2 style={styles.heading}>Password updated.</h2>
          <p style={styles.sub}>You can now sign in with your new password.</p>
          <button onClick={() => navigate('/')} style={{ ...btn('primary'), marginTop: 8, width: '100%', justifyContent: 'center' }}>
            Sign in →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.card} className="animate-fadeUp">
        <Logo width={120} />
        <h2 style={{ ...styles.heading, marginTop: 28 }}>Set a new password</h2>
        <p style={styles.sub}>Hi {employee.name} — choose a new password for your account.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>New password</label>
            <input
              type="password" required autoFocus
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Confirm password</label>
            <input
              type="password" required
              value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Same as above"
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button
            type="submit" disabled={saving}
            style={{ ...btn('primary'), width: '100%', justifyContent: 'center', opacity: saving ? .6 : 1 }}
          >
            {saving ? 'Saving…' : 'Set password →'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page:  { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.bg, padding: 24 },
  card:  { width: '100%', maxWidth: 400, background: T.bg, border: `1.5px solid rgba(55,74,62,.1)`, borderRadius: 20, padding: '36px 32px', boxShadow: '0 4px 32px rgba(36,47,40,.07)' },
  heading: { fontFamily: "'Inter','Arial Black',sans-serif", fontSize: 26, fontWeight: 800, color: T.heading, marginBottom: 6 },
  sub:   { fontSize: 15, color: T.text, opacity: .65, marginBottom: 24 },
  form:  { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: T.heading },
  error: { fontSize: 13, color: '#c0392b', background: '#fdf0ee', padding: '8px 12px', borderRadius: 8 },
}
