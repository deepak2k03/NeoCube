import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  motion, useScroll, useTransform, useSpring, useMotionValue 
} from 'framer-motion';
import { 
  ArrowRight, Terminal, Cpu, Shield, Zap, Layout, 
  Code2, Command, Globe, BarChart3, Database,
  Server, Lock, Activity, CheckCircle2, Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- DATA: TECH STREAMS ---
const STREAM_1 = [
  { name: 'React', icon: Code2, color: 'text-blue-400' },
  { name: 'Node.js', icon: Server, color: 'text-emerald-400' },
  { name: 'TypeScript', icon: Terminal, color: 'text-blue-500' },
  { name: 'Docker', icon: Layout, color: 'text-blue-400' },
];
const STREAM_2 = [
  { name: 'Python', icon: Terminal, color: 'text-yellow-400' },
  { name: 'AWS', icon: Globe, color: 'text-orange-400' },
  { name: 'PostgreSQL', icon: Database, color: 'text-blue-300' },
  { name: 'Security', icon: Shield, color: 'text-red-400' },
];
const STREAM_3 = [
  { name: 'GraphQL', icon: Activity, color: 'text-pink-400' },
  { name: 'Rust', icon: Cpu, color: 'text-orange-500' },
  { name: 'Kubernetes', icon: Layout, color: 'text-blue-500' },
  { name: 'Auth0', icon: Lock, color: 'text-red-500' },
];

// --- 1. MINIMALIST CURSOR ---
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 20, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 10);
      cursorY.set(e.clientY - 10);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-5 h-5 bg-white mix-blend-difference rounded-full pointer-events-none z-[100] hidden md:block"
      style={{ translateX: cursorXSpring, translateY: cursorYSpring }}
    />
  );
};

// --- 2. PARALLAX CARD COMPONENT ---
const TechCard = ({ name, icon: Icon, color }) => (
  <div className="group relative p-4 mb-4 rounded-xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm hover:bg-neutral-800 transition-all duration-300 cursor-default hover:border-white/10 hover:scale-105 hover:shadow-2xl">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-white/5 ${color} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-sm font-bold text-neutral-300 group-hover:text-white transition-colors">{name}</div>
        <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">Roadmap Available</div>
      </div>
    </div>
  </div>
);

