import React from 'react';

// Importing components
import RightVisual from '../components/createAssignment/rightVisual';

const CreateAssignment = () => {



  return (
    <div className="text-[var(--color-text-light)] min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-primary)]">
      
      {/* Header */}
      <div className="w-full max-w-7xl text-center mb-8 animate-fadeIn">
        <h1 className="text-4xl font-bold text-[var(--color-text-bright)]">
          Create a New <span className="text-[var(--color-accent-cyan)]">Assignment</span>
        </h1>
        <p className="mt-2 text-[var(--color-text-light)]">Design a new challenge for your students.</p>
      </div>

      {/* Main Layout */}
      <div
        className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 animate-fadeIn"
        style={{ animationDelay: '0.2s' }}
        >
    {/* //    circuit workspace which is showing over here is temp will be replaced later */}
        {/* Left Side: Circuit Workspace */}
        <div className="lg:w-2/3 w-full">
          <div className="bg-[var(--color-secondary)] p-6 rounded-2xl shadow-lg border border-[var(--color-border)] h-full flex flex-col">
            <h2 className="text-xl font-bold text-[var(--color-text-bright)] mb-4">
              Solution Circuit Workspace
            </h2>
            <div className="flex-grow flex gap-4">
              
              {/* Component Library */}
              <div className="w-24 bg-[var(--color-primary)] p-2 rounded-lg border border-[var(--color-border)] flex flex-col items-center space-y-2">
                {['Resistor', 'Capacitor', 'DC Source', 'LED'].map((comp) => (
                  <div
                    key={comp}
                    className="w-full p-2 text-center bg-[var(--color-secondary)] rounded-md cursor-pointer hover:bg-[var(--color-tertiary)] border border-transparent hover:border-[var(--color-accent-cyan)]"
                  >
                    <p className="text-xs">{comp}</p>
                  </div>
                ))}
              </div>

              {/* Canvas Placeholder */}
              <div className="flex-1 h-[600px] flex items-center justify-center bg-[var(--color-primary)] border-2 border-dashed border-[var(--color-border)] rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-semibold text-[var(--color-placeholder)]">
                    Interactive Circuit Canvas
                  </p>
                  <p className="text-sm text-[var(--color-placeholder)]/70">
                    Build the solution circuit here
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Right Side: Assignment Details Form */}
        <RightVisual />
      </div>
    </div>
  );
};

export default CreateAssignment;
