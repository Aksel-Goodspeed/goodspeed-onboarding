import { useState, useEffect } from 'react'
import { T, eyebrow, h2Style, btn } from '../../../styles/tokens'

const VALUES = [
  { id: 1,  icon: '🤝', title: 'Our business is trust',        desc: 'Everything we do is built on trust — with clients, with each other, and in the work we put out. Once trust is broken it\'s hard to rebuild, so we protect it like our most valuable asset.' },
  { id: 2,  icon: '🏆', title: 'Set the standard',             desc: 'We don\'t follow the industry, we set the bar. Whether it\'s quality, speed, or communication — we hold ourselves to a level that others aspire to reach.' },
  { id: 3,  icon: '🧭', title: 'Go slow to go fast',           desc: 'Taking time to understand the problem properly, align on the approach, and plan clearly means we move faster when it counts. Rushing the thinking stage costs more time than it saves.' },
  { id: 4,  icon: '⚡', title: 'Bias for action',              desc: 'When in doubt, move. A good decision made now beats a perfect decision made too late. We\'d rather try, learn, and adjust than wait for certainty that never comes.' },
  { id: 5,  icon: '🛠️', title: 'Be the owner',                desc: 'Treat every project, task, and client relationship as if it\'s yours. Don\'t wait to be told — if you see something that needs fixing, fix it. Ownership isn\'t a title, it\'s a mindset.' },
  { id: 6,  icon: '🎯', title: 'Do what matters most',         desc: 'Focus is a competitive advantage. We ruthlessly prioritise the work that moves the needle and say no to everything else. Busyness isn\'t the same as progress.' },
  { id: 7,  icon: '💬', title: 'No assumptions, no surprises', desc: 'When something is unclear, ask. When something changes, tell people. Surprises in a client relationship almost always come from someone not speaking up sooner.' },
  { id: 8,  icon: '🔄', title: 'Feedback early, feedback often', desc: 'Don\'t wait until something is polished to share it. Early, rough feedback is worth more than late, detailed feedback. Build a habit of sharing work-in-progress.' },
  { id: 9,  icon: '🧪', title: 'Experiment, learn and share',  desc: 'We work at the frontier of what\'s possible with AI. That means trying things that haven\'t been tried before. When experiments work — or don\'t — we document and share what we learned.' },
  { id: 10, icon: '🚀', title: 'There is always a way',        desc: 'When a client says it can\'t be done, that\'s where we start. Constraints aren\'t blockers, they\'re the problem to solve. We don\'t give up because something is hard.' },
]

export default function ValuesStep({ onNext }) {
  const [index,    setIndex]    = useState(0)
  const [seen,     setSeen]     = useState(() => new Set([VALUES[0].id]))

  const value     = VALUES[index]
  const isLast    = index === VALUES.length - 1
  const allSeen   = seen.size === VALUES.length

  // Mark as seen whenever the active value changes
  useEffect(() => {
    setSeen(prev => prev.has(value.id) ? prev : new Set([...prev, value.id]))
  }, [value.id])

  const goNext = () => {
    if (isLast) return
    setIndex(i => i + 1)
  }

  const goPrev = () => {
    if (index === 0) return
    setIndex(i => i - 1)
  }

  return (
    <div style={{ width: '100%', maxWidth: 600 }}>
      <div style={eyebrow}>What we believe</div>
      <h2 style={h2Style}>Ten things we live by.</h2>

      {/* Progress dots */}
      <div style={styles.dots}>
        {VALUES.map((v, i) => (
          <div
            key={v.id}
            onClick={() => setIndex(i)}
            style={{
              ...styles.dot,
              ...(i === index ? styles.dotActive : {}),
              ...(seen.has(v.id) && i !== index ? styles.dotSeen : {}),
            }}
          />
        ))}
      </div>

      {/* Value card */}
      <div key={value.id} style={styles.card} className="animate-fadeUp">
        <div style={styles.numRow}>
          <span style={styles.num}>{String(value.id).padStart(2, '0')}</span>
          <span style={styles.counter}>{index + 1} / {VALUES.length}</span>
        </div>

        <div style={styles.titleRow}>
          <div style={styles.iconBubble}>{value.icon}</div>
          <h3 style={styles.title}>{value.title}</h3>
        </div>

        <p style={styles.desc} className="animate-fadeUp">{value.desc}</p>
      </div>

      {/* Navigation */}
      <div style={styles.navRow}>
        <button
          onClick={goPrev}
          disabled={index === 0}
          style={{ ...styles.navBtn, opacity: index === 0 ? 0.25 : 1 }}
        >
          ← Prev
        </button>

        {isLast ? (
          <button
            onClick={onNext}
            disabled={!allSeen}
            style={{
              ...btn('primary'),
              opacity: allSeen ? 1 : 0.35,
              cursor: allSeen ? 'pointer' : 'not-allowed',
              transition: 'opacity .3s',
            }}
          >
            {allSeen ? 'Continue →' : `${VALUES.length - seen.size} left`}
          </button>
        ) : (
          <button
            onClick={goNext}
            style={btn('primary')}
          >
            Next →
          </button>
        )}
      </div>

      {/* Jump to unread hint */}
      {!allSeen && seen.size > 0 && (
        <p style={styles.hint}>
          {VALUES.length - seen.size} value{VALUES.length - seen.size !== 1 ? 's' : ''} left — click the dots to jump around
        </p>
      )}
    </div>
  )
}

const styles = {
  dots: {
    display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap',
  },
  dot: {
    width: 8, height: 8, borderRadius: '50%',
    background: 'rgba(55,74,62,.15)',
    cursor: 'pointer', transition: 'all .25s',
  },
  dotActive: {
    background: T.dark, width: 24, borderRadius: 4,
  },
  dotSeen: {
    background: T.accent,
  },
  card: {
    background: T.card, borderRadius: 20, padding: '36px 32px',
    marginBottom: 20, minHeight: 240,
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
  },
  numRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20,
  },
  num: {
    fontSize: 13, fontWeight: 800, letterSpacing: '.06em',
    color: T.accent, background: T.dark,
    padding: '4px 10px', borderRadius: 8,
  },
  counter: {
    fontSize: 12, fontWeight: 600, color: T.text, opacity: .4,
  },
  titleRow: {
    display: 'flex', gap: 14, alignItems: 'center',
    marginBottom: 18,
  },
  iconBubble: {
    width: 52, height: 52, borderRadius: 14,
    background: T.accent, color: T.dark,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 26, flexShrink: 0,
  },
  title: {
    fontFamily: "'Inter',sans-serif",
    fontSize: 'clamp(20px,3vw,26px)',
    fontWeight: 800, color: T.heading,
    lineHeight: 1.2, margin: 0,
  },
  revealBtn: {
    alignSelf: 'flex-start',
    background: 'transparent',
    border: `1.5px solid rgba(55,74,62,.2)`,
    borderRadius: 100, padding: '10px 20px',
    fontSize: 14, fontWeight: 600,
    color: T.heading, cursor: 'pointer',
    fontFamily: 'inherit', transition: 'all .2s',
  },
  desc: {
    fontSize: 15, lineHeight: 1.75,
    color: T.text, opacity: .8,
  },
  navRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12,
  },
  navBtn: {
    background: 'transparent',
    border: `1.5px solid rgba(55,74,62,.2)`,
    borderRadius: 100, padding: '10px 20px',
    fontSize: 14, fontWeight: 600,
    color: T.heading, cursor: 'pointer',
    fontFamily: 'inherit', transition: 'opacity .2s',
  },
  hint: {
    fontSize: 12, color: T.text, opacity: .4, textAlign: 'center',
  },
}
