import React, { useEffect } from "react";
import { motion } from "framer-motion";

const BackgroundGlow = () => {
  const blobs = [
    { color: "#00D4FF", top: "20%", left: "15%", size: 400 },
    { color: "#4F46E5", top: "60%", left: "70%", size: 500 },
    { color: "#00FFAA", top: "80%", left: "30%", size: 350 },
  ];

  return (
    <div className="fixed inset-0 z-10 overflow-hidden pointer-events-none">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-screen blur-3xl opacity-50"
          style={{
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -20, 20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundGlow;