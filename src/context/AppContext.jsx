import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext(null)

const SESSION_KEY = 'gs_session'

// ── row ↔ app object mappers ──────────────────────────────────────────────────

function rowToEmployee(row) {
  if (!row) return null
  return {
    // core fields
    id:                 row.id,
    token:              row.token,
    name:               row.name,
    email:              row.email,
    role:               row.role,
    department:         row.department        || '',
    startDate:          row.start_date,
    personalMessage:    row.personal_message,
    managerName:        row.manager_name,
    password:           row.password,
    onboardingComplete: row.onboarding_complete,
    watchedSOPs:        row.watched_sops      || [],
    invitedAt:          row.invited_at,
    // display / team fields
    initials:           row.initials          || (row.name ? row.name.slice(0, 2).toUpperCase() : ''),
    avatarColor:        row.avatar_color      || '#374A3E',
    avatarText:         row.avatar_text       || '#C6DD66',
    bio:                row.bio               || '',
    funFacts:           typeof row.fun_facts === 'string' ? JSON.parse(row.fun_facts) : (row.fun_facts || []),
    slack:              row.slack             || '',
    isFounder:          row.is_founder        || false,
    isAdmin:            row.is_admin          || false,
    // location / profile fields
    location:           row.location          || '',
    locationLat:        row.location_lat      ?? null,
    locationLng:        row.location_lng      ?? null,
    profilePicture:     row.profile_picture   || '',
    completedGoals:     row.completed_goals   || [],
  }
}

function employeeToRow(updates) {
  const row = {}
  if ('name'               in updates) row.name                = updates.name
  if ('email'              in updates) row.email               = updates.email
  if ('role'               in updates) row.role                = updates.role
  if ('department'         in updates) row.department          = updates.department
  if ('startDate'          in updates) row.start_date          = updates.startDate || null
  if ('personalMessage'    in updates) row.personal_message    = updates.personalMessage
  if ('managerName'        in updates) row.manager_name        = updates.managerName
  if ('password'           in updates) row.password            = updates.password
  if ('onboardingComplete' in updates) row.onboarding_complete = updates.onboardingComplete
  if ('watchedSOPs'        in updates) row.watched_sops        = updates.watchedSOPs
  if ('initials'           in updates) row.initials            = updates.initials
  if ('avatarColor'        in updates) row.avatar_color        = updates.avatarColor
  if ('avatarText'         in updates) row.avatar_text         = updates.avatarText
  if ('bio'                in updates) row.bio                 = updates.bio
  if ('funFacts'           in updates) row.fun_facts           = updates.funFacts
  if ('slack'              in updates) row.slack               = updates.slack
  if ('isFounder'          in updates) row.is_founder          = updates.isFounder
  if ('isAdmin'            in updates) row.is_admin            = updates.isAdmin
  if ('location'           in updates) row.location            = updates.location
  if ('locationLat'        in updates) row.location_lat        = updates.locationLat
  if ('locationLng'        in updates) row.location_lng        = updates.locationLng
  if ('profilePicture'     in updates) row.profile_picture     = updates.profilePicture
  if ('completedGoals'     in updates) row.completed_goals     = updates.completedGoals
  return row
}

function rowToSop(row) {
  if (!row) return null
  return {
    id:          row.id,
    title:       row.title,
    description: row.description,
    category:    row.category,
    icon:        row.icon || '📋',
    videoUrl:    row.video_url || '',
    documentUrl: row.document_url || '',
    steps:       typeof row.steps === 'string' ? JSON.parse(row.steps) : (row.steps || []),
    owner:       row.owner,
    duration:    row.duration,
    orderIndex:  row.order_index,
  }
}

function sopToRow(updates) {
  const row = {}
  if ('title'       in updates) row.title        = updates.title
  if ('description' in updates) row.description  = updates.description
  if ('category'    in updates) row.category     = updates.category
  if ('icon'        in updates) row.icon         = updates.icon
  if ('videoUrl'    in updates) row.video_url    = updates.videoUrl
  if ('documentUrl' in updates) row.document_url = updates.documentUrl
  if ('steps'       in updates) row.steps        = updates.steps
  if ('owner'       in updates) row.owner        = updates.owner
  if ('duration'    in updates) row.duration     = updates.duration
  if ('orderIndex'  in updates) row.order_index  = updates.orderIndex
  return row
}

