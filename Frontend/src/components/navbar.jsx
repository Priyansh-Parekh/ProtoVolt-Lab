import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiTrello, FiBookOpen, FiLayout, FiUser } from 'react-icons/fi';
import { FaUsers } from 'react-icons/fa';

const Navbar = () => {
  const linkClasses = ({ isActive }) =>
    `relative flex items-center space-x-2 px-3 py-2 rounded-md font-medium text-sm overflow-hidden z-10 
     ${isActive
       ? 'text-white'
       : 'text-gray-300 hover:text-sky-400'
     }
     before:absolute before:inset-0 before:bg-sky-600 before:transition-transform before:duration-300 before:ease-out before:scale-x-0 before:origin-left
     ${isActive
       ? 'before:scale-x-100 before:opacity-100'
       : 'before:opacity-0 hover:before:scale-x-100 hover:before:opacity-30'
     }`;

  return (
    <div className="bg-[#0a0e17] h-16 px-8 flex justify-between items-center shadow-md">
      {/* Logo */}
      <NavLink
        className="text-2xl font-bold text-white relative z-20 animate-bounce
           hover:bg-gradient-to-r hover:from-[#ae3575] hover:via-[#00f7ff] hover:to-[#a855f7]
           hover:bg-clip-text hover:text-transparent transition-all duration-500 ease-in-out"
        to="/"
      >
        ProtoVolt
      </NavLink>

      {/* Navigation Links */}
      <div className="flex space-x-6">
        <NavLink to="/" className={linkClasses}>
          <span className="relative z-10 flex items-center space-x-2">
            <FiHome />
            <span>Home</span>
          </span>
        </NavLink>
        <NavLink to="/workspace" className={linkClasses}>
          <span className="relative z-10 flex items-center space-x-2">
            <FiTrello />
            <span>Workspace</span>
          </span>
        </NavLink>
        <NavLink to="/classroom" className={linkClasses}>
          <span className="relative z-10 flex items-center space-x-2">
            <FiBookOpen />
            <span>Classroom</span>
          </span>
        </NavLink>
        <NavLink to="/dashboard" className={linkClasses}>
          <span className="relative z-10 flex items-center space-x-2">
            <FiLayout />
            <span>Dashboard</span>
          </span>
        </NavLink>
        <NavLink to="/about-us" className={linkClasses}>
          <span className="relative z-10 flex items-center space-x-2">
            <FaUsers />
            <span>About Us</span>
          </span>
        </NavLink>
      </div>

      {/* Login Button with Icon */}
      <NavLink
        className="bg-[#00d4ff] hover:bg-[#00b8e6] text-[#0a0e17] font-bold px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
        to="/login"
      >
        <FiUser />
        <span>Login</span>
      </NavLink>
    </div>
  );
};

export default Navbar;