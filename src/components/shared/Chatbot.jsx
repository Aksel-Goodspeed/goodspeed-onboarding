import { useState, useRef, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { T } from '../../styles/tokens'

const STATIC_KB = [
  {
    t: ['value', 'values', 'believe', 'mission', 'principles'],
    r: `Goodspeed lives by ten values:\n\n**Our business is trust** — protect it like your most valuable asset.\n**Set the standard** — hold yourself to a level others aspire to.\n**Go slow to go fast** — clear thinking saves time when it counts.\n**Bias for action** — a good decision now beats a perfect one too late.\n**Be the owner** — if you see something that needs fixing, fix it.\n**Do what matters most** — ruthlessly prioritise what moves the needle.\n**No assumptions, no surprises** — when things change, tell people.\n**Feedback early, feedback often** — share work-in-progress, always.\n**Experiment, learn and share** — try new things and document what you learn.\n**There is always a way** — constraints are problems to solve, not reasons to stop.`,
  },
  {
    t: ['tool', 'tools', 'software', 'stack', 'figma', 'bubble', 'framer', 'linear', 'notion', 'slack'],
    r: `Here's the core stack:\n\n**Design:** Figma\n**Build:** Bubble, Framer\n**Tasks:** Linear\n**Docs:** Notion\n**Chat:** Slack\n\nYou'll pick it all up quickly — the team is happy to show you the ropes.`,
  },
  {
    t: ['manager', 'boss', 'report', 'aksel', 'harish'],
    r: `Your manager is set during your invite. Harish (Founder & CEO) is approachable — ping them directly on Slack anytime.`,
  },
  {
    t: ['culture', 'vibe', 'feel', 'environment'],
    r: `Goodspeed is fast-moving, candid, and genuinely supportive. No politics. People say what they think and care about doing good work. You can suggest something at 10am and often see it live by 5pm.`,
  },
  {
    t: ['goal', 'goals', '30', '60', '90', 'first day', 'expect'],
    r: `Your goals are structured in 30/60/90-day phases:\n\n**30 days:** Learn the tools, meet everyone, shadow projects.\n**60 days:** Own a deliverable, contribute to a live project.\n**90 days:** Lead a feature, build your workflow, set the next goals.`,
  },
  {
    t: ['hour', 'schedule', 'remote', 'flexible', 'time', 'office'],
    r: `Goodspeed is **async-first and flexible**. Results matter more than hours. Coordinate availability with your team, stay responsive on Slack, and manage your own schedule.`,
  },
  {
    t: ['password', 'login', 'sign in', 'account'],
    r: `You set your password during onboarding. To sign in again, go to the landing page and enter your email and password. If you're locked out, reach out to Harish on Slack.`,
  },
]

function buildKB(teamMembers, sops) {
  return [
    ...STATIC_KB,
    {
      t: ['team', 'people', 'who', 'colleague', 'coworker'],
      r: teamMembers.length
        ? `The team is ${teamMembers.length} people: ${teamMembers.map(m => `**${m.name}** (${m.role})`).join(', ')}.\n\nClick "Meet the Team" in the top nav to learn about each person and reveal fun facts.`
        : `Click "Meet the Team" in the top nav to meet everyone.`,
    },
    {
      t: ['sop', 'sops', 'process', 'procedure', 'workflow', 'how do we', 'how does'],
      r: sops.length
        ? `There are ${sops.length} SOPs in the workspace: ${sops.map(s => `**${s.title}**`).join(', ')}. Check the SOPs tab — each one has a video and a step-by-step breakdown.`
        : `Check the SOPs tab for process guides. Each one has a video and a step-by-step breakdown.`,
    },
  ]
}

function getResponse(msg, kb) {
  const lower = msg.toLowerCase()
  for (const item of kb) {
    if (item.t.some(kw => lower.includes(kw))) return item.r
  }
  return `Good question! That's best answered by your manager directly on Slack. Is there anything else I can help with?`
}

function renderMd(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
}

const CHIPS = ['Our values', 'What tools do we use?', 'Meet the team', 'My goals']

export default function Chatbot({ employee }) {
  const { teamMembers, sops } = useApp()
  const kb = buildKB(teamMembers, sops)
  const [open,     setOpen]     = useState(false)
  const [inited,   setInited]   = useState(false)
  const [msgs,     setMsgs]     = useState([])
  const [input,    setInput]    = useState('')
  const [typing,   setTyping]   = useState(false)
  const [chips,    setChips]    = useState(CHIPS)
  const [badge,    setBadge]    = useState(true)
  const msgsRef = useRef(null)

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [msgs, typing])

  const toggle = () => {
    setOpen(o => !o)
    setBadge(false)
    if (!inited) {
      setInited(true)
      const name = employee?.name || 'there'
      setTimeout(() => addBot(`Hi ${name}! I'm **Goodie**, your onboarding assistant. Ask me anything about Goodspeed — culture, tools, SOPs, or what to do on day one. 🌿`), 300)
    }
  }

  const addBot = (text) => {
    setMsgs(prev => [...prev, { role: 'bot', text }])
  }

  const send = (text) => {
    if (!text.trim()) return
    setMsgs(prev => [...prev, { role: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      addBot(getResponse(text, kb))
    }, 600 + Math.random() * 400)
  }

  const useChip = (chip) => {
    setChips(prev => prev.filter(c => c !== chip))
    send(chip)
  }

  return (
    <>
      {/* Chat panel */}
      <div style={{ ...styles.panel, ...(open ? styles.panelOpen : {}) }}>
        {/* Header */}
        <div style={styles.head}>
          <div style={styles.headAvatar}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={styles.headName}>Goodie</div>
            <div style={styles.headStatus}>Online · ask me anything</div>
          </div>
          <button onClick={toggle} style={styles.closeBtn}>✕</button>
        </div>

        {/* Messages */}
        <div ref={msgsRef} style={styles.msgs}>
          {msgs.map((m, i) => (
            <div key={i} style={{ ...styles.msgRow, ...(m.role === 'user' ? styles.msgRowUser : {}) }}>
              {m.role === 'bot' && <div style={styles.botAv}>🤖</div>}
              <div
                style={{ ...styles.bubble, ...(m.role === 'user' ? styles.bubbleUser : styles.bubbleBot) }}
                dangerouslySetInnerHTML={{ __html: m.role === 'bot' ? renderMd(m.text) : m.text.replace(/&/g,'&amp;').replace(/</g,'&lt;') }}
              />
            </div>
          ))}
          {typing && (
            <div style={styles.msgRow}>
              <div style={styles.botAv}>🤖</div>
              <div style={{ ...styles.bubble, ...styles.bubbleBot, padding: '10px 14px' }}>
                <span style={styles.dot1} /><span style={styles.dot2} /><span style={styles.dot3} />
              </div>
            </div>
          )}
        </div>

        {/* Chips */}
        {chips.length > 0 && (
          <div style={styles.chipsRow}>
            {chips.map(c => (
              <button key={c} onClick={() => useChip(c)} style={styles.chip}>{c}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder="Ask anything about Goodspeed…"
          />
          <button onClick={() => send(input)} style={styles.sendBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={T.white}><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
          </button>
        </div>
      </div>

      {/* FAB */}
      <button onClick={toggle} style={styles.fab} aria-label="Chat with Goodie">
        {badge && <div style={styles.badge}>1</div>}
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.white} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
      </button>

      <style>{`
        @keyframes tdot { 0%,80%,100%{transform:translateY(0);opacity:.3} 40%{transform:translateY(-4px);opacity:.9} }
      `}</style>
    </>
  )
}

const dotBase = { display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: T.heading, opacity: .3, animation: 'tdot 1.1s ease infinite' }
const styles = {
  panel: {
    position: 'fixed', bottom: 94, right: 28, width: 340, height: 480,
    background: T.bg, borderRadius: 20,
    boxShadow: '0 8px 48px rgba(36,47,40,.16)',
    display: 'flex', flexDirection: 'column',
    border: `1px solid rgba(55,74,62,.1)`,
    zIndex: 500, overflow: 'hidden',
    transformOrigin: 'bottom right',
    transform: 'scale(.88) translateY(16px)', opacity: 0,
    pointerEvents: 'none', transition: 'all .3s cubic-bezier(.34,1.56,.64,1)',
  },
  panelOpen: { transform: 'scale(1) translateY(0)', opacity: 1, pointerEvents: 'all' },
  head:      { padding: '13px 16px', background: T.dark, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  headAvatar: { width: 34, height: 34, borderRadius: '50%', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 },
  headName:  { fontSize: 15, fontWeight: 700, color: T.white },
  headStatus: { fontSize: 11, color: T.accent, display: 'flex', alignItems: 'center', gap: 4 },
  closeBtn:  { background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(251,253,252,.4)', fontSize: 18, lineHeight: 1, padding: 4 },
  msgs:      { flex: 1, overflowY: 'auto', padding: 13, display: 'flex', flexDirection: 'column', gap: 8 },
  msgRow:    { display: 'flex', gap: 7, alignItems: 'flex-end' },
  msgRowUser:{ flexDirection: 'row-reverse' },
  botAv:     { width: 24, height: 24, borderRadius: '50%', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 },
  bubble:    { maxWidth: '80%', padding: '9px 12px', borderRadius: 14, fontSize: 13, lineHeight: 1.55 },
  bubbleBot: { background: T.card, color: T.text, borderBottomLeftRadius: 4 },
  bubbleUser: { background: T.dark, color: T.white, borderBottomRightRadius: 4 },
  dot1: { ...dotBase },
  dot2: { ...dotBase, animationDelay: '.18s', marginLeft: 4 },
  dot3: { ...dotBase, animationDelay: '.36s', marginLeft: 4 },
  chipsRow:  { padding: '5px 12px 3px', display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 },
  chip: {
    fontSize: 11, padding: '5px 10px', borderRadius: 100,
    background: T.card, color: T.heading, border: 'none',
    cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
    transition: 'all .15s',
  },
  inputRow:  { padding: '9px 12px', borderTop: `1px solid rgba(55,74,62,.08)`, display: 'flex', gap: 7, flexShrink: 0 },
  input: {
    flex: 1, border: `1.5px solid rgba(55,74,62,.15)`, borderRadius: 100,
    padding: '8px 14px', fontSize: 13, fontFamily: 'inherit',
    background: T.bg, color: T.text, outline: 'none',
  },
  sendBtn: { width: 36, height: 36, borderRadius: '50%', background: T.dark, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  fab: {
    position: 'fixed', bottom: 28, right: 28,
    width: 52, height: 52, borderRadius: '50%',
    background: T.dark, border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(36,47,40,.28)',
    transition: 'all .2s', zIndex: 500,
  },
  badge: {
    position: 'absolute', top: -2, right: -2,
    width: 17, height: 17, borderRadius: '50%',
    background: T.coral, fontSize: 10, fontWeight: 700,
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: `2px solid ${T.bg}`,
  },
}
