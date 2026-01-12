import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, BookOpen, Users, TrendingUp, Award,
  Target, Sparkles, Shield, ChevronRight, Terminal, 
  Cpu, Globe
} from 'lucide-react';

// --- ANIMATED TITLE COMPONENT (The "NeoCube" Text) ---
const AnimatedTitle = () => {
  const title = "NeoCube";
  const letters = title.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    }),
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: -100,
      rotateX: 90,
      filter: "blur(20px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 150,
      },
    },
  };

  return (
    <div className="relative z-20 flex justify-center mb-12">
      {/* Central Glow behind the text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-primary/40 blur-[80px] -z-10 animate-pulse-slow" />
      
      <motion.h1
        className="text-7xl md:text-9xl font-display font-extrabold tracking-tighter flex items-center justify-center perspective-1000"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={childVariants}
            className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          >
            {letter}
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
};

// --- Animation Variants ---
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.2, delayChildren: 0.8 } }
};

const floating = {
  animate: { 
    y: [0, -20, 0], 
    rotateX: [0, 5, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } 
  }
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      
      {/* 1. BACKGROUND FX */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-[0.1]" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative z-10 pt-32 pb-20 lg:pt-40 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* --- A. TOP CENTER: ANIMATED TITLE --- */}
          <AnimatedTitle />
          
          {/* --- B. MAIN CONTENT GRID --- */}
          <div className="grid lg:grid-cols-12 gap-12 items-center mt-8">
            
            {/* Left: Text Pitch (Span 7 cols) */}
            <motion.div 
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center lg:text-left space-y-8 lg:col-span-7"
            >
              <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-mono tracking-widest uppercase backdrop-blur-md">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  <span>System Online v2.0</span>
                </div>
              </motion.div>

              <motion.h2 variants={fadeInUp} className="text-4xl lg:text-6xl font-display font-bold leading-tight text-white">
                The <span className="text-gradient-cyan">Operating System</span> <br />
                for Your IT Career.
              </motion.h2>

              <motion.p variants={fadeInUp} className="text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                NeoCube isn't just a course list. It's a dynamic, <span className="text-white font-medium">data-driven career engine</span> designed for Government & Enterprise professionals to bridge the gap to modern tech.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-5 pt-4 justify-center lg:justify-start">
                <Link to="/signup" className="btn-neo text-lg px-8 py-4 group relative overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.4)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Initialize Roadmap
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link to="/technologies" className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center gap-3 transition-all font-medium hover:border-primary/50">
                  <Terminal className="w-5 h-5 text-gray-400" />
                  Explore Radar
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Holographic UI Mockup (Span 5 cols) */}
            <motion.div 
              variants={fadeInUp}
              className="relative hidden lg:block lg:col-span-5"
            >
              {/* Card Container Glow */}
              <div className="absolute -inset-10 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 rounded-full blur-3xl -z-10" />
              
              <motion.div
                  variants={floating}
                  initial="initial"
                  animate="animate"
                  className="perspective-1000"
              >
                  {/* The Glass Card */}
                  <div className="glass-card p-6 border-t border-l border-white/20 shadow-2xl shadow-black/50 relative z-20 backdrop-blur-xl transform rotate-y-[-10deg] rotate-x-[5deg]">
                    
                    {/* Header Bar */}
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-glow-sm" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-glow-sm" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-glow-sm" />
                      </div>
                      <div className="text-[10px] text-primary-glow font-mono tracking-[0.2em]">USER_DATA.JSON</div>
                    </div>
                    
                    {/* Progress Bars */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-300 uppercase tracking-wider">
                          <span className="flex items-center gap-2"><Cpu className="w-3 h-3 text-primary"/> Kubernetes</span>
                          <span className="text-primary">84%</span>
                        </div>
                        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: "84%" }} 
                            transition={{ duration: 2, delay: 1 }} 
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-300 uppercase tracking-wider">
                           <span className="flex items-center gap-2"><Shield className="w-3 h-3 text-secondary"/> Cybersecurity</span>
                          <span className="text-secondary">42%</span>
                        </div>
                        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: "42%" }} 
                            transition={{ duration: 2, delay: 1.2 }} 
                            className="h-full bg-gradient-to-r from-teal-600 to-emerald-400 shadow-[0_0_10px_rgba(20,184,166,0.8)]" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Code Block */}
                    <div className="mt-8 p-4 bg-black/50 rounded-lg font-mono text-[10px] text-blue-200/60 border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary/50"></div>
                      <p className="mb-1 opacity-50">{`> initializing neural_net...`}</p>
                      <p className="mb-1 text-green-400">{`> ACCESS GRANTED.`}</p>
                      <p className="flex items-center gap-1 animate-pulse"><span className="w-1.5 h-3 bg-primary block"></span> Awaiting input...</p>
                    </div>
                  </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. FEATURE GRID */}
      <section className="relative z-10 py-24 px-6 bg-surface/30 backdrop-blur-sm border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              Enterprise-Grade <span className="text-gradient-cyan">Capabilities</span>
            </h2>
            <p className="text-textMuted max-w-2xl mx-auto">
              Built to meet the rigorous standards of modern IT departments and government agencies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Target} 
              title="Role-Based Roadmaps" 
              desc="Don't just learn random tools. Follow precise paths for roles like 'System Architect' or 'DevOps Engineer'."
            />
            <FeatureCard 
              icon={Shield} 
              title="Govt-Ready Compliance" 
              desc="Focus on stable, secure, and open-source technologies approved for public sector use." 
            />
            <FeatureCard 
              icon={TrendingUp} 
              title="Emerging Tech Radar" 
              desc="A live dashboard separating 'Hype' from 'Enterprise-Ready' technologies." 
            />
            <FeatureCard 
              icon={BookOpen} 
              title="Curated Resources" 
              desc="We filter the noise. Access only high-quality documentation and verified tutorials." 
            />
            <FeatureCard 
              icon={Award} 
              title="Skill Certification" 
              desc="Earn verifiable badges to demonstrate your modernization progress to stakeholders." 
            />
            <FeatureCard 
              icon={Users} 
              title="Team Analytics" 
              desc="For managers: Track the upskilling velocity of your entire technical unit." 
            />
          </div>
        </div>
      </section>

      {/* 4. TECH STACK */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-display font-bold text-white">Supported Technologies</h2>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-textMuted uppercase tracking-widest">System Online</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {technologies.map((tech, idx) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-surface border border-white/5 p-4 rounded-xl hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform relative z-10">{tech.icon}</div>
                <div className="font-semibold text-gray-300 group-hover:text-white relative z-10">{tech.name}</div>
                <div className="text-xs text-textMuted mt-1 relative z-10">Status: Stable</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-primary/20">
          {/* CTA Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-slate-950" />
          <div className="absolute inset-0 bg-grid opacity-20 mix-blend-overlay" />
          {/* Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full" />
          
          <div className="relative z-10 p-12 md:p-20 text-center">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-6 leading-tight">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Upgrade</span> Your Protocol?
            </h2>
            <p className="text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join the platform building the next generation of India's technical infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/signup" className="btn-neo text-lg px-10 py-5 shadow-xl shadow-primary/20">
                Start Free Trial
              </Link>
              <Link to="/login" className="px-10 py-5 rounded-xl border-2 border-white/10 text-white hover:bg-white/5 hover:border-white/30 transition-all font-bold tracking-wide">
                Enterprise Login
              </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-blue-200/60 font-mono uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Secure
              </span>
              <span className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-secondary" /> Scalable
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" /> Open Standards
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

// Sub-component for features
const FeatureCard = ({ icon: Icon, title, desc }) => (
  <motion.div 
    variants={fadeInUp}
    className="neo-card group relative overflow-hidden p-8 rounded-3xl border border-white/10 bg-surface/50 backdrop-blur-xl hover:border-primary/40 transition-all duration-500"
  >
    <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    
    <div className="relative z-10">
        <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
        <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        {title}
        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
        </h3>
        <p className="text-textMuted text-base leading-relaxed group-hover:text-gray-200 transition-colors">
        {desc}
        </p>
    </div>
  </motion.div>
);

const technologies = [
  { name: 'React.js', icon: '⚛️' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'Docker', icon: '🐳' },
  { name: 'Kubernetes', icon: '☸️' },
  { name: 'Python', icon: '🐍' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'Redis', icon: '🔴' },
  { name: 'AWS', icon: '☁️' },
  { name: 'Git', icon: '📦' },
  { name: 'Linux', icon: '🐧' },
  { name: 'Security', icon: '🔒' },
  { name: 'GraphQL', icon: '◈' },
];

export default Landing;