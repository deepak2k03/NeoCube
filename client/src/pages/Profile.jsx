import React, { useEffect, useState, useRef } from "react";
import { 
  User, Calendar, Award, Target, Clock, Zap, Edit3, Save, X, 
  Cpu, Shield, Terminal, Activity, ChevronRight, Fingerprint, 
  Hash, Mail, Sparkles
} from "lucide-react";
import { 
  motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate 
} from "framer-motion";
import api from "../services/api";

// --- ASSETS & CONFIG ---
const AVATAR_PRESETS = [
  { id: "avatar1", label: "Alpha", color: "#3b82f6", gradient: "from-blue-600 to-cyan-400" },
  { id: "avatar2", label: "Beta", color: "#ec4899", gradient: "from-pink-600 to-rose-400" },
  { id: "avatar3", label: "Gamma", color: "#10b981", gradient: "from-emerald-600 to-teal-400" },
  { id: "avatar4", label: "Delta", color: "#f59e0b", gradient: "from-amber-600 to-orange-400" },
];

// --- 3D TILT CARD COMPONENT ---
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
        rotateX: useTransform(mouseY, [-50, 50], [2, -2]), 
        rotateY: useTransform(mouseX, [-50, 50], [-2, 2]), 
        transformStyle: "preserve-3d" 
      }}
      className={`relative group ${className}`}
    >
      <div style={{ transform: "translateZ(0px)" }} className="h-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden relative shadow-2xl transition-all duration-500">
        <motion.div
          style={{ background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.05), transparent 80%)` }}
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="relative z-10 h-full p-8">{children}</div>
      </div>
    </motion.div>
  );
};

// --- NEON PROGRESS RING ---
const NeonRing = ({ percentage, color = "#3b82f6" }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
      <svg className="transform -rotate-90 w-full h-full drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
        <circle cx="80" cy="80" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
        <circle
          cx="80" cy="80" r={radius} stroke={color} strokeWidth="8" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-3xl font-black">{percentage}%</span>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500">Synced</span>
      </div>
    </div>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "", bio: "", experienceLevel: "Beginner",
    interestsText: "", avatarPreset: "avatar1", avatarColor: "#3b82f6",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const res = await api.get("/users/profile");
        const user = res.data?.data?.user || res.data?.user || res.data;
        setProfile(user);
        setFormData({
          name: user.name || "", bio: user.bio || "",
          experienceLevel: user.experienceLevel || "Beginner",
          interestsText: Array.isArray(user.interests) ? user.interests.join(", ") : "",
          avatarPreset: user.avatar?.presetOption || "avatar1",
          avatarColor: user.avatar?.color || "#3b82f6",
        });
      } catch (err) { console.error("Failed to load profile:", err); } 
      finally { setIsLoadingProfile(false); }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const interestsArray = formData.interestsText.split(",").map((s) => s.trim()).filter(Boolean);
      const payload = {
        name: formData.name, bio: formData.bio,
        experienceLevel: formData.experienceLevel, interests: interestsArray,
        avatar: { type: "preset", presetOption: formData.avatarPreset, color: formData.avatarColor },
      };
      const res = await api.put("/users/profile", payload);
      setProfile(res.data?.data?.user || res.data?.user || payload);
      setIsEditing(false);
    } catch (err) { console.error("Update failed", err); } 
    finally { setIsSaving(false); }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-blue-500 animate-pulse">LOAD</div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const stats = profile.stats || { totalTechnologies: 0, completedTechnologies: 0, inProgressTechnologies: 0, totalHoursSpent: 0, streak: 0, level: 1 };
  const completionPct = stats.totalTechnologies > 0 ? Math.round((stats.completedTechnologies / stats.totalTechnologies) * 100) : 0;
  const recentProgress = [{ technology: "React.js", progress: 68, lastUpdated: "2d ago" }, { technology: "Node.js", progress: 45, lastUpdated: "1w ago" }, { technology: "MongoDB", progress: 30, lastUpdated: "2w ago" }];
  const currentAvatar = AVATAR_PRESETS.find(p => p.id === formData.avatarPreset) || AVATAR_PRESETS[0];

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-20 px-6 relative overflow-x-hidden font-sans selection:bg-indigo-500/30">
      
      {/* 1. CINEMATIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 2. HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-3 font-mono text-xs tracking-[0.2em] uppercase">
              <Fingerprint className="w-4 h-4" /> Operative Dossier
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
              User <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Profile</span>
            </h1>
          </div>
          <div className="px-4 py-2 rounded-full bg-zinc-900/50 border border-white/10 flex items-center gap-3 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
            <span className="text-xs font-bold text-zinc-300 tracking-wider">SECURE CONNECTION ESTABLISHED</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: HOLOGRAPHIC ID CARD --- */}
          <div className="lg:col-span-4 space-y-6">
            <TiltCard className="h-full">
               {/* Holographic Scan Effect */}
               <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.5)] animate-[scan_4s_ease-in-out_infinite] opacity-30 z-20 pointer-events-none" />
               
               <div className="flex flex-col items-center text-center relative z-10">
                  {/* Avatar Container */}
                  <div className="relative mb-8 group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div 
                      className="relative w-36 h-36 rounded-full flex items-center justify-center text-5xl font-black text-white border-4 border-zinc-950 shadow-2xl z-10 bg-gradient-to-br"
                      style={{ backgroundImage: `linear-gradient(135deg, ${currentAvatar.color}, #18181b)` }}
                    >
                      {profile.name?.charAt(0).toUpperCase()}
                      {/* Inner Ring */}
                      <div className="absolute inset-2 border border-white/20 rounded-full" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-zinc-950 border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-xl z-20 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-indigo-400" /> LVL {stats.level}
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">{profile.name}</h2>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm font-mono mb-6">
                    <Mail className="w-3 h-3" /> {profile.email}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                     <span className={`px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-wide ${
                        profile.experienceLevel === 'Beginner' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        profile.experienceLevel === 'Intermediate' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        {profile.experienceLevel}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {new Date(profile.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                  </div>

                  <div className="w-full bg-zinc-950/50 rounded-2xl p-4 text-left border border-white/5 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                    <div className="text-[10px] font-mono text-indigo-400 mb-2 uppercase tracking-widest">Directive / Bio</div>
                    <p className="text-sm text-zinc-300 leading-relaxed italic">
                      "{profile.bio || "No directive established. Operative is currently in stealth mode."}"
                    </p>
                  </div>

                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full py-4 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  >
                    <Edit3 className="w-4 h-4" /> {isEditing ? 'Close Interface' : 'Update Credentials'}
                  </button>
               </div>
            </TiltCard>
          </div>

          {/* --- RIGHT: DATA CENTER --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. EDIT INTERFACE (Collapsible) */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  className="overflow-hidden"
                >
                  <div className="bg-zinc-900/50 backdrop-blur-xl border border-indigo-500/30 rounded-[2rem] p-8 shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
                    
                    <div className="flex justify-between items-center mb-8">
                       <h3 className="text-xl font-bold text-white flex items-center gap-2">
                         <Cpu className="w-5 h-5 text-indigo-400" /> Neural Configuration
                       </h3>
                       <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-6">
                       <div className="grid md:grid-cols-2 gap-6">
                          <InputGroup label="Identity Name">
                             <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                               className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors font-mono text-sm" />
                          </InputGroup>
                          <InputGroup label="Clearance Level">
                             <select value={formData.experienceLevel} onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                               className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors font-mono text-sm appearance-none cursor-pointer">
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                             </select>
                          </InputGroup>
                       </div>

                       <InputGroup label="Primary Directive (Bio)">
                          <textarea rows={2} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors text-sm" />
                       </InputGroup>

                       <InputGroup label="Active Protocols (Interests)">
                          <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                            <input type="text" value={formData.interestsText} onChange={e => setFormData({...formData, interestsText: e.target.value})}
                              placeholder="e.g. React, Cybersecurity, Neural Networks"
                              className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors text-sm" />
                          </div>
                       </InputGroup>

                       <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 block">Avatar Matrix</label>
                          <div className="flex gap-4">
                             {AVATAR_PRESETS.map((preset) => (
                                <button key={preset.id} type="button" onClick={() => setFormData({...formData, avatarPreset: preset.id, avatarColor: preset.color})}
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${formData.avatarPreset === preset.id ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-50 hover:opacity-100 bg-zinc-800'}`}
                                  style={{ background: formData.avatarPreset === preset.id ? preset.color : undefined }}>
                                   {formData.avatarPreset === preset.id && <Sparkles className="w-5 h-5 text-white" />}
                                </button>
                             ))}
                          </div>
                       </div>

                       <div className="flex justify-end pt-4 border-t border-white/5">
                          <button type="submit" disabled={isSaving} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                             {isSaving ? <span className="animate-spin">⏳</span> : <Save className="w-4 h-4" />} Save Configuration
                          </button>
                       </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. STATS BENTO GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox icon={Target} label="Technologies" value={stats.totalTechnologies} color="text-cyan-400" />
              <StatBox icon={Clock} label="Uptime Hours" value={stats.totalHoursSpent} color="text-emerald-400" />
              <StatBox icon={Award} label="Sync Streak" value={stats.streak} color="text-amber-400" />
              <StatBox icon={Zap} label="User Level" value={stats.level} color="text-purple-400" />
            </div>

            {/* 3. PROGRESS MONITOR */}
            <TiltCard>
               <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-1 space-y-6 w-full">
                     <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                           <Activity className="w-5 h-5 text-indigo-400" /> System Completion
                        </h3>
                        <p className="text-zinc-400 text-sm">Overall synchronization across all active protocols.</p>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5">
                           <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Done</div>
                           <div className="text-2xl font-black text-white">{stats.completedTechnologies}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5">
                           <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Active</div>
                           <div className="text-2xl font-black text-indigo-400">{stats.inProgressTechnologies}</div>
                        </div>
                     </div>
                  </div>
                  <div className="relative">
                     <NeonRing percentage={completionPct} color="#6366f1" />
                  </div>
               </div>
            </TiltCard>

            {/* 4. TERMINAL LOGS */}
            <div className="bg-zinc-950/50 border border-white/10 rounded-[2rem] p-8 backdrop-blur-md relative overflow-hidden">
               <div className="flex items-center gap-2 mb-6 text-zinc-400 font-mono text-xs uppercase tracking-widest">
                  <Terminal className="w-4 h-4" /> System Logs_Recent_Activity
               </div>
               <div className="space-y-4">
                  {recentProgress.map((item, i) => (
                     <div key={i} className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all cursor-default">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-indigo-400 border border-white/5 font-mono text-sm">
                              0{i+1}
                           </div>
                           <div>
                              <div className="text-white font-bold group-hover:text-indigo-400 transition-colors">{item.technology}</div>
                              <div className="text-xs text-zinc-500 font-mono">UPDATED: {item.lastUpdated.toUpperCase()}</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="text-right hidden sm:block">
                              <div className="text-sm font-bold text-white">{item.progress}%</div>
                              <div className="text-[10px] text-zinc-600 uppercase">Synced</div>
                           </div>
                           <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                     </div>
                  ))}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const StatBox = ({ icon: Icon, label, value, color }) => (
  <div className="bg-zinc-900/40 border border-white/5 p-5 rounded-2xl flex flex-col items-center justify-center text-center backdrop-blur-md hover:bg-white/5 transition-colors group">
    <div className={`mb-3 p-3 rounded-xl bg-zinc-950 border border-white/10 ${color} group-hover:scale-110 transition-transform shadow-lg`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="text-2xl font-black text-white">{value}</div>
    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">{label}</div>
  </div>
);

const InputGroup = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">{label}</label>
    {children}
  </div>
);

export default Profile;