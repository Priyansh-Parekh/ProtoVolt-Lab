import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Sidebar3DModel = () => {
  const mountRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ----- Scene / Camera / Renderer -----
    const scene = new THREE.Scene();
    scene.background = null; // transparent background

    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // fully transparent
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);

    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.background = "transparent";

    if (getComputedStyle(mount).position === "static") {
      mount.style.position = "relative";
    }

    mount.appendChild(renderer.domElement);

    // ----- Wireframe geometry -----
    const baseGeom = new THREE.IcosahedronGeometry(1.2, 1);
    const edges = new THREE.EdgesGeometry(baseGeom);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#06b6d4", // Tailwind cyan-500
      transparent: true,
      opacity: 1,
    });
    const wire = new THREE.LineSegments(edges, lineMaterial);
    scene.add(wire);

    // ----- Vertex glow points -----
    const verts = new Float32Array(baseGeom.attributes.position.count * 3);
    verts.set(baseGeom.attributes.position.array);
    const ptsGeom = new THREE.BufferGeometry();
    ptsGeom.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    const ptsMat = new THREE.PointsMaterial({
      color: "#06b6d4",
      size: 0.03,
      transparent: true,
      opacity: 0.9,
    });
    const points = new THREE.Points(ptsGeom, ptsMat);
    scene.add(points);

    // ----- Lighting -----
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);
    const pLight = new THREE.PointLight(0x06b6d4, 0.6, 10);
    pLight.position.set(3, 2, 3);
    scene.add(pLight);

    // ----- Animation -----
    let rotationSpeed = 0.002;
    let paused = false;

    const animate = () => {
      if (!paused) {
        wire.rotation.y += rotationSpeed;
        wire.rotation.x += rotationSpeed * 0.4;
        points.rotation.y += rotationSpeed;
      }
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // ----- Hover & Click effects -----
    const handleEnter = () => (rotationSpeed = 0.01);
    const handleLeave = () => (rotationSpeed = 0.002);
    const handleClick = () => {
      wire.scale.set(1.25, 1.25, 1.25);
      points.scale.set(1.25, 1.25, 1.25);
      setTimeout(() => {
        wire.scale.set(1, 1, 1);
        points.scale.set(1, 1, 1);
      }, 300);
    };

    mount.addEventListener("mouseenter", handleEnter);
    mount.addEventListener("mouseleave", handleLeave);
    mount.addEventListener("click", handleClick);

    // ----- Resize handling -----
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", handleResize);

    // ----- Cleanup -----
    return () => {
      cancelAnimationFrame(frameRef.current);
      mount.removeEventListener("mouseenter", handleEnter);
      mount.removeEventListener("mouseleave", handleLeave);
      mount.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);

      // dispose geometries/materials
      baseGeom.dispose();
      edges.dispose();
      ptsGeom.dispose();
      lineMaterial.dispose();
      ptsMat.dispose();

      // dispose renderer and remove canvas
      renderer.dispose();
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full md:w-[240px] h-[300px] bg-transparent flex items-center justify-center border-r border-gray-700"
      style={{ cursor: "pointer" }}
    />
  );
};

export default Sidebar3DModel;
