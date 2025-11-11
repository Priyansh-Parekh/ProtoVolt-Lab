import React from 'react';
import { Link } from 'react-router-dom';
// --- Importing a suitable icon from react-icons ---
import { RiForbid2Line } from 'react-icons/ri';

const Unauthorized = () => {
  return (
    <div>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-primary)] text-center">
            <div className="w-full max-w-lg animate-fadeIn">
                <div className="bg-[var(--color-secondary)] p-8 md:p-12 rounded-2xl shadow-lg border border-[var(--color-border)]">
                    
                    {/* Icon */}
                    <div className="mb-6">
                        <RiForbid2Line className="w-24 h-24 mx-auto text-red-500" />
                    </div>

                    {/* Header */}
                    <h1 className="text-5xl font-extrabold tracking-tight text-[var(--color-text-bright)]">
                        Access <span className="text-red-500">Denied</span>
                    </h1>
                    <p className="mt-4 text-xl text-[var(--color-text-light)]">
                        You do not have the necessary permissions to view this page.
                    </p>

                    {/* Explanation */}
                    <p className="mt-6 text-[var(--color-text-light)] max-w-md mx-auto">
                        This area may be restricted to certain user roles, such as Professors or Administrators. If you believe this is an error, please contact support.
                    </p>

                    {/* Action Button */}
                    <div className="mt-10">
                        <Link 
                            to="/" 
                            className="inline-block w-full sm:w-auto py-3 px-8 rounded-md text-sm font-bold text-white transition-all hover:shadow-lg" 
                            style={{backgroundImage: 'linear-gradient(to right, var(--color-accent-cyan), var(--color-accent-teal), var(--color-accent-green))', boxShadow: 'var(--shadow-neon)'}}
                        >
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Unauthorized;
