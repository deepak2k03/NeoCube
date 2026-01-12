import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Layout, Target, Zap, Award, Sparkles, Clock, ChevronLeft } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import RoadmapStep from '../components/RoadmapStep';

const TechnologyDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [technology, setTechnology] = useState(null);
  const [userProgress, setUserProgress] = useState({ steps: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Technology Data
        const techRes = await axios.get(`http://localhost:5000/api/v1/technologies/${slug}`);
        const tech = techRes.data?.data?.technology;
        if (tech) setTechnology(tech);

        // 2. Fetch User Progress if logged in
        const token = localStorage.getItem('token');
        if (token && tech) {
          const userRes = await axios.get('http://localhost:5000/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const progress = userRes.data?.data?.progress?.find(p => p.technology === tech._id);
          if (progress) setUserProgress(progress);
        }
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleProgressUpdate = async (stepIndex, status, notes) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.error("Please login to save progress");

      // OPTIMISTIC UPDATE: Instant UI feedback
      setUserProgress(prev => {
        const newSteps = [...(prev?.steps || [])];
        const idx = newSteps.findIndex(s => s.stepIndex === stepIndex);
        const updated = { stepIndex, status, notes: notes ?? (newSteps[idx]?.notes || '') };
        if (idx >= 0) newSteps[idx] = updated;
        else newSteps.push(updated);
        return { ...prev, steps: newSteps };
      });

      // BACKEND SYNC
      await axios.put(
        `http://localhost:5000/api/v1/technologies/${slug}/progress`,
        { stepIndex, status, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (status === 'completed') toast.success("Step Mastered!", { icon: '🚀' });
    } catch (err) {
      toast.error("Cloud sync failed. Check connection.");
    }
  };

  const completedCount = userProgress?.steps?.filter(s => s.status === 'completed').length || 0;
  const totalCount = technology?.roadmap?.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  if (loading) return <div className="h-screen bg-zinc-950 flex items-center justify-center text-indigo-500 font-bold animate-pulse">Neural Link Established...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <Toaster position="bottom-right" />
      
      {/* Cinematic Header */}
      <div className="relative h-[45vh] flex items-end pb-16 overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_#4f46e5_0%,_transparent_30%)] opacity-20" />
        
        <div className="container mx-auto px-8 relative z-20">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition-all group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1" /> Back
          </button>
          <div className="flex gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">{technology?.category}</span>
            <span className="flex items-center gap-1.5 text-amber-400 text-[10px] font-black uppercase tracking-widest"><Sparkles className="w-3 h-3"/> {technology?.difficulty}</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter mb-4">{technology?.name}<span className="text-indigo-600">.</span></h1>
          <p className="text-zinc-400 max-w-2xl text-lg font-light leading-relaxed">{technology?.description}</p>
        </div>
      </div>

      {/* Content Grid */}
      <main className="container mx-auto px-8 -mt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-30">
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-3 mb-6"><Layout className="w-5 h-5 text-indigo-500"/> Project Curriculum</h2>
          {technology?.roadmap?.map((step, idx) => (
            <RoadmapStep key={idx} step={step} index={idx} userProgress={userProgress} onUpdate={handleProgressUpdate} />
          ))}
        </div>

        {/* Sticky Sidebar */}
        <aside className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-lg">Evolution Progress</h3>
              <Target className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="relative h-4 bg-zinc-800 rounded-full mb-4 overflow-hidden">
               <div className="absolute inset-y-0 left-0 bg-indigo-500 transition-all duration-1000 shadow-[0_0_20px_rgba(79,70,229,0.5)]" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex justify-between text-sm mb-10 text-zinc-500 font-bold uppercase tracking-widest">
              <span>{progressPercent}% Complete</span>
              <span className="text-indigo-400">{completedCount}/{totalCount} Modules</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-zinc-800/50 p-4 rounded-3xl border border-zinc-800"><Zap className="w-4 h-4 text-amber-500 mb-2"/><p className="text-[10px] text-zinc-500 font-bold uppercase">Time</p><p className="text-sm font-bold truncate">{technology?.estimatedTime || 'Self-paced'}</p></div>
              <div className="bg-zinc-800/50 p-4 rounded-3xl border border-zinc-800"><Award className="w-4 h-4 text-emerald-500 mb-2"/><p className="text-[10px] text-zinc-500 font-bold uppercase">Reward</p><p className="text-sm font-bold">Certification</p></div>
            </div>
            <button className="w-full bg-white text-zinc-950 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all active:scale-[0.98]">Continue Journey</button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default TechnologyDetail;