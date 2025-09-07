import { useEffect } from "react";

export const useBgMotion = (ref, numParticles = 40) => {
  useEffect(() => {
    if (!ref.current) return;

    const container = ref.current;

    // Ensure container is relative
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }

    // Particle container
    const particleContainer = document.createElement("div");
    particleContainer.style.position = "absolute";
    particleContainer.style.top = "0";
    particleContainer.style.left = "0";
    particleContainer.style.width = "100%";
    particleContainer.style.height = "100%";
    particleContainer.style.zIndex = "0"; // behind everything
    particleContainer.style.pointerEvents = "none"; // ignore clicks
    container.prepend(particleContainer); // prepend so content stays above

    const colors = ["#a855f7", "#7e22ce", "#facc15"]; // neon-like colors
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * 6 + 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.borderRadius = "50%";
      particle.style.position = "absolute";
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.opacity = "0.7";
      particle.style.filter = "blur(2px)";
      particle.style.pointerEvents = "none"; // ensure particle itself doesn't block clicks
      particleContainer.appendChild(particle);
      particles.push(particle);

      const animateParticle = () => {
        const x = Math.random() * 50 - 25;
        const y = Math.random() * 50 - 25;
        const duration = Math.random() * 8 + 5;

        particle.animate(
          [
            { transform: "translate(0px,0px)", opacity: 0.5 },
            { transform: `translate(${x}px, ${y}px)`, opacity: 1 },
            { transform: "translate(0px,0px)", opacity: 0.5 },
          ],
          {
            duration: duration * 1000,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        );
      };
      animateParticle();
    }

    return () => {
      container.removeChild(particleContainer);
    };
  }, [ref, numParticles]);
};
