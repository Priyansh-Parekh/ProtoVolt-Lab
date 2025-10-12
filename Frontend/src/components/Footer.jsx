import React from "react";
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from "react-icons/fi";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-[#0A0E17] border-t border-gray-800 text-gray-400 relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <motion.h2 
            className="text-2xl font-bold bg-gradient-to-r from-[#00D4FF] via-[#4F46E5] to-[#00D4FF] bg-clip-text text-transparent mb-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            ProtoVolt
          </motion.h2>
          <p className="text-sm text-gray-500">
            Revolutionizing circuit design, simulation, and learning in 3D.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-[#00D4FF] transition">Home</a></li>
            <li><a href="/workspace" className="hover:text-[#00D4FF] transition">Workspace</a></li>
            <li><a href="/classroom" className="hover:text-[#00D4FF] transition">Classroom</a></li>
            <li><a href="/about-us" className="hover:text-[#00D4FF] transition">About Us</a></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-white font-semibold mb-4">Connect</h3>
          <div className="flex space-x-5 text-xl">
            <a href="#" className="hover:text-[#00D4FF] transition">
              <FiGithub />
            </a>
            <a href="#" className="hover:text-[#00D4FF] transition">
              <FiLinkedin />
            </a>
            <a href="#" className="hover:text-[#00D4FF] transition">
              <FiTwitter />
            </a>
            <a href="mailto:info@protovolt.com" className="hover:text-[#00D4FF] transition">
              <FiMail />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-6 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} ProtoVolt Project. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
