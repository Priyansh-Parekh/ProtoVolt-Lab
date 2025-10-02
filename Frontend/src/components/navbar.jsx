import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiTrello, FiBookOpen, FiLayout, FiUser } from 'react-icons/fi';
import { FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AnimatedLogo = () => {
    const logoVariants = {
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1, transition: { duration: 1, ease: "easeInOut" } }
    };

    return (
        <svg viewBox="0 0 24 24" width="24" height="24" className="text-[#00D4FF]">
            {/* Custom Path resembling a stylized 'P' for ProtoVolt */}
            <motion.path
                d="M5 21V3H13C16.3137 3 19 5.68629 19 9C19 12.3137 16.3137 15 13 15H5" 
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={logoVariants}
                initial="initial"
                animate="animate"
            />
        </svg>
    );
};

const Navbar = () => {
  // Custom NavLink classes for active state and transition
  const linkClasses = ({ isActive }) =>
    `relative flex items-center space-x-2 px-3 py-2 rounded-md font-medium text-sm overflow-hidden z-10 
     ${isActive
       ? 'text-white'
       : 'text-gray-300 hover:text-sky-400'
     }
     before:absolute before:inset-0 before:bg-sky-700 before:transition-transform before:duration-300 before:ease-out before:scale-x-0 before:origin-left
     ${isActive
       ? 'before:scale-x-100 before:opacity-100'
       : 'before:opacity-0 hover:before:scale-x-100 hover:before:opacity-30'
     }`;

  return (
    // Navbar is now fixed, solid, and uses the dark background color directly.
    <motion.div
        className="fixed top-0 left-0 right-0 z-50 bg-[#0A0E17] shadow-lg border-b border-gray-800"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
      <div className="h-16 px-8 flex justify-between items-center max-w-7xl mx-auto">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
            <AnimatedLogo />
            <NavLink
                className="text-2xl font-bold text-white transition-all duration-500 ease-in-out"
                to="/"
            >
                ProtoVolt
            </NavLink>
        </div>


        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
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
          className="bg-[#00D4FF] hover:bg-[#00B8E6] text-[#0A0E17] font-bold px-4 py-2 animate-pulse rounded-lg transition-colors duration-300 flex items-center space-x-2 shadow-lg"
          to="/user/login"
        >
          <FiUser />
          <span>Login</span>
        </NavLink>
      </div>
    </motion.div>
  );
};

export default Navbar;
