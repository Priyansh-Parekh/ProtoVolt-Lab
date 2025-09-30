import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import TransitionLogo from './TransitionLogo'; // CORRECTED PATH: Imports from the same helper folder

const TRANSITION_DURATION_MS = 800;

const Loading = ({ children }) => {
  const location = useLocation();
  const [showLogo, setShowLogo] = React.useState(false);
  const [currentPath, setCurrentPath] = React.useState(location.pathname);

  // This effect manually triggers the logo screen when navigation starts
  useEffect(() => {
    if (location.pathname !== currentPath) {
      // 1. Navigation has started: Block the screen with the logo
      setShowLogo(true);

      // 2. Wait for the logo animation duration, then hide the logo
      const timer = setTimeout(() => {
        setShowLogo(false);
        setCurrentPath(location.pathname);
      }, TRANSITION_DURATION_MS);

      // Cleanup on unmount
      return () => clearTimeout(timer);
    }
  }, [location.pathname, currentPath]);

  // Define the main content animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 10, scale: 0.99 },
    in: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.5, 
        // Delay the entrance of the new page content until the logo overlay is gone
        delay: showLogo ? TRANSITION_DURATION_MS / 1000 : 0, 
        ease: [0.17, 0.55, 0.55, 1] 
      } 
    },
    out: { opacity: 0, y: -10, scale: 0.99, transition: { duration: 0.3, ease: [0.55, 0.08, 0.68, 0.53] } },
  };

  return (
    <>
      {/* 1. Logo Overlay (Visible during transition, covers everything) */}
      {showLogo && (
        <motion.div 
            key="transition-logo"
            className="fixed inset-0 z-[999] bg-[#0A0E17]" // Solid dark background stops the white flash
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
          {/* TransitionLogo takes the entire screen */}
          <TransitionLogo />
        </motion.div>
      )}
      
      {/* 2. Page Content (Only animates when the logo is not showing) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          className="min-h-screen pt-16 w-full" 
          // CRITICAL FIX: Hide the old page instantly when the logo is active
          style={{ visibility: showLogo ? 'hidden' : 'visible' }} 
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Loading;
