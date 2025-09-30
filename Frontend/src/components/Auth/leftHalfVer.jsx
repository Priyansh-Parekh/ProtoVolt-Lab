import React from 'react'

// --- NEW: Importing icons relevant to account recovery ---
import { MdOutlineMail,MdPassword } from 'react-icons/md';
import { RiShieldCheckLine } from "react-icons/ri";

const LeftHalfVer = () => {
  return (
    <div className="hidden lg:flex w-1/2 items-center justify-center p-12 relative bg-[var(--color-primary)] border-r border-[var(--color-border)]">
      <div className="w-full max-w-lg animate-fadeIn">
          <h1 className="text-5xl font-extrabold tracking-tight text-[var(--color-text-bright)]">
              Account <span className="text-[var(--color-accent-cyan)]">Recovery</span>
          </h1>
          <p className="mt-4 text-xl text-[var(--color-text-light)]">
              Follow the steps below to securely regain access to your account.
          </p>

          <div className="mt-12 space-y-8">
              <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                      <MdOutlineMail className="w-8 h-8" />
                  </div>
                  <div className="ml-4">
                      <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Check Your Email</h3>
                      <p className="mt-1 text-[var(--color-text-light)]">A secure, single-use verification code has been sent to your registered email address.</p>
                  </div>
              </div>
              <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                      <RiShieldCheckLine className="w-8 h-8" />
                  </div>
                  <div className="ml-4">
                      <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Verify Your Identity</h3>
                      <p className="mt-1 text-[var(--color-text-light)]">Enter the code to confirm you are the owner of this account. Your security is our priority.</p>
                  </div>
              </div>
              <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                      <MdPassword className="w-8 h-8" />
                  </div>
                  <div className="ml-4">
                      <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Reset and Continue</h3>
                      <p className="mt-1 text-[var(--color-text-light)]">After successful verification, you will be able to set a new password and access your projects.</p>
                  </div>
              </div>
          </div>
      </div>
  </div>
  )
}

export default LeftHalfVer

