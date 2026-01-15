import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Flame, Zap, Activity, ChevronRight, Cpu, Star, ArrowUpRight, Globe, Command, Layout } from 'lucide-react';

const NeoCard = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`relative overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm p-6 transition-all duration-300 group ${onClick ? 'cursor-pointer hover:bg-neutral-800/60 hover:border-white/10 hover:shadow-2xl' : ''} ${className}`}>
    {children}
  </div>
);

const StatBox = ({ label, value, icon: Icon, color }) => (
  <NeoCard className="flex flex-col justify-between h-full">
    <div className="flex items-start justify-between mb-4"><div className={`p-2.5 rounded-lg bg-white/5 ${color}`}><Icon className="w-5 h-5" /></div></div>
    <div><div className="text-3xl font-bold text-white tracking-tight">{value}</div><div className="text-xs text-neutral-500 font-mono uppercase tracking-wider mt-1">{label}</div></div>
  </NeoCard>
);

const ProtocolItem = ({ title, level, progress, color, icon: Icon, onClick }) => (
  <div onClick={onClick} className="group relative p-5 bg-neutral-900/50 hover:bg-neutral-800 border border-white/5 rounded-xl transition-all cursor-pointer overflow-hidden">
    <div className="flex justify-between items-start mb-4"><div className="w-10 h-10 rounded-lg bg-neutral-950 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors"><Icon className="w-5 h-5" /></div><span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded text-neutral-400 border border-white/5">{level}</span></div>
    <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
    <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono mb-2"><span>PROGRESS</span><span>{progress}%</span></div>
    <div className="w-full bg-neutral-950 rounded-full h-1 overflow-hidden"><div className={`h-full ${color} shadow-[0_0_10px_currentColor]`} style={{ width: `${progress}%` }} /></div>
  </div>
);

const SuggestionItem = ({ icon, name, tag }) => (
  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
    <div className="w-10 h-10 rounded-lg bg-neutral-950 border border-white/10 flex items-center justify-center text-lg">{icon}</div>
    <div className="flex-1 min-w-0"><div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">{name}</div><div className="text-[10px] text-neutral-500 font-mono truncate">{tag}</div></div>
    <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
  </div>
);

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
    <div className="min-h-screen bg-[#030712] text-white pt-6 pb-20 font-sans relative w-full overflow-x-hidden">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/4 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="w-full px-6 md:px-8 xl:px-12 relative z-10 space-y-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-indigo-400 mb-3 font-mono text-xs tracking-[0.2em] uppercase">
              <Zap className="w-4 h-4" /> SYSTEM_ONLINE • {today}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl font-black text-white leading-tight">
              {greeting}, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{user?.name?.split(' ')[0] || 'Operative'}</span>
            </motion.h1>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-4 bg-zinc-900/50 border border-white/5 p-2 pr-6 rounded-full backdrop-blur-md">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center border border-white/5 text-orange-500"><Flame className={`w-6 h-6 ${streak > 0 ? 'fill-orange-500 animate-bounce' : ''}`} /></div>
            <div><div className="text-2xl font-bold text-white leading-none">{streak}</div><div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Day Streak</div></div>
          </motion.div>
        </div>

        {/* STATS */}
        {/* Responsive: 1 col (mobile) -> 4 col (desktop xl) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatBox label="Active Modules" value={userStats.inProgressTechnologies ?? 3} icon={Cpu} color="text-blue-400" />
          <StatBox label="Nodes Cleared" value={userStats.completedSteps ?? 24} icon={Target} color="text-emerald-400" />
          <StatBox label="Global Rank" value="#842" icon={Trophy} color="text-yellow-400" />
          <StatBox label="System Sync" value={`${userStats.overallProgress ?? 68}%`} icon={Activity} color="text-purple-400" />
        </div>

        {/* MAIN LAYOUT */}
        {/* grid-cols-1 (Mobile/Tablet) -> xl:grid-cols-4 (Desktop) */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 xl:gap-8">
          
          <div className="xl:col-span-3 space-y-6">
            <NeoCard className="p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div><h2 className="text-2xl font-bold text-white flex items-center gap-3"><Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" /> Active Protocols</h2><p className="text-zinc-400 text-sm mt-1">Resume where you left off.</p></div>
                <button onClick={() => navigate('/technologies')} className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10 transition-colors flex items-center gap-2">VIEW RADAR <ArrowUpRight className="w-3 h-3" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProtocolItem title="React.js Architecture" level="Level 4" progress={68} color="bg-blue-500" icon={Layout} onClick={() => navigate('/technologies/reactjs')} />
                <ProtocolItem title="Node.js Scalability" level="Level 2" progress={45} color="bg-emerald-500" icon={Globe} onClick={() => navigate('/technologies/nodejs')} />
              </div>
            </NeoCard>
            <NeoCard className="p-8">
              <div className="flex items-center gap-3 mb-8"><div className="p-2 bg-pink-500/10 rounded-lg"><TrendingUp className="w-5 h-5 text-pink-500" /></div><div><h2 className="text-lg font-bold text-white">Neural Activity</h2><p className="text-zinc-500 text-xs">Commit frequency over 7 days</p></div></div>
              <div className="flex items-end justify-between h-40 gap-2 sm:gap-4 px-2">
                {[35, 60, 25, 80, 55, 90, 45].map((h, i) => (<div key={i} className="w-full relative group"><div className="w-full bg-zinc-800 rounded-t-sm group-hover:bg-blue-500 transition-all duration-500" style={{ height: `${h}%` }} /></div>))}
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-mono text-zinc-600 uppercase"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
            </NeoCard>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <NeoCard><h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Command className="w-3 h-3" /> Recommended</h3><div className="space-y-2"><SuggestionItem icon="🐍" name="Python" tag="Data Science" /><SuggestionItem icon="🐳" name="Docker" tag="DevOps" /><SuggestionItem icon="☁️" name="AWS" tag="Cloud Architecture" /></div></NeoCard>
            <div className="relative overflow-hidden rounded-2xl p-8 border border-white/10 group cursor-pointer bg-zinc-900/40"><div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 group-hover:opacity-100 transition-opacity" /><div className="relative z-10"><div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30 mb-4 text-indigo-400"><Star className="w-5 h-5 fill-indigo-400" /></div><h3 className="text-lg font-bold text-white mb-2">Upgrade to Pro</h3><p className="text-zinc-400 text-sm mb-6 leading-relaxed">Unlock Layer 2 protocols and access advanced architect certs.</p><button className="w-full py-3 bg-white text-black text-sm font-bold rounded-lg hover:bg-neutral-200 transition-colors">Upgrade Now</button></div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;