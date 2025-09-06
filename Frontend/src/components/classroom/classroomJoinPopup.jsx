import React from "react";

const ClassroomJoinPopup = ({setJoinPopup}) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      {/* Popup Container */}
      <div className="bg-[#0a0e17] text-white rounded-2xl shadow-lg w-96 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Join Classroom</h2>
          <button 
          onClick={()=>setJoinPopup(prev => !prev)}
          className="text-gray-400 hover:text-white transition">
            ✖
          </button>
        </div>

        {/* Input */}
        <label className="block text-sm text-gray-300 mb-2">
          Enter Class Code:
        </label>
        <input
          type="text"
          placeholder="e.g. ABC123"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
           onClick={()=>setJoinPopup(prev => !prev)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassroomJoinPopup;
