import { useApp } from '../../../context/AppContext'
import { T, eyebrow, h2Style, lead } from '../../../styles/tokens'

const STATIC_GOALS = [
  {
    period:    '30 days',
    title:     'Get grounded.',
    bg:        T.card,
    textColor: T.heading,
    items: [
      'Learn the tools and core workflows',
      'Meet every person on the team',
      'Shadow two active client projects',
      'Set up your workspace your way',
    ],
  },
  {
    period:    '60 days',
    title:     'Find your footing.',
    bg:        T.dark,
    textColor: '#FBFDFC',
    items: [
      'Own at least one deliverable end-to-end',
      'Contribute to a live client project',
      'Share a candid piece of feedback',
      'Spot something to improve — say it out loud',
    ],
  },
  {
    period:    '90 days',
    title:     'Take the lead.',
    bg:        T.darkest,
    textColor: '#FBFDFC',
    items: [
      'Lead a feature from kickoff to ship',
      "Build a go-to workflow that's yours",
      'Help onboard or mentor a newer team member',
      'Set your own next 90-day goals',
    ],
  },
]

const PERIOD_STYLES = {
  '30 days': { bg: T.card,    textColor: T.heading  },
  '60 days': { bg: T.dark,    textColor: '#FBFDFC'  },
  '90 days': { bg: T.darkest, textColor: '#FBFDFC'  },
}

export default function GoalsStep({ employee, onNext }) {
  const { getGoalsForEmployee } = useApp()
  const dbGoals = getGoalsForEmployee(employee)

  // Bucket DB goals into 30/60/90 day periods based on days from start date
  const periodLabels = ['30 days', '60 days', '90 days']
  const startDate = employee?.startDate ? new Date(employee.startDate) : null

  const bucketGoal = (goal) => {
    if (!goal.dueDate || !startDate) return null
    const due = new Date(goal.dueDate + 'T23:59:59')
    if (isNaN(due)) return null
    const days = Math.ceil((due - startDate) / (1000 * 60 * 60 * 24))
    if (days <= 30) return '30 days'
    if (days <= 60) return '60 days'
    return '90 days'
  }

  const byPeriod = { '30 days': [], '60 days': [], '90 days': [] }
  dbGoals.forEach(g => {
    const b = bucketGoal(g)
    if (b) byPeriod[b].push(g)
  })

  const useDynamic = periodLabels.some(l => byPeriod[l].length > 0)

  if (useDynamic) {
    return (
      <div style={{ maxWidth: 720 }}>
        <div style={eyebrow}>The plan</div>
        <h2 style={h2Style}>Your first 90 days.</h2>
        <p style={{ ...lead, marginBottom: 28 }}>
          Here's what success looks like early on. These are starting points — you'll shape them with your manager.
        </p>

        <div style={styles.grid}>
          {periodLabels.map((label, i) => {
            const items = byPeriod[label]
            if (items.length === 0) return null
            const { bg, textColor } = PERIOD_STYLES[label] || PERIOD_STYLES['30 days']
            return (
              <div key={label} style={{ ...styles.card, background: bg }} className={`animate-cardIn delay-${i + 1}`}>
                <div style={styles.pill}>{label}</div>
                <div style={{ ...styles.title, color: textColor }}>
                  {label === '30 days' ? 'Get grounded.' : label === '60 days' ? 'Find your footing.' : 'Take the lead.'}
                </div>
                <ul style={styles.list}>
                  {items.map(item => (
                    <li key={item.id} style={{ ...styles.item, color: textColor }}>
                      <span style={styles.arrow}>→</span>
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Static fallback
  return (
    <div style={{ maxWidth: 720 }}>
      <div style={eyebrow}>The plan</div>
      <h2 style={h2Style}>Your first 90 days.</h2>
      <p style={{ ...lead, marginBottom: 28 }}>
        Here's what success looks like early on. These are starting points — you'll shape them with your manager.
      </p>

      <div style={styles.grid}>
        {STATIC_GOALS.map((g, i) => (
          <div key={g.period} style={{ ...styles.card, background: g.bg }} className={`animate-cardIn delay-${i + 1}`}>
            <div style={styles.pill}>{g.period}</div>
            <div style={{ ...styles.title, color: g.textColor }}>{g.title}</div>
            <ul style={styles.list}>
              {g.items.map(item => (
                <li key={item} style={{ ...styles.item, color: g.textColor }}>
                  <span style={styles.arrow}>→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  grid:  { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 16 },
  card:  { borderRadius: 16, padding: '22px 20px' },
  pill:  { fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', background: T.accent, color: T.dark, padding: '3px 10px', borderRadius: 100, display: 'inline-block', marginBottom: 12 },
  title: { fontFamily: "'Inter',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 14 },
  list:  { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 },
  item:  { fontSize: 13, lineHeight: 1.45, display: 'flex', gap: 8, alignItems: 'flex-start', opacity: .85 },
  arrow: { color: T.accent, fontWeight: 700, flexShrink: 0 },
}
