import { NavLink } from 'react-router-dom';
import { FiHome, FiTrello, FiBookOpen, FiLogOut, FiLayout, FiUser } from 'react-icons/fi';
import { FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

//importing utils  
import api from '../utils/axios.js'
import { error, success } from '../utils/toastify.js';
// Animated ProtoVolt Logo
const AnimatedLogo = () => {
  const logoVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1, transition: { duration: 1, ease: "easeInOut" } }
  };



  return (
    <svg viewBox="0 0 24 24" width="24" height="24" className="text-[#00D4FF]">
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

const Navbar = ({ user = null }) => {
  // Classes for NavLink active/inactive states

  const linkClasses = ({ isActive }) =>
    `relative flex items-center space-x-2 px-3 py-2 rounded-md font-medium text-sm overflow-hidden z-10 
     ${isActive ? 'text-white' : 'text-gray-300 hover:text-sky-400'}
     before:absolute before:inset-0 before:bg-sky-700 before:transition-transform before:duration-300 before:ease-out before:scale-x-0 before:origin-left
     ${isActive
      ? 'before:scale-x-100 before:opacity-100'
      : 'before:opacity-0 hover:before:scale-x-100 hover:before:opacity-30'
    }`;

  const logout = async (e) => {

    e.target.disabled = true;
    e.target.style.opacity = 0.5;
    try {
      const res = await api.get('/user/auth/logout');
      if (res.data.success) {
        success("Logout Success");
        setTimeout(() => {
          // Manually redirect browser
          window.location.href = "/";
        }, 1000);
      } else {
        error("Logout Failed");
      }
    } catch (err) {
      error("server Error");
    } finally {
      e.target.disabled = false;
      e.target.style.opacity = 1;
    }
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 bg-[#0A0E17] shadow-lg border-b border-gray-800"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-16 px-8 flex justify-between items-center max-w-7xl mx-auto">

        {/* Logo Section */}
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
          {user.role === "professor" &&
            <NavLink to="/dashboard" className={linkClasses}>
              <span className="relative z-10 flex items-center space-x-2">
                <FiLayout />
                <span>Dashboard</span>
              </span>
            </NavLink>
          }
          <NavLink to="/about-us" className={linkClasses}>
            <span className="relative z-10 flex items-center space-x-2">
              <FaUsers />
              <span>About Us</span>
            </span>
          </NavLink>
        </div>

        {/* User Section */}
        {!user ? (
          // Login Button if no user
          <NavLink
            className="bg-[#00D4FF] hover:bg-[#00B8E6] text-[#0A0E17] font-bold px-4 py-2 animate-pulse rounded-lg transition-colors duration-300 flex items-center space-x-2 shadow-lg"
            to="/user/login"
          >
            <FiUser />
            <span>Login</span>
          </NavLink>
        ) : (
          // User button if logged in
          <>
            <button className="bg-[#00D4FF] hover:bg-[#00B8E6] text-[#0A0E17] font-bold px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2 shadow-lg">
              {user?.name || 'User'}
            </button>
            <button
              onClick={(e) => { logout(e) }}
              className="
            flex items-center gap-2
            bg-[var(--color-secondary)]
            text-[var(--color-text-light)]
            hover:cursor-pointer
            px-4 py-2 rounded-xl
            hover:bg-[var(--color-tertiary)]
            hover:text-[var(--color-accent-cyan)]
            transition-all duration-300
            border border-[var(--color-border)]
            shadow-[var(--shadow-soft)]
          "
            >
              <FiLogOut className="text-xl" />
              <span className="font-medium">Logout</span>
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Navbar;
