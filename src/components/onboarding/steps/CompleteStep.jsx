import { useApp } from '../../../context/AppContext'
import { T, btn } from '../../../styles/tokens'

export default function CompleteStep({ employee, navigate }) {
  const { updateEmployee } = useApp()

  const finish = () => {
    updateEmployee(employee.id, { onboardingComplete: true })
    navigate('/home')
  }

  return (
    <div style={{ maxWidth: 540, textAlign: 'center', margin: '0 auto' }}>
      <div style={styles.badge} className="animate-pulse">✓</div>

      <h2 style={styles.heading}>
        You're all set, {employee.name}.
      </h2>
      <p style={styles.sub}>
        That's everything you need to get started. The team is genuinely excited you're here.
      </p>
      <p style={{ ...styles.sub, marginTop: 8 }}>
        Your home workspace has the team directory and all the SOPs you'll need. Goodie the chatbot is there too — ask anything.
      </p>

      <div style={styles.links}>
        <a href="#" style={styles.link}>
          <SlackIcon /> Open Slack
        </a>
        <a href="#" style={styles.link}>
          📋 Team wiki
        </a>
        <a href="#" style={styles.link}>
          🎯 Linear tasks
        </a>
      </div>

      <button onClick={finish} style={{ ...btn('primary'), marginTop: 32, padding: '15px 36px', fontSize: 16 }}>
        Go to my workspace →
      </button>
    </div>
  )
}

function SlackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
    </svg>
  )
}

const styles = {
  badge: {
    width: 72, height: 72, borderRadius: '50%',
    background: T.accent, color: T.dark,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 30, fontWeight: 700, margin: '0 auto 24px',
  },
  heading: {
    fontFamily: "'Inter',sans-serif",
    fontSize: 'clamp(26px,4vw,38px)', fontWeight: 800,
    color: T.heading, marginBottom: 14,
  },
  sub: { fontSize: 16, lineHeight: 1.7, color: T.text, opacity: .75, maxWidth: 440, margin: '0 auto' },
  links: { display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 },
  link: {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '9px 18px', borderRadius: 100,
    background: T.card, color: T.heading,
    fontSize: 14, fontWeight: 600, textDecoration: 'none',
    transition: 'all .2s',
  },
}
