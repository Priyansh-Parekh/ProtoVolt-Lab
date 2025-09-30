import React from 'react';
import { motion } from 'framer-motion';
import { FiTrello, FiBookOpen, FiZap, FiCode } from 'react-icons/fi';

// Dummy content for feature sections
const features = [
  { icon: FiTrello, title: "Drag-and-Drop Canvas", description: "Build complex circuits intuitively on a limitless digital canvas. Our workspace supports all standard components and custom modules.", delay: 0.2 },
  { icon: FiZap, title: "Real-Time Simulation Core", description: "Experience instantaneous analysis with our high-speed C++ core engine. Get live voltage, current, and waveform data.", delay: 0.4 },
  { icon: FiBookOpen, title: "Integrated Classroom Module", description: "Professors can deploy assignments, track student progress, and conduct virtual labs directly within the platform.", delay: 0.6 },
  { icon: FiCode, title: "API and Data Protocol Ready", description: "Designed for collaboration. Seamless data exchange between Frontend, Backend, and the simulation engine for easy integration.", delay: 0.8 },
];

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    // CRITICAL FIX: Added pt-16 to ensure content clears the fixed Navbar
    <div className="min-h-screen bg-[#0A0E17] text-gray-100 overflow-x-hidden pt-16">
      
      {/* SECTION 1: HERO (Full viewport height) */}
      <section className="relative h-[90vh] flex items-center justify-center text-center px-4 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-4 text-white hover:text-[#00D4FF] transition-colors duration-500 ease-in-out">
            ProtoVolt: Circuit Intelligence.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10">
            Design, Simulate, and Master Electronics with Our Next-Generation, Cloud-Native Platform.
          </p>
          <motion.a 
            href="/workspace"
            className="inline-block bg-[#00D4FF] hover:bg-[#00B8E6] text-[#0A0E17] font-bold px-10 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Start Designing Today
          </motion.a>
        </motion.div>
      </section>

      {/* SECTION 2: CORE FEATURES (Scroll-Triggered Section) */}
      <section className="py-24 bg-black/30 backdrop-blur-sm px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-16 text-center text-[#00D4FF]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Built for the Future of Engineering
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-[#60A5FA] transition-colors duration-300 shadow-xl"
                variants={itemVariants}
              >
                <feature.icon className="w-10 h-10 text-[#60A5FA] mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: WORKFLOW SHOWCASE (Image/Diagram focused) */}
      <section className="py-24 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-16 text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            The ProtoVolt Workflow: Simplified
          </motion.h2>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold mb-4 text-[#00D4FF]">1. Ideate and Connect</h3>
              <p className="text-gray-400 mb-6 text-lg">
                Drag components like resistors, capacitors, and power sources onto the canvas. Our intelligent wiring tool snaps connections into place, minimizing design friction. You spend less time drawing and more time innovating.
              </p>
              <h3 className="text-3xl font-bold mb-4 text-[#00D4FF]">2. Simulate Instantly</h3>
              <p className="text-gray-400 mb-6 text-lg">
                Hit 'Run' and watch the circuit come alive. The C++ engine handles complex calculations, delivering real-time simulation data, voltage heatmaps, and oscilloscopes for precise analysis.
              </p>
            </motion.div>

            {/* Right Column: Placeholder Image/Diagram */}
            <motion.div
              className="relative aspect-video bg-gray-900/50 rounded-xl shadow-2xl p-6 border border-gray-800 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-gray-500 text-xl">
                [Placeholder for Interactive Circuit Diagram Image/Video]
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer / Call to Action */}
      <section className="py-16 bg-gray-900 text-center border-t border-gray-800">
          <p className="text-gray-500">© 2025 ProtoVolt Project. All Rights Reserved.</p>
      </section>

    </div>
  );
};

export default Home;
