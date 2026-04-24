import { useApp } from '../../context/AppContext'
import { T } from '../../styles/tokens'

const DUE_ORDER = ['30 days', '60 days', '90 days', 'Ongoing']

export default function Goals() {
  const { currentEmployee, getGoalsForEmployee, toggleGoalComplete } = useApp()

  const goals = getGoalsForEmployee(currentEmployee)
  const completed = (currentEmployee?.completedGoals || [])
  const completedCount = goals.filter(g => completed.includes(g.id)).length
  const total = goals.length
  const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0

  // Group goals by dueLabel
  const groups = DUE_ORDER.reduce((acc, label) => {
    const items = goals.filter(g => g.dueLabel === label)
    if (items.length > 0) acc.push({ label, items })
    return acc
  }, [])

  // Any goals with an unknown dueLabel
  const knownLabels = new Set(DUE_ORDER)
  const otherGoals = goals.filter(g => !knownLabels.has(g.dueLabel))
  if (otherGoals.length > 0) groups.push({ label: 'Other', items: otherGoals })

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
      {groups.map(({ label, items }) => (
        <div key={label} style={{ marginBottom: 28 }}>
          <div style={styles.groupHeader}>
            <span style={styles.groupPill}>{label}</span>
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
                    {goal.type !== 'global' && (
                      <span style={styles.typePill}>
                        {goal.type === 'role' ? goal.role : 'Personal'}
                      </span>
                    )}
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
