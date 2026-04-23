import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Logo from './shared/Logo'
import { T, btn } from '../styles/tokens'

export default function Landing() {
  const { adminLogin, employeeLogin, isAdmin, currentEmployee } = useApp()
  const navigate = useNavigate()

  const [mode,      setMode]      = useState('employee') // 'employee' | 'admin'
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [adminPass, setAdminPass] = useState('')
  const [error,     setError]     = useState('')

  // Auto-redirect if already logged in
  if (isAdmin)         { navigate('/admin', { replace: true }); return null }
  if (currentEmployee) { navigate('/home',  { replace: true }); return null }

  const handleEmployeeLogin = (e) => {
    e.preventDefault()
    setError('')
    const emp = employeeLogin(email, password)
    if (!emp) { setError('No account found with those credentials.'); return }
    navigate(emp.onboardingComplete ? '/home' : '/home')
  }

  const handleAdminLogin = (e) => {
    e.preventDefault()
    setError('')
    if (!adminLogin(adminPass)) { setError('Incorrect admin password.'); return }
    navigate('/admin')
  }

  return (
    <div style={styles.page}>
      <div style={styles.card} className="animate-fadeUp">
        <div style={styles.logoWrap}>
          <Logo width={130} />
        </div>

        <h2 style={styles.heading}>
          {mode === 'employee' ? 'Welcome back.' : 'Admin access.'}
        </h2>
        <p style={styles.sub}>
          {mode === 'employee'
            ? 'Sign in to your workspace.'
            : 'Enter the admin password to manage onboarding.'}
        </p>

        {mode === 'employee' ? (
          <form onSubmit={handleEmployeeLogin} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input
                type="email" required autoFocus
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@goodspeed.studio"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password" required
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={{ ...btn('primary'), width: '100%', justifyContent: 'center' }}>
              Sign In →
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdminLogin} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Admin password</label>
              <input
                type="password" required autoFocus
                value={adminPass} onChange={e => setAdminPass(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={{ ...btn('dark'), width: '100%', justifyContent: 'center' }}>
              Enter Dashboard →
            </button>
          </form>
        )}

        <div style={styles.divider}><span>or</span></div>

        <button
          onClick={() => { setMode(m => m === 'employee' ? 'admin' : 'employee'); setError('') }}
          style={{ ...btn('ghost'), width: '100%', justifyContent: 'center', fontSize: 14 }}
        >
          {mode === 'employee' ? '⚙️  Admin access' : '← Back to employee login'}
        </button>

        <p style={styles.hint}>
          {mode === 'employee'
            ? "New here? You'll have received an invite link by email."
            : "Admin: Harish · password hint: first name"}
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: T.bg,
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    background: T.bg,
    border: `1.5px solid rgba(55,74,62,.1)`,
    borderRadius: 20,
    padding: '36px 32px',
    boxShadow: '0 4px 32px rgba(36,47,40,.07)',
  },
  logoWrap: { marginBottom: 32 },
  heading: {
    fontFamily: "'Inter','Arial Black',sans-serif",
    fontSize: 28,
    fontWeight: 800,
    color: T.heading,
    marginBottom: 6,
  },
  sub: { fontSize: 15, color: T.text, opacity: .65, marginBottom: 28 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: T.heading },
  error: { fontSize: 13, color: '#c0392b', background: '#fdf0ee', padding: '8px 12px', borderRadius: 8 },
  divider: {
    textAlign: 'center',
    position: 'relative',
    margin: '20px 0',
    color: 'rgba(55,74,62,.35)',
    fontSize: 13,
  },
  hint: {
    marginTop: 16,
    fontSize: 12,
    color: T.text,
    opacity: .4,
    textAlign: 'center',
    lineHeight: 1.5,
  },
}
