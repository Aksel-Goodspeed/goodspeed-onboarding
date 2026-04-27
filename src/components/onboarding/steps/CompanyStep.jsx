import { T, eyebrow, h2Style, lead, btn } from '../../../styles/tokens'

const stats = [
  { value: '200+',  label: 'Products shipped' },
  { value: '5.0★',  label: 'Client rating'   },
  { value: '$500M+', label: 'Raised by clients' },
]

export default function CompanyStep({ onNext }) {
  return (
    <div style={{ width: '100%', maxWidth: 600 }}>
      <div style={eyebrow}>The company</div>
      <h2 style={h2Style}>We build products that matter.</h2>

      <p style={{ ...lead, marginBottom: 16 }}>
        Goodspeed Studio is an AI product studio. We turn what founders and enterprises know into software people actually use — from idea to deployed product, fast.
      </p>
      <p style={{ ...lead, marginBottom: 36 }}>
        We partner with ambitious teams to design, build, and ship AI-powered tools. Every project is a collaboration. Every product has to work.
      </p>

      <div style={styles.statsRow}>
        {stats.map((s, i) => (
          <div key={s.label} style={styles.stat} className={`animate-cardIn delay-${i + 1}`}>
            <div style={styles.statNum}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.highlight}>
        <span style={styles.highlightIcon}>⚡</span>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: T.white, opacity: .85 }}>
          Speed is one of the things that sets us apart. We move in days, not months — and we don't use speed as an excuse to cut corners. Quality is non-negotiable.
        </p>
      </div>

    </div>
  )
}

const styles = {
  statsRow: { display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' },
  stat: {
    flex: 1, minWidth: 120,
    background: T.card, borderRadius: 14, padding: '18px 20px',
  },
  statNum:   { fontFamily: "'Inter',sans-serif", fontSize: 30, fontWeight: 900, color: T.heading, lineHeight: 1, marginBottom: 4 },
  statLabel: { fontSize: 13, color: T.text, opacity: .55 },
  highlight: {
    display: 'flex', gap: 14, alignItems: 'flex-start',
    background: T.dark, borderRadius: 14, padding: '18px 20px',
  },
  highlightIcon: { fontSize: 20, flexShrink: 0, marginTop: 2 },
}
