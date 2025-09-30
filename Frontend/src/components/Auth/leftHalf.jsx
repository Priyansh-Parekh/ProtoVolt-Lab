import React from 'react'
import { PiArrowsOutCardinal } from "react-icons/pi";
import { TbCpu } from "react-icons/tb";
import { HiOutlineAcademicCap } from "react-icons/hi";

const LeftHalf = () => {
  return (
    <div className="hidden lg:flex w-1/2 items-center justify-center p-12 relative bg-[var(--color-primary)] border-r border-[var(--color-border)]">
    <div className="w-full max-w-lg animate-fadeIn">
        <h1 className="text-5xl font-extrabold tracking-tight text-[var(--color-text-bright)]">
            Unlock the Power of <span className="text-[var(--color-accent-cyan)]">Simulation</span>
        </h1>
        <p className="mt-4 text-xl text-[var(--color-text-light)]">
            From basic concepts to complex circuits, our platform is built for modern electronics education.
        </p>

        <div className="mt-12 space-y-8">
            {/* Feature 1 */}
            <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                    {/* Using react-icons component */}
                    <PiArrowsOutCardinal className="w-8 h-8" />
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Intuitive Drag & Drop Editor</h3>
                    <p className="mt-1 text-[var(--color-text-light)]">Build complex circuits with ease using our clean, node-based canvas.</p>
                </div>
            </div>
            {/* Feature 2 */}
            <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                    {/* Using react-icons component */}
                    <TbCpu className="w-8 h-8" />
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-bold text-[var(--color-text-bright)]">AI-Powered Analysis</h3>
                    <p className="mt-1 text-[var(--color-text-light)]">Get instant feedback and solve for node voltages and currents with our powerful engine.</p>
                </div>
            </div>
            {/* Feature 3 */}
            <div className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                    {/* Using react-icons component */}
                    <HiOutlineAcademicCap className="w-8 h-8" />
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Collaborative Classroom Mode</h3>
                    <p className="mt-1 text-[var(--color-text-light)]">Create assignments, track student progress, and manage your entire course online.</p>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default LeftHalf