import React from 'react';
// --- Importing icons relevant to account verification ---
import { MdOutlineMail } from 'react-icons/md';
import { RiShieldCheckLine } from "react-icons/ri";
import { FiUserCheck } from "react-icons/fi";

const LeftHalfAccVer = () => {
  return (
    <div className="hidden lg:flex w-1/2 items-center justify-center p-12 relative bg-[var(--color-primary)] border-r border-[var(--color-border)]">
      <div className="w-full max-w-lg animate-fadeIn">
          <h1 className="text-5xl font-extrabold tracking-tight text-[var(--color-text-bright)]">
              One Last <span className="text-[var(--color-accent-cyan)]">Step</span>
          </h1>
          <p className="mt-4 text-xl text-[var(--color-text-light)]">
              Let's verify your email to complete your registration and secure your account.
          </p>

          <div className="mt-12 space-y-8">
              <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                      <MdOutlineMail className="w-8 h-8" />
                  </div>
                  <div className="ml-4">
                      <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Confirm Your Email</h3>
                      <p className="mt-1 text-[var(--color-text-light)]">We've sent a code to your inbox to ensure it's really you.</p>
                  </div>
              </div>
              <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                      <FiUserCheck className="w-8 h-8" />
                  </div>
                  <div className="ml-4">
                      <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Activate Your Account</h3>
                      <p className="mt-1 text-[var(--color-text-light)]">Entering the code will activate your account and grant you full access to the platform.</p>
                  </div>
              </div>
              <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                      <RiShieldCheckLine className="w-8 h-8" />
                  </div>
                  <div className="ml-4">
                      <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Secure Your Workspace</h3>
                      <p className="mt-1 text-[var(--color-text-light)]">Email verification is a key step to protecting your future projects and classroom data.</p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  )
}

export default LeftHalfAccVer;
