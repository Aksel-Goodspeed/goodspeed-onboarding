import { useApp } from '../../../context/AppContext'
import { T, eyebrow, h2Style, lead } from '../../../styles/tokens'

function stripHtml(html) {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return (tmp.textContent || '').replace(/\s+/g, ' ').trim()
}

function formatDue(dateStr) {
  if (!dateStr) return 'Ongoing'
  const d = new Date(dateStr + 'T23:59:59')
  if (isNaN(d)) return 'Ongoing'
  const days = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24))
  if (days < 0)   return `Overdue by ${-days} day${-days === 1 ? '' : 's'}`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  if (days <= 14) return `Due in ${days} days`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function GoalsStep({ employee }) {
  const { getGoalsForEmployee } = useApp()
  const goals = getGoalsForEmployee(employee)

  const personal = goals.filter(g => g.type === 'individual')
  const other    = goals.filter(g => g.type !== 'individual')

  return (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <div style={eyebrow}>The plan</div>
      <h2 style={h2Style}>Your goals.</h2>
      <p style={{ ...lead, marginBottom: 28 }}>
        Here's what you're working toward — built for you and shared by the team. You'll shape the details with your manager.
      </p>

      {goals.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎯</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: T.heading, marginBottom: 4 }}>No goals yet</div>
          <div style={{ fontSize: 13, opacity: .55 }}>Your manager will add goals soon — they'll show up here and on your dashboard.</div>
        </div>
      ) : (
        <>
          <Section
            title="Your personal goals"
            subtitle="Goals assigned directly to you."
            tone="dark"
            goals={personal}
            emptyHint="No personal goals yet — these will be assigned by your manager."
          />
          <Section
            title="Other goals"
            subtitle="Shared across the team or your role."
            tone="light"
            goals={other}
            emptyHint="No team-wide goals are active right now."
          />
        </>
      )}
    </div>
  )
}

function Section({ title, subtitle, tone, goals, emptyHint }) {
  const isDark = tone === 'dark'
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={styles.sectionHeader}>
        <div>
          <div style={{
            ...styles.sectionPill,
            background: isDark ? T.dark : T.accent,
            color:      isDark ? T.accent : T.dark,
          }}>
            {title}
          </div>
          <div style={styles.sectionSub}>{subtitle}</div>
        </div>
        {goals.length > 0 && (
          <span style={styles.countBadge}>{goals.length}</span>
        )}
      </div>

      {goals.length === 0 ? (
        <div style={styles.sectionEmpty}>{emptyHint}</div>
      ) : (
        <div style={styles.list}>
          {goals.map((g, i) => (
            <div key={g.id} className={`animate-cardIn delay-${(i % 4) + 1}`}
              style={{ ...styles.card, ...(isDark ? styles.cardDark : {}) }}>
              <div style={{ ...styles.icon, background: isDark ? 'rgba(198,221,102,.18)' : T.bg }}>
                {g.icon || '🎯'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...styles.title, color: isDark ? T.white : T.heading }}>
                  {g.title}
                </div>
                {g.description && (
                  <div style={{ ...styles.desc, color: isDark ? 'rgba(251,253,252,.7)' : T.text }}>
                    {stripHtml(g.description)}
                  </div>
                )}
                <div style={styles.metaRow}>
                  {g.type === 'role' && g.role && (
                    <span style={{ ...styles.metaPill, background: isDark ? 'rgba(255,255,255,.08)' : 'rgba(55,74,62,.08)', color: isDark ? T.accent : T.heading }}>
                      {g.role}
                    </span>
                  )}
                  {g.type === 'global' && (
                    <span style={{ ...styles.metaPill, background: isDark ? 'rgba(255,255,255,.08)' : 'rgba(55,74,62,.08)', color: isDark ? T.accent : T.heading }}>
                      Team-wide
                    </span>
                  )}
                  <span style={{ ...styles.metaPill, background: isDark ? T.accent : T.dark, color: isDark ? T.dark : T.accent }}>
                    {formatDue(g.dueDate)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  sectionHeader: {
    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
    marginBottom: 12, gap: 12,
  },
  sectionPill: {
    fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
    padding: '5px 12px', borderRadius: 100, display: 'inline-block', marginBottom: 6,
  },
  sectionSub: { fontSize: 13, color: T.text, opacity: .6 },
  countBadge: {
    fontSize: 12, fontWeight: 700, color: T.heading, opacity: .55,
  },
  sectionEmpty: {
    fontSize: 13, color: T.text, opacity: .55, fontStyle: 'italic',
    background: T.card, borderRadius: 12, padding: '16px 18px',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 10 },
  card: {
    display: 'flex', alignItems: 'flex-start', gap: 14,
    background: T.card, borderRadius: 14, padding: '16px 18px',
    border: '2px solid transparent',
  },
  cardDark: {
    background: T.dark, border: '2px solid transparent',
  },
  icon: {
    width: 40, height: 40, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, flexShrink: 0,
  },
  title: { fontWeight: 700, fontSize: 15, marginBottom: 4 },
  desc: { fontSize: 13, lineHeight: 1.5, opacity: .8, marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  metaRow: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  metaPill: {
    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
    whiteSpace: 'nowrap',
  },
  empty: {
    background: T.card, borderRadius: 16, padding: '40px 20px',
    textAlign: 'center', color: T.text,
  },
}
