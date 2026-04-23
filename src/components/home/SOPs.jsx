import { useState } from 'react'
import { sops } from '../../data/sops'
import { useApp } from '../../context/AppContext'
import { T, btn } from '../../styles/tokens'

export default function SOPs() {
  const { currentEmployee, updateEmployee } = useApp()
  const [selected,  setSelected]  = useState(null)
  const [watched,   setWatched]   = useState(false)
  const [cat,       setCat]       = useState('All')

  const cats = ['All', ...new Set(sops.map(s => s.category))]
  const filtered = cat === 'All' ? sops : sops.filter(s => s.category === cat)
  const watchedIds = currentEmployee?.watchedSOPs || []

  const markWatched = (sop) => {
    setWatched(true)
    if (!watchedIds.includes(sop.id)) {
      updateEmployee(currentEmployee.id, {
        watchedSOPs: [...watchedIds, sop.id],
      })
    }
  }

  if (selected) {
    const isWatched = watched || watchedIds.includes(selected.id)
    return (
      <div style={styles.detailWrap} className="animate-fadeUp">
        <button onClick={() => { setSelected(null); setWatched(false) }} style={styles.backBtn}>
          ← Back to SOPs
        </button>

        <div style={styles.detailHeader}>
          <div style={styles.detailIcon}>{selected.icon}</div>
          <div>
            <div style={styles.catTag}>{selected.category}</div>
            <h2 style={styles.detailTitle}>{selected.title}</h2>
            <p style={styles.detailDesc}>{selected.description}</p>
          </div>
        </div>

        {/* Video player */}
        <div style={styles.videoPlayer}>
          <div style={styles.videoOverlay}>
            {!isWatched ? (
              <>
                <div style={styles.playBtn} onClick={() => markWatched(selected)}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={T.dark}>
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div style={styles.videoTitle}>{selected.videoTitle}</div>
                <div style={styles.videoDuration}>⏱ {selected.duration} · Owner: {selected.owner}</div>
                <button onClick={() => markWatched(selected)} style={{ ...btn('primary'), padding: '10px 22px', fontSize: 14, marginTop: 16 }}>
                  ▶ Watch now
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✓</div>
                <div style={{ color: T.white, fontWeight: 700, fontSize: 16 }}>Watched!</div>
                <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, marginTop: 4 }}>Scroll down to see the breakdown</div>
              </div>
            )}
          </div>
        </div>

        {/* Breakdown — revealed after watching */}
        {isWatched && (
          <div style={styles.breakdown} className="animate-fadeUp">
            <h3 style={styles.breakdownTitle}>Step-by-step breakdown</h3>
            <div style={styles.steps}>
              {selected.steps.map((step, i) => (
                <div key={i} style={styles.step} className={`animate-cardIn delay-${(i % 5) + 1}`}>
                  <div style={styles.stepNum}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={styles.stepTitle}>{step.title}</div>
                    <div style={styles.stepDesc}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.doneBar}>
              <span style={{ fontWeight: 700, color: T.dark }}>✓ Process complete</span>
              <span style={{ fontSize: 13, opacity: .6 }}>You can come back to this anytime</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={styles.listHeader}>
        <div>
          <h2 style={styles.h2}>Standard Operating Procedures</h2>
          <p style={styles.sub}>
            {watchedIds.length} of {sops.length} watched
          </p>
        </div>
        <div style={styles.filters}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ ...styles.filterBtn, ...(cat === c ? styles.filterActive : {}) }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.grid}>
        {filtered.map((sop, i) => {
          const done = watchedIds.includes(sop.id)
          return (
            <div
              key={sop.id}
              onClick={() => { setSelected(sop); setWatched(done) }}
              className={`animate-cardIn delay-${(i % 4) + 1}`}
              style={{ ...styles.card, ...(done ? styles.cardDone : {}) }}
            >
              <div style={styles.cardTop}>
                <div style={styles.sopIcon}>{sop.icon}</div>
                {done && <div style={styles.doneBadge}>✓ Watched</div>}
              </div>
              <div style={styles.sopCat}>{sop.category}</div>
              <div style={styles.sopTitle}>{sop.title}</div>
              <p style={styles.sopDesc}>{sop.description}</p>
              <div style={styles.sopMeta}>
                <span>⏱ {sop.duration}</span>
                <span>·</span>
                <span>{sop.steps.length} steps</span>
                <span>·</span>
                <span>{sop.owner}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  // List view
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
  h2:         { fontFamily: "'Inter',sans-serif", fontSize: 26, fontWeight: 800, color: T.heading, marginBottom: 4 },
  sub:        { fontSize: 14, color: T.text, opacity: .6 },
  filters:    { display: 'flex', gap: 7 },
  filterBtn:  { padding: '6px 14px', borderRadius: 100, border: `1.5px solid rgba(55,74,62,.18)`, background: 'transparent', color: T.heading, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  filterActive: { background: T.dark, color: T.white, border: `1.5px solid ${T.dark}` },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 },
  card:       { background: T.card, borderRadius: 16, padding: '22px', cursor: 'pointer', border: '2px solid transparent', transition: 'all .2s' },
  cardDone:   { borderColor: 'rgba(198,221,102,.4)' },
  cardTop:    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  sopIcon:    { width: 44, height: 44, borderRadius: 12, background: T.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 },
  doneBadge:  { fontSize: 11, fontWeight: 700, background: 'rgba(198,221,102,.2)', color: T.dark, padding: '3px 10px', borderRadius: 100 },
  sopCat:     { fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.text, opacity: .45, marginBottom: 6 },
  sopTitle:   { fontWeight: 700, fontSize: 16, color: T.heading, marginBottom: 8 },
  sopDesc:    { fontSize: 13, lineHeight: 1.55, color: T.text, opacity: .7, marginBottom: 12 },
  sopMeta:    { display: 'flex', gap: 6, fontSize: 12, color: T.text, opacity: .45 },
  // Detail view
  detailWrap:   { paddingBottom: 80 },
  backBtn:      { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: T.heading, opacity: .6, fontFamily: 'inherit', marginBottom: 24, padding: 0 },
  detailHeader: { display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 28 },
  detailIcon:   { width: 60, height: 60, borderRadius: 16, background: T.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 },
  catTag:       { fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.accent, background: T.dark, padding: '3px 10px', borderRadius: 100, display: 'inline-block', marginBottom: 8 },
  detailTitle:  { fontFamily: "'Inter',sans-serif", fontSize: 26, fontWeight: 800, color: T.heading, marginBottom: 6 },
  detailDesc:   { fontSize: 15, color: T.text, opacity: .7 },
  videoPlayer:  {
    background: T.darkest, borderRadius: 16, height: 240,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 28, position: 'relative', overflow: 'hidden',
  },
  videoOverlay: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  playBtn: {
    width: 64, height: 64, borderRadius: '50%', background: T.accent,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'transform .2s', marginBottom: 8,
  },
  videoTitle:    { color: T.white, fontWeight: 700, fontSize: 16 },
  videoDuration: { color: 'rgba(255,255,255,.45)', fontSize: 13 },
  // Breakdown
  breakdown:      { },
  breakdownTitle: { fontFamily: "'Inter',sans-serif", fontSize: 20, fontWeight: 700, color: T.heading, marginBottom: 20 },
  steps:         { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 },
  step:          { display: 'flex', gap: 16, alignItems: 'flex-start', background: T.card, borderRadius: 14, padding: '18px 20px' },
  stepNum:       { width: 32, height: 32, borderRadius: '50%', background: T.dark, color: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 },
  stepTitle:     { fontWeight: 700, fontSize: 15, color: T.heading, marginBottom: 5 },
  stepDesc:      { fontSize: 13, lineHeight: 1.6, color: T.text, opacity: .75 },
  doneBar:       { background: 'rgba(198,221,102,.15)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
}
