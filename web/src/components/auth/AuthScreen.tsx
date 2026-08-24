import { FormEvent, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Lock, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { demoUser } from '../../data/mockData'
import type { UserProfile } from '../../types/social'
import { Brand } from '../ui/Brand'

type AuthScreenProps = { onAuthenticated: (user: UserProfile) => void }
type AuthStep = 'signin' | 'signup' | 'onboarding'

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [step, setStep] = useState<AuthStep>('signin')
  const [showAccounts, setShowAccounts] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [branch, setBranch] = useState('Computer Science')
  const [year, setYear] = useState('First year')

  const validateThaparEmail = () => {
    if (!email.trim().toLowerCase().endsWith('@thapar.edu')) {
      setError('Use your @thapar.edu email address.')
      return false
    }
    setError('')
    return true
  }

  const signIn = (event: FormEvent) => {
    event.preventDefault()
    if (!validateThaparEmail()) return
    if (password.length < 6) {
      setError('Enter a password with at least 6 characters.')
      return
    }
    onAuthenticated({ ...demoUser, email: email.trim().toLowerCase() })
  }

  const startSignup = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Enter your full name.')
      return
    }
    if (!validateThaparEmail()) return
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }
    setUsername(email.split('@')[0].replace(/[^a-zA-Z0-9._]/g, '').toLowerCase())
    setStep('onboarding')
  }

  const finishSignup = (event: FormEvent) => {
    event.preventDefault()
    if (username.trim().length < 3) {
      setError('Choose a username with at least 3 characters.')
      return
    }
    onAuthenticated({
      id: `user-${Date.now()}`,
      name: name.trim(),
      username: username.trim().replace(/^@/, '').toLowerCase(),
      email: email.trim().toLowerCase(),
      avatar: '/images/riya.jpg',
      bio: `${branch} · ${year}`,
      branch,
      year,
      followers: 0,
      following: 0,
    })
  }

  const inputClass = 'h-11 w-full rounded-md border border-neutral-300 bg-neutral-50 px-3 text-sm outline-none transition focus:border-neutral-500 focus:bg-white motion-reduce:transition-none'
  const primaryButton = 'flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 text-sm font-semibold text-white transition duration-150 ease-out hover:bg-blue-600 active:scale-[.98] disabled:opacity-40 motion-reduce:transition-none'

  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-8 sm:grid sm:place-items-center">
      <div className="mx-auto grid w-full max-w-[940px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm md:grid-cols-[1.08fr_.92fr]">
        <section className="relative hidden min-h-[680px] overflow-hidden bg-neutral-950 p-10 text-white md:block">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-fuchsia-600/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 size-80 rounded-full bg-orange-500/25 blur-3xl" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs"><ShieldCheck size={14} /> Verified campus community</span>
            <h1 className="mt-7 max-w-md font-serif text-5xl font-bold italic leading-[1.05]">Every campus moment, in one place.</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">Share, discover and talk with verified Thapar students. Your campus ID keeps the community private.</p>
          </div>
          <div className="absolute bottom-9 left-10 right-10 grid grid-cols-3 gap-2">
            {['/images/campus.jpg', '/images/friends.jpg', '/images/event.jpg'].map((image, index) => <img className={`h-44 w-full rounded-xl object-cover ${index === 1 ? '-translate-y-7' : ''}`} src={image} alt="Campus preview" key={image} />)}
          </div>
        </section>

        <section className="flex min-h-[620px] flex-col justify-center px-6 py-10 sm:px-12">
          <div className="mx-auto w-full max-w-[340px]">
            <div className="mb-9 flex justify-center"><Brand /></div>

            {step === 'signin' ? (
              <>
                <h2 className="text-center text-xl font-semibold">Sign in to your campus</h2>
                <p className="mt-2 text-center text-sm text-neutral-500">Only verified Thapar accounts can join.</p>
                <button className={`${primaryButton} mt-7 bg-white text-neutral-900 ring-1 ring-neutral-300 hover:bg-neutral-50`} onClick={() => setShowAccounts((current) => !current)}>
                  <span className="text-lg font-bold text-blue-500">G</span> Continue with Google
                </button>
                {showAccounts ? (
                  <div className="mt-2 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg">
                    <button className="flex w-full items-center gap-3 p-3 text-left hover:bg-neutral-50" onClick={() => onAuthenticated(demoUser)}>
                      <img className="size-9 rounded-full object-cover" src={demoUser.avatar} alt="" />
                      <span className="flex-1"><b className="block text-sm">Riya Sharma</b><small className="text-neutral-500">riya.sharma@thapar.edu</small></span><CheckCircle2 className="text-green-500" size={18} />
                    </button>
                    <button className="flex w-full items-center gap-3 border-t border-neutral-100 p-3 text-left hover:bg-neutral-50" onClick={() => { setShowAccounts(false); setError('This account is not linked to a Thapar ID.') }}>
                      <span className="grid size-9 place-items-center rounded-full bg-neutral-100"><UserRound size={18} /></span>
                      <span><b className="block text-sm">Use another account</b><small className="text-neutral-500">Personal accounts are not allowed</small></span>
                    </button>
                  </div>
                ) : null}
                <div className="my-6 flex items-center gap-3 text-xs font-semibold text-neutral-400"><span className="h-px flex-1 bg-neutral-200" />OR<span className="h-px flex-1 bg-neutral-200" /></div>
                <form className="grid gap-2.5" onSubmit={signIn}>
                  <label className="relative"><Mail className="absolute left-3 top-3 text-neutral-400" size={18} /><input className={`${inputClass} pl-10`} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Thapar email" /></label>
                  <label className="relative"><Lock className="absolute left-3 top-3 text-neutral-400" size={18} /><input className={`${inputClass} pl-10`} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" /></label>
                  {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
                  <button className={`${primaryButton} mt-2`} type="submit">Sign in <ArrowRight size={17} /></button>
                </form>
                <button className="mt-4 w-full text-center text-xs text-[#00376b]" onClick={() => setError('A mock reset link has been sent to your Thapar email.')}>Forgot password?</button>
                <p className="mt-8 text-center text-sm">New to Thapar Talks? <button className="font-semibold text-blue-500" onClick={() => { setStep('signup'); setError('') }}>Create an account</button></p>
              </>
            ) : null}

            {step === 'signup' ? (
              <>
                <button className="mb-5 flex items-center gap-1 text-sm text-neutral-500" onClick={() => { setStep('signin'); setError('') }}><ArrowLeft size={16} /> Back</button>
                <h2 className="text-xl font-semibold">Create your account</h2>
                <p className="mt-2 text-sm text-neutral-500">Start with your verified institute details.</p>
                <form className="mt-7 grid gap-3" onSubmit={startSignup}>
                  <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" />
                  <input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@thapar.edu" />
                  <input className={inputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create password" />
                  {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
                  <button className={`${primaryButton} mt-2`} type="submit">Verify and continue <ArrowRight size={17} /></button>
                </form>
                <p className="mt-6 text-center text-xs leading-5 text-neutral-400">By continuing, you agree to the campus community guidelines and privacy policy.</p>
              </>
            ) : null}

            {step === 'onboarding' ? (
              <>
                <div className="mb-5 grid size-11 place-items-center rounded-full bg-blue-50 text-blue-500"><GraduationCap /></div>
                <h2 className="text-xl font-semibold">Complete your profile</h2>
                <p className="mt-2 text-sm text-neutral-500">This is how other students will find you.</p>
                <form className="mt-7 grid gap-3" onSubmit={finishSignup}>
                  <label className="text-xs font-semibold text-neutral-600">Username<input className={`${inputClass} mt-1.5`} value={username} onChange={(event) => setUsername(event.target.value)} placeholder="username" /></label>
                  <label className="text-xs font-semibold text-neutral-600">Branch<select className={`${inputClass} mt-1.5`} value={branch} onChange={(event) => setBranch(event.target.value)}><option>Computer Science</option><option>Electronics</option><option>Mechanical</option><option>Civil</option><option>Biotechnology</option></select></label>
                  <label className="text-xs font-semibold text-neutral-600">Year<select className={`${inputClass} mt-1.5`} value={year} onChange={(event) => setYear(event.target.value)}><option>First year</option><option>Second year</option><option>Third year</option><option>Final year</option></select></label>
                  {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
                  <button className={`${primaryButton} mt-2`} type="submit">Create account</button>
                </form>
              </>
            ) : null}

            <p className="mt-8 text-center text-[11px] text-neutral-400">Frontend demo · Authentication is simulated locally</p>
          </div>
        </section>
      </div>
    </main>
  )
}
