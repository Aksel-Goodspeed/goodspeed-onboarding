import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Logo from '../shared/Logo'
import { T } from '../../styles/tokens'

import WelcomeStep   from './steps/WelcomeStep'
import ManagerStep   from './steps/ManagerStep'
import MeetTeamStep  from './steps/MeetTeamStep'
import CompanyStep   from './steps/CompanyStep'
import ValuesStep    from './steps/ValuesStep'
import GoalsStep     from './steps/GoalsStep'
import CompleteStep  from './steps/CompleteStep'

const STEPS = [
  { id: 'welcome',  label: 'Welcome'       },
  { id: 'manager',  label: 'Your manager'  },
  { id: 'company',  label: 'Our story'     },
  { id: 'values',   label: 'Values'        },
  { id: 'team',     label: 'Meet the team' },
  { id: 'goals',    label: 'Your goals'    },
  { id: 'complete', label: 'All done!'     },
]

export default function OnboardingFlow() {
  const { token }  = useParams()
  const { employees, getByToken, startOnboarding, updateEmployee } = useApp()
  const navigate   = useNavigate()
  const [step, setStep]       = useState(0)
  const [employee, setEmployee] = useState(null)
  const [ready, setReady]       = useState(false)
  const [animKey, setAnimKey]   = useState(0)
  const sessionStarted = useRef(false)

  // Fetch employee by token directly from Supabase (async, no stale closure)
  useEffect(() => {
    let cancelled = false
    getByToken(token).then(emp => {
      if (cancelled) return
      setReady(true)
      if (!emp) return
      setEmployee(emp)
      if (!sessionStarted.current) {
        sessionStarted.current = true
        startOnboarding(emp.id)
      }
      if (emp.onboardingComplete) navigate('/home', { replace: true })
      if (emp.password && step === 0) setStep(1)
    })
    return () => { cancelled = true }
  }, [token])

  // Refresh local employee state from context (called after mutations)
  const refreshEmp = () => {
    if (employee) {
      const fresh = employees.find(e => e.id === employee.id)
      if (fresh) setEmployee(fresh)
      return fresh
    }
  }

  const goNext = () => {
    refreshEmp()
    if (step >= STEPS.length - 1) return
    setAnimKey(k => k + 1)
    setStep(s => s + 1)
  }
  const goPrev = () => {
    if (step <= 0) return
    setAnimKey(k => k + 1)
    setStep(s => s - 1)
  }

  if (!ready) return null
  if (!employee) return (
    <div style={styles.page}>
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: T.heading, marginBottom: 8 }}>Invite not found</h2>
        <p style={{ opacity: .6 }}>This link may have expired or been used already.</p>
      </div>
    </div>
  )

  const pct = (step / (STEPS.length - 1)) * 100

  const stepProps = { employee, updateEmployee, onNext: goNext, onPrev: goPrev, step, navigate }

  return (
    <div style={styles.page}>
      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${Math.max(pct, 3)}%` }} />
      </div>

      {/* Header */}
      <header style={styles.header}>
        <Logo width={110} />
        <span style={styles.counter}>{step + 1} / {STEPS.length}</span>
      </header>

      {/* Step content */}
      <main style={styles.main}>
        <div key={animKey} className="animate-fadeUp" style={styles.stepContainer}>
          {step === 0 && <WelcomeStep  {...stepProps} />}
          {step === 1 && <ManagerStep  {...stepProps} />}
          {step === 2 && <CompanyStep  {...stepProps} />}
          {step === 3 && <ValuesStep   {...stepProps} />}
          {step === 4 && <MeetTeamStep {...stepProps} />}
          {step === 5 && <GoalsStep    {...stepProps} />}
          {step === 6 && <CompleteStep {...stepProps} />}
        </div>
      </main>

      {/* Footer nav — hidden on welcome (step 0) and complete (last step) */}
      {/* Continue button is also hidden on the values step (step 3) — that step gates its own Continue */}
      {step > 0 && step < STEPS.length - 1 && (
        <footer style={styles.footer}>
          <button onClick={goPrev} style={styles.ghostBtn}>← Back</button>
          <div style={styles.dots}>
            {STEPS.slice(1, -1).map((_, i) => (
              <div key={i} style={{ ...styles.dot, ...(i === step - 1 ? styles.dotActive : {}) }} />
            ))}
          </div>
          {STEPS[step].id !== 'values' && (
            <button onClick={goNext} style={styles.primaryBtn}>Continue →</button>
          )}
        </footer>
      )}
    </div>
  )
}

const styles = {
  page:          { minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column' },
  progressTrack: { height: 3, background: T.card, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200 },
  progressFill:  { height: '100%', background: T.accent, transition: 'width .6s cubic-bezier(.4,0,.2,1)' },
  header: {
    position: 'sticky', top: 3, zIndex: 100,
    height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 40px', background: T.bg, borderBottom: `1px solid rgba(55,74,62,.08)`,
  },
  counter: { fontSize: 13, fontWeight: 600, color: T.heading, opacity: .45 },
  main:    {
    flex: 1, display: 'flex', justifyContent: 'center',
    padding: '48px 24px 100px', overflowY: 'auto',
  },
  stepContainer: {
    width: '100%', maxWidth: 800,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  footer: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 40px',
    background: `linear-gradient(to top, ${T.bg} 60%, transparent)`,
    zIndex: 100,
  },
  dots:       { display: 'flex', gap: 7, alignItems: 'center' },
  dot:        { width: 7, height: 7, borderRadius: 100, background: 'rgba(55,74,62,.2)', transition: 'all .3s' },
  dotActive:  { background: T.dark, width: 22 },
  primaryBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '12px 24px', borderRadius: 100, fontSize: 15, fontWeight: 700,
    background: T.accent, color: T.dark, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
  },
  ghostBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '12px 20px', borderRadius: 100, fontSize: 15, fontWeight: 600,
    background: 'transparent', color: T.heading, border: `1.5px solid rgba(55,74,62,.2)`,
    cursor: 'pointer', fontFamily: 'inherit',
  },
}
