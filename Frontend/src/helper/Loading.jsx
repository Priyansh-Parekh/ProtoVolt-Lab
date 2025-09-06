import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <h1 className="text-3xl">Loading...</h1>
      </div>
      <style>
        {`
        .loader {
          border-right-color: transparent;
          border-left-color: transparent;
          border-bottom-color: transparent;
          border-top-color: #60a5fa;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        `}
      </style>
    </div>
  );
};

export default Loading;