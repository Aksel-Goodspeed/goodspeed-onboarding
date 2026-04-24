import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Logo from '../shared/Logo'
import MeetTeam from './MeetTeam'
import SOPs from './SOPs'
import Goals from './Goals'
import EditProfile from './EditProfile'
import Chatbot from '../shared/Chatbot'
import { T, btn } from '../../styles/tokens'

const NAV = [
  { id: 'home',    label: 'Home'          },
  { id: 'team',    label: 'Meet the Team' },
  { id: 'sops',    label: 'SOPs'          },
  { id: 'goals',   label: 'My Goals'      },
  { id: 'profile', label: 'My Profile'    },
]

export default function HomeDashboard() {
  const { currentEmployee, logout, sops, getGoalsForEmployee } = useApp()
  const navigate = useNavigate()
  const [section, setSection] = useState('home')

  const watchedCount = currentEmployee?.watchedSOPs?.length || 0
  const myGoals = getGoalsForEmployee(currentEmployee)
  const completedGoals = (currentEmployee?.completedGoals || [])
  const completedGoalCount = myGoals.filter(g => completedGoals.includes(g.id)).length

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <Logo width={110} />
        <nav style={styles.nav}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setSection(n.id)}
              style={{ ...styles.navBtn, ...(section === n.id ? styles.navBtnActive : {}) }}>
              {n.label}
            </button>
          ))}
        </nav>
        <div style={styles.headerRight}>
          <div style={{ ...styles.userChip, cursor: 'pointer' }} onClick={() => setSection('profile')}>
            {currentEmployee?.profilePicture ? (
              <img src={currentEmployee.profilePicture} alt={currentEmployee.name} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={styles.userAvatar}>
                {currentEmployee?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span>{currentEmployee?.name}</span>
          </div>
          <button onClick={handleLogout}
            style={{ ...btn('ghost'), padding: '7px 14px', fontSize: 13 }}>
            Sign out
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {section === 'home'    && <HomeSection employee={currentEmployee} watchedCount={watchedCount} setSection={setSection} totalSops={sops.length} completedGoalCount={completedGoalCount} totalGoals={myGoals.length} goals={myGoals} completedGoalIds={completedGoals} />}
        {section === 'team'    && <MeetTeam />}
        {section === 'sops'    && <SOPs />}
        {section === 'goals'   && <Goals />}
        {section === 'profile' && <EditProfile />}
      </main>

      <Chatbot employee={currentEmployee} />
    </div>
  )
}

function stripHtml(html) {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return (tmp.textContent || '').replace(/\s+/g, ' ').trim()
}

function formatDueRelative(dateStr) {
  const due = new Date(dateStr + 'T23:59:59')
  if (isNaN(due)) return ''
  const days = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24))
  if (days < 0)   return `Overdue by ${-days} day${-days === 1 ? '' : 's'}`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  if (days <= 14) return `Due in ${days} days`
  return due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function HomeSection({ employee, watchedCount, setSection, totalSops, completedGoalCount, totalGoals, goals, completedGoalIds }) {
  const upcoming = (goals || [])
    .filter(g => g.dueDate && !completedGoalIds.includes(g.id))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4)

  return (
    <div className="animate-fadeUp">
      <div style={styles.welcomeRow}>
        <div>
          <h1 style={styles.h1}>
            Good to see you, {employee?.name}. <span className="animate-wave">👋</span>
          </h1>
          <p style={styles.welcomeSub}>
            Welcome to your Goodspeed workspace. Everything you need is here.
          </p>
        </div>
        <div style={styles.startBadge}>
          <span style={{ fontSize: 11, opacity: .6 }}>Started</span>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{employee?.startDate || 'Recently'}</span>
          <span style={{ fontSize: 11, opacity: .6 }}>{employee?.role}</span>
        </div>
      </div>

      {/* Quick access cards */}
      <div style={styles.cards}>
        <div onClick={() => setSection('team')} style={{ ...styles.accessCard, cursor: 'pointer' }}>
          <div style={styles.cardIcon} className="animate-cardIn delay-1">👥</div>
          <div style={styles.cardLabel}>Meet the Team</div>
          <div style={styles.cardSub}>5 people · Click to explore</div>
          <div style={styles.cardArrow}>→</div>
        </div>

        <div onClick={() => setSection('sops')} style={{ ...styles.accessCard, cursor: 'pointer' }}>
          <div style={styles.cardIcon} className="animate-cardIn delay-2">📋</div>
          <div style={styles.cardLabel}>SOPs</div>
          <div style={styles.cardSub}>
            {watchedCount} of {totalSops} watched
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ height: 4, background: 'rgba(55,74,62,.12)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${(watchedCount / totalSops) * 100}%`, background: T.accent, borderRadius: 2, transition: 'width .5s' }} />
            </div>
          </div>
          <div style={styles.cardArrow}>→</div>
        </div>

        <div style={{ ...styles.accessCard, background: T.dark }}>
          <div style={{ ...styles.cardIcon, background: 'rgba(198,221,102,.15)' }}>🤖</div>
          <div style={{ ...styles.cardLabel, color: T.white }}>Ask Goodie</div>
          <div style={{ ...styles.cardSub, color: 'rgba(251,253,252,.5)' }}>Your onboarding assistant</div>
          <div style={{ ...styles.cardArrow, color: T.accent }}>↓</div>
        </div>

        <div onClick={() => setSection('goals')} style={{ ...styles.accessCard, cursor: 'pointer' }}>
          <div style={styles.cardIcon} className="animate-cardIn delay-3">🎯</div>
          <div style={styles.cardLabel}>My Goals</div>
          <div style={styles.cardSub}>
            {completedGoalCount} of {totalGoals} complete
          </div>
          {totalGoals > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ height: 4, background: 'rgba(55,74,62,.12)', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${Math.round((completedGoalCount / totalGoals) * 100)}%`, background: T.accent, borderRadius: 2, transition: 'width .5s' }} />
              </div>
            </div>
          )}
          <div style={styles.cardArrow}>→</div>
        </div>
      </div>

      {/* Upcoming goals */}
      {upcoming.length > 0 && (
        <div style={styles.upcomingSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 17, fontWeight: 700, color: T.heading }}>
              Upcoming goals
            </span>
            <button onClick={() => setSection('goals')}
              style={{ ...btn('ghost'), padding: '5px 12px', fontSize: 12 }}>
              View all →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {upcoming.map(g => {
              const days = Math.ceil((new Date(g.dueDate + 'T23:59:59') - new Date()) / (1000 * 60 * 60 * 24))
              const isOverdue = days < 0
              const isSoon = days >= 0 && days <= 7
              return (
                <div key={g.id} style={styles.upcomingRow} onClick={() => setSection('goals')}>
                  <div style={styles.upcomingIcon}>{g.icon || '🎯'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: T.heading }}>{g.title}</div>
                    {g.description && (
                      <div style={{ fontSize: 12, color: T.text, opacity: .55, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {stripHtml(g.description)}
                      </div>
                    )}
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
                    background: isOverdue ? '#c0392b' : isSoon ? T.accent : 'rgba(55,74,62,.1)',
                    color:      isOverdue ? '#fff'    : isSoon ? T.dark  : T.heading,
                    whiteSpace: 'nowrap',
                  }}>
                    {formatDueRelative(g.dueDate)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div style={styles.progressSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: T.heading }}>Onboarding complete</span>
          <span style={{ fontSize: 14, color: T.accent, fontWeight: 700 }}>100%</span>
        </div>
        <div style={{ height: 6, background: T.card, borderRadius: 3 }}>
          <div style={{ height: '100%', width: '100%', background: T.accent, borderRadius: 3 }} />
        </div>
        <p style={{ fontSize: 13, opacity: .55, marginTop: 8 }}>
          You finished onboarding on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · {totalSops - watchedCount > 0 ? `${totalSops - watchedCount} SOPs left to watch` : 'All SOPs watched 🎉'}
        </p>
      </div>
    </div>
  )
}

const styles = {
  page:   { minHeight: '100vh', background: T.bg },
  header: {
    position: 'sticky', top: 0, zIndex: 100,
    height: 64, display: 'flex', alignItems: 'center', gap: 24,
    padding: '0 40px', background: T.bg,
    borderBottom: `1px solid rgba(55,74,62,.08)`,
  },
  nav:    { display: 'flex', gap: 4, flex: 1, justifyContent: 'center' },
  navBtn: {
    padding: '7px 16px', borderRadius: 100, border: 'none', cursor: 'pointer',
    fontSize: 14, fontWeight: 600, color: T.heading, background: 'transparent',
    fontFamily: 'inherit', opacity: .6, transition: 'all .2s',
  },
  navBtnActive: { background: T.card, opacity: 1 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' },
  userChip: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: T.heading },
  userAvatar: {
    width: 30, height: 30, borderRadius: '50%',
    background: T.dark, color: T.accent,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700,
  },
  main: { maxWidth: 900, margin: '0 auto', padding: '40px 24px' },
  // Home section
  welcomeRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 16 },
  h1:         { fontFamily: "'Inter',sans-serif", fontSize: 'clamp(24px,3.5vw,34px)', fontWeight: 800, color: T.heading, marginBottom: 6 },
  welcomeSub: { fontSize: 15, color: T.text, opacity: .6 },
  startBadge: { background: T.card, borderRadius: 12, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 2, minWidth: 140 },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 32 },
  accessCard: {
    background: T.card, borderRadius: 16, padding: '24px',
    cursor: 'default', transition: 'transform .2s, box-shadow .2s',
    position: 'relative',
  },
  cardIcon:  { width: 48, height: 48, borderRadius: 12, background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14 },
  cardLabel: { fontWeight: 700, fontSize: 16, color: T.heading, marginBottom: 5 },
  cardSub:   { fontSize: 13, color: T.text, opacity: .55 },
  cardArrow: { position: 'absolute', top: 20, right: 20, fontSize: 18, color: T.text, opacity: .3 },
  progressSection: { background: T.card, borderRadius: 14, padding: '20px 24px' },
  upcomingSection: { background: T.card, borderRadius: 14, padding: '20px 24px', marginBottom: 16 },
  upcomingRow:     { display: 'flex', alignItems: 'center', gap: 12, background: T.bg, borderRadius: 10, padding: '10px 12px', cursor: 'pointer', transition: 'transform .15s' },
  upcomingIcon:    { width: 32, height: 32, borderRadius: 8, background: T.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
}
