import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiTrello, FiBookOpen, FiZap, FiCode } from "react-icons/fi";
// import Hero3D from "../components/Hero3D";
import ParticleBackground from "../helper/ParticleBackground.jsx";
import BackgroundGlow from "../helper/BackgroundGlow.jsx";
import ParallaxSection from "../helper/ParallaxSection.jsx";
import { SplitText, RevealText, ParallaxText, GlitchText, ScaleText } from "../helper/AnimatedText.jsx";

const features = [
  { icon: FiTrello, title: "Drag-and-Drop Canvas", description: "Build complex circuits intuitively on a limitless digital canvas. Our workspace supports all standard components and custom modules.", delay: 0.2 },
  { icon: FiZap, title: "Real-Time Simulation Core", description: "Experience instantaneous analysis with our high-speed C++ core engine. Get live voltage, current, and waveform data.", delay: 0.4 },
  { icon: FiBookOpen, title: "Integrated Classroom Module", description: "Professors can deploy assignments, track student progress, and conduct virtual labs directly within the platform.", delay: 0.6 },
  { icon: FiCode, title: "API and Data Protocol Ready", description: "Designed for collaboration. Seamless data exchange between Frontend, Backend, and the simulation engine for easy integration.", delay: 0.8 },
];

const dotContent = [
  {
    id: 1,
    icon: FiTrello,
    title: "Start Designing",
    description: "Begin with drag-and-drop circuit creation.",
    link: "#",
  },
  {
    id: 2,
    icon: FiZap,
    title: "Simulate in Real-Time",
    description: "Run your design instantly with real-time feedback.",
    link: "#",
  },
  {
    id: 3,
    icon: FiBookOpen,
    title: "Learn & Teach",
    description: "Classroom mode for assignments and collaboration.",
    link: "#",
  },
  {
    id: 4,
    icon: FiCode,
    title: "Deploy Anywhere",
    description: "Export APIs and integrate seamlessly.",
    link: "#",
  },
];

