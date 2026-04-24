import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Logo from '../shared/Logo'
import TeamManager from './TeamManager'
import SOPManager from './SOPManager'
import { T, btn } from '../../styles/tokens'

const TABS = [
  { id: 'employees', label: 'People'  },
  { id: 'team',      label: 'Team'    },
  { id: 'sops',      label: 'SOPs'    },
]

export default function AdminDashboard() {
  const { employees, logout } = useApp()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(null)
  const [tab,    setTab]    = useState('employees')

  // Admin accounts are not onboarding users — exclude them from the People view
  const people    = employees.filter(e => !e.isAdmin)
  const total     = people.length
  const pending   = people.filter(e => !e.password).length
  const active    = people.filter(e => e.password && !e.onboardingComplete).length
  const completed = people.filter(e => e.onboardingComplete).length

  const copyLink = (token) => {
    const url = `${window.location.origin}${window.location.pathname}#/join/${token}`
    navigator.clipboard.writeText(url)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  const statusInfo = (emp) => {
    if (emp.onboardingComplete) return { label: 'Active',          color: T.accent,   bg: 'rgba(198,221,102,.18)' }
    if (emp.password)           return { label: 'In Onboarding',   color: T.gold,     bg: 'rgba(235,195,101,.18)' }
    return                             { label: 'Invite Pending',  color: T.coral,    bg: 'rgba(234,158,131,.18)' }
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <Logo width={110} />
        <div style={styles.headerRight}>
          <span style={styles.adminBadge}>Harish · Admin</span>
          <button onClick={() => { logout(); navigate('/') }} style={{ ...btn('ghost'), padding: '8px 16px', fontSize: 13 }}>
            Sign out
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Page title */}
        <div style={{ marginBottom: 28 }} className="animate-fadeUp">
          <h1 style={styles.h1}>Admin Dashboard</h1>
          <p style={styles.sub}>Manage employees, team members, and SOPs.</p>
        </div>

        {/* Tabs */}
        <div style={styles.tabBar}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ ...styles.tabBtn, ...(tab === t.id ? styles.tabBtnActive : {}) }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* People tab */}
        {tab === 'employees' && (
          <div className="animate-fadeUp">
            {/* Stats */}
            <div style={styles.statsRow}>
              {[
                { label: 'Total invited', value: total,     color: T.heading },
                { label: 'Invite pending', value: pending,  color: T.coral   },
                { label: 'In onboarding', value: active,    color: T.gold    },
                { label: 'Completed',     value: completed, color: T.accent  },
              ].map(s => (
                <div key={s.label} style={styles.statCard}>
                  <div style={{ ...styles.statNum, color: s.color }}>{s.value}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Invite CTA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '28px 0 16px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: T.heading }}>Employees</h2>
              <button onClick={() => navigate('/admin/invite')} style={btn('primary')}>
                + Invite employee
              </button>
            </div>

            {/* Employee list */}
            {people.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
                <p style={{ fontSize: 16, fontWeight: 600, color: T.heading, marginBottom: 6 }}>No employees yet</p>
                <p style={{ fontSize: 14, opacity: .6 }}>Invite your first team member to get started.</p>
              </div>
            ) : (
              <div style={styles.table}>
                <div style={styles.tableHead}>
                  <span>Employee</span>
                  <span>Role</span>
                  <span>Start date</span>
                  <span>Status</span>
                  <span>Invite link</span>
                </div>
                {people.map(emp => {
                  const s = statusInfo(emp)
                  return (
                    <div key={emp.id} style={styles.tableRow} className="animate-cardIn">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ ...styles.avatar, background: T.dark, color: T.accent }}>
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15, color: T.heading }}>{emp.name}</div>
                          <div style={{ fontSize: 12, opacity: .55 }}>{emp.email}</div>
                        </div>
                      </div>
                      <span style={styles.cell}>{emp.role}</span>
                      <span style={styles.cell}>{emp.startDate || '—'}</span>
                      <span>
                        <span style={{ ...styles.badge, color: s.color, background: s.bg }}>{s.label}</span>
                      </span>
                      <button
                        onClick={() => copyLink(emp.token)}
                        style={{ ...btn('card'), padding: '7px 14px', fontSize: 13 }}
                      >
                        {copied === emp.token ? '✓ Copied!' : '🔗 Copy link'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Team tab */}
        {tab === 'team' && (
          <div className="animate-fadeUp">
            <TeamManager />
          </div>
        )}

        {/* SOPs tab */}
        {tab === 'sops' && (
          <div className="animate-fadeUp">
            <SOPManager />
          </div>
        )}
      </main>
    </div>
  )
}

const styles = {
  page:   { minHeight: '100vh', background: T.bg },
  header: {
    position: 'sticky', top: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 40px', height: 64,
    background: T.bg, borderBottom: `1px solid rgba(55,74,62,.08)`,
  },
  headerRight:  { display: 'flex', alignItems: 'center', gap: 12 },
  adminBadge:   { fontSize: 13, fontWeight: 600, color: T.heading, opacity: .6 },
  main:         { maxWidth: 960, margin: '0 auto', padding: '40px 24px 80px' },
  h1:           { fontFamily: "'Inter',sans-serif", fontSize: 32, fontWeight: 800, color: T.heading, marginBottom: 6 },
  sub:          { fontSize: 15, color: T.text, opacity: .65 },
  tabBar:       { display: 'flex', gap: 0, marginBottom: 28, borderBottom: `1.5px solid rgba(55,74,62,.08)` },
  tabBtn:       {
    padding: '9px 20px 11px', background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 14, fontWeight: 600, color: T.heading, opacity: .45,
    fontFamily: 'inherit', borderBottom: '2px solid transparent', marginBottom: -1,
  },
  tabBtnActive: { opacity: 1, borderBottom: `2px solid ${T.dark}` },
  statsRow:     { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 },
  statCard:     { background: T.card, borderRadius: 14, padding: '18px 20px' },
  statNum:      { fontFamily: "'Inter',sans-serif", fontSize: 32, fontWeight: 900, lineHeight: 1, marginBottom: 4 },
  statLabel:    { fontSize: 13, color: T.text, opacity: .6 },
  table:        { display: 'flex', flexDirection: 'column', gap: 8 },
  tableHead:    {
    display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.2fr 1.2fr 1fr',
    padding: '8px 16px', fontSize: 12, fontWeight: 700,
    color: T.heading, opacity: .45, letterSpacing: '.05em', textTransform: 'uppercase',
  },
  tableRow: {
    display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.2fr 1.2fr 1fr',
    alignItems: 'center', padding: '14px 16px',
    background: T.card, borderRadius: 12,
    transition: 'background .2s',
  },
  avatar:    { width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 },
  cell:      { fontSize: 14, color: T.text, opacity: .8 },
  badge:     { fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 100 },
  emptyState: {
    background: T.card, borderRadius: 16, padding: '60px 24px',
    textAlign: 'center', color: T.text,
  },
}
