import { useState } from 'react'
import { teamMembers } from '../../../data/team'
import { T, eyebrow, h2Style, lead, btn } from '../../../styles/tokens'

export default function MeetTeamStep({ onNext }) {
  const [selected,   setSelected]   = useState(null)
  const [factIndex,  setFactIndex]  = useState(0)
  const [revealed,   setRevealed]   = useState(false)
  const [metIds,     setMetIds]     = useState(new Set())

  const select = (member) => {
    setSelected(member)
    setFactIndex(0)
    setRevealed(false)
    setMetIds(prev => new Set([...prev, member.id]))
  }

  const nextFact = () => {
    if (factIndex < selected.funFacts.length - 1) {
      setFactIndex(i => i + 1)
      setRevealed(false)
      setTimeout(() => setRevealed(true), 80)
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={eyebrow}>Your people</div>
      <h2 style={h2Style}>Meet the team.</h2>
      <p style={{ ...lead, marginBottom: 8 }}>
        Click on anyone to learn about them — and reveal a fun fact or two.
      </p>
      <p style={{ fontSize: 13, color: T.text, opacity: .5, marginBottom: 28 }}>
        {metIds.size} of {teamMembers.length} people met
      </p>

      {/* Cards grid */}
      <div style={styles.grid}>
        {teamMembers.map((m, i) => (
          <div
            key={m.id}
            className={`animate-cardIn delay-${i + 1}`}
            onClick={() => select(m)}
            style={{
              ...styles.card,
              ...(selected?.id === m.id ? styles.cardActive : {}),
              ...(metIds.has(m.id) && selected?.id !== m.id ? styles.cardMet : {}),
            }}
          >
            <div style={{ ...styles.avatar, background: m.avatarColor, color: m.avatarText }}>
              {m.initials}
            </div>
            <div style={styles.cardName}>{m.name}</div>
            <div style={styles.cardRole}>{m.role}</div>
            {metIds.has(m.id) && (
              <div style={styles.metBadge}>✓ Met</div>
            )}
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={styles.panel} className="animate-slideIn" key={selected.id}>
          <div style={styles.panelHeader}>
            <div style={{ ...styles.bigAvatar, background: selected.avatarColor, color: selected.avatarText }}>
              {selected.initials}
            </div>
            <div>
              <div style={styles.panelName}>{selected.name}</div>
              <div style={styles.panelRole}>{selected.role} · {selected.department}</div>
            </div>
            <button onClick={() => setSelected(null)} style={styles.closeBtn}>✕</button>
          </div>

          <p style={styles.bio}>{selected.bio}</p>

          {/* Fun fact reveal */}
          <div style={styles.factSection}>
            <div style={styles.factLabel}>
              <span>⭐</span>
              <span style={{ fontWeight: 700, fontSize: 13 }}>
                Fun fact {factIndex + 1} of {selected.funFacts.length}
              </span>
            </div>

            {!revealed ? (
              <button onClick={() => setRevealed(true)} style={styles.revealBtn}>
                Tap to reveal →
              </button>
            ) : (
              <div style={styles.factCard} className="animate-fadeUp">
                <p style={styles.factText}>"{selected.funFacts[factIndex]}"</p>
                {factIndex < selected.funFacts.length - 1 && (
                  <button onClick={nextFact} style={{ ...btn('card'), padding: '7px 14px', fontSize: 13, marginTop: 12 }}>
                    Next fact →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={onNext}
        style={{ ...btn('primary'), marginTop: 32 }}
      >
        {metIds.size >= teamMembers.length ? 'Met everyone! Continue →' : 'Continue →'}
      </button>
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: 12, marginBottom: 20,
  },
  card: {
    background: T.card, borderRadius: 14, padding: '20px 14px',
    textAlign: 'center', cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'all .2s ease', position: 'relative',
  },
  cardActive: {
    border: `2px solid ${T.accent}`,
    background: `linear-gradient(135deg, ${T.card} 0%, rgba(198,221,102,.12) 100%)`,
    transform: 'translateY(-3px)',
    boxShadow: `0 6px 20px rgba(198,221,102,.2)`,
  },
  cardMet: { opacity: .75 },
  avatar: {
    width: 52, height: 52, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: 18, margin: '0 auto 10px',
  },
  cardName: { fontWeight: 700, fontSize: 14, color: T.heading, marginBottom: 3 },
  cardRole: { fontSize: 11, color: T.text, opacity: .55, lineHeight: 1.3 },
  metBadge: {
    position: 'absolute', top: 8, right: 8,
    fontSize: 10, fontWeight: 700, color: T.dark,
    background: T.accent, padding: '2px 7px', borderRadius: 100,
  },
  panel: {
    background: T.card, borderRadius: 16, padding: '24px',
    marginBottom: 8, border: `1.5px solid rgba(55,74,62,.1)`,
  },
  panelHeader: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 },
  bigAvatar: {
    width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: 20,
  },
  panelName: { fontSize: 18, fontWeight: 700, color: T.heading, flex: 1 },
  panelRole: { fontSize: 13, color: T.text, opacity: .6 },
  closeBtn:  { marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: T.text, opacity: .4 },
  bio:       { fontSize: 14, lineHeight: 1.7, color: T.text, opacity: .8, marginBottom: 20 },
  factSection: { background: T.bg, borderRadius: 12, padding: '16px 18px' },
  factLabel:   { display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 },
  revealBtn: {
    background: T.dark, color: T.white, border: 'none', cursor: 'pointer',
    padding: '10px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600,
    fontFamily: 'inherit', transition: 'all .2s',
  },
  factCard: { },
  factText: { fontSize: 15, lineHeight: 1.65, color: T.heading, fontStyle: 'italic', fontWeight: 500 },
}