// --- 3. INFINITE SCROLL COLUMN ---
const InfiniteColumn = ({ items, duration = 20, reverse = false }) => (
  <div className="relative flex flex-col overflow-hidden h-[600px] w-full opacity-30 hover:opacity-100 transition-opacity duration-700 mask-gradient">
    <motion.div
      className="flex flex-col"
      animate={{ y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {[...items, ...items, ...items, ...items].map((item, i) => (
        <TechCard key={i} {...item} />
      ))}
    </motion.div>
    {/* Fade edges */}
    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-neutral-950 to-transparent z-10" />
    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent z-10" />
  </div>
);

// --- 4. MAIN LANDING COMPONENT ---
const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-white/20 relative overflow-x-hidden">
      <CustomCursor />
      
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-sm shadow-[0_0_10px_white]" />
            <span className="font-semibold tracking-tight text-lg">NeoCube</span>
          </div>
          <div className="flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">Log in</Link>
                <Link to="/register" className="text-sm font-medium bg-white text-black px-5 py-2 rounded-full hover:bg-neutral-200 transition-colors">
                  Sign up
                </Link>
              </>
            ) : (
              <Link to="/technologies" className="text-sm font-medium bg-white text-black px-5 py-2 rounded-full hover:bg-neutral-200 transition-colors">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION WITH PARALLAX STREAMS */}
      <section className="relative z-10 pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: TEXT CONTENT */}
          <div className="relative z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-neutral-400 text-xs mb-8 font-mono"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM_ONLINE_v2.0
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
            >
              Master the code. <br />
              <span className="text-neutral-500">Skip the noise.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-neutral-400 max-w-md mb-10 leading-relaxed"
            >
              NeoCube uses Gemini AI to generate precise, step-by-step learning roadmaps for any technology. Stop searching, start building.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <button 
                onClick={() => navigate(isAuthenticated ? '/technologies' : '/register')}
                className="h-12 px-8 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
              >
                {isAuthenticated ? 'Enter Dashboard' : 'Start Free'} <ArrowRight className="w-4 h-4" />
              </button>
              <button className="h-12 px-8 rounded-full border border-white/10 hover:bg-white/5 transition-all text-neutral-300 flex items-center gap-2">
                <Play className="w-4 h-4" /> Watch Demo
              </button>
            </motion.div>

            {/* TRUST BADGE */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex items-center gap-4 text-xs text-neutral-500 font-mono"
            >
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-950 flex items-center justify-center text-white font-bold">{i}</div>
                ))}
              </div>
              <p>Trusted by 10,000+ developers</p>
            </motion.div>
          </div>

          {/* RIGHT: PARALLAX STREAMS (VISUAL) */}
          <div className="relative h-[600px] w-full hidden lg:flex gap-4 perspective-1000">
            {/* Gradient Mask to fade top/bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950 z-20 pointer-events-none" />
            
            <div className="flex-1 pt-20">
              <InfiniteColumn items={STREAM_1} duration={45} />
            </div>
            <div className="flex-1">
              <InfiniteColumn items={STREAM_2} duration={35} reverse={true} />
            </div>
            <div className="flex-1 pt-40">
              <InfiniteColumn items={STREAM_3} duration={50} />
            </div>
          </div>

        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 border-y border-white/5 bg-neutral-900/20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBox label="Active Users" value="12k+" icon={Globe} />
          <StatBox label="Roadmaps Generated" value="85k+" icon={Command} />
          <StatBox label="Sectors Covered" value="120+" icon={Layout} />
          <StatBox label="Completion Rate" value="94%" icon={CheckCircle2} />
        </div>
      </section>

      {/* VALUE PROPOSITION (BENTO) */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Why NeoCube?</h2>
            <p className="text-neutral-400 max-w-xl text-lg">
              We replaced static video tutorials with dynamic, interactive protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BentoCard 
              colSpan="md:col-span-2"
              title="AI-Powered Curriculum"
              desc="Enter 'Quantum Computing' or 'Salesforce'. Our engine builds a complete syllabus in seconds."
              icon={Zap}
              gradient="from-indigo-500/20 to-purple-500/20"
            />
            <BentoCard 
              title="Progress Sync"
              desc="Cross-device synchronization for every node you complete."
              icon={Activity}
              gradient="from-emerald-500/20 to-teal-500/20"
            />
            <BentoCard 
              title="Skill Verification"
              desc="Earn cryptographic badges for every sector you master."
              icon={Shield}
              gradient="from-orange-500/20 to-red-500/20"
            />
            <BentoCard 
              colSpan="md:col-span-2"
              title="Global Taxonomy"
              desc="Access a database of 100+ specialized sectors, from Aerospace to Zoology."
              icon={Globe}
              gradient="from-blue-500/20 to-cyan-500/20"
            />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-8xl font-bold text-white mb-8 tracking-tighter">
            Ready to <span className="text-neutral-600">Ship?</span>
          </h2>
          <p className="text-xl text-neutral-400 mb-10">
            Join the new standard of technical education.
          </p>
          <button 
            onClick={() => navigate(isAuthenticated ? '/technologies' : '/register')}
            className="px-10 py-5 bg-white text-black text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.2)]"
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-neutral-500 text-sm">
            © 2026 NeoCube Inc.
          </div>
          <div className="flex gap-8 text-sm font-medium text-neutral-400">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatBox = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 text-neutral-500 mb-2">
      <Icon className="w-4 h-4" />
      <span className="text-xs font-mono uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-4xl font-bold text-white">{value}</div>
  </div>
);

const BentoCard = ({ title, desc, icon: Icon, gradient, colSpan = "" }) => (
  <div className={`relative overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/30 p-8 hover:bg-neutral-900/50 transition-colors group ${colSpan}`}>
    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${gradient} blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-neutral-400 leading-relaxed">
        {desc}
      </p>
    </div>
  </div>
);

export default Landing;