import React, { useState } from 'react';

//Components
import LeftHalf from '../components/Login/LeftHalf.jsx';

// Reusing the same SVG icons and visual components for a consistent theme.
import CircuitIcons from '../assets/circuitIcons.jsx';
import api from '../utils/axios.js';
import { error, success } from '../utils/toastify.js';




const Signup = (e) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('student');

    const handleSignup = async (e) => {
        e.preventDefault();
        e.target.disabled = true;
        e.target.style.opacity = 0.5;
        if (password !== confirmPassword) {
            setPassword("");
            setConfirmPassword("");
            error("Passwords do not match!");
            return;
        } else {
            const res = await api.post(`/user/auth/signup`, { name, email, password, role });
            if (res.status === 400) {
                error("something went Wrong");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                e.target.disabled = false;
                e.target.style.opacity = 1;
            }
            else if (res.status === 200) {
                success(res.data.success);
                const redirectUrl = res.data.redirectUrl;
                setTimeout(() => {
                    // Manually redirect browser
                    window.location.href = redirectUrl;
                }, 3000);
            }
        }
    };

    return (
        <div>
            <div className="min-h-screen flex bg-[var(--color-primary)]">
                {/* Left Panel: Visuals & Branding */}
                <LeftHalf />

                {/* Right Panel: Signup Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full p-8 rounded-2xl animate-fadeIn bg-[var(--color-secondary)]">
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <CircuitIcons />
                            <h1 className="text-4xl font-bold text-[var(--color-text-bright)]">
                                Circuit<span className="text-[var(--color-accent-cyan)]">Sim</span>
                            </h1>
                        </div>

                        <h2 className="text-2xl font-bold text-center text-[var(--color-text-bright)]">Create an Account</h2>
                        <p className="mt-2 text-center text-sm text-[var(--color-text-light)]">Join the simulation revolution.</p>

                        <form className="mt-8 space-y-5" onSubmit={(e) => { handleSignup(e) }}>
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="custom-input w-full p-3 rounded-md text-sm" />
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="custom-input w-full p-3 rounded-md text-sm" />
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="custom-input w-full p-3 rounded-md text-sm" />
                            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="custom-input w-full p-3 rounded-md text-sm" />

                            <div>
                                <label className="block text-sm font-medium mb-2 text-[var(--color-text-light)]">I am a...</label>
                                <div className="flex space-x-4">
                                    <button type="button" onClick={() => setRole('student')} className={`w-full py-2 rounded-md text-sm font-semibold transition-all ${role === 'student' ? 'text-white shadow-lg' : 'text-gray-400 bg-[var(--color-primary)]'}`} style={role === 'student' ? { backgroundImage: 'linear-gradient(to right, var(--color-accent-cyan), var(--color-accent-teal))', boxShadow: 'var(--shadow-neon)' } : {}}>
                                        Student
                                    </button>
                                    <button type="button" onClick={() => setRole('professor')} className={`w-full py-2 rounded-md text-sm font-semibold transition-all ${role === 'professor' ? 'text-white shadow-lg' : 'text-gray-400 bg-[var(--color-primary)]'}`} style={role === 'professor' ? { backgroundImage: 'linear-gradient(to right, var(--color-accent-cyan), var(--color-accent-teal))', boxShadow: 'var(--shadow-neon)' } : {}}>
                                        Professor
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="w-full hover:cursor-pointer py-3 rounded-md text-sm font-bold text-white transition-all hover:shadow-lg" style={{ backgroundImage: 'linear-gradient(to right, var(--color-accent-cyan), var(--color-accent-teal), var(--color-accent-green))', boxShadow: 'var(--shadow-neon)' }}>
                                Create Account
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-[var(--color-text-light)]">
                            Already have an account?{' '}
                            <a href="/user/login" className="font-medium hover:underline text-[var(--color-accent-cyan)]">
                                Log In
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
