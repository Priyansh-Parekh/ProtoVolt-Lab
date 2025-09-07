import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";


const ClassroomCreatePopup = ({ setCreatePopup }) => {

    const [codeCopied, setCodeCopied] = useState(false);
    const [created, setCreated] = useState(false);

    //copy is not handled properly so just have it done later
    const handleCopy = () => {
        navigator.clipboard.writeText(classroomCode);
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            {/* Popup Container */}
            <div className="bg-[var(--color-tertiary)] text-[var(--color-text-bright)] rounded-2xl shadow-lg w-96 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Create Classroom</h2>
                    <button
                        onClick={() => setCreatePopup(prev => !prev)}
                        className="text-[var(--color-placeholder)] hover:text-[var(--color-text-bright)] transition">
                        ✖
                    </button>
                </div>

                {!created && (
                    <>
                        {/* Input: Classroom Name */}
                <label className="block text-sm text-[var(--color-text-light)] mb-2">
                    Classroom Name:
                </label>
                        <input
                            type="text"
                            placeholder="e.g. Web Development"
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)] focus:border-[var(--color-accent-purple)] focus:ring-2 focus:ring-[var(--color-accent-purple)] outline-none transition mb-4"
                        />

                        {/* Input: Description */}
                <label className="block text-sm text-[var(--color-text-light)] mb-2">
                    Description:
                </label>
                        <textarea
                            placeholder="Enter classroom description..."
                            rows="3"
                            className="w-full px-4 py-2 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)] focus:border-[var(--color-accent-purple)] focus:ring-2 focus:ring-[var(--color-accent-purple)] outline-none transition mb-4"
                        ></textarea>
                    </>
                )}

                {/* Disabled Input: Classroom Code */}
                {created && (
                    <>
                    <label className="block text-sm text-[var(--color-text-light)] mb-2">
                    Classroom Code:
                </label>
                        <div className="relative">
                            <input
                                type="text"
                                value="ABC123" // Static for now — can be dynamic later
                                disabled
                                className="w-full px-4 py-2 pr-10 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-placeholder)] cursor-not-allowed"
                            />
                            <FiCopy
                                onClick={handleCopy}
                                size={18}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[var(--color-placeholder)] hover:text-[var(--color-text-bright)] cursor-pointer transition"
                            />
                            {codeCopied && (
                                <span className="absolute right-0 -top-6 text-xs bg-[var(--color-secondary)] text-[var(--color-text-bright)] px-2 py-1 rounded-md shadow">
                                    Copied!
                                </span>
                            )}
                        </div>
                    </>
                )}



                {/* Buttons */}
                {!created && (
                    <div className="flex justify-end gap-3 mt-6">

                        <button
                            onClick={() => {
                                //  setCreatePopup(prev => !prev)
                                setCreated(prev => !prev);
                            }}
                            className="px-4 py-2 rounded-lg bg-[var(--color-accent-purple)] hover:bg-[var(--color-accent-violet)] transition">
                            Create
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassroomCreatePopup;
