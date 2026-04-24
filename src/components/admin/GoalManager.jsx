import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { T, btn } from '../../styles/tokens'

const ROLES = ['Developer', 'AI Developer', 'Designer', 'Operations']

const EMPTY_FORM = {
  title:       '',
  description: '',
  type:        'global',
  role:        '',
  employeeId:  '',
  dueDate:     '',
  icon:        '🎯',
}

function formatDueDate(dateStr) {
  if (!dateStr) return 'Ongoing'
  const d = new Date(dateStr + 'T23:59:59')
  if (isNaN(d)) return 'Ongoing'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

const typeBadge = (type) => {
  const map = {
    global:     { label: 'Global',     bg: 'rgba(198,221,102,.18)', color: '#374A3E' },
    role:       { label: 'Role',       bg: 'rgba(235,195,101,.18)', color: '#7a5c00' },
    individual: { label: 'Individual', bg: 'rgba(234,158,131,.18)', color: '#a0412a' },
  }
  return map[type] || map.global
}

export default function GoalManager() {
  const { goals, employees, addGoal, updateGoal, deleteGoal } = useApp()
  const [showForm, setShowForm]   = useState(false)
  const [editId,   setEditId]     = useState(null)
  const [form,     setForm]       = useState(EMPTY_FORM)
  const [saving,   setSaving]     = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openNew = () => {
    setForm(EMPTY_FORM)
    setEditId(null)
    setShowForm(true)
  }

  const openEdit = (goal) => {
    setForm({
      title:       goal.title,
      description: goal.description || '',
      type:        goal.type,
      role:        goal.role || '',
      employeeId:  goal.employeeId || '',
      dueDate:     goal.dueDate || '',
      icon:        goal.icon || '🎯',
    })
    setEditId(goal.id)
    setShowForm(true)
  }

  const cancel = () => {
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY_FORM)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      role:       form.type === 'role'       ? form.role       : null,
      employeeId: form.type === 'individual' ? form.employeeId : null,
    }
    try {
      if (editId) {
        updateGoal(editId, payload)
      } else {
        await addGoal(payload)
      }
      cancel()
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this goal? This cannot be undone.')) return
    await deleteGoal(id)
  }

  const nonAdminEmployees = employees.filter(e => !e.isAdmin)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={styles.sectionTitle}>Goals</h2>
          <p style={{ fontSize: 13, color: T.text, opacity: .55, marginTop: -12 }}>
            Create and manage goals for employees. Global goals apply to everyone.
          </p>
        </div>
        {!showForm && (
          <button onClick={openNew} style={btn('primary')}>+ New goal</button>
        )}
      </div>

      {/* Inline form */}
      {showForm && (
        <div style={styles.formCard} className="animate-fadeUp">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: T.heading, marginBottom: 16 }}>
            {editId ? 'Edit goal' : 'New goal'}
          </h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Icon</label>
                <input
                  value={form.icon}
                  onChange={e => set('icon', e.target.value)}
                  placeholder="🎯"
                  style={{ width: 64 }}
                />
              </div>
              <div style={{ ...styles.field, flex: 3 }}>
                <label style={styles.label}>Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="Complete tool setup"
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={3}
                placeholder="What does completing this goal look like?"
              />
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Type *</label>
                <select required value={form.type} onChange={e => set('type', e.target.value)}>
                  <option value="global">Global (all employees)</option>
                  <option value="role">Role-specific</option>
                  <option value="individual">Individual</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Due date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e => set('dueDate', e.target.value)}
                />
                <span style={{ fontSize: 11, color: T.text, opacity: .5 }}>
                  Leave blank for ongoing goals
                </span>
              </div>
            </div>

            {form.type === 'role' && (
              <div style={styles.field}>
                <label style={styles.label}>Role</label>
                <select value={form.role} onChange={e => set('role', e.target.value)} required>
                  <option value="">Select a role…</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            )}

            {form.type === 'individual' && (
              <div style={styles.field}>
                <label style={styles.label}>Employee</label>
                <select value={form.employeeId} onChange={e => set('employeeId', e.target.value)} required>
                  <option value="">Select an employee…</option>
                  {nonAdminEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button type="submit" disabled={saving} style={{ ...btn('primary'), opacity: saving ? .6 : 1 }}>
                {saving ? 'Saving…' : editId ? 'Save changes' : 'Create goal'}
              </button>
              <button type="button" onClick={cancel} style={btn('ghost')}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Goals list */}
      {goals.length === 0 && !showForm ? (
        <div style={styles.empty}>
          No goals yet. Create your first goal to get started.
        </div>
      ) : (
        <div style={styles.list}>
          {goals.map(goal => {
            const badge = typeBadge(goal.type)
            return (
              <div key={goal.id} style={styles.goalRow}>
                <div style={styles.goalIcon}>{goal.icon || '🎯'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: T.heading }}>{goal.title}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: badge.bg, color: badge.color }}>
                      {badge.label}
                    </span>
                    {goal.type === 'role' && goal.role && (
                      <span style={{ fontSize: 11, fontWeight: 600, opacity: .6, color: T.text }}>
                        {goal.role}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {goal.description && (
                      <span style={{ fontSize: 13, color: T.text, opacity: .6, flex: 1 }}>{goal.description}</span>
                    )}
                    <span style={styles.dueTag}>{formatDueDate(goal.dueDate)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => openEdit(goal)} style={{ ...btn('card'), padding: '7px 14px', fontSize: 13 }}>Edit</button>
                  <button onClick={() => handleDelete(goal.id)} style={{ ...btn('ghost'), padding: '7px 14px', fontSize: 13, color: '#c0392b' }}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const styles = {
  sectionTitle: { fontFamily: "'Inter',sans-serif", fontSize: 20, fontWeight: 700, color: T.heading, marginBottom: 20 },
  formCard:     { background: T.card, borderRadius: 16, padding: '24px', marginBottom: 24 },
  form:         { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 680 },
  row:          { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field:        { display: 'flex', flexDirection: 'column', gap: 6, flex: 1 },
  label:        { fontSize: 13, fontWeight: 600, color: T.heading },
  list:         { display: 'flex', flexDirection: 'column', gap: 8 },
  goalRow:      { display: 'flex', alignItems: 'center', gap: 14, background: T.card, borderRadius: 12, padding: '14px 16px' },
  goalIcon:     { fontSize: 24, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.bg, borderRadius: 10, flexShrink: 0 },
  dueTag:       { fontSize: 11, fontWeight: 700, background: T.dark, color: T.accent, padding: '2px 8px', borderRadius: 100, whiteSpace: 'nowrap' },
  empty:        { background: T.card, borderRadius: 14, padding: '32px', textAlign: 'center', color: T.text, opacity: .6 },
}
