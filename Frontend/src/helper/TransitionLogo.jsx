import React from 'react';
import { motion } from 'framer-motion';

const TransitionLogo = () => {
    // Define the animation path for the 'P' logo
    const pathVariants = {
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } }
    };

    // Define the overall entrance and exit animation for the logo container
    const logoContainerVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            transition: { 
                type: "spring", 
                stiffness: 100,
                damping: 10 
            } 
        },
    };

    return (
        <motion.div 
            className="flex flex-col items-center justify-center h-screen w-screen bg-[#0A0E17]" // SAME BACKGROUND
            initial="hidden"
            animate="visible"
            variants={logoContainerVariants}
        >
            <motion.svg viewBox="0 0 24 24" width="100" height="100" className="text-[#00D4FF]">
                <motion.path
                    d="M5 21V3H13C16.3137 3 19 5.68629 19 9C19 12.3137 16.3137 15 13 15H5" 
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={pathVariants}
                    initial="initial"
                    animate="animate"
                />
            </motion.svg>
            <motion.h1 
                className="text-2xl font-bold mt-4 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                ProtoVolt
            </motion.h1>
        </motion.div>
    );
};

export default TransitionLogo;