import { teamMembers } from '../../../data/team'
import { T, eyebrow, h2Style, lead, btn } from '../../../styles/tokens'

export default function ManagerStep({ employee, onNext }) {
  const manager = teamMembers.find(
    m => m.name.toLowerCase() === employee.managerName?.toLowerCase()
  ) || teamMembers[0]

  return (
    <div style={{ maxWidth: 620 }}>
      <div style={eyebrow}>A message for you</div>
      <h2 style={h2Style}>From {manager.name}.</h2>

      {/* Personal message card */}
      {employee.personalMessage && (
        <div style={styles.msgCard}>
          <div style={styles.quoteIcon}>"</div>
          <p style={styles.msgText}>{employee.personalMessage}</p>
          <div style={styles.msgAuthor}>
            <div style={{ ...styles.avatar, background: manager.avatarColor, color: manager.avatarText }}>
              {manager.initials}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: T.white }}>{manager.name}</div>
              <div style={{ fontSize: 12, opacity: .6, color: T.white }}>{manager.role}</div>
            </div>
          </div>
        </div>
      )}

      {/* Manager intro card */}
      <div style={styles.managerCard} className="animate-cardIn">
        <div style={{ ...styles.bigAvatar, background: manager.avatarColor, color: manager.avatarText }}>
          {manager.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={styles.managerName}>{manager.name}</div>
          <div style={styles.managerRole}>{manager.role} · {manager.department}</div>
          <p style={styles.managerBio}>{manager.bio}</p>
          <div style={styles.slackTag}>
            <SlackIcon />
            {manager.slack}
          </div>
        </div>
      </div>

      <div style={styles.facts}>
        <p style={{ ...lead, fontSize: 15, marginBottom: 0 }}>
          {manager.name}'s door — and Slack DMs — are always open. Don't wait for a formal 1:1 to reach out.
        </p>
      </div>

      <button onClick={onNext} style={{ ...btn('primary'), marginTop: 28 }}>
        Continue →
      </button>
    </div>
  )
}

function SlackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
    </svg>
  )
}

const styles = {
  msgCard: {
    background: T.dark, borderRadius: 16, padding: '28px 28px 20px',
    marginBottom: 20, position: 'relative',
  },
  quoteIcon: {
    position: 'absolute', top: 12, left: 20,
    fontSize: 48, fontWeight: 900, color: T.accent, opacity: .4, lineHeight: 1,
  },
  msgText: {
    fontSize: 16, lineHeight: 1.75, color: T.white, opacity: .9,
    paddingTop: 16, fontStyle: 'italic', maxWidth: 520,
  },
  msgAuthor: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: 13,
  },
  managerCard: {
    background: T.card, borderRadius: 16, padding: '24px',
    display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 16,
  },
  bigAvatar: {
    width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: 22,
  },
  managerName: { fontSize: 19, fontWeight: 700, color: T.heading, marginBottom: 3 },
  managerRole: { fontSize: 13, fontWeight: 600, color: T.accent, background: T.dark, padding: '2px 10px', borderRadius: 100, display: 'inline-block', marginBottom: 12 },
  managerBio:  { fontSize: 14, lineHeight: 1.65, color: T.text, opacity: .75, marginBottom: 14 },
  slackTag: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'rgba(198,221,102,.15)', color: T.dark,
    fontSize: 13, fontWeight: 600, padding: '4px 12px', borderRadius: 100,
  },
  facts: {
    background: T.card, borderRadius: 12, padding: '16px 20px',
  },
}
