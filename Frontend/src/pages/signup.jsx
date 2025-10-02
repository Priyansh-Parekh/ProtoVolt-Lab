import React, { useState } from 'react';

//Components
import LeftHalf from '../components/Login/LeftHalf';

// Reusing the same SVG icons and visual components for a consistent theme.
import CircuitIcons from '../assets/circuitIcons';




const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('Signing up with:', { name, email, password, role });
  };

  return (
    <div>
        <style>
            {`
            @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&display=swap');
            body { font-family: 'Chakra Petch', sans-serif; }
            @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            @keyframes float1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
            @keyframes fadeIn { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
            .animate-float { animation: float 4s ease-in-out infinite; }
            .animate-float1 { animation: float1 3s ease-in-out infinite; }
            .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
            .custom-input {
                background-color: var(--color-primary);
                border: 1px solid var(--color-border);
                color: var(--color-text-bright);
                transition: border-color 0.3s, box-shadow 0.3s;
            }
            .custom-input:focus {
                outline: none;
                border-color: var(--color-accent-cyan);
                box-shadow: var(--shadow-neon);
            }
            .custom-input::placeholder {
                color: var(--color-placeholder);
            }
            `}
        </style>
        <div className="min-h-screen flex bg-[var(--color-primary)]">
            {/* Left Panel: Visuals & Branding */}
            <LeftHalf />

            {/* Right Panel: Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full p-8 rounded-2xl animate-fadeIn bg-[var(--color-secondary)]">
                    <div className="flex items-center justify-center space-x-3 mb-6">
                        <CircuitIcons/>
                        <h1 className="text-4xl font-bold text-[var(--color-text-bright)]">
                            Circuit<span className="text-[var(--color-accent-cyan)]">Sim</span>
                        </h1>
                    </div>
                
                    <h2 className="text-2xl font-bold text-center text-[var(--color-text-bright)]">Create an Account</h2>
                    <p className="mt-2 text-center text-sm text-[var(--color-text-light)]">Join the simulation revolution.</p>

                    <form className="mt-8 space-y-5" onSubmit={handleSignup}>
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="custom-input w-full p-3 rounded-md text-sm"/>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="custom-input w-full p-3 rounded-md text-sm"/>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="custom-input w-full p-3 rounded-md text-sm"/>
                        <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="custom-input w-full p-3 rounded-md text-sm"/>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[var(--color-text-light)]">I am a...</label>
                            <div className="flex space-x-4">
                                <button type="button" onClick={() => setRole('student')} className={`w-full py-2 rounded-md text-sm font-semibold transition-all ${role === 'student' ? 'text-white shadow-lg' : 'text-gray-400 bg-[var(--color-primary)]'}`} style={role === 'student' ? {backgroundImage: 'linear-gradient(to right, var(--color-accent-cyan), var(--color-accent-teal))', boxShadow: 'var(--shadow-neon)'} : {}}>
                                    Student
                                </button>
                                <button type="button" onClick={() => setRole('professor')} className={`w-full py-2 rounded-md text-sm font-semibold transition-all ${role === 'professor' ? 'text-white shadow-lg' : 'text-gray-400 bg-[var(--color-primary)]'}`} style={role === 'professor' ? {backgroundImage: 'linear-gradient(to right, var(--color-accent-cyan), var(--color-accent-teal))', boxShadow: 'var(--shadow-neon)'} : {}}>
                                    Professor
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-3 rounded-md text-sm font-bold text-white transition-all hover:shadow-lg" style={{backgroundImage: 'linear-gradient(to right, var(--color-accent-cyan), var(--color-accent-teal), var(--color-accent-green))', boxShadow: 'var(--shadow-neon)'}}>
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
