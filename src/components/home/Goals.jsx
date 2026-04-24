import { useApp } from '../../context/AppContext'
import { T } from '../../styles/tokens'

const BUCKET_ORDER = ['overdue', 'soon', 'later', 'ongoing']
const BUCKET_LABELS = {
  overdue: 'Overdue',
  soon:    'Due soon',
  later:   'Later',
  ongoing: 'Ongoing',
}

function endOfDay(dateStr) {
  const d = new Date(dateStr + 'T23:59:59')
  return isNaN(d) ? null : d
}

function daysUntil(dateStr) {
  const due = endOfDay(dateStr)
  if (!due) return null
  const now = new Date()
  return Math.ceil((due - now) / (1000 * 60 * 60 * 24))
}

function bucketFor(goal) {
  if (!goal.dueDate) return 'ongoing'
  const d = daysUntil(goal.dueDate)
  if (d == null)     return 'ongoing'
  if (d < 0)         return 'overdue'
  if (d <= 7)        return 'soon'
  return 'later'
}

function formatDue(goal) {
  if (!goal.dueDate) return 'Ongoing'
  const d = daysUntil(goal.dueDate)
  if (d == null) return 'Ongoing'
  if (d < 0)  return `Overdue by ${-d} day${-d === 1 ? '' : 's'}`
  if (d === 0) return 'Due today'
  if (d === 1) return 'Due tomorrow'
  if (d <= 14) return `Due in ${d} days`
  return new Date(goal.dueDate + 'T23:59:59').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function Goals() {
  const { currentEmployee, getGoalsForEmployee, toggleGoalComplete } = useApp()

  const goals = getGoalsForEmployee(currentEmployee)
  const completed = (currentEmployee?.completedGoals || [])
  const completedCount = goals.filter(g => completed.includes(g.id)).length
  const total = goals.length
  const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0

  // Group goals by date proximity
  const buckets = goals.reduce((acc, g) => {
    const key = bucketFor(g)
    ;(acc[key] = acc[key] || []).push(g)
    return acc
  }, {})

  // Sort each bucket by due date ascending (ongoing stays by order)
  Object.keys(buckets).forEach(k => {
    if (k === 'ongoing') return
    buckets[k].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  })

  const groups = BUCKET_ORDER
    .filter(k => buckets[k] && buckets[k].length > 0)
    .map(k => ({ label: BUCKET_LABELS[k], items: buckets[k], key: k }))

  return (
    <div className="animate-fadeUp">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={styles.h1}>My Goals</h1>
        <p style={styles.sub}>Track your progress through onboarding milestones.</p>
      </div>

      {/* Progress summary */}
      <div style={styles.progressCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: T.heading }}>
            {completedCount} of {total} goals complete
          </span>
          <span style={{ fontSize: 15, fontWeight: 800, color: T.accent }}>{progress}%</span>
        </div>
        <div style={{ height: 8, background: 'rgba(55,74,62,.12)', borderRadius: 4 }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: T.accent,
            borderRadius: 4,
            transition: 'width .5s',
          }} />
        </div>
        {total === 0 && (
          <p style={{ fontSize: 13, opacity: .5, marginTop: 10 }}>
            No goals assigned yet. Your manager will add goals soon.
          </p>
        )}
      </div>

      {/* Goal groups */}
      {groups.map(({ label, items, key }) => (
        <div key={label} style={{ marginBottom: 28 }}>
          <div style={styles.groupHeader}>
            <span style={{
              ...styles.groupPill,
              ...(key === 'overdue' ? { background: '#c0392b', color: '#fff' } : {}),
              ...(key === 'soon'    ? { background: T.accent, color: T.dark } : {}),
            }}>{label}</span>
          </div>
          <div style={styles.goalList}>
            {items.map(goal => {
              const isDone = completed.includes(goal.id)
              return (
                <div
                  key={goal.id}
                  style={{ ...styles.goalCard, ...(isDone ? styles.goalCardDone : {}) }}
                  onClick={() => toggleGoalComplete(currentEmployee.id, goal.id)}
                >
                  <div style={styles.goalIcon}>{goal.icon || '🎯'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...styles.goalTitle, ...(isDone ? { textDecoration: 'line-through', opacity: .5 } : {}) }}>
                      {goal.title}
                    </div>
                    {goal.description && (
                      <div style={{ ...styles.goalDesc, ...(isDone ? { opacity: .35 } : {}) }}>
                        {goal.description}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                      {goal.type !== 'global' && (
                        <span style={styles.typePill}>
                          {goal.type === 'role' ? goal.role : 'Personal'}
                        </span>
                      )}
                      {!isDone && (
                        <span style={styles.typePill}>{formatDue(goal)}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ ...styles.checkbox, ...(isDone ? styles.checkboxDone : {}) }}>
                    {isDone && <span style={{ fontSize: 14, lineHeight: 1 }}>✓</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {total === 0 && (
        <div style={styles.empty}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <p style={{ fontWeight: 600, color: T.heading, marginBottom: 4 }}>No goals yet</p>
          <p style={{ fontSize: 13, opacity: .5 }}>Goals assigned to you or your role will appear here.</p>
        </div>
      )}
    </div>
  )
}

const styles = {
  h1:           { fontFamily: "'Inter',sans-serif", fontSize: 'clamp(24px,3.5vw,34px)', fontWeight: 800, color: T.heading, marginBottom: 6 },
  sub:          { fontSize: 15, color: T.text, opacity: .6 },
  progressCard: { background: T.card, borderRadius: 14, padding: '20px 24px', marginBottom: 32 },
  groupHeader:  { marginBottom: 12 },
  groupPill:    {
    fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
    background: T.dark, color: T.accent,
    padding: '4px 12px', borderRadius: 100,
  },
  goalList:     { display: 'flex', flexDirection: 'column', gap: 10 },
  goalCard:     {
    display: 'flex', alignItems: 'center', gap: 14,
    background: T.card, borderRadius: 14, padding: '16px 18px',
    cursor: 'pointer', transition: 'all .2s',
    border: '2px solid transparent',
  },
  goalCardDone: {
    background: `rgba(198,221,102,.08)`,
    border: `2px solid rgba(198,221,102,.25)`,
  },
  goalIcon:     {
    width: 44, height: 44, borderRadius: 12,
    background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, flexShrink: 0,
  },
  goalTitle:    { fontWeight: 700, fontSize: 15, color: T.heading, marginBottom: 3 },
  goalDesc:     { fontSize: 13, color: T.text, opacity: .65, lineHeight: 1.5 },
  typePill:     {
    display: 'inline-block', marginTop: 6,
    fontSize: 10, fontWeight: 700, background: 'rgba(55,74,62,.1)',
    color: T.heading, padding: '2px 8px', borderRadius: 100,
  },
  checkbox:     {
    width: 24, height: 24, borderRadius: 8, flexShrink: 0,
    border: `2px solid rgba(55,74,62,.2)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all .2s',
  },
  checkboxDone: {
    background: T.accent, borderColor: T.accent, color: T.dark,
  },
  empty:        {
    background: T.card, borderRadius: 16, padding: '60px 24px',
    textAlign: 'center', color: T.text,
  },
}
