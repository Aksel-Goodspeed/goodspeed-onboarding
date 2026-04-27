import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { T, btn } from '../../styles/tokens'

function getYouTubeId(url) {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

function truncate(text, max = 100) {
  if (!text) return ''
  if (text.length <= max) return text
  return text.slice(0, max).trimEnd() + '…'
}

export default function SOPs() {
  const { sops, currentEmployee, updateEmployee } = useApp()
  const [selected, setSelected]  = useState(null)
  const [viewed,   setViewed]    = useState(false)
  const [cat,      setCat]       = useState('All')
  const [lightbox, setLightbox]  = useState(null)

  const cats      = ['All', ...new Set(sops.map(s => s.category))]
  const filtered  = cat === 'All' ? sops : sops.filter(s => s.category === cat)
  const viewedIds = currentEmployee?.watchedSOPs || []

  // Esc closes lightbox
  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const markViewed = (sop) => {
    setViewed(true)
    if (!viewedIds.includes(sop.id)) {
      updateEmployee(currentEmployee.id, { watchedSOPs: [...viewedIds, sop.id] })
    }
  }

  if (selected) {
    const isViewed = viewed || viewedIds.includes(selected.id)
    const ytId     = getYouTubeId(selected.videoUrl)

    return (
      <div style={styles.detailWrap} className="animate-fadeUp">
        <button onClick={() => { setSelected(null); setViewed(false) }} style={styles.backBtn}>
          ← Back to SOPs
        </button>

        <div style={styles.detailHeader}>
          <div style={styles.detailIcon}>
            {selected.imageUrl
              ? <img src={selected.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span>{selected.icon || '📋'}</span>}
          </div>
          <div>
            <div style={styles.catTag}>{selected.category}</div>
            <h2 style={styles.detailTitle}>{selected.title}</h2>
          </div>
        </div>

        {/* Media — YouTube embed, external video link, or image preview */}
        {ytId ? (
          <div style={styles.videoWrap}>
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              style={styles.iframe}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={selected.title}
              onLoad={() => markViewed(selected)}
            />
          </div>
        ) : selected.videoUrl ? (
          <div style={styles.videoPlayer}>
            <div style={styles.videoOverlay}>
              <div style={styles.playBtn} onClick={() => markViewed(selected)}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill={T.dark}><path d="M8 5v14l11-7z"/></svg>
              </div>
              <div style={styles.videoTitle}>{selected.title}</div>
              <div style={styles.videoDuration}>⏱ {selected.duration} · {selected.owner}</div>
              <a href={selected.videoUrl} target="_blank" rel="noopener noreferrer"
                onClick={() => markViewed(selected)}
                style={{ ...btn('primary'), padding: '10px 22px', fontSize: 14, marginTop: 16, textDecoration: 'none' }}>
                ▶ Watch video
              </a>
            </div>
          </div>
        ) : selected.imageUrl ? (
          <div style={styles.imageWrap} onClick={() => setLightbox(selected.imageUrl)}>
            <img src={selected.imageUrl} alt={selected.title} style={styles.coverImg} />
            <div style={styles.imageHint}>🔍 Click to enlarge</div>
          </div>
        ) : null}

        {/* Description (below media) */}
        {selected.description && (
          <p style={styles.detailDesc}>{selected.description}</p>
        )}

        {/* SOP Document link */}
        {selected.documentUrl && (
          <a href={selected.documentUrl} target="_blank" rel="noopener noreferrer" style={styles.docBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM13 3.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/>
            </svg>
            View SOP Document
          </a>
        )}

        {/* Step-by-step breakdown — always visible */}
        {selected.steps?.length > 0 && (
          <div style={styles.breakdown}>
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
          </div>
        )}

        {/* Mark as viewed — at the bottom, after the steps */}
        <div style={styles.markBar}>
          {isViewed ? (
            <div style={styles.viewedNote}>
              <span style={{ fontWeight: 700, color: T.dark }}>✓ Marked as viewed</span>
              <span style={{ fontSize: 13, opacity: .6 }}>You can come back to this anytime</span>
            </div>
          ) : (
            <button onClick={() => markViewed(selected)} style={{ ...btn('primary'), padding: '12px 26px', fontSize: 14 }}>
              Mark as viewed
            </button>
          )}
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div style={styles.lightbox} onClick={() => setLightbox(null)}>
            <button onClick={() => setLightbox(null)} style={styles.lightboxClose} aria-label="Close">✕</button>
            <img src={lightbox} alt="" style={styles.lightboxImg} onClick={e => e.stopPropagation()} />
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
          <p style={styles.sub}>{viewedIds.length} of {sops.length} viewed</p>
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
          const done = viewedIds.includes(sop.id)
          return (
            <div key={sop.id} onClick={() => { setSelected(sop); setViewed(done) }}
              className={`animate-cardIn delay-${(i % 4) + 1}`}
              style={{ ...styles.card, ...(done ? styles.cardDone : {}) }}>
              <div style={styles.cardTop}>
                <div style={styles.sopIcon}>
                  {sop.imageUrl
                    ? <img src={sop.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span>{sop.icon || '📋'}</span>}
                </div>
                {done && <div style={styles.doneBadge}>✓ Viewed</div>}
              </div>
              <div style={styles.sopCat}>{sop.category}</div>
              <div style={styles.sopTitle}>{sop.title}</div>
              <p style={styles.sopDesc}>{truncate(sop.description, 100)}</p>
              <div style={styles.sopMeta}>
                <span>⏱ {sop.duration}</span><span>·</span>
                <span>{sop.steps?.length || 0} steps</span><span>·</span>
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
  listHeader:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
  h2:           { fontFamily: "'Inter',sans-serif", fontSize: 26, fontWeight: 800, color: T.heading, marginBottom: 4 },
  sub:          { fontSize: 14, color: T.text, opacity: .6 },
  filters:      { display: 'flex', gap: 7, flexWrap: 'wrap' },
  filterBtn:    { padding: '6px 14px', borderRadius: 100, border: `1.5px solid rgba(55,74,62,.18)`, background: 'transparent', color: T.heading, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  filterActive: { background: T.dark, color: T.white, border: `1.5px solid ${T.dark}` },
  grid:         { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 },
  card:         { background: T.card, borderRadius: 16, padding: '22px', cursor: 'pointer', border: '2px solid transparent', transition: 'all .2s' },
  cardDone:     { borderColor: 'rgba(198,221,102,.4)' },
  cardTop:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  sopIcon:      { width: 44, height: 44, borderRadius: 12, background: T.dark, color: T.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, overflow: 'hidden' },
  doneBadge:    { fontSize: 11, fontWeight: 700, background: 'rgba(198,221,102,.2)', color: T.dark, padding: '3px 10px', borderRadius: 100 },
  sopCat:       { fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.text, opacity: .45, marginBottom: 6 },
  sopTitle:     { fontWeight: 700, fontSize: 16, color: T.heading, marginBottom: 8 },
  sopDesc:      { fontSize: 13, lineHeight: 1.55, color: T.text, opacity: .7, marginBottom: 12 },
  sopMeta:      { display: 'flex', gap: 6, fontSize: 12, color: T.text, opacity: .45 },
  detailWrap:   { paddingBottom: 80 },
  backBtn:      { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: T.heading, opacity: .6, fontFamily: 'inherit', marginBottom: 24, padding: 0 },
  detailHeader: { display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 },
  detailIcon:   { width: 60, height: 60, borderRadius: 16, background: T.dark, color: T.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, overflow: 'hidden' },
  catTag:       { fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.accent, background: T.dark, padding: '3px 10px', borderRadius: 100, display: 'inline-block', marginBottom: 8 },
  detailTitle:  { fontFamily: "'Inter',sans-serif", fontSize: 26, fontWeight: 800, color: T.heading, marginBottom: 6 },
  detailDesc:   { fontSize: 15, color: T.text, opacity: .8, lineHeight: 1.65, marginBottom: 24 },
  videoWrap:    { borderRadius: 16, overflow: 'hidden', marginBottom: 20, aspectRatio: '16/9' },
  imageWrap:    {
    position: 'relative', borderRadius: 16, overflow: 'hidden', marginBottom: 20,
    background: T.card, cursor: 'zoom-in',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  coverImg:     { display: 'block', maxWidth: '100%', maxHeight: 560, width: 'auto', height: 'auto', objectFit: 'contain' },
  imageHint:    {
    position: 'absolute', bottom: 12, right: 12,
    fontSize: 11, fontWeight: 700, background: 'rgba(36,47,40,.8)', color: T.white,
    padding: '5px 10px', borderRadius: 100, pointerEvents: 'none',
  },
  iframe:       { width: '100%', height: '100%', border: 'none', display: 'block' },
  videoPlayer:  { background: T.darkest, borderRadius: 16, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, overflow: 'hidden' },
  videoOverlay: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  playBtn:      { width: 64, height: 64, borderRadius: '50%', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 8 },
  videoTitle:   { color: T.white, fontWeight: 700, fontSize: 16 },
  videoDuration: { color: 'rgba(255,255,255,.45)', fontSize: 13 },
  docBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28,
    background: T.card, color: T.heading, border: `1.5px solid rgba(55,74,62,.15)`,
    borderRadius: 10, padding: '10px 18px', fontSize: 14, fontWeight: 600,
    textDecoration: 'none', transition: 'all .2s',
  },
  breakdown:      { marginBottom: 32 },
  breakdownTitle: { fontFamily: "'Inter',sans-serif", fontSize: 20, fontWeight: 700, color: T.heading, marginBottom: 20 },
  steps:          { display: 'flex', flexDirection: 'column', gap: 12 },
  step:           { display: 'flex', gap: 16, alignItems: 'flex-start', background: T.card, borderRadius: 14, padding: '18px 20px' },
  stepNum:        { width: 32, height: 32, borderRadius: '50%', background: T.dark, color: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 },
  stepTitle:      { fontWeight: 700, fontSize: 15, color: T.heading, marginBottom: 5 },
  stepDesc:       { fontSize: 13, lineHeight: 1.6, color: T.text, opacity: .75 },
  markBar:        {
    background: 'rgba(198,221,102,.15)', borderRadius: 12, padding: '18px 22px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
  },
  viewedNote:     { display: 'flex', flexDirection: 'column', gap: 2 },
  lightbox: {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(20,28,23,.92)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 32, cursor: 'zoom-out',
  },
  lightboxImg: {
    maxWidth: '100%', maxHeight: '100%',
    borderRadius: 12, boxShadow: '0 30px 60px rgba(0,0,0,.5)',
    cursor: 'default',
  },
  lightboxClose: {
    position: 'absolute', top: 20, right: 20,
    width: 40, height: 40, borderRadius: '50%',
    background: 'rgba(255,255,255,.12)', color: T.white,
    border: 'none', cursor: 'pointer', fontSize: 18,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
}
