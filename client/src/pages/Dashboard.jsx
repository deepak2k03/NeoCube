import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  motion, useMotionTemplate, useMotionValue, useSpring, useTransform 
} from 'framer-motion';
import {
  Trophy, Target, TrendingUp, Flame, Zap, Activity, 
  ChevronRight, Cpu, Star, ArrowUpRight
} from 'lucide-react';

// --- COMPACT 3D TILT CARD ---
const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ 
        rotateX: useTransform(mouseY, [-50, 50], [1.5, -1.5]), // Reduced rotation for cleaner feel
        rotateY: useTransform(mouseX, [-50, 50], [-1.5, 1.5]), 
        transformStyle: "preserve-3d" 
      }}
      className={`relative group ${className}`}
    >
      <div style={{ transform: "translateZ(0px)" }} className="h-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden relative shadow-lg group-hover:shadow-blue-500/5 transition-all duration-500">
        <motion.div
          style={{ background: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.1), transparent 80%)` }}
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="relative z-10 h-full p-5">{children}</div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const userStats = user?.stats || {};
  const streak = user?.streak ?? userStats.streak ?? 0;

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden pt-6 pb-20 px-6 font-sans selection:bg-cyan-500/30">
      
      {/* 1. COMPACT AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* 2. COMPACT HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-2 font-mono text-[10px] tracking-[0.2em] uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              System Online • {today}
            </div>
            {/* Reduced text size for better scale */}
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              {greeting}, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-500">
                {user?.name?.split(' ')[0] || 'Operative'}
              </span>
            </h1>
          </div>

          {/* Compact Streak Counter */}
          <TiltCard className="w-full md:w-auto !p-0">
            <div className="flex items-center gap-4 pr-2">
              <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/10 text-orange-500 shadow-inner">
                <Flame className={`w-6 h-6 ${streak > 0 ? 'fill-orange-500 animate-bounce' : ''}`} />
              </div>
              <div>
                <div className="text-3xl font-black text-white leading-none tracking-tight">{streak}</div>
                <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mt-0.5">Day Streak</div>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* 3. DENSE STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatBox 
            label="Active Modules" 
            value={userStats.inProgressTechnologies ?? 3} 
            icon={Cpu} 
            color="text-cyan-400"
            gradient="from-cyan-500/20 to-blue-500/5"
          />
          <StatBox 
            label="Nodes Cleared" 
            value={userStats.completedSteps ?? 24} 
            icon={Target} 
            color="text-emerald-400"
            gradient="from-emerald-500/20 to-teal-500/5"
          />
          <StatBox 
            label="Global Rank" 
            value="#842" 
            icon={Trophy} 
            color="text-yellow-400"
            gradient="from-yellow-500/20 to-orange-500/5"
          />
          <StatBox 
            label="System Sync" 
            value={`${userStats.overallProgress ?? 68}%`} 
            icon={Activity} 
            color="text-purple-400"
            gradient="from-purple-500/20 to-pink-500/5"
          />
        </div>

        {/* 4. MAIN CONTENT (9 cols / 3 cols ratio) */}
        <div className="grid lg:grid-cols-12 gap-6 h-full">
          
          {/* PRIMARY COLUMN (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Active Learning (Glass Panel) */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-[#0a0a0c] rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" /> 
                    Active Protocols
                  </h2>
                  <button 
                    onClick={() => navigate('/technologies')}
                    className="text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group/btn"
                  >
                    VIEW RADAR <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <ProtocolCard 
                    title="React.js" 
                    level="LVL 4" 
                    progress={68} 
                    color="bg-blue-500" 
                    icon="⚛️"
                    onClick={() => navigate('/technologies/reactjs')}
                  />
                  <ProtocolCard 
                    title="Node.js" 
                    level="LVL 2" 
                    progress={45} 
                    color="bg-green-500" 
                    icon="🟢"
                    onClick={() => navigate('/technologies/nodejs')}
                  />
                </div>
              </div>
            </div>

            {/* Activity Chart (Compact) */}
            <TiltCard>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-1.5 bg-pink-500/10 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-pink-500" />
                </div>
                <h2 className="text-lg font-bold text-white">Neural Activity</h2>
              </div>
              
              <div className="flex items-end justify-between h-32 gap-3 px-2">
                {[35, 60, 25, 80, 55, 90, 45].map((h, i) => (
                  <div key={i} className="w-full relative group">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1.2, delay: i * 0.1 }}
                      className="w-full bg-zinc-800 rounded-t-[2px] group-hover:bg-gradient-to-t group-hover:from-blue-600 group-hover:to-cyan-400 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
            </TiltCard>
          </div>

          {/* SIDEBAR COLUMN (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Suggested Ops */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-md">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Recommended</h3>
              <div className="space-y-3">
                <SuggestionItem icon="🐍" name="Python" tag="Data Science" />
                <SuggestionItem icon="🐳" name="Docker" tag="DevOps" />
                <SuggestionItem icon="☁️" name="AWS" tag="Cloud Arch" />
              </div>
            </div>

            {/* Premium Promo (Smaller) */}
            <div className="relative rounded-2xl p-6 overflow-hidden group cursor-pointer border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 transition-transform duration-500 group-hover:scale-105" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/30">
                    <Star className="w-4 h-4 text-indigo-300 fill-indigo-300" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Pro Access</h3>
                </div>
                <p className="text-indigo-200/70 text-xs mb-4 leading-relaxed">Unlock Layer 2 protocols.</p>
                <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-indigo-50 transition-colors">
                  Upgrade
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// --- COMPACT SUB-COMPONENTS ---

const StatBox = ({ label, value, icon: Icon, color, gradient }) => (
  <TiltCard className="!p-0">
    <div className={`absolute top-0 right-0 p-16 rounded-full blur-[40px] bg-gradient-to-br ${gradient} opacity-20 pointer-events-none`} />
    <div className="relative z-10">
      <div className={`w-8 h-8 rounded-lg bg-zinc-950 border border-white/10 flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-2xl font-black text-white tracking-tight mb-0.5">{value}</div>
      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</div>
    </div>
  </TiltCard>
);

const ProtocolCard = ({ title, level, progress, color, icon, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative p-4 bg-zinc-900/50 hover:bg-zinc-800/50 border border-white/5 rounded-xl transition-all cursor-pointer overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    <div className="flex justify-between items-start mb-3">
      <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-white/10 flex items-center justify-center text-lg shadow-inner">
        {icon}
      </div>
      <span className="text-[10px] font-bold bg-white/5 px-1.5 py-0.5 rounded text-zinc-400 border border-white/5">
        {level}
      </span>
    </div>
    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{title}</h3>
    <div className="w-full bg-zinc-950 rounded-full h-1 mt-3 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${progress}%` }}
        transition={{ duration: 1, delay: 0.2 }}
        className={`h-full ${color} shadow-[0_0_8px_currentColor]`}
      />
    </div>
  </div>
);

const SuggestionItem = ({ icon, name, tag }) => (
  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
    <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform text-sm">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate">{name}</div>
      <div className="text-[10px] text-zinc-500 truncate">{tag}</div>
    </div>
    <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-white" />
  </div>
);

export default Dashboard;