import React, { useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Split text into words for animation
export const SplitText = ({ children, className = "" }) => {
  const words = children.split(" ");
  
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          viewport={{ once: true, amount: 0.8 }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// Character-by-character reveal
export const RevealText = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const letters = children.split("");
  
  return (
    <span ref={ref} className={className}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.03 }}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );
};

// Parallax text that moves on scroll
export const ParallaxText = ({ children, className = "", speed = 0.5 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

// Glitch text effect
export const GlitchText = ({ children, className = "" }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const glitch = () => {
      const glitchTime = 100;
      const glitchDelay = 3000;
      
      const interval = setInterval(() => {
        element.style.textShadow = `
          ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #00d4ff,
          ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #4F46E5
        `;
        
        setTimeout(() => {
          element.style.textShadow = "none";
        }, glitchTime);
      }, glitchDelay);
      
      return () => clearInterval(interval);
    };
    
    const cleanup = glitch();
    return cleanup;
  }, []);
  
  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
};

// Scale on scroll
export const ScaleText = ({ children, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  
  return (
    <motion.div ref={ref} style={{ scale, opacity }} className={className}>
      {children}
    </motion.div>
  );
};

// Typing effect
export const TypingText = ({ children, className = "", speed = 50 }) => {
  const [displayText, setDisplayText] = React.useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < children.length) {
        setDisplayText(children.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [isInView, children, speed]);
  
  return (
    <span ref={ref} className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        |
      </motion.span>
    </span>
  );
};

export default {
  SplitText,
  RevealText,
  ParallaxText,
  GlitchText,
  ScaleText,
  TypingText,
};
