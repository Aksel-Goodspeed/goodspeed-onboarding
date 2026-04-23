import { useState } from 'react'
import { T, eyebrow, h2Style, lead, btn } from '../../../styles/tokens'

const values = [
  { icon: '⚡', title: 'Move Fast',        desc: 'We ship in days, not months. Speed is a feature. When in doubt, build it.' },
  { icon: '🔍', title: 'Radical Honesty',  desc: 'We say what we think. Candid feedback beats comfortable silence, every time.' },
  { icon: '💚', title: 'Client Obsessed',  desc: 'Our clients\' success is our success. Full stop.' },
  { icon: '🎯', title: 'Think Bold',       desc: 'No idea is too ambitious. Constraints are just puzzles waiting to be solved.' },
  { icon: '✨', title: 'Quality First',    desc: 'We never ship something we\'re not proud of. Good enough isn\'t good enough.' },
]

export default function ValuesStep({ onNext }) {
  const [checked, setChecked] = useState(new Set())

  const toggle = (i) => setChecked(prev => {
    const next = new Set(prev)
    next.has(i) ? next.delete(i) : next.add(i)
    return next
  })

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={eyebrow}>What we believe</div>
      <h2 style={h2Style}>Five things we live by.</h2>
      <p style={{ ...lead, marginBottom: 28 }}>
        These aren't posters on a wall — they're how we make decisions. Click each one to acknowledge it.
      </p>

      <div style={styles.grid}>
        {values.map((v, i) => (
          <div
            key={v.title}
            onClick={() => toggle(i)}
            className={`animate-cardIn delay-${i + 1}`}
            style={{
              ...styles.card,
              ...(checked.has(i) ? styles.cardChecked : {}),
            }}
          >
            <div style={styles.cardTop}>
              <div style={styles.icon}>{v.icon}</div>
              {checked.has(i) && <span style={styles.checkmark}>✓</span>}
            </div>
            <div style={styles.title}>{v.title}</div>
            <div style={styles.desc}>{v.desc}</div>
          </div>
        ))}
      </div>

      {checked.size > 0 && checked.size < values.length && (
        <p style={styles.hint}>{values.length - checked.size} more to go…</p>
      )}
      {checked.size === values.length && (
        <p style={{ ...styles.hint, color: T.dark, opacity: 1, fontWeight: 600 }}>
          ✓ You've acknowledged all five. That's the spirit.
        </p>
      )}

      <button onClick={onNext} style={{ ...btn('primary'), marginTop: 24 }}>
        Continue →
      </button>
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 12, marginBottom: 20,
  },
  card: {
    background: T.card, borderRadius: 16, padding: '20px',
    cursor: 'pointer', border: '2px solid transparent',
    transition: 'all .2s ease',
  },
  cardChecked: {
    border: `2px solid ${T.accent}`,
    background: `linear-gradient(135deg, ${T.card} 0%, rgba(198,221,102,.14) 100%)`,
    transform: 'translateY(-3px)',
  },
  cardTop:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  icon:      { width: 40, height: 40, borderRadius: 11, background: T.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  checkmark: { fontSize: 15, fontWeight: 700, color: T.accent, background: T.dark, width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: 700, fontSize: 15, color: T.heading, marginBottom: 6 },
  desc:  { fontSize: 13, lineHeight: 1.55, color: T.text, opacity: .7 },
  hint:  { fontSize: 13, color: T.text, opacity: .5, marginBottom: 8 },
}
