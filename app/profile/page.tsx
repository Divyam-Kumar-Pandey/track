'use client'

import Image from 'next/image'
import { useUser, SignOutButton, RedirectToSignIn, UserButton, UserProfile } from '@clerk/nextjs'
import { useMemo, useRef } from 'react'
import pkg from '../../package.json'
import FeedbackModal from '@/components/FeedbackModal'

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  if(user === null) {
    return <RedirectToSignIn />
  }
  const bugDialogRef = useRef<HTMLDialogElement | null>(null)
  const featureDialogRef = useRef<HTMLDialogElement | null>(null)
  const profileDialogRef = useRef<HTMLDialogElement | null>(null)

  const supportEmail = process.env.NEXT_PUBLIC_BUG_EMAIL || 'divyamkumarp@gmail.com'
  const featureEmail = process.env.NEXT_PUBLIC_FEATURE_EMAIL || 'divyamkumarp@gmail.com'
  const appName = 'Track'
  const appVersion = pkg.version

  const userDisplayName = useMemo(() => {
    if (!user) return ''
    return user.fullName || user.username || user.primaryEmailAddress?.emailAddress || 'User'
  }, [user])

  const email = user?.primaryEmailAddress?.emailAddress
  const avatarUrl = user?.imageUrl

  const openBugDialog = () => {
    bugDialogRef.current?.showModal()
  }

  const openFeatureDialog = () => {
    featureDialogRef.current?.showModal()
  }

  const openProfileDialog = () => {
    profileDialogRef.current?.showModal()
  }

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg" aria-label="loading" />
      </main>
    )
  }

  if (!user) {
    return <RedirectToSignIn />
  }

  return (
    <main className="min-h-screen py-24 px-4 flex flex-col items-center justify-between">
      <div className="mx-auto max-w-2xl">
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body gap-6">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt="Profile picture" width={80} height={80} />
                  ) : (
                    <div className="bg-neutral text-neutral-content w-20 h-20 flex items-center justify-center text-2xl">
                      {userDisplayName?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{userDisplayName}</h1>
                {email ? <p className="text-base-content/70">{email}</p> : null}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <a className="btn btn-outline btn-block" onClick={openBugDialog}>
                Report a bug
              </a>
              <a className="btn btn-outline btn-block" onClick={openProfileDialog}>
                Manage profile
              </a>
              <a className="btn btn-outline btn-block" onClick={openFeatureDialog}>
                Request a feature
              </a>
              <SignOutButton>
                <button className="btn btn-outline btn-block">
                  Logout
                </button>
              </SignOutButton>
            </div>

          </div>
        </div>
      </div>

      <dialog ref={profileDialogRef} className="modal">

            <UserProfile />
            <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
      </dialog>

      <FeedbackModal
        ref={bugDialogRef}
        title="Report a bug"
        placeholder="Write your bug report..."
        toEmail={supportEmail}
        subject="Bug report - Track"
        userDisplayName={userDisplayName}
        userId={user.id}
        email={email}
        variant="primary"
      />
      <FeedbackModal
        ref={featureDialogRef}
        title="Request a feature"
        placeholder="Describe your feature request..."
        toEmail={featureEmail}
        subject="Feature request - Track"
        userDisplayName={userDisplayName}
        userId={user.id}
        email={email}
        variant="secondary"
      />

      <footer className="mt-10 flex items-center justify-center text-base-content/70 ">
        <span className="font-bold">{appName}</span>&nbsp;v{appVersion}
      </footer>
    </main>
  )
}

