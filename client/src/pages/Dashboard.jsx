import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  BookOpen, Trophy, Target, TrendingUp, Flame,
  Clock, Zap, Award, Play, ChevronRight, Star,
  Activity, Calendar, ArrowUpRight
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Safely derive stats
  const userStats = user?.stats || {};
  const streak = user?.streak ?? userStats.streak ?? 0;

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden pt-28 pb-20 px-6">
      
      {/* 1. ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 2. HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 text-primary mb-2 font-mono text-xs tracking-widest uppercase">
              <Activity className="w-4 h-4" /> System Overview
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
              Welcome back, <span className="text-gradient-primary">{user?.name || 'Operative'}</span>
            </h1>
            <p className="text-textMuted mt-2 max-w-xl">
              Your learning neural network is active. Systems nominal.
            </p>
          </div>

          {/* Streak Badge (Floating) */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="group relative px-6 py-3 bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-4 shadow-lg hover:border-orange-500/50 transition-colors"
          >
            <div className="absolute inset-0 bg-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
              <Flame className={`w-6 h-6 ${streak > 0 ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white leading-none">{streak}</div>
              <div className="text-[10px] text-orange-400 font-mono uppercase tracking-wider">Day Streak</div>
            </div>
          </motion.div>
        </motion.div>

        {/* 3. STATS HUD */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          <StatCard 
            title="Active Modules" 
            value={String(userStats.inProgressTechnologies ?? 3)} 
            icon={BookOpen} 
            color="text-blue-400" 
            trend="+1 New"
          />
          <StatCard 
            title="Nodes Cleared" 
            value={String(userStats.completedSteps ?? 24)} 
            icon={Target} 
            color="text-green-400" 
            trend="+8 This Week"
          />
          <StatCard 
            title="Sync Streak" 
            value={`${streak} Days`} 
            icon={Trophy} 
            color="text-yellow-400" 
            trend="Record High"
          />
          <StatCard 
            title="Overall Sync" 
            value={`${userStats.overallProgress ?? 68}%`} 
            icon={TrendingUp} 
            color="text-purple-400" 
            trend="+5% Gain"
          />
        </motion.div>

        {/* 4. MAIN DASHBOARD GRID */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: ACTIVE LEARNING (2/3 width) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Continue Learning Section */}
            <div className="glass-card p-6 border-l-4 border-l-primary">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" /> Active Protocols
                </h2>
                <button 
                  onClick={() => navigate('/technologies')}
                  className="text-xs font-mono text-primary hover:text-white transition-colors"
                >
                  VIEW ALL &gt;
                </button>
              </div>

              <div className="space-y-4">
                <CourseProgress 
                  title="React.js" 
                  subtitle="Frontend • Intermediate" 
                  progress={68} 
                  icon="⚛️" 
                  color="bg-blue-500"
                  onClick={() => navigate('/technologies/reactjs')}
                />
                <CourseProgress 
                  title="Node.js" 
                  subtitle="Backend • Intermediate" 
                  progress={45} 
                  icon="🟢" 
                  color="bg-green-500"
                  onClick={() => navigate('/technologies/nodejs')}
                />
                <CourseProgress 
                  title="MongoDB" 
                  subtitle="Database • Beginner" 
                  progress={30} 
                  icon="🍃" 
                  color="bg-emerald-500"
                  onClick={() => navigate('/technologies/mongodb')}
                />
              </div>
            </div>

            {/* Weekly Activity Graph (Visual Mock) */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Activity Log</h2>
              </div>
              <div className="flex items-end justify-between h-32 gap-2">
                {[40, 70, 35, 90, 60, 80, 50].map((h, i) => (
                  <div key={i} className="w-full bg-white/5 rounded-t-lg relative group hover:bg-primary/20 transition-colors">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="absolute bottom-0 w-full bg-gradient-to-t from-primary/10 to-primary rounded-t-lg"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs font-mono text-gray-500 uppercase">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: SIDEBAR (1/3 width) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Recommended */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-400" /> Suggested Ops
              </h3>
              <div className="space-y-3">
                <RecommendedItem 
                  icon="🐍" 
                  name="Python" 
                  match="98%" 
                  tag="Data Science"
                />
                <RecommendedItem 
                  icon="🐳" 
                  name="Docker" 
                  match="92%" 
                  tag="DevOps"
                />
                <RecommendedItem 
                  icon="🧠" 
                  name="Neural Nets" 
                  match="88%" 
                  tag="AI/ML"
                />
              </div>
            </div>

            {/* Achievements */}
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl" />
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                <Trophy className="w-4 h-4 text-yellow-400" /> Recent Awards
              </h3>
              <div className="space-y-4 relative z-10">
                <div className="flex gap-3 items-center p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-500">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Ignition</div>
                    <div className="text-[10px] text-gray-400">7 Day Streak</div>
                  </div>
                </div>
                <div className="flex gap-3 items-center p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Fast Learner</div>
                    <div className="text-[10px] text-gray-400">Top 10% Speed</div>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS (Clean & Reusable) ---

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 }
    }}
    whileHover={{ y: -5 }}
    className="glass-card p-5 border border-white/10 hover:border-white/20 transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-mono text-gray-500 bg-black/20 px-2 py-1 rounded border border-white/5">
        {trend}
      </span>
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-xs text-textMuted uppercase tracking-wider">{title}</div>
  </motion.div>
);

const CourseProgress = ({ title, subtitle, progress, icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all cursor-pointer"
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-surfaceHighlight flex items-center justify-center text-xl shadow-lg border border-white/5 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h4 className="text-white font-bold group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-lg font-bold text-white">{progress}%</span>
      </div>
    </div>
    <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${color} shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
      />
    </div>
  </div>
);

const RecommendedItem = ({ icon, name, match, tag }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer group">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded bg-surfaceHighlight flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{name}</div>
        <div className="text-[10px] text-gray-500">{tag}</div>
      </div>
    </div>
    <div className="text-xs font-mono text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
      {match} Match
    </div>
  </div>
);

export default Dashboard;