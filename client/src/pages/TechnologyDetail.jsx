import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import { 
  Layout, Target, Zap, Award, Sparkles, ChevronLeft, 
  CheckCircle2, Lock, Unlock, PlayCircle, BookOpen, 
  Terminal, Shield, Trophy
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// --- SUB-COMPONENT: The Resource Card ---
const ResourceCard = ({ resource }) => {
  const icons = {
    article: <BookOpen className="w-4 h-4" />,
    video: <PlayCircle className="w-4 h-4" />,
    quest: <Shield className="w-4 h-4" />,
    'pro-tip': <Sparkles className="w-4 h-4" />,
    interview: <Terminal className="w-4 h-4" />
  };

  return (
    <a 
      href={resource.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 hover:border-indigo-500/30 transition-all duration-300"
    >
      <div className={`p-2 rounded-lg ${resource.type === 'quest' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
        {icons[resource.type] || <BookOpen className="w-4 h-4" />}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
          {resource.title}
        </h4>
        <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-bold">
          {resource.type.replace('-', ' ')}
        </span>
      </div>
      <div className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-indigo-400">
        →
      </div>
    </a>
  );
};

const TechnologyDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [technology, setTechnology] = useState(null);
  const [userProgress, setUserProgress] = useState({ steps: [] });
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0); // Tracks which step is expanded

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const techRes = await api.get(`/technologies/${slug}`);
        const tech = techRes.data?.data?.technology;
        
        if (tech) {
          setTechnology(tech);
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const userRes = await api.get('/auth/me', { _skipAuthRedirect: true });
              const user = userRes.data?.data?.user;
              const progress = user?.progress?.find(p => {
                const pTechId = p.technology?._id || p.technology;
                return pTechId?.toString() === tech._id?.toString();
              });
              if (progress) setUserProgress(progress);
            } catch (authErr) {
              if (authErr.response?.status === 401) {
                localStorage.removeItem('token');
              }
            }
          }
        }
      } catch (err) {
        if (err.response?.status !== 401) {
          toast.error("Could not load roadmap.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleStatusUpdate = async (stepIndex, newStatus) => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error("Login to track progress");

    const previousProgress = { ...userProgress };
    
    // Optimistic Update
    setUserProgress(prev => {
      const newSteps = [...(prev?.steps || [])];
      const idx = newSteps.findIndex(s => s.stepIndex === stepIndex);
      const updatedStep = { 
        stepIndex, 
        status: newStatus, 
        notes: newSteps[idx]?.notes || '' 
      };
      
      if (idx >= 0) newSteps[idx] = updatedStep;
      else newSteps.push(updatedStep);
      
      return { ...prev, steps: newSteps };
    });

    try {
      await api.put(`/technologies/${slug}/progress`, 
        { stepIndex, status: newStatus },
        { _skipAuthRedirect: true }
      );
      if (newStatus === 'completed') {
        toast.success("Unit Complete! +50 XP", {
            style: { background: '#10b981', color: '#fff' },
            icon: '⚡'
        });
      }
    } catch (err) {
      setUserProgress(previousProgress);
      toast.error("Sync failed");
    }
  };

  // --- Calculations ---
  const completedCount = userProgress?.steps?.filter(s => s.status === 'completed').length || 0;
  const totalCount = technology?.roadmap?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const currentXP = completedCount * 150;

  if (loading) return (
    <div className="h-screen bg-[#030712] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-6" />
      <div className="text-zinc-500 font-mono text-sm tracking-widest animate-pulse">DECODING MATRIX...</div>
    </div>
  );

  if (!technology) return <div className="h-screen bg-[#030712] flex items-center justify-center text-zinc-500">Subject Not Found</div>;

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 selection:bg-indigo-500/30">
      <Toaster position="bottom-center" />

      {/* --- HERO HEADER --- */}
      <div className="relative pt-32 pb-20 px-6 border-b border-white/5 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(circle_at_50%_0%,_rgba(79,70,229,0.15),_transparent_70%)] pointer-events-none" />
        <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[100px] animate-pulse-slow" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white mb-8 transition-colors"
          >
            <div className="p-1 rounded-md bg-white/5 group-hover:bg-indigo-500/20 transition-colors">
               <ChevronLeft className="w-4 h-4" />
            </div>
            <span>RETURN TO RADAR</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                  <Target className="w-3 h-3" />
                  {technology.sector || 'General'} Protocol
               </div>
               <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-zinc-500">
                  {technology.name}
               </h1>
               <p className="text-zinc-400 max-w-2xl text-lg leading-relaxed">
                  {technology.description}
               </p>
            </div>

            {/* Header Stats */}
            <div className="flex gap-4">
                <div className="px-6 py-4 bg-zinc-900/50 border border-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Current XP</div>
                    <div className="text-2xl font-black text-white flex items-center gap-2">
                        {currentXP.toLocaleString()} <span className="text-amber-500 text-sm">XP</span>
                    </div>
                </div>
                <div className="px-6 py-4 bg-zinc-900/50 border border-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Completion</div>
                    <div className="text-2xl font-black text-indigo-400">
                        {progressPercent}%
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <main className="container mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: Progress Timeline (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2 mb-6 flex items-center gap-2">
                <Layout className="w-4 h-4" /> Learning Nodes
            </h3>
            
            <div className="relative pl-4 border-l border-white/5 space-y-8">
                {technology.roadmap?.map((step, index) => {
                    const stepStatus = userProgress?.steps?.find(s => s.stepIndex === index)?.status || 'pending';
                    const isCompleted = stepStatus === 'completed';
                    const isActive = activeStep === index;
                    const isLocked = index > 0 && userProgress?.steps?.find(s => s.stepIndex === index - 1)?.status !== 'completed';

                    return (
                        <div key={index} className="relative group">
                            {/* Connector Node */}
                            <div className={`
                                absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 transition-all duration-300 z-10
                                ${isActive ? 'bg-indigo-500 border-indigo-500 scale-125' : 
                                  isCompleted ? 'bg-zinc-900 border-indigo-500' : 'bg-zinc-900 border-zinc-700'}
                            `} />
                            
                            <button 
                                onClick={() => !isLocked && setActiveStep(index)}
                                disabled={isLocked}
                                className={`
                                    w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden
                                    ${isActive 
                                        ? 'bg-indigo-600/10 border-indigo-500/50 shadow-[0_0_30px_rgba(79,70,229,0.1)]' 
                                        : 'bg-zinc-900/30 border-white/5 hover:border-white/10 hover:bg-zinc-800/50'}
                                    ${isLocked ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-[10px] font-mono text-zinc-500 mb-1">NODE_{String(index + 1).padStart(2, '0')}</div>
                                        <h4 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                                            {step.title}
                                        </h4>
                                    </div>
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : 
                                     isLocked ? <Lock className="w-4 h-4 text-zinc-600" /> :
                                     <div className="w-4 h-4 rounded-full border border-zinc-600" />
                                    }
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* RIGHT COLUMN: Active Detail View (8 Cols) */}
        <div className="lg:col-span-8">
            <AnimatePresence mode='wait'>
                {technology.roadmap && technology.roadmap[activeStep] && (
                    <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 md:p-10 backdrop-blur-xl relative overflow-hidden"
                    >
                        {/* Background Deco */}
                        <div className="absolute top-0 right-0 p-40 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />

                        {/* Step Header */}
                        <div className="relative z-10 mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-lg bg-zinc-800 text-xs font-mono text-zinc-400">
                                    {technology.roadmap[activeStep].duration || '1h 30m'}
                                </span>
                                {userProgress?.steps?.find(s => s.stepIndex === activeStep)?.status === 'completed' && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                                        <CheckCircle2 className="w-3 h-3" /> COMPLETED
                                    </span>
                                )}
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">{technology.roadmap[activeStep].title}</h2>
                            <p className="text-zinc-400 leading-relaxed text-lg">
                                {technology.roadmap[activeStep].description}
                            </p>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-zinc-500 font-bold uppercase">Reward</div>
                                    <div className="font-bold text-white">150 XP</div>
                                </div>
                            </div>

                            {userProgress?.steps?.find(s => s.stepIndex === activeStep)?.status === 'completed' ? (
                                <button 
                                    onClick={() => handleStatusUpdate(activeStep, 'pending')}
                                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-colors"
                                >
                                    MARK AS INCOMPLETE
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleStatusUpdate(activeStep, 'completed')}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all active:scale-95 flex items-center gap-2"
                                >
                                    COMPLETE MODULE <Trophy className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Resources Grid */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <BookOpen className="w-4 h-4" /> Required Materials
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {technology.roadmap[activeStep].resources?.map((res, idx) => (
                                    <ResourceCard key={idx} resource={res} />
                                ))}
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>

      </main>
    </div>
  );
};

export default TechnologyDetail;