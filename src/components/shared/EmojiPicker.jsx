import { useState, useRef, useEffect } from 'react'
import { T } from '../../styles/tokens'

const CATEGORIES = [
  {
    label: 'Goals & Work',
    emojis: ['🎯','🏆','⭐','✅','🚀','💡','🔥','⚡','💪','🎓','📈','🏅','🎖️','🥇','✨','🌟'],
  },
  {
    label: 'Tasks & Tools',
    emojis: ['📋','📝','🗂️','📌','📎','🔧','🛠️','⚙️','🔑','💻','🖥️','📱','🖊️','📐','📏','🗒️'],
  },
  {
    label: 'Communication',
    emojis: ['💬','📣','🤝','👥','🗣️','📢','💌','📨','📩','🔔','📞','📡','🌐','🤙','👋','🙌'],
  },
  {
    label: 'Progress',
    emojis: ['📊','📉','🔄','🔁','⏱️','⏰','🗓️','📅','🔖','🏁','🎉','🎊','🪄','🔓','🛤️','🧭'],
  },
  {
    label: 'People & Growth',
    emojis: ['👤','👩‍💻','👨‍💻','🧑‍🎨','🧑‍💼','👩‍🏫','🌱','🌿','🌳','🌻','🦋','🧠','❤️','💚','🤟','🙏'],
  },
]

export default function EmojiPicker({ value, onChange }) {
  const [open, setOpen]         = useState(false)
  const [search, setSearch]     = useState('')
  const containerRef            = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const allEmojis = CATEGORIES.flatMap(c => c.emojis)
  const searchResults = search
    ? allEmojis.filter(e => {
        // Very basic — match by codepoint name isn't available without a lib,
        // so we just filter the full list for any match against the search text
        // We'll rely on the curated set and let users browse instead.
        return true
      })
    : null

  const select = (emoji) => {
    onChange(emoji)
    setOpen(false)
    setSearch('')
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        title="Pick an emoji"
        style={styles.trigger}
      >
        <span style={{ fontSize: 22, lineHeight: 1 }}>{value || '🎯'}</span>
        <span style={styles.chevron}>{open ? '▴' : '▾'}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={styles.dropdown}>
          {CATEGORIES.map(cat => (
            <div key={cat.label}>
              <div style={styles.catLabel}>{cat.label}</div>
              <div style={styles.grid}>
                {cat.emojis.map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => select(e)}
                    title={e}
                    style={{
                      ...styles.emojiBtn,
                      ...(e === value ? styles.emojiBtnActive : {}),
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  trigger: {
    display:        'flex',
    alignItems:     'center',
    gap:            6,
    background:     'var(--bg)',
    border:         '1.5px solid rgba(55,74,62,.18)',
    borderRadius:   12,
    padding:        '9px 12px',
    cursor:         'pointer',
    transition:     'border-color .15s',
    fontFamily:     'inherit',
    minWidth:       72,
  },
  chevron: {
    fontSize:  10,
    color:     T.heading,
    opacity:   .45,
    lineHeight: 1,
  },
  dropdown: {
    position:     'absolute',
    top:          'calc(100% + 6px)',
    left:         0,
    zIndex:       200,
    background:   '#fff',
    border:       '1.5px solid rgba(55,74,62,.12)',
    borderRadius: 14,
    padding:      '12px',
    boxShadow:    '0 8px 32px rgba(36,47,40,.14)',
    width:        320,
    maxHeight:    360,
    overflowY:    'auto',
    display:      'flex',
    flexDirection:'column',
    gap:          10,
  },
  catLabel: {
    fontSize:      11,
    fontWeight:    700,
    color:         T.heading,
    opacity:       .45,
    textTransform: 'uppercase',
    letterSpacing: '.07em',
    marginBottom:  6,
  },
  grid: {
    display:             'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gap:                 2,
  },
  emojiBtn: {
    background:   'transparent',
    border:       'none',
    borderRadius: 8,
    padding:      '6px 4px',
    fontSize:     20,
    cursor:       'pointer',
    lineHeight:   1,
    transition:   'background .1s',
    textAlign:    'center',
  },
  emojiBtnActive: {
    background: 'rgba(198,221,102,.35)',
  },
}
