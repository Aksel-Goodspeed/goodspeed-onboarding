export const T = {
  bg:       '#F9F2ED',
  card:     '#EFEBE1',
  dark:     '#374A3E',
  darker:   '#36493C',
  darkest:  '#242F28',
  text:     '#242F28',
  heading:  '#374A3E',
  accent:   '#C6DD66',
  bright:   '#D7FF36',
  coral:    '#EA9E83',
  gold:     '#EBC365',
  white:    '#FBFDFC',
}

export const btn = (variant = 'primary') => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 24px',
  borderRadius: 100,
  fontSize: 15,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
  border: 'none',
  transition: 'all .2s ease',
  textDecoration: 'none',
  ...(variant === 'primary' && { background: T.accent, color: T.dark }),
  ...(variant === 'dark'    && { background: T.dark, color: T.white }),
  ...(variant === 'ghost'   && { background: 'transparent', color: T.heading, border: `1.5px solid rgba(55,74,62,.25)` }),
  ...(variant === 'card'    && { background: T.card, color: T.heading }),
})

export const card = (dark = false) => ({
  background: dark ? T.dark : T.card,
  borderRadius: 16,
  padding: '20px 24px',
  color: dark ? T.white : T.text,
})

export const eyebrow = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  color: T.accent,
  background: T.dark,
  padding: '4px 12px',
  borderRadius: 100,
  display: 'inline-block',
  marginBottom: 20,
}

export const h1Style = {
  fontFamily: "'Inter', 'Arial Black', sans-serif",
  fontSize: 'clamp(34px, 5vw, 56px)',
  fontWeight: 900,
  color: T.heading,
  lineHeight: 1.1,
  marginBottom: 14,
}

export const h2Style = {
  fontFamily: "'Inter', 'Arial Black', sans-serif",
  fontSize: 'clamp(26px, 4vw, 40px)',
  fontWeight: 800,
  color: T.heading,
  lineHeight: 1.15,
  marginBottom: 12,
}

export const lead = {
  fontSize: 17,
  lineHeight: 1.75,
  color: T.text,
  maxWidth: 540,
  opacity: .85,
}
