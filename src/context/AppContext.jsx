import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

const EMPLOYEES_KEY = 'gs_employees'
const SESSION_KEY   = 'gs_session'
const ADMIN_PASSWORD = 'harish'

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function genId()    { return Math.random().toString(36).slice(2, 10) }
function genToken() { return Math.random().toString(36).slice(2, 12) }

export function AppProvider({ children }) {
  const [employees, setEmployees] = useState(() => load(EMPLOYEES_KEY, []))
  const [session,   setSession]   = useState(() => load(SESSION_KEY, null))

  useEffect(() => { save(EMPLOYEES_KEY, employees) }, [employees])
  useEffect(() => { save(SESSION_KEY,   session)   }, [session])

  // ── employees ────────────────────────────────────────────────────────────
  const addEmployee = (data) => {
    const emp = {
      id:                 genId(),
      token:              genToken(),
      name:               data.name,
      email:              data.email.toLowerCase().trim(),
      role:               data.role,
      startDate:          data.startDate,
      personalMessage:    data.personalMessage || '',
      managerName:        data.managerName || 'Aksel',
      password:           null,
      onboardingComplete: false,
      watchedSOPs:        [],
      invitedAt:          new Date().toISOString(),
    }
    setEmployees(prev => [...prev, emp])
    return emp
  }

  const updateEmployee = (id, updates) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const getByToken = (token) => employees.find(e => e.token === token) || null
  const getById    = (id)    => employees.find(e => e.id    === id)    || null

  // ── auth ──────────────────────────────────────────────────────────────────
  const adminLogin = (password) => {
    if (password.toLowerCase().trim() !== ADMIN_PASSWORD) return false
    setSession({ type: 'admin' })
    return true
  }

  const employeeLogin = (email, password) => {
    const emp = employees.find(
      e => e.email === email.toLowerCase().trim() && e.password === password
    )
    if (!emp) return null
    setSession({ type: 'employee', employeeId: emp.id })
    return emp
  }

  const startOnboarding = (token) => {
    const emp = getByToken(token)
    if (!emp) return null
    setSession({ type: 'employee', employeeId: emp.id })
    return emp
  }

  const logout = () => setSession(null)

  // ── derived ───────────────────────────────────────────────────────────────
  const isAdmin         = session?.type === 'admin'
  const currentEmployee = session?.type === 'employee'
    ? getById(session.employeeId) : null

  return (
    <AppContext.Provider value={{
      employees, session,
      isAdmin, currentEmployee,
      addEmployee, updateEmployee,
      getByToken, getById,
      adminLogin, employeeLogin, startOnboarding, logout,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
