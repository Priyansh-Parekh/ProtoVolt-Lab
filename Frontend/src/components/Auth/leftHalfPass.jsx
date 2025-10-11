import React from 'react'


//importing iconssss
import { RiShieldCheckLine } from "react-icons/ri";
import { MdPassword, MdLockReset } from "react-icons/md";
import { FiKey } from "react-icons/fi";

const LeftHalfPass = () => {
  return (
    <div className="hidden lg:flex w-1/2 items-center justify-center p-12 relative bg-[var(--color-primary)] border-r border-[var(--color-border)]">
    <div className="w-full max-w-lg animate-fadeIn">
        <h1 className="text-5xl font-extrabold tracking-tight text-[var(--color-text-bright)]">
            Update Your <span className="text-[var(--color-accent-cyan)]">Password</span>
        </h1>
        <p className="mt-4 text-xl text-[var(--color-text-light)]">
            Create a new, strong password to keep your account secure.
        </p>

        <div className="mt-12 space-y-8">
            <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                    <FiKey className="w-7 h-7" />
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Strong & Unique</h3>
                    <p className="mt-1 text-[var(--color-text-light)]">Use a combination of letters, numbers, and symbols to create a password that is difficult to guess.</p>
                </div>
            </div>
            <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                    <RiShieldCheckLine className="w-8 h-8" />
                    </div>
                <div className="ml-4">
                    <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Keep it Private</h3>
                    <p className="mt-1 text-[var(--color-text-light)]">Never share your password with anyone. We will never ask you for your password via email.</p>
                </div>
            </div>
            <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                    <MdLockReset className="w-8 h-8" />
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Update Regularly</h3>
                    <p className="mt-1 text-[var(--color-text-light)]">For enhanced security, consider updating your password periodically.</p>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default LeftHalfPass



