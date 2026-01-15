import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Command, Map, ChevronRight } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* 1. ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-12">
          
          {/* 2. TEXT CONTENT (No Graphic) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono tracking-[0.2em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Error: 404_Target_Missing
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
              Signal <span className="text-zinc-600 italic font-medium font-mono">LOST</span>
            </h1>
            
            <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed border-l border-white/10 pl-6 text-left md:text-center md:border-none md:pl-0">
              The coordinate you requested does not exist in the NeoCube neural network. 
              Redirecting protocols recommended.
            </p>
          </motion.div>
        </div>

        {/* 3. PRIMARY ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button 
            onClick={() => navigate('/dashboard')}
            className="h-12 px-8 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            <Home className="w-4 h-4" /> Go to Dashboard
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="h-12 px-8 rounded-full border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Initialize Step-back
          </button>
        </div>

        {/* 4. STRUCTURAL HELP PANEL */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <HelpLink 
            to="/technologies" 
            icon={Command} 
            title="Technology Radar" 
            desc="Explore all AI roadmaps." 
          />
          <HelpLink 
            to="/profile" 
            icon={Map} 
            title="Personal Atlas" 
            desc="Review your saved progress." 
          />
        </motion.div>

        {/* SYSTEM STATUS FOOTER */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Core System Nominal
          </div>
          <div className="hidden md:block w-px h-3 bg-white/10" />
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">
            Status: Connection_Closed
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: HELPFUL LINKS ---
const HelpLink = ({ to, icon: Icon, title, desc }) => (
  <Link 
    to={to} 
    className="group p-5 bg-neutral-900/40 border border-white/5 rounded-2xl hover:border-indigo-500/50 hover:bg-neutral-900 transition-all flex items-start gap-4"
  >
    <div className="p-2.5 rounded-xl bg-black border border-white/10 group-hover:text-indigo-400 transition-colors">
      <Icon className="w-5 h-5 text-zinc-500 group-hover:text-indigo-400" />
    </div>
    <div>
      <div className="text-sm font-bold text-zinc-200 flex items-center gap-2 group-hover:text-white transition-colors">
        {title} <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>
      <div className="text-xs text-zinc-500 mt-1">{desc}</div>
    </div>
  </Link>
);

export default NotFound;