import React, { useState } from 'react';
// --- Importing icons for the informative panel ---
import { MdOutlineEditNote } from "react-icons/md";
import { IoAnalyticsSharp } from "react-icons/io5";
import { VscMegaphone } from "react-icons/vsc";
import { TbCpu } from "react-icons/tb";
import { RiShieldCheckLine } from "react-icons/ri"; // Added icon for security


// Renamed and enhanced reusable component for the left visual panel
const LeftVisualPanel = () => {
    return (
        <div className="hidden lg:flex w-1/2 items-center justify-center p-12 relative bg-[var(--color-primary)] border-r border-[var(--color-border)]">
            <div className="w-full max-w-lg animate-fadeIn">
                <h1 className="text-5xl font-extrabold tracking-tight text-[var(--color-text-bright)]">
                    Build Your <span className="text-[var(--color-accent-cyan)]">Learning Community</span>
                </h1>
                <p className="mt-4 text-xl text-[var(--color-text-light)]">
                    Create a dedicated space for your students to learn, collaborate, and grow their skills in circuit analysis.
                </p>
    
                <div className="mt-12 space-y-8">
                    {/* Feature 1 - Enhanced */}
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                            <MdOutlineEditNote className="w-8 h-8" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Design Custom Assignments</h3>
                            <p className="mt-1 text-[var(--color-text-light)]">Go beyond theory. Build unique, hands-on problems in the workspace that challenge and inspire your students.</p>
                        </div>
                    </div>
                     {/* Feature 2 - Enhanced */}
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                            <TbCpu className="w-8 h-8" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Instant AI-Powered Feedback</h3>
                            <p className="mt-1 text-[var(--color-text-light)]">Enable students to analyze their circuits in real-time, helping them to learn from mistakes and understand concepts faster.</p>
                        </div>
                    </div>
                    {/* Feature 3 - Enhanced */}
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                            <IoAnalyticsSharp className="w-8 h-8" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Track Student Progress</h3>
                            <p className="mt-1 text-[var(--color-text-light)]">Review submissions, provide detailed feedback, and gain insights into your class's performance from a central dashboard.</p>
                        </div>
                    </div>
                    {/* Feature 4 (New) */}
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                             <RiShieldCheckLine className="w-8 h-8" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Secure & Private Environment</h3>
                            <p className="mt-1 text-[var(--color-text-light)]">Each classroom is a private space. Manage your student roster and control access with a unique join code.</p>
                        </div>
                    </div>
                    {/* Feature 5 - Enhanced */}
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-accent-cyan)]">
                            <VscMegaphone className="w-8 h-8" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-bold text-[var(--color-text-bright)]">Engage Your Community</h3>
                            <p className="mt-1 text-[var(--color-text-light)]">Use announcements to post updates, share critical resources, and keep your students connected with course material.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default LeftVisualPanel