import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Cpu, BookOpen, Users, Sparkles, Code, Layers, Zap, Mail, MapPin, Phone, Globe } from 'lucide-react';

const AboutUs = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features = [
    {
      icon: Cpu,
      title: "Performance without Compromise",
      description: "A simulation is only as good as its speed and accuracy. We are committed to an uncompromising, high-performance C++ core because we believe educational tools should meet professional standards."
    },
    {
      icon: BookOpen,
      title: "Intuition by Design",
      description: "Power should feel effortless. We obsess over every detail of the user experience to ensure the platform is clean, responsive, and gets out of your way."
    },
    {
      icon: Users,
      title: "Education-First",
      description: "While ProtoVolt is a powerful tool for any engineer, its heart is in the classroom. Every feature is built with the goal of making learning more engaging and teaching more impactful."
    },
    {
      icon: Sparkles,
      title: "Open and Collaborative",
      description: "Our robust data protocols and API-ready architecture enable seamless sharing of data and designs across tools and communities."
    }
  ];

  const team = [
    { 
      role: "Frontend Team", 
      focus: "Crafting beautiful, responsive interfaces with React.js and modern web technologies",
      icon: Layers
    },
    { 
      role: "Backend Team", 
      focus: "Building robust APIs with Node.js and managing seamless data flow",
      icon: Code
    },
    { 
      role: "Core Engine Team", 
      focus: "Developing the powerful C++ simulation engine for accurate circuit analysis",
      icon: Cpu
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15 } 
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#020408] via-[#050a12] to-[#0a0e17] text-white overflow-hidden">
      {/* Animated flowing background - Very subtle */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 212, 255, 0.2) 1px, transparent 0)`,
            backgroundSize: '50px 50px',
            transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.03}px)`
          }}
        />
        
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.04) 0%, rgba(0, 212, 255, 0.01) 50%, transparent 70%)',
            left: '10%',
            top: '20%',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute w-[450px] h-[450px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.05) 0%, rgba(79, 70, 229, 0.02) 50%, transparent 70%)',
            right: '10%',
            top: '30%',
            filter: 'blur(90px)',
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.03) 0%, transparent 70%)',
            filter: 'blur(60px)',
            left: mousePosition.x - 150,
            top: mousePosition.y - 150,
          }}
          transition={{ type: "spring", damping: 40, stiffness: 150 }}
        />
      </div>

      {/* Mission Section - Starting Point */}
      <section className="relative z-10 py-32 px-6 pt-40">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center gap-3 px-6 py-3 bg-[#4F46E5]/15 border border-[#4F46E5]/40 rounded-full backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Target className="w-5 h-5 text-[#4F46E5]" />
                <span className="text-sm font-semibold text-[#4F46E5]">Our Mission</span>
              </motion.div>
              
              <motion.h2 
                className="text-5xl md:text-6xl font-bold leading-tight text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Democratizing Electronics Education
              </motion.h2>
              
              <motion.p 
                className="text-lg text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                The world runs on circuits, but for too long, a deep understanding of them has been locked behind expensive physical labs and dense textbooks. We saw this gap firsthand—the disconnect between a schematic on a page and the living, breathing circuit it represents.
              </motion.p>
              
              <motion.p 
                className="text-lg text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Our mission is to tear down those walls. We built ProtoVolt to be a bridge between theory and practice; a dynamic, intuitive, and powerful environment where curiosity can flourish.
              </motion.p>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF] to-[#4F46E5] rounded-3xl blur-3xl opacity-8" />
              <motion.div 
                className="relative bg-gradient-to-br from-[#0d1625]/90 to-[#080f1a]/90 backdrop-blur-sm border border-[#00D4FF]/30 rounded-3xl p-12 hover:border-[#00D4FF]/50 transition-all duration-500"
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Zap className="w-20 h-20 text-[#00D4FF] mb-6 opacity-80" />
                </motion.div>
                <h3 className="text-3xl font-bold mb-4 text-white">Powering Innovation</h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Combining cutting-edge web technology with robust circuit simulation to create an unparalleled learning experience for the digital age.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative z-10 py-32 px-6 bg-gradient-to-b from-transparent via-[#00D4FF]/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">
              The Genesis of ProtoVolt
            </h2>
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                ProtoVolt didn't start in a boardroom; it started with a shared frustration during late-night study sessions at a university in Gujarat. We were surrounded by brilliant minds who struggled to visualize the flow of electrons and the interplay of components.
              </p>
              <p>
                We asked ourselves: "Why can't we see our circuits come to life as we build them?" That question sparked an idea. Working from our base in Surat, we began building the tool we wished we had.
              </p>
              <p>
                What started as a small project in late 2024 quickly became our passion. We officially launched ProtoVolt in early 2025 with the goal of creating a platform that was not only powerful but also inspiring—a canvas for the next generation of electrical engineers.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              The Code We Live By
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide every decision we make
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative bg-gradient-to-br from-[#0d1625]/70 to-[#080f1a]/70 backdrop-blur-sm border border-[#00D4FF]/20 rounded-2xl p-8 hover:border-[#00D4FF]/40 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#00D4FF]/20 to-[#4F46E5]/20 rounded-xl flex items-center justify-center mb-6 border border-[#00D4FF]/30">
                  <feature.icon className="w-8 h-8 text-[#00D4FF]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-base text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#00D4FF]/15 border border-[#00D4FF]/40 rounded-full mb-8 backdrop-blur-sm">
              <Users className="w-5 h-5 text-[#00D4FF]" />
              <span className="text-sm font-semibold text-[#00D4FF]">Our Team</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Built by Passionate Developers
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A collaborative effort across multiple disciplines
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <motion.div 
                  className="relative bg-gradient-to-br from-[#0d1625]/70 to-[#080f1a]/70 backdrop-blur-sm border border-[#00D4FF]/20 rounded-2xl p-8 h-full hover:border-[#00D4FF]/40 transition-all duration-500"
                  whileHover={{ y: -8 }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#00D4FF]/20 to-[#4F46E5]/20 rounded-xl mb-6 flex items-center justify-center border border-[#00D4FF]/30">
                    <member.icon className="w-7 h-7 text-[#00D4FF]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {member.role}
                  </h3>
                  <p className="text-base text-gray-300 leading-relaxed">
                    {member.focus}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Complaint Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#4F46E5]/15 border border-[#4F46E5]/40 rounded-full mb-8 backdrop-blur-sm">
              <Mail className="w-5 h-5 text-[#4F46E5]" />
              <span className="text-sm font-semibold text-[#4F46E5]">Your Voice Matters</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Share Your Feedback
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We're committed to continuous improvement. Your complaints and suggestions help us build a better ProtoVolt.
            </p>
          </motion.div>

          <motion.div 
            className="relative bg-gradient-to-br from-[#0d1625]/70 to-[#080f1a]/70 backdrop-blur-sm border border-[#00D4FF]/20 rounded-2xl p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Name
                </label>
                <input 
                  type="text" 
                  placeholder="Your full name"
                  className="w-full px-4 py-3 bg-[#0d1625]/60 border border-[#00D4FF]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00D4FF]/50 focus:ring-1 focus:ring-[#00D4FF]/50 transition-all duration-300"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Email
                </label>
                <input 
                  type="email" 
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-[#0d1625]/60 border border-[#00D4FF]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00D4FF]/50 focus:ring-1 focus:ring-[#00D4FF]/50 transition-all duration-300"
                />
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Category
                </label>
                <select className="w-full px-4 py-3 bg-[#0d1625]/60 border border-[#00D4FF]/20 rounded-lg text-white focus:outline-none focus:border-[#00D4FF]/50 focus:ring-1 focus:ring-[#00D4FF]/50 transition-all duration-300">
                  <option value="">Select a category</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="performance">Performance Issue</option>
                  <option value="ui">UI/UX Complaint</option>
                  <option value="documentation">Documentation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Subject Field */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Subject
                </label>
                <input 
                  type="text" 
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-3 bg-[#0d1625]/60 border border-[#00D4FF]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00D4FF]/50 focus:ring-1 focus:ring-[#00D4FF]/50 transition-all duration-300"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Detailed Message
                </label>
                <textarea 
                  rows="6"
                  placeholder="Please provide as much detail as possible..."
                  className="w-full px-4 py-3 bg-[#0d1625]/60 border border-[#00D4FF]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00D4FF]/50 focus:ring-1 focus:ring-[#00D4FF]/50 transition-all duration-300 resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00D4FF] to-[#4F46E5] text-white font-semibold py-4 rounded-lg hover:shadow-lg hover:shadow-[#00D4FF]/20 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit Feedback
              </motion.button>
            </form>

            {/* Info Text */}
            <motion.p 
              className="text-center text-sm text-gray-400 mt-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              We typically respond within 24-48 hours. Your feedback is confidential and helps us improve.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 py-32 px-6 mb-20"></section>

      {/* Contact Section */}
      <section className="relative z-10 py-32 px-6 mb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="relative rounded-2xl p-12 overflow-hidden border border-[#00D4FF]/20 bg-gradient-to-br from-[#0d1625]/60 to-[#080f1a]/60 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  contact us
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  ProtoVolt is more than just software; it's a growing community of innovators, educators, and lifelong learners. We want to hear from you.
                </p>
              </motion.div>

              <motion.div 
                className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                {/* Email */}
                <div className="flex items-start gap-4 p-6 rounded-xl bg-[#0d1625]/40 border border-[#00D4FF]/15 hover:border-[#00D4FF]/30 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00D4FF]/15 to-[#4F46E5]/15 rounded-lg flex items-center justify-center border border-[#00D4FF]/25">
                    <Mail className="w-5 h-5 text-[#00D4FF]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">Email Us</h3>
                    <a href="mailto:contact@protovolt.com" className="text-gray-300 hover:text-[#00D4FF] transition-colors text-sm">
                      contact@protovolt.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-6 rounded-xl bg-[#0d1625]/40 border border-[#00D4FF]/15 hover:border-[#00D4FF]/30 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00D4FF]/15 to-[#4F46E5]/15 rounded-lg flex items-center justify-center border border-[#00D4FF]/25">
                    <Phone className="w-5 h-5 text-[#00D4FF]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">Call Us</h3>
                    <a href="tel:+919876543210" className="text-gray-300 hover:text-[#00D4FF] transition-colors text-sm">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 p-6 rounded-xl bg-[#0d1625]/40 border border-[#00D4FF]/15 hover:border-[#00D4FF]/30 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00D4FF]/15 to-[#4F46E5]/15 rounded-lg flex items-center justify-center border border-[#00D4FF]/25">
                    <MapPin className="w-5 h-5 text-[#00D4FF]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">Visit Us</h3>
                    <p className="text-gray-300 text-sm">
                      Surat, Gujarat, India
                    </p>
                  </div>
                </div>

                {/* Support */}
                <div className="flex items-start gap-4 p-6 rounded-xl bg-[#0d1625]/40 border border-[#00D4FF]/15 hover:border-[#00D4FF]/30 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00D4FF]/15 to-[#4F46E5]/15 rounded-lg flex items-center justify-center border border-[#00D4FF]/25">
                    <Globe className="w-5 h-5 text-[#00D4FF]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">Support</h3>
                    <a href="mailto:support@protovolt.com" className="text-gray-300 hover:text-[#00D4FF] transition-colors text-sm">
                      support@protovolt.com
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div 
                className="mt-10 flex justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <a href="#" className="w-10 h-10 bg-[#0d1625]/40 border border-[#00D4FF]/20 rounded-lg flex items-center justify-center hover:border-[#00D4FF]/40 hover:bg-[#00D4FF]/5 transition-all duration-300">
                  <svg className="w-4 h-4 text-[#00D4FF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-[#0d1625]/40 border border-[#00D4FF]/20 rounded-lg flex items-center justify-center hover:border-[#00D4FF]/40 hover:bg-[#00D4FF]/5 transition-all duration-300">
                  <svg className="w-4 h-4 text-[#00D4FF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-[#0d1625]/40 border border-[#00D4FF]/20 rounded-lg flex items-center justify-center hover:border-[#00D4FF]/40 hover:bg-[#00D4FF]/5 transition-all duration-300">
                  <svg className="w-4 h-4 text-[#00D4FF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-[#0d1625]/40 border border-[#00D4FF]/20 rounded-lg flex items-center justify-center hover:border-[#00D4FF]/40 hover:bg-[#00D4FF]/5 transition-all duration-300">
                  <svg className="w-4 h-4 text-[#00D4FF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
