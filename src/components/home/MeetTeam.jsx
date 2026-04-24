import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { T, btn } from '../../styles/tokens'

export default function MeetTeam() {
  const { teamMembers } = useApp()
  const [selected,  setSelected]  = useState(null)
  const [factIdx,   setFactIdx]   = useState(0)
  const [revealed,  setRevealed]  = useState(false)
  const [dept,      setDept]      = useState('All')

  const depts = ['All', ...new Set(teamMembers.map(m => m.department))]
  const filtered = dept === 'All' ? teamMembers : teamMembers.filter(m => m.department === dept)

  const select = (m) => {
    setSelected(m)
    setFactIdx(0)
    setRevealed(false)
  }

  const nextFact = () => {
    setFactIdx(i => i + 1)
    setRevealed(false)
    setTimeout(() => setRevealed(true), 60)
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.h2}>Meet the team.</h2>
          <p style={styles.sub}>5 people building the future of AI products.</p>
        </div>
        {/* Department filter */}
        <div style={styles.filters}>
          {depts.map(d => (
            <button
              key={d}
              onClick={() => { setDept(d); setSelected(null) }}
              style={{ ...styles.filterBtn, ...(dept === d ? styles.filterActive : {}) }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.layout}>
        {/* Cards grid */}
        <div style={styles.grid}>
          {filtered.map((m, i) => (
            <div
              key={m.id}
              onClick={() => select(m)}
              className={`animate-cardIn delay-${(i % 5) + 1}`}
              style={{
                ...styles.card,
                ...(selected?.id === m.id ? styles.cardActive : {}),
              }}
            >
              <div style={{ ...styles.avatar, background: m.avatarColor, color: m.avatarText }}>
                {m.initials}
              </div>
              <div style={styles.cardName}>{m.name}</div>
              <div style={styles.cardRole}>{m.role}</div>
              <div style={styles.deptPill}>{m.department}</div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={styles.panel} className="animate-slideIn" key={selected.id}>
            {/* Header */}
            <div style={styles.panelHero}>
              <div style={{ ...styles.bigAvatar, background: selected.avatarColor, color: selected.avatarText }}>
                {selected.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.panelName}>{selected.name}</div>
                {selected.isFounder && <div style={styles.founderBadge}>Founder</div>}
                <div style={styles.panelRole}>{selected.role}</div>
              </div>
              <button onClick={() => setSelected(null)} style={styles.closeBtn}>✕</button>
            </div>

            <p style={styles.bio}>{selected.bio}</p>

            {/* Slack */}
            <a href={`slack://user?${selected.slack}`} style={styles.slackBtn}>
              <SlackIcon /> {selected.slack}
            </a>

            {/* Fun facts */}
            <div style={styles.factBox}>
              <div style={styles.factHeader}>
                <span>⭐ Fun fact</span>
                <span style={{ fontSize: 12, opacity: .5 }}>
                  {factIdx + 1} / {selected.funFacts.length}
                </span>
              </div>

              {!revealed ? (
                <button onClick={() => setRevealed(true)} style={styles.revealBtn}>
                  Tap to reveal →
                </button>
              ) : (
                <div className="animate-fadeUp">
                  <p style={styles.factText}>"{selected.funFacts[factIdx]}"</p>
                  {factIdx < selected.funFacts.length - 1 && (
                    <button onClick={nextFact} style={{ ...btn('card'), padding: '7px 14px', fontSize: 13, marginTop: 12 }}>
                      Next fact →
                    </button>
                  )}
                </div>
              )}

              {/* Dot indicators */}
              <div style={{ display: 'flex', gap: 5, marginTop: 14 }}>
                {selected.funFacts.map((_, i) => (
                  <div key={i} style={{
                    width: i <= factIdx && revealed ? 20 : 6,
                    height: 6, borderRadius: 100,
                    background: i <= factIdx && revealed ? T.accent : 'rgba(55,74,62,.2)',
                    transition: 'all .3s',
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SlackIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
    </svg>
  )
}

const styles = {
  wrap:       { padding: '0 0 80px' },
  headerRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
  h2:         { fontFamily: "'Inter',sans-serif", fontSize: 26, fontWeight: 800, color: T.heading, marginBottom: 4 },
  sub:        { fontSize: 14, color: T.text, opacity: .6 },
  filters:    { display: 'flex', gap: 7, flexWrap: 'wrap' },
  filterBtn:  { padding: '6px 14px', borderRadius: 100, border: `1.5px solid rgba(55,74,62,.18)`, background: 'transparent', color: T.heading, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  filterActive: { background: T.dark, color: T.white, border: `1.5px solid ${T.dark}` },
  layout:   { display: 'grid', gridTemplateColumns: selected => selected ? '1fr 380px' : '1fr', gap: 20 },
  grid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 },
  card: {
    background: T.card, borderRadius: 14, padding: '20px 14px',
    textAlign: 'center', cursor: 'pointer',
    border: '2px solid transparent', transition: 'all .2s',
  },
  cardActive: {
    border: `2px solid ${T.accent}`,
    background: `linear-gradient(135deg, ${T.card} 0%, rgba(198,221,102,.12) 100%)`,
    transform: 'translateY(-3px)',
  },
  avatar:   { width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, margin: '0 auto 10px' },
  cardName: { fontWeight: 700, fontSize: 14, color: T.heading, marginBottom: 3 },
  cardRole: { fontSize: 12, color: T.text, opacity: .55, marginBottom: 8, lineHeight: 1.3 },
  deptPill: { fontSize: 10, fontWeight: 700, background: T.dark, color: T.accent, padding: '2px 8px', borderRadius: 100, display: 'inline-block' },
  panel: {
    background: T.card, borderRadius: 16, padding: '24px',
    border: `1.5px solid rgba(55,74,62,.1)`, alignSelf: 'flex-start',
    position: 'sticky', top: 90,
  },
  panelHero: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 },
  bigAvatar: { width: 56, height: 56, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20 },
  panelName: { fontSize: 18, fontWeight: 700, color: T.heading },
  founderBadge: { fontSize: 10, fontWeight: 700, background: T.accent, color: T.dark, padding: '2px 8px', borderRadius: 100, display: 'inline-block', marginBottom: 2 },
  panelRole: { fontSize: 13, color: T.text, opacity: .6 },
  closeBtn: { marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: T.text, opacity: .4 },
  bio: { fontSize: 14, lineHeight: 1.7, color: T.text, opacity: .8, marginBottom: 14 },
  slackBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 7,
    background: 'rgba(198,221,102,.15)', color: T.dark,
    fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 100,
    textDecoration: 'none', marginBottom: 18,
  },
  factBox: { background: T.bg, borderRadius: 12, padding: '16px' },
  factHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, fontWeight: 700, color: T.heading, marginBottom: 12 },
  revealBtn: { background: T.dark, color: T.white, border: 'none', cursor: 'pointer', padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' },
  factText: { fontSize: 14, lineHeight: 1.65, color: T.heading, fontStyle: 'italic', fontWeight: 500 },
}
