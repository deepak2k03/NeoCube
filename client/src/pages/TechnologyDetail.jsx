import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// ✅ FIX: Import custom API service
import api from '../services/api'; 
import { Layout, Target, Zap, Award, Sparkles, ChevronLeft } from 'lucide-react';
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
        
        // 1. Fetch Technology (Public Data)
        // ✅ FIX: Use 'api.get' with relative path
        const techRes = await api.get(`/technologies/${slug}`);
        const tech = techRes.data?.data?.technology;
        
        if (tech) {
          setTechnology(tech);

          // 2. Fetch User Progress (Optional Authentication)
          const token = localStorage.getItem('token');
          if (token) {
            try {
              // ✅ FIX: Pass '_skipAuthRedirect: true'
              // This tells api.js: "If this fails, don't redirect to login. Just let me handle it."
              const userRes = await api.get('/auth/me', {
                _skipAuthRedirect: true
              });
              
              const user = userRes.data?.data?.user;
              const progress = user?.progress?.find(p => {
                const pTechId = p.technology?._id || p.technology;
                return pTechId?.toString() === tech._id?.toString();
              });
              
              if (progress) setUserProgress(progress);
            } catch (authErr) {
              // Graceful Fallback: If 401, just stay as guest
              if (authErr.response?.status === 401) {
                console.warn("Token expired. Switching to Guest Mode.");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // We do NOT redirect here. The user just sees the page without progress.
              }
            }
          }
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        const errorMsg = err.response?.data?.message || "Could not load roadmap data.";
        // Only show error toast if it wasn't a 401 (api.js handles standard 401s)
        if (err.response?.status !== 401) {
          toast.error(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleProgressUpdate = async (stepIndex, status, notes) => {
    // 1. CLIENT-SIDE CHECK: Are we logged in?
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error("Please login to track your progress", { icon: '🔒' });
      // Optional: Redirect to login immediately
      // navigate('/login'); 
      return; 
    }

    // 2. Optimistic UI Update
    const previousProgress = { ...userProgress };
    setUserProgress(prev => {
      const newSteps = [...(prev?.steps || [])];
      const idx = newSteps.findIndex(s => s.stepIndex === stepIndex);
      const updatedStep = { stepIndex, status, notes: notes ?? (newSteps[idx]?.notes || '') };
      
      if (idx >= 0) newSteps[idx] = updatedStep;
      else newSteps.push(updatedStep);
      
      return { ...prev, steps: newSteps };
    });

    try {
      // 3. Send Request (with skip redirect flag)
      await api.put(`/technologies/${slug}/progress`, 
        { stepIndex, status, notes },
        { _skipAuthRedirect: true } // Don't force redirect if token is bad
      );
      
      if (status === 'completed') toast.success("Module Mastered!", { icon: '🚀' });

    } catch (err) {
      // 4. Revert UI on failure
      setUserProgress(previousProgress);

      // 5. Handle Specific 401 Error
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // navigate('/login'); // Uncomment if you want to force them to login page
      } else {
        toast.error("Sync failed. Changes not saved.");
      }
    }
  };
  const completedCount = userProgress?.steps?.filter(s => s.status === 'completed').length || 0;
  const totalCount = technology?.roadmap?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading) return (
    <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center text-indigo-500">
      <div className="animate-pulse text-2xl font-bold tracking-widest mb-4">DECRYPTING ROADMAP...</div>
      <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 animate-progress"></div>
      </div>
    </div>
  );

  if (!technology) return <div className="h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Technology not found.</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' } }} />
      
      <div className="relative min-h-[45vh] flex items-end pb-16 overflow-hidden border-b border-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_#4f46e5_0%,_transparent_30%)] opacity-20" />
        
        <div className="container mx-auto px-6 md:px-8 relative z-20">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-all group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1" /> Back to Radar
          </button>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">{technology.category}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white">
            {technology.name}<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl text-lg font-light leading-relaxed line-clamp-3">
            {technology.description}
          </p>
        </div>
      </div>

      <main className="container mx-auto px-6 md:px-8 -mt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-30">
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-3 mb-8 text-zinc-100">
            <Layout className="w-5 h-5 text-indigo-500"/> Project Curriculum
          </h2>
          {/* SAFE RENDER: Checks if roadmap exists before mapping */}
          {technology.roadmap && technology.roadmap.length > 0 ? (
            technology.roadmap.map((step, idx) => (
              <RoadmapStep key={idx} step={step} index={idx} userProgress={userProgress} onUpdate={handleProgressUpdate} />
            ))
          ) : (
            <div className="p-10 border border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500">
              <p className="mb-2 font-bold text-white">Roadmap Initialization Failed</p>
              <p className="text-sm">The AI could not generate this roadmap. Please check the server console logs.</p>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-8 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl shadow-indigo-500/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-lg text-white">Evolution Progress</h3>
              <Target className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="relative h-3 bg-zinc-800 rounded-full mb-4 overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-indigo-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex justify-between text-xs mb-10 text-zinc-500 font-bold uppercase tracking-widest">
              <span>{progressPercent}% Complete</span>
              <span className="text-indigo-400">{completedCount}/{totalCount} Modules</span>
            </div>
            <button className="w-full bg-zinc-100 text-zinc-950 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] transition-all active:scale-[0.98]">
              {progressPercent === 100 ? 'Claim Certificate' : 'Continue Journey'}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default TechnologyDetail;