const Home = () => {
  const dotsRef = useRef(null);
  const isDotsInView = useInView(dotsRef, { amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <div className="relative min-h-screen z-20 bg-[#05070D] text-gray-100 overflow-x-hidden">
      {/* PARTICLE BACKGROUND */}
      <ParticleBackground />
      <BackgroundGlow/>

      {/* HERO 3D SECTION */}
     {/* HERO SECTION */}
<section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center overflow-hidden pt-32">

  {/* TITLE + SUBTEXT */}
  <div className="relative z-20 mb-10">
    <h1 className="text-6xl md:text-8xl font-extrabold mb-4 bg-gradient-to-r from-[#00D4FF] via-[#4F46E5] to-[#00D4FF] bg-clip-text text-transparent">
      ProtoVolt
    </h1>
    <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
      The Futuristic Circuit Simulator — Design, Simulate, and Collaborate in 3D.
    </p>
  </div>

  {/* 3D MODEL BELOW TEXT */}
  {/* <div className="relative z-10 w-full h-[500px] flex items-center justify-center">
    <Hero3D />
  </div> */}

  {/* BUTTON OVER MODEL */}
  <div className="relative z-20 mt-8">
    <motion.a
      href="/workspace"
      className="inline-block px-10 py-4 bg-gradient-to-r from-[#00D4FF] to-[#4F46E5] text-black font-bold text-lg rounded-full shadow-lg hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      Start Designing
    </motion.a>
  </div>
</section>


      {/* ANIMATED INTRO TEXT */}
      <section className="relative z-10 py-32 px-4 md:px-12 overflow-hidden">
        <ParallaxSection speed={0.3}>
          <h2 className="text-5xl md:text-7xl font-extrabold text-center mb-8">
            <GlitchText className="bg-gradient-to-r from-[#00D4FF] via-[#4F46E5] to-[#00D4FF] bg-clip-text text-transparent">
              The Future of Circuit Design
            </GlitchText>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 text-center max-w-4xl mx-auto">
            <SplitText>
              Experience the next generation of electronics education and simulation with real-time 3D visualization, AI-powered analysis, and collaborative learning environments
            </SplitText>
          </p>
        </ParallaxSection>
      </section>

      {/* FEATURES SECTION WITH PARALLAX */}
      <section className="py-24 relative z-10 px-4 md:px-12">
        <ParallaxSection speed={0.2}>
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <RevealText className="text-[#00D4FF]">
              Built for the Future of Engineering
            </RevealText>
          </motion.h2>
        </ParallaxSection>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <ParallaxSection key={index} speed={0.1 * (index + 1)}>
              <motion.div
                variants={itemVariants}
                className="group p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-md border border-white/10 hover:border-[#00D4FF] transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:scale-105"
                whileHover={{ y: -10 }}
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-12 h-12 text-[#00D4FF] mb-4 group-hover:drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#00D4FF] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            </ParallaxSection>
          ))}
        </motion.div>
      </section>

      {/* LARGE ANIMATED STATEMENT */}
      <section className="py-32 relative z-10 px-4 md:px-12">
        <ScaleText>
          <h2 className="text-5xl md:text-8xl font-extrabold text-center leading-tight">
            <span className="block mb-4">
              <ParallaxText speed={0.5} className="inline-block text-white">
                Design.
              </ParallaxText>
            </span>
            <span className="block mb-4">
              <ParallaxText speed={-0.3} className="inline-block text-[#00D4FF]">
                Simulate.
              </ParallaxText>
            </span>
            <span className="block">
              <ParallaxText speed={0.4} className="inline-block text-[#4F46E5]">
                Collaborate.
              </ParallaxText>
            </span>
          </h2>
        </ScaleText>
      </section>

      <section className="py-24 px-4 md:px-12 relative overflow-hidden">
 <div className="max-w-7xl mx-auto relative">
   <motion.h2
     className="text-4xl md:text-5xl font-bold mb-20 text-center text-white"
     initial={{ opacity: 0, y: 30 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true }}
     transition={{ duration: 0.6 }}
   >
     The ProtoVolt Journey
   </motion.h2>


   {/* Timeline Container */}
   <div className="relative mx-auto w-full max-w-4xl">
     {/* Center Vertical Line */}
     <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#00D4FF]/20 rounded-full overflow-hidden z-0">
       <motion.div
         className="w-full h-full bg-gradient-to-b from-transparent via-[#00D4FF] to-transparent animate-[flow_2s_linear_infinite]"
         initial={{ y: "-100%" }}
         animate={{ y: ["-100%", "100%"] }}
         transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
       />
     </div>


     {[
       {
         title: "Ideate and Connect",
         text: "Drag components like resistors, capacitors, and power sources onto the canvas. Our intelligent wiring tool snaps connections into place, minimizing design friction.",
       },
       {
         title: "Simulate Instantly",
         text: "Hit 'Run' and watch the circuit come alive with real-time waveform outputs powered by our C++ engine.",
       },
       {
         title: "Analyze & Iterate",
         text: "View heatmaps, oscilloscopes, and voltage metrics. Instantly adjust parameters for rapid prototyping.",
       },
       {
         title: "Export & Collaborate",
         text: "Share circuits with teams or deploy directly into classrooms with one click.",
       },
     ].map((step, index) => (
       <motion.div
         key={index}
         className="relative w-full flex justify-center mb-16"
         initial={{ opacity: 0, y: 50 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: false, amount: 0.2 }}
         transition={{ duration: 0.8, delay: index * 0.2 }}
       >
         {/* Center Dot */}
         <motion.span
           className="absolute left-1/2 transform -translate-x-1/2 top-0 w-6 h-6 bg-[#00D4FF] rounded-full shadow-[0_0_25px_#00D4FF] z-20"
           initial={{ scale: 0 }}
           whileInView={{ scale: 1 }}
           viewport={{ once: false, amount: 0.3 }}
           transition={{ duration: 0.5, delay: index * 0.3 }}
         />


         {/* Horizontal Connector - FIXED DIRECTION */}
<motion.div
 className="absolute top-1/2 transform -translate-y-1/2 h-0.5 bg-[#00D4FF]/40 overflow-hidden z-0"
 style={{
   // 🔥 FORCE direction based on box side
   left: index % 2 === 0 ? "50%" : "auto",
   right: index % 2 !== 0 ? "50%" : "auto",
   width: "calc(50% - 2rem)"
 }}
 initial={{ scaleX: 0 }}
 whileInView={{ scaleX: 1 }}
 viewport={{ once: false, amount: 0.3 }}
 transition={{ duration: 0.5, delay: index * 0.4 }}
>
 <motion.div
   className={`h-full ${
     index % 2 === 0
       ? "bg-gradient-to-r from-[#00D4FF] via-[#00D4FF]/70 to-transparent"
       : "bg-gradient-to-l from-[#00D4FF] via-[#00D4FF]/70 to-transparent"
   }`}
   initial={{ x: index % 2 === 0 ? "-100%" : "100%" }}
   animate={{ x: index % 2 === 0 ? "100%" : "-100%" }}
   transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
 />
</motion.div>






         {/* Box */}
         <div
           className={`w-1/2 px-6 relative ${
             index % 2 === 0 ? "ml-auto text-right" : "mr-auto text-left"
           }`}
         >
           <div className="bg-gray-900/70 backdrop-blur-sm border border-[#00D4FF] rounded-xl p-6 shadow-xl hover:shadow-[#00D4FF]/50 transition-shadow duration-500">
             <h3 className="text-2xl font-bold text-[#00D4FF] mb-2">{index + 1}. {step.title}</h3>
             <p className="text-gray-400">{step.text}</p>
           </div>
         </div>
       </motion.div>
     ))}
   </div>
 </div>
</section>


      {/* STATS SECTION WITH PARALLAX */}
      <section className="py-24 relative z-10 px-4 md:px-12">
        <ParallaxSection speed={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "50K+", label: "Circuits Simulated" },
              { number: "500+", label: "Institutions" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-[#00D4FF] transition-all duration-500 hover:scale-110"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{
                  boxShadow: "0 0 40px rgba(0,212,255,0.4)",
                }}
              >
                <motion.h3
                  className="text-5xl md:text-6xl font-extrabold text-[#00D4FF] mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 + 0.3, type: "spring" }}
                >
                  {stat.number}
                </motion.h3>
                <p className="text-gray-400 text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </ParallaxSection>
      </section>

      {/* VIDEO SHOWCASE WITH PARALLAX */}
      <section className="py-24 relative z-10 px-4 md:px-12 bg-gradient-to-b from-transparent to-black/70">
        <ParallaxSection speed={0.2}>
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-12 text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <RevealText>See ProtoVolt in Action</RevealText>
          </motion.h2>
        </ParallaxSection>

        <ParallaxSection speed={0.1}>
          <div className="flex justify-center">
            <motion.div
              className="w-full md:w-3/4 lg:w-2/3 aspect-video rounded-2xl overflow-hidden border-2 border-[#00D4FF]/40 shadow-[0_0_50px_rgba(0,212,255,0.3)] hover:shadow-[0_0_80px_rgba(0,212,255,0.5)] transition-all duration-500"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <iframe
                className="w-full h-full"
                src=""
                title="ProtoVolt Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </div>
        </ParallaxSection>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 relative z-10 px-4 md:px-12">
        <ParallaxSection speed={0.3}>
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6">
              <GlitchText className="bg-gradient-to-r from-[#00D4FF] via-[#4F46E5] to-[#00D4FF] bg-clip-text text-transparent">
                Ready to Transform Your Learning?
              </GlitchText>
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              <SplitText>
                Join thousands of students and educators revolutionizing electronics education
              </SplitText>
            </p>
            <motion.a
              href="/workspace"
              className="inline-block px-12 py-5 bg-gradient-to-r from-[#00D4FF] to-[#4F46E5] text-black font-bold text-xl rounded-full shadow-2xl hover:shadow-[0_0_50px_rgba(0,212,255,0.6)] transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.a>
          </motion.div>
        </ParallaxSection>
      </section>

    </div>
  );
};

export default Home;