function rowToGoal(row) {
  if (!row) return null
  return {
    id:          row.id,
    title:       row.title,
    description: row.description || '',
    type:        row.type,        // 'global' | 'role' | 'individual'
    role:        row.role         || null,
    employeeId:  row.employee_id  || null,
    dueLabel:    row.due_label    || '30 days',
    dueDate:     row.due_date     || null,
    icon:        row.icon         || '🎯',
    orderIndex:  row.order_index  || 0,
  }
}

function goalToRow(updates) {
  const row = {}
  if ('title'       in updates) row.title        = updates.title
  if ('description' in updates) row.description  = updates.description
  if ('type'        in updates) row.type         = updates.type
  if ('role'        in updates) row.role         = updates.role
  if ('employeeId'  in updates) row.employee_id  = updates.employeeId
  if ('dueLabel'    in updates) row.due_label    = updates.dueLabel
  if ('dueDate'     in updates) row.due_date     = updates.dueDate || null
  if ('icon'        in updates) row.icon         = updates.icon
  if ('orderIndex'  in updates) row.order_index  = updates.orderIndex
  return row
}

function genToken() { return Math.random().toString(36).slice(2, 12) }

// ── provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  const [employees,    setEmployees]    = useState([])
  const [sops,         setSops]         = useState([])
  const [goals,        setGoals]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [session,      setSession]      = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null }
  })

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else         localStorage.removeItem(SESSION_KEY)
  }, [session])

  useEffect(() => {
    Promise.all([fetchEmployees(), fetchSops(), fetchGoals()])
      .finally(() => setLoading(false))
  }, [])

  // ── employees ──────────────────────────────────────────────────────────────

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from('employees').select('*').order('invited_at', { ascending: false })
    if (!error && data) setEmployees(data.map(rowToEmployee))
  }

  const addEmployee = async (data) => {
    const row = {
      token:               genToken(),
      name:                data.name,
      email:               data.email.toLowerCase().trim(),
      role:                data.role,
      start_date:          data.startDate || null,
      personal_message:    data.personalMessage || '',
      manager_name:        data.managerName || 'Harish',  // CEO default
      onboarding_complete: false,
      watched_sops:        [],
    }
    const { data: created, error } = await supabase
      .from('employees').insert(row).select().single()
    if (error) throw error
    const emp = rowToEmployee(created)
    setEmployees(prev => [emp, ...prev])
    return emp
  }

  const updateEmployee = (id, updates) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
    supabase.from('employees').update(employeeToRow(updates)).eq('id', id)
      .select().single()
      .then(({ data, error }) => {
        if (error) { console.error('updateEmployee sync failed:', error); return }
        if (data) setEmployees(prev => prev.map(e => e.id === id ? rowToEmployee(data) : e))
      })
  }

  const getByToken = async (token) => {
    const { data, error } = await supabase
      .from('employees').select('*').eq('token', token).single()
    if (error || !data) return null
    const emp = rowToEmployee(data)
    setEmployees(prev => {
      const exists = prev.find(e => e.id === emp.id)
      return exists ? prev.map(e => e.id === emp.id ? emp : e) : [emp, ...prev]
    })
    return emp
  }

  const getById = (id) => employees.find(e => e.id === id) || null

  const generateResetToken = async (id) => {
    const newToken = genToken()
    const { error } = await supabase.from('employees').update({ token: newToken }).eq('id', id)
    if (error) throw error
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, token: newToken } : e))
    return newToken
  }

  // ── team members (same objects as employees) ──────────────────────────────

  const updateTeamMember = (id, updates) => updateEmployee(id, updates)

  const deleteTeamMember = async (id) => {
    setEmployees(prev => prev.filter(e => e.id !== id))
    await supabase.from('employees').delete().eq('id', id)
  }

  // ── SOPs ───────────────────────────────────────────────────────────────────

  const fetchSops = async () => {
    const { data, error } = await supabase
      .from('sops').select('*').order('order_index', { ascending: true })
    if (!error && data) setSops(data.map(rowToSop))
  }

  const addSop = async (data) => {
    const row = {
      ...sopToRow(data),
      order_index: sops.length + 1,
    }
    const { data: created, error } = await supabase
      .from('sops').insert(row).select().single()
    if (error) throw error
    const sop = rowToSop(created)
    setSops(prev => [...prev, sop])
    return sop
  }

  const updateSop = (id, updates) => {
    setSops(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
    supabase.from('sops').update(sopToRow(updates)).eq('id', id)
      .then(({ error }) => { if (error) console.error('updateSop failed:', error) })
  }

  const deleteSop = async (id) => {
    setSops(prev => prev.filter(s => s.id !== id))
    await supabase.from('sops').delete().eq('id', id)
  }

  // ── Goals ──────────────────────────────────────────────────────────────────

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('goals').select('*').order('order_index', { ascending: true })
    if (!error && data) setGoals(data.map(rowToGoal))
  }

  const addGoal = async (data) => {
    const row = {
      ...goalToRow(data),
      order_index: goals.length + 1,
    }
    const { data: created, error } = await supabase
      .from('goals').insert(row).select().single()
    if (error) throw error
    const goal = rowToGoal(created)
    setGoals(prev => [...prev, goal])
    return goal
  }

  const updateGoal = (id, updates) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
    supabase.from('goals').update(goalToRow(updates)).eq('id', id)
      .then(({ error }) => { if (error) console.error('updateGoal failed:', error) })
  }

  const deleteGoal = async (id) => {
    setGoals(prev => prev.filter(g => g.id !== id))
    await supabase.from('goals').delete().eq('id', id)
  }

  const getGoalsForEmployee = (employee) => {
    if (!employee) return []
    return goals.filter(g =>
      g.type === 'global' ||
      (g.type === 'role' && g.role === employee.role) ||
      (g.type === 'individual' && g.employeeId === employee.id)
    )
  }

  const toggleGoalComplete = (employeeId, goalId) => {
    const emp = employees.find(e => e.id === employeeId)
    if (!emp) return
    const completed = emp.completedGoals || []
    const next = completed.includes(goalId)
      ? completed.filter(id => id !== goalId)
      : [...completed, goalId]
    updateEmployee(employeeId, { completedGoals: next })
  }

  // ── auth ───────────────────────────────────────────────────────────────────

  const employeeLogin = async (email, password) => {
    const { data, error } = await supabase
      .from('employees').select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('password', password)
      .single()
    if (error || !data) return null
    const emp = rowToEmployee(data)
    // Admin employees get an 'admin' session so they route to the admin dashboard
    setSession({ type: emp.isAdmin ? 'admin' : 'employee', employeeId: emp.id })
    setEmployees(prev => {
      const exists = prev.find(e => e.id === emp.id)
      return exists ? prev.map(e => e.id === emp.id ? emp : e) : [emp, ...prev]
    })
    return emp
  }

  const startOnboarding = (employeeId) => {
    setSession({ type: 'employee', employeeId })
  }

  const logout = () => setSession(null)

  // ── derived ────────────────────────────────────────────────────────────────

  const isAdmin         = session?.type === 'admin'
  const currentEmployee = session?.type === 'employee' ? getById(session.employeeId) : null
  const teamMembers     = employees

  return (
    <AppContext.Provider value={{
      employees, teamMembers, sops, goals, session, loading,
      isAdmin, currentEmployee,
      addEmployee, updateEmployee, getByToken, getById, generateResetToken,
      updateTeamMember, deleteTeamMember,
      addSop, updateSop, deleteSop, fetchSops,
      addGoal, updateGoal, deleteGoal, fetchGoals,
      getGoalsForEmployee, toggleGoalComplete,
      employeeLogin, startOnboarding, logout,
      fetchEmployees,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
