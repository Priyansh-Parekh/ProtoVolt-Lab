import React from 'react';
import { FiSearch } from 'react-icons/fi'; // Search Icon

const Classroom_controlbar
 = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full gap-4 md:gap-6 p-4 bg-transparent">
  
    {/* Search Bar */}
    <div className="relative w-full md:w-96">
      <FiSearch 
        className="
          absolute top-1/2 left-4 
          -translate-y-1/2 
          h-5 w-5 text-gray-400
        "
      />
      <input
        type="text"
        placeholder="Find a course..."
        className="
          w-full
          font-ChakraPetch text-white bg-[#1a1f2c]
          border border-gray-700 rounded-lg
          pl-12 pr-4 py-2.5
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-[#00d4ff]
          placeholder-gray-400
        "
      />
    </div>
  
    {/* Filter Dropdowns */}
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
      <select 
        className="
          w-42
          font-ChakraPetch text-white bg-[#1a1f2c]
          border border-gray-700 rounded-lg
          px-4 py-2.5
          appearance-none
          bg-no-repeat bg-right
          bg-[url('data:image/svg+xml,%3csvg%20xmlns%3d%22http%3a//www.w3.org/2000/svg%22%20fill%3d%22none%22%20viewBox%3d%220%200%2020%2020%22%3e%3cpath%20stroke%3d%22%236b7280%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%20stroke-width%3d%221.5%22%20d%3d%22m6%208%204%204%204-4%22/%3e%3c/svg%3e')]
          focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-[#00d4ff]
        "
      >
        <option>Sort by: Progress</option>
        <option>Sort by: Recent</option>
        <option>Sort by: Title</option>
      </select>
  
      {/* Additional filters can go here */}
    </div>
  
  </div>
  
  );
};

export default Classroom_controlbar
;