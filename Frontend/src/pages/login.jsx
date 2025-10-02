import { useState } from 'react';

//Components
import LeftHalf from '../components/Login/LeftHalf';

// SVG Icon
import CircuitIcons from '../assets/circuitIcons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
  };

  return (
    <div className='h-[91vh]'>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&display=swap');
          @keyframes float { 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-10px);} }
          @keyframes float1 { 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-5px);} }
          @keyframes fadeIn { 0%{opacity:0; transform:translateY(-10px);} 100%{opacity:1; transform:translateY(0);} }
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

      <div className="h-full flex" style={{backgroundColor: 'var(--color-primary)'}}>
        {/* Left Visuals */}
        <LeftHalf />

        {/* Right Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full p-8 rounded-2xl animate-fadeIn" style={{backgroundColor: 'var(--color-secondary)'}}>
            <div className="flex items-center justify-center space-x-3 mb-6">
             <CircuitIcons/>
              <h1 className="text-4xl font-bold" style={{color: 'var(--color-text-bright)'}}>
                Circuit<span style={{color: 'var(--color-accent-cyan)'}}>Sim</span>
              </h1>
            </div>

            <h2 className="text-2xl font-bold text-center" style={{color: 'var(--color-text-bright)'}}>Welcome Back</h2>
            <p className="mt-2 text-center text-sm" style={{color: 'var(--color-text-light)'}}>Enter your credentials to continue.</p>

            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="custom-input w-full p-3 rounded-md text-sm"/>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="custom-input w-full p-3 rounded-md text-sm"/>

              <div className="text-right text-sm">
                <a href="/user/otpVerification" className="font-medium hover:underline" style={{color: 'var(--color-accent-cyan)'}}>
                  Forgot Password?
                </a>
              </div>

              <button type="submit" className="w-full py-3 rounded-md text-sm font-bold text-white transition-all hover:shadow-lg" style={{backgroundImage: 'linear-gradient(to right, var(--color-accent-cyan), var(--color-accent-teal), var(--color-accent-green))', boxShadow: 'var(--shadow-neon)'}}>
                Log In
              </button>
            </form>

            <p className="mt-6 text-center text-sm" style={{color: 'var(--color-text-light)'}}>
              Don't have an account?{' '}
              <a href="/user/signup" className="font-medium hover:underline" style={{color: 'var(--color-accent-cyan)'}}>
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
