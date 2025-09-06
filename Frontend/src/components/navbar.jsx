import React from 'react';
import {Link} from 'react-router-dom';

const Navbar = () => {
  return (
    <>
     <div className="bg-[#0a0e17] h-16 px-8 flex justify-between items-center shadow-md">
      
      {/* Logo */}
      <Link
  className="text-2xl font-ChakraPetch font-bold text-white 
             hover:bg-gradient-to-r hover:from-[#ae3575] hover:via-[#00f7ff] hover:to-[#a855f7]
             hover:bg-clip-text hover:text-transparent transition-all duration-500 ease-in-out"
  to="/"
>
  ProtoVolt
</Link>


      {/* Navigation Links */}
      <div className="flex space-x-6">
        <Link
          className="text-white font-ChakraPetch hover:text-[#00d4ff] transition-colors duration-300"
          to="/workspace"
        >
          Workspace
        </Link>
        <Link
          className="text-white font-ChakraPetch hover:text-[#00d4ff] transition-colors duration-300"
          to="/classroom"
        >
          Classroom
        </Link>
        <Link
          className="text-white font-ChakraPetch hover:text-[#00d4ff] transition-colors duration-300"
          to="/dashboard"
        >
          Dashboard
        </Link>
      </div>

      {/* Login Button */}
      <Link
        className="bg-[#00d4ff] hover:bg-[#00b8e6] text-[#0a0e17] font-ChakraPetch px-4 py-2 rounded-lg transition-colors duration-300"
        to="/login"
      >
        Login
      </Link>
    </div>
    </>
  )
}

export default Navbar

