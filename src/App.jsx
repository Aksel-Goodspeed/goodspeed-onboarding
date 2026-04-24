import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Landing from './components/Landing'
import AdminDashboard from './components/admin/AdminDashboard'
import InviteForm from './components/admin/InviteForm'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import HomeDashboard from './components/home/HomeDashboard'
import PasswordReset from './components/PasswordReset'

function AuthGuard({ children, require: role }) {
  const { isAdmin, currentEmployee, loading } = useApp()
  // Wait for Supabase to finish loading before making an auth decision
  if (loading) return null
  if (role === 'admin'    && !isAdmin)        return <Navigate to="/" replace />
  if (role === 'employee' && !currentEmployee) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"               element={<Landing />} />
      <Route path="/admin"          element={<AuthGuard require="admin"><AdminDashboard /></AuthGuard>} />
      <Route path="/admin/invite"   element={<AuthGuard require="admin"><InviteForm /></AuthGuard>} />
      <Route path="/join/:token"    element={<OnboardingFlow />} />
      <Route path="/reset/:token"   element={<PasswordReset />} />
      <Route path="/home"           element={<AuthGuard require="employee"><HomeDashboard /></AuthGuard>} />
      <Route path="*"               element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
