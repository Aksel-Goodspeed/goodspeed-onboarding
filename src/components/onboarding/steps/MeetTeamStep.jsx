import { useState, useEffect, useRef } from 'react'
import Globe from 'react-globe.gl'
import { useApp } from '../../../context/AppContext'
import { T, eyebrow, h2Style, lead, btn } from '../../../styles/tokens'

export default function MeetTeamStep({ employee }) {
  const { teamMembers } = useApp()
  // Don't show the current user — they're meeting everyone else
  const filteredMembers = teamMembers.filter(m => m.id !== employee?.id)
  const [selected,   setSelected]   = useState(null)
  const [factIndex,  setFactIndex]  = useState(0)
  const [revealed,   setRevealed]   = useState(false)
  const [metIds,     setMetIds]     = useState(new Set())
  const [countries, setCountries]   = useState({ features: [] })

  const globeEl      = useRef()
  const containerRef = useRef()
  const [containerWidth, setContainerWidth] = useState(720)

  // Fetch GeoJSON countries
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(r => r.json())
      .then(setCountries)
      .catch(() => {})
  }, [])

  // Measure container
  useEffect(() => {
    if (containerRef.current) setContainerWidth(containerRef.current.clientWidth)
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) setContainerWidth(entry.contentRect.width)
    })
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Configure globe controls after countries load
  useEffect(() => {
    const g = globeEl.current
    if (!g) return
    g.controls().autoRotate = true
    g.controls().autoRotateSpeed = 0.3
    g.controls().enableZoom = false
    g.pointOfView({ altitude: 2.2 })
  }, [countries])

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

  const membersWithLocation = filteredMembers.filter(m => m.locationLat != null && m.locationLng != null)
  const globeHeight = Math.min(420, containerWidth * 0.55)

  return (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <div style={eyebrow}>Your people</div>
      <h2 style={h2Style}>Meet the team.</h2>
      <p style={{ ...lead, marginBottom: 8 }}>
        Click on anyone to learn about them — and reveal a fun fact or two.
      </p>
      <p style={{ fontSize: 13, color: T.text, opacity: .5, marginBottom: 20 }}>
        {metIds.size} of {filteredMembers.length} people met
      </p>

      {/* Globe */}
      <div ref={containerRef} style={styles.globeWrap}>
        {membersWithLocation.length === 0 && (
          <div style={styles.globeHint}>
            We're a remote-first team — locations will appear once they're set.
          </div>
        )}
        <Globe
          ref={globeEl}
          width={containerWidth}
          height={globeHeight}
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor="#C6DD66"
          atmosphereAltitude={0.18}
          globeImageUrl="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2' height='2'%3E%3Crect width='2' height='2' fill='%23FFFFFF'/%3E%3C/svg%3E"
          bumpImageUrl={null}
          backgroundImageUrl={null}
          polygonsData={countries.features}
          polygonCapColor={() => '#374A3E'}
          polygonSideColor={() => '#2E3D33'}
          polygonStrokeColor={() => '#C6DD66'}
          polygonAltitude={0.012}
          pointsData={membersWithLocation}
          pointLat={d => d.locationLat}
          pointLng={d => d.locationLng}
          pointColor={() => '#C6DD66'}
          pointRadius={1.2}
          pointAltitude={0.14}
          pointLabel={d => `<div style="background:#374A3E;color:#FBFDFC;padding:7px 12px;border-radius:10px;font-size:13px;font-weight:700;pointer-events:none">${d.name}<br/><span style="font-weight:400;opacity:.65">${d.role}</span>${d.location ? `<br/><span style="opacity:.5;font-size:11px">${d.location}</span>` : ''}</div>`}
          onPointClick={member => { select(member) }}
        />
      </div>

      {/* Cards + side detail panel */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 320px' : '1fr', gap: 16 }}>
        <div style={styles.grid}>
          {filteredMembers.map((m, i) => (
            <div
              key={m.id}
              className={`animate-cardIn delay-${(i % 5) + 1}`}
              onClick={() => select(m)}
              style={{
                ...styles.card,
                ...(selected?.id === m.id ? styles.cardActive : {}),
                ...(metIds.has(m.id) && selected?.id !== m.id ? styles.cardMet : {}),
              }}
            >
              {m.profilePicture ? (
                <img src={m.profilePicture} alt={m.name}
                  style={{ ...styles.avatar, objectFit: 'cover' }} />
              ) : (
                <div style={{ ...styles.avatar, background: m.avatarColor, color: m.avatarText }}>
                  {m.initials}
                </div>
              )}
              <div style={styles.cardName}>{m.name}</div>
              <div style={styles.cardRole}>{m.role}</div>
              {metIds.has(m.id) && (
                <div style={styles.metBadge}>✓ Met</div>
              )}
            </div>
          ))}
        </div>

        {/* Detail panel — sticky on the right so it's always visible */}
        {selected && (
          <div style={styles.panel} className="animate-slideIn" key={selected.id}>
            <div style={styles.panelHeader}>
              {selected.profilePicture ? (
                <img src={selected.profilePicture} alt={selected.name}
                  style={{ ...styles.bigAvatar, objectFit: 'cover' }} />
              ) : (
                <div style={{ ...styles.bigAvatar, background: selected.avatarColor, color: selected.avatarText }}>
                  {selected.initials}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.panelName}>{selected.name}</div>
                <div style={styles.panelRole}>{selected.role}</div>
                {selected.location && (
                  <div style={{ fontSize: 12, color: T.text, opacity: .55, marginTop: 2 }}>
                    📍 {selected.location}
                  </div>
                )}
              </div>
              <button onClick={() => setSelected(null)} style={styles.closeBtn}>✕</button>
            </div>

            {selected.bio && <p style={styles.bio}>{selected.bio}</p>}

            {/* Fun fact reveal */}
            {selected.funFacts && selected.funFacts.length > 0 && (
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
            )}
          </div>
        )}
      </div>

    </div>
  )
}

const styles = {
  globeWrap:  {
    background: T.card, borderRadius: 16, overflow: 'hidden', marginBottom: 24,
    position: 'relative', border: `1.5px solid rgba(55,74,62,.1)`,
  },
  globeHint:  {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
    color: 'rgba(55,74,62,.4)', fontSize: 13, fontWeight: 600, textAlign: 'center',
    pointerEvents: 'none', zIndex: 1, padding: '0 16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: 12,
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
    background: T.card, borderRadius: 16, padding: '20px',
    border: `1.5px solid rgba(55,74,62,.1)`,
    alignSelf: 'flex-start',
    position: 'sticky', top: 80,
  },
  panelHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
  bigAvatar: {
    width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: 18,
  },
  panelName: { fontSize: 16, fontWeight: 700, color: T.heading, lineHeight: 1.2 },
  panelRole: { fontSize: 12, color: T.text, opacity: .6, marginTop: 2 },
  closeBtn:  { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: T.text, opacity: .4, padding: 4, flexShrink: 0 },
  bio:       { fontSize: 13, lineHeight: 1.65, color: T.text, opacity: .8, marginBottom: 14 },
  factSection: { background: T.bg, borderRadius: 12, padding: '14px 16px' },
  factLabel:   { display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 },
  revealBtn: {
    background: T.dark, color: T.white, border: 'none', cursor: 'pointer',
    padding: '9px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600,
    fontFamily: 'inherit', transition: 'all .2s',
  },
  factCard: { },
  factText: { fontSize: 14, lineHeight: 1.6, color: T.heading, fontStyle: 'italic', fontWeight: 500 },
}
