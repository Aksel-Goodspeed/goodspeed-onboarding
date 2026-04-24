import { useRef, useEffect, useState } from 'react'
import { T } from '../../styles/tokens'

/**
 * RichTextEditor — sleek Slack-style editor supporting:
 *   bold, underline, bulleted list, numbered list, hyperlinks.
 *
 * Stores content as HTML string.
 * Props:
 *   value        – current HTML string
 *   onChange(v)  – called with new HTML
 *   placeholder  – placeholder text
 *   minHeight    – CSS min-height for the editor area (default 80px)
 */
export default function RichTextEditor({ value = '', onChange, placeholder = 'Write something…', minHeight = 80 }) {
  const editorRef = useRef(null)
  const [focused, setFocused] = useState(false)
  const [isEmpty, setIsEmpty] = useState(!value || value === '<br>' || value === '<p></p>')

  // Sync incoming `value` only when editor is not focused (avoid caret jump while typing)
  useEffect(() => {
    if (editorRef.current && !focused && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
      setIsEmpty(!editorRef.current.textContent.trim())
    }
  }, [value, focused])

  const exec = (cmd, arg = null) => {
    document.execCommand(cmd, false, arg)
    editorRef.current?.focus()
    handleInput()
  }

  const handleInput = () => {
    const html = editorRef.current?.innerHTML || ''
    setIsEmpty(!editorRef.current?.textContent?.trim())
    onChange?.(html)
  }

  const handleLink = () => {
    const sel = window.getSelection()
    const selected = sel?.toString() || ''
    const url = window.prompt('Enter URL', 'https://')
    if (!url) return
    if (selected) {
      exec('createLink', url)
    } else {
      // Insert the URL itself as a clickable link
      exec('insertHTML', `<a href="${url}" target="_blank" rel="noopener">${url}</a>`)
    }
  }

  const isActive = (cmd) => {
    try { return document.queryCommandState(cmd) } catch { return false }
  }

  const btn = (label, cmd, arg, title) => (
    <button
      type="button"
      title={title || label}
      onMouseDown={e => e.preventDefault()}  // keep editor focus
      onClick={() => exec(cmd, arg)}
      style={{
        ...styles.toolBtn,
        ...(isActive(cmd) ? styles.toolBtnActive : {}),
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ ...styles.wrap, ...(focused ? styles.wrapFocused : {}) }}>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={e => {
          // Keyboard shortcuts — let the browser handle Cmd/Ctrl+B, +U natively
          if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault()
            handleLink()
          }
        }}
        data-placeholder={placeholder}
        style={{
          ...styles.editor,
          minHeight,
          ...(isEmpty && !focused ? styles.editorEmpty : {}),
        }}
      />
      <div style={styles.toolbar}>
        {btn(<b>B</b>,    'bold',           null, 'Bold (⌘B)')}
        {btn(<u>U</u>,    'underline',      null, 'Underline (⌘U)')}
        <div style={styles.sep} />
        {btn('•',         'insertUnorderedList', null, 'Bulleted list')}
        {btn('1.',        'insertOrderedList',   null, 'Numbered list')}
        <div style={styles.sep} />
        <button
          type="button"
          title="Link (⌘K)"
          onMouseDown={e => e.preventDefault()}
          onClick={handleLink}
          style={styles.toolBtn}
        >
          🔗
        </button>
      </div>
      <style>{`
        [contenteditable][data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: ${T.text};
          opacity: .4;
          pointer-events: none;
        }
        [contenteditable] a {
          color: #3869b3;
          text-decoration: underline;
        }
        [contenteditable] ul, [contenteditable] ol {
          margin: 4px 0 4px 22px;
          padding: 0;
        }
        [contenteditable] li { margin: 2px 0; }
        [contenteditable] p  { margin: 0 0 6px; }
      `}</style>
    </div>
  )
}

const styles = {
  wrap: {
    background: '#fff',
    border: `1.5px solid rgba(55,74,62,.12)`,
    borderRadius: 12,
    overflow: 'hidden',
    transition: 'border-color .15s, box-shadow .15s',
  },
  wrapFocused: {
    borderColor: T.heading,
    boxShadow: '0 0 0 3px rgba(55,74,62,.08)',
  },
  editor: {
    padding: '12px 14px',
    fontSize: 14,
    lineHeight: 1.5,
    color: T.text,
    outline: 'none',
    fontFamily: 'inherit',
    wordBreak: 'break-word',
  },
  editorEmpty: {},
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    padding: '6px 8px',
    borderTop: `1px solid rgba(55,74,62,.08)`,
    background: 'rgba(55,74,62,.025)',
  },
  toolBtn: {
    background: 'transparent',
    border: 'none',
    borderRadius: 6,
    padding: '5px 9px',
    fontSize: 13,
    color: T.heading,
    cursor: 'pointer',
    fontFamily: 'inherit',
    minWidth: 28,
    transition: 'background .12s',
  },
  toolBtnActive: {
    background: 'rgba(55,74,62,.12)',
  },
  sep: {
    width: 1,
    height: 18,
    background: 'rgba(55,74,62,.12)',
    margin: '0 4px',
  },
}
