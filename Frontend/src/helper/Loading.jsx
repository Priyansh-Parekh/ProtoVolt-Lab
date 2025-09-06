import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-[#030712] text-white font-sans">
      <div className="flex flex-col items-center text-center">
        <div className="loader h-12 w-12 mb-4"></div>
        <h1 className="text-2xl font-light tracking-wider animate-pulse">Loading...</h1>
      </div>
      {/* The keyframes and loader animation styles are defined here directly,
        so this component is fully self-contained.
      */}
      <style>
        {`
        .loader {
          border: 4px solid #1a1f2c; /* Using your --color-secondary for the track */
          border-top-color: #3b82f6; /* A bright accent color for the spinning part */
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        `}
      </style>
    </div>
  );
};

export default Loading;