import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ParticleBackground = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // === SCENE SETUP ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // === PARTICLES ===
    const geometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 150;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      color: new THREE.Color("#00E5FF"),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // === LIGHTS (for subtle glow reflection) ===
    const light = new THREE.PointLight("#00D4FF", 1, 200);
    light.position.set(0, 0, 30);
    scene.add(light);

    // === MOUSE MOVEMENT ===
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // === ANIMATION LOOP ===
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate particles slowly for motion
      particles.rotation.x += 0.0006;
      particles.rotation.y += 0.0003;

      // Apply subtle parallax motion
      camera.position.x += (mouseX * 10 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // === HANDLE RESIZE ===
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // === CLEANUP ===
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      if (rendererRef.current && rendererRef.current.domElement?.parentNode) {
        rendererRef.current.domElement.parentNode.removeChild(
          rendererRef.current.domElement
        );
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background: "radial-gradient(circle at center, #02060c 10%, #000 90%)",
      }}
    />
  );
};

export default ParticleBackground;