import { T, eyebrow, h2Style, lead, btn } from '../../../styles/tokens'

const goals = [
  {
    period: '30 Days',
    title:  'Get grounded.',
    bg:     T.card,
    textColor: T.heading,
    items: [
      'Learn the tools and core workflows',
      'Meet every person on the team',
      'Shadow two active client projects',
      'Set up your workspace your way',
    ],
  },
  {
    period: '60 Days',
    title:  'Find your footing.',
    bg:     T.dark,
    textColor: T.white,
    items: [
      'Own at least one deliverable end-to-end',
      'Contribute to a live client project',
      'Share a candid piece of feedback',
      'Spot something to improve — say it out loud',
    ],
  },
  {
    period: '90 Days',
    title:  'Take the lead.',
    bg:     T.darkest,
    textColor: T.white,
    items: [
      'Lead a feature from kickoff to ship',
      'Build a go-to workflow that\'s yours',
      'Help onboard or mentor a newer team member',
      'Set your own next 90-day goals',
    ],
  },
]

export default function GoalsStep({ onNext }) {
  return (
    <div style={{ maxWidth: 720 }}>
      <div style={eyebrow}>The plan</div>
      <h2 style={h2Style}>Your first 90 days.</h2>
      <p style={{ ...lead, marginBottom: 28 }}>
        Here's what success looks like early on. These are starting points — you'll shape them with your manager.
      </p>

      <div style={styles.grid}>
        {goals.map((g, i) => (
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
