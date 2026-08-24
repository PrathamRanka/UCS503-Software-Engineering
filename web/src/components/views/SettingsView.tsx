import { ChangeEvent, FormEvent, useState } from 'react'
import { Bell, Lock, LogOut, Shield, UserRound } from 'lucide-react'
import type { UserProfile } from '../../types/social'
import { Avatar } from '../ui/Avatar'
import { PageHeader } from '../ui/PageHeader'

type SettingsViewProps = { user: UserProfile; onUpdate: (user: UserProfile) => void; onLogout: () => void; onPasswordReset: () => void; onDeleteAccount: () => void }

export function SettingsView({ user, onUpdate, onLogout, onPasswordReset, onDeleteAccount }: SettingsViewProps) {
  const [name, setName] = useState(user.name)
  const [avatar, setAvatar] = useState(user.avatar)
  const [username, setUsername] = useState(user.username)
  const [bio, setBio] = useState(user.bio)
  const [privateAccount, setPrivateAccount] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onUpdate({ ...user, name: name.trim(), username: username.trim().replace(/^@/, ''), bio: bio.trim(), avatar })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  const toggleClass = (enabled: boolean) => `relative h-6 w-11 rounded-full transition ${enabled ? 'bg-blue-500' : 'bg-neutral-300'} motion-reduce:transition-none after:absolute after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition after:content-[''] ${enabled ? 'after:left-[22px]' : 'after:left-0.5'}`
  const changePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <section className="mx-auto min-h-screen w-full max-w-3xl border-x border-neutral-100">
      <PageHeader title="Settings" />
      <div className="p-4 sm:p-7">
        <form className="rounded-xl border border-neutral-200 p-5 sm:p-7" onSubmit={submit}>
          <div className="flex items-center gap-4"><Avatar src={avatar} size="lg" /><div><strong className="block">{user.username}</strong><label className="mt-1 block cursor-pointer text-xs font-semibold text-blue-500">Change profile photo<input className="sr-only" type="file" accept="image/*" onChange={changePhoto} /></label></div></div>
          <div className="mt-7 grid gap-5"><label className="grid gap-1.5 text-sm font-semibold">Name<input className="h-11 rounded-lg border border-neutral-300 px-3 font-normal outline-none focus:border-neutral-500" value={name} onChange={(event) => setName(event.target.value)} /></label><label className="grid gap-1.5 text-sm font-semibold">Username<input className="h-11 rounded-lg border border-neutral-300 px-3 font-normal outline-none focus:border-neutral-500" value={username} onChange={(event) => setUsername(event.target.value)} /></label><label className="grid gap-1.5 text-sm font-semibold">Bio<textarea className="min-h-24 rounded-lg border border-neutral-300 p-3 font-normal outline-none focus:border-neutral-500" maxLength={150} value={bio} onChange={(event) => setBio(event.target.value)} /><small className="text-right font-normal text-neutral-400">{bio.length}/150</small></label></div>
          <button className="mt-6 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white" type="submit">Save changes</button>{saved ? <span className="ml-3 text-sm font-medium text-green-600">Saved</span> : null}
        </form>

        <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200">
          <div className="flex items-center gap-3 border-b border-neutral-100 p-4"><Shield size={20} /><div className="flex-1"><strong className="text-sm">Private account</strong><p className="text-xs text-neutral-500">Only approved students can follow you.</p></div><button className={toggleClass(privateAccount)} onClick={() => setPrivateAccount((current) => !current)} aria-label="Toggle private account" /></div>
          <div className="flex items-center gap-3 border-b border-neutral-100 p-4"><Bell size={20} /><div className="flex-1"><strong className="text-sm">Push notifications</strong><p className="text-xs text-neutral-500">Likes, comments, follows and messages.</p></div><button className={toggleClass(notifications)} onClick={() => setNotifications((current) => !current)} aria-label="Toggle notifications" /></div>
          <div className="flex items-center gap-3 border-b border-neutral-100 p-4"><Lock size={20} /><div className="flex-1"><strong className="text-sm">Account privacy</strong><p className="text-xs text-neutral-500">Verified Thapar members only</p></div><span className="text-xs font-medium text-green-600">Protected</span></div>
          <div className="flex items-center gap-3 p-4"><UserRound size={20} /><div className="flex-1"><strong className="text-sm">Personal details</strong><p className="text-xs text-neutral-500">{user.email}</p></div><span className="text-xs text-neutral-400">Verified</span></div>
        </div>
        <button className="mt-5 flex w-full items-center justify-between rounded-xl border border-neutral-200 p-4 text-left" onClick={onPasswordReset}><span><b className="block text-sm">Change password</b><small className="text-neutral-500">Send a reset link to your Thapar email</small></span><Lock size={19} /></button>
        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 p-4 text-sm font-semibold text-red-500 hover:bg-red-50" onClick={onLogout}><LogOut size={19} />Log out of Thapar Talks</button>
        <button className="mt-3 w-full py-3 text-xs font-semibold text-red-500" onClick={() => setConfirmDelete(true)}>Deactivate or delete account</button>
      </div>
      {confirmDelete ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"><section className="w-full max-w-sm rounded-xl bg-white p-6 text-center"><h2 className="text-lg font-semibold">Delete account?</h2><p className="mt-2 text-sm leading-5 text-neutral-500">This mock removes your local session and returns to sign in. A real backend will add a recovery period.</p><div className="mt-6 grid gap-2"><button className="rounded-lg bg-red-500 py-3 text-sm font-semibold text-white" onClick={onDeleteAccount}>Delete account</button><button className="rounded-lg bg-neutral-100 py-3 text-sm font-semibold" onClick={() => setConfirmDelete(false)}>Cancel</button></div></section></div> : null}
    </section>
  )
}
