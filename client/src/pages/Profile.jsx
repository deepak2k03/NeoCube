import React, { useEffect, useState } from "react";
import { 
  User, Calendar, Award, Target, Clock, 
  Zap, Edit3, Save, X, Cpu, Shield, 
  Terminal, Activity, ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/common/Button";
import ProgressRing from "../components/common/ProgressRing";
import api from "../services/api";

const avatarPresets = [
  { id: "avatar1", label: "A", color: "#3b82f6" }, // primary blue
  { id: "avatar2", label: "B", color: "#ec4899" }, // pink
  { id: "avatar3", label: "C", color: "#10b981" }, // emerald
  { id: "avatar4", label: "D", color: "#f59e0b" }, // amber
];

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    experienceLevel: "Beginner",
    interestsText: "",
    avatarPreset: "avatar1",
    avatarColor: "#3b82f6",
  });

  // --- LOGIC: FETCH PROFILE ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const res = await api.get("/users/profile");
        const user = res.data?.data?.user || res.data?.user || res.data;

        setProfile(user);

        // Init form
        setFormData({
          name: user.name || "",
          bio: user.bio || "",
          experienceLevel: user.experienceLevel || "Beginner",
          interestsText: Array.isArray(user.interests) ? user.interests.join(", ") : "",
          avatarPreset: user.avatar?.presetOption || "avatar1",
          avatarColor: user.avatar?.color || "#3b82f6",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  // --- LOGIC: HANDLERS ---
  const handleEditClick = () => setIsEditing(true);
  
  const handleCancelEdit = () => {
    if (!profile) { setIsEditing(false); return; }
    setFormData({
      name: profile.name || "",
      bio: profile.bio || "",
      experienceLevel: profile.experienceLevel || "Beginner",
      interestsText: Array.isArray(profile.interests) ? profile.interests.join(", ") : "",
      avatarPreset: profile.avatar?.presetOption || "avatar1",
      avatarColor: profile.avatar?.color || "#3b82f6",
    });
    setIsEditing(false);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarPresetChange = (preset) => {
    const presetDef = avatarPresets.find((p) => p.id === preset);
    setFormData((prev) => ({
      ...prev,
      avatarPreset: preset,
      avatarColor: presetDef?.color || prev.avatarColor,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setIsSaving(true);
      const interestsArray = formData.interestsText.split(",").map((s) => s.trim()).filter(Boolean);

      const payload = {
        name: formData.name,
        bio: formData.bio,
        experienceLevel: formData.experienceLevel,
        interests: interestsArray,
        avatar: {
          type: "preset",
          presetOption: formData.avatarPreset,
          color: formData.avatarColor,
        },
      };

      const res = await api.put("/users/profile", payload);
      const updatedUser = res.data?.data?.user || res.data?.user || res.data || payload;

      setProfile(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // --- LOADING / ERROR STATES ---
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-primary font-mono animate-pulse">LOADING DOSSIER...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-2xl text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-white font-bold mb-2">Access Denied</h2>
          <p className="text-red-400">Could not retrieve user profile.</p>
        </div>
      </div>
    );
  }

  // --- DATA PREP ---
  const stats = profile.stats || {
    totalTechnologies: 0,
    completedTechnologies: 0,
    inProgressTechnologies: 0,
    totalHoursSpent: 0,
    streak: 0,
    level: 1,
  };

  const completionPct = stats.totalTechnologies > 0
    ? Math.round((stats.completedTechnologies / stats.totalTechnologies) * 100)
    : 0;

  // Mock Recent Progress (since API might not provide it yet)
  const recentProgress = [
    { technology: "React.js", progress: 68, lastUpdated: "2 days ago" },
    { technology: "Node.js", progress: 45, lastUpdated: "1 week ago" },
    { technology: "MongoDB", progress: 30, lastUpdated: "2 weeks ago" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden pt-28 pb-20 px-6">
      
      {/* 1. ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 2. HEADER */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2 font-mono text-xs tracking-widest uppercase">
              <User className="w-4 h-4" /> Operative Identification
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
              User <span className="text-gradient-primary">Dossier</span>
            </h1>
          </div>
          <div className="hidden md:block">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-textMuted flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SYSTEM ONLINE
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: IDENTITY CARD */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 relative overflow-hidden"
            >
              {/* Scan Line Animation */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-[scan_3s_ease-in-out_infinite] opacity-50" />

              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-6 group">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all" />
                  <div 
                    className="relative w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-white border-2 border-white/20 shadow-2xl z-10"
                    style={{ backgroundColor: profile.avatar?.color || "#3b82f6" }}
                  >
                    {profile.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-surface border border-white/10 px-2 py-1 rounded-lg text-xs font-bold text-white shadow-lg z-20">
                    LVL {stats.level}
                  </div>
                </div>

                {/* Info */}
                <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
                <p className="text-textMuted text-sm font-mono mb-4">{profile.email}</p>

                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className={`px-3 py-1 rounded border text-xs font-bold uppercase tracking-wide ${
                    profile.experienceLevel === 'Beginner' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                    profile.experienceLevel === 'Intermediate' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                    'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {profile.experienceLevel}
                  </span>
                  <span className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-300 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Unknown"}
                  </span>
                </div>

                {/* Bio Section */}
                <div className="w-full bg-black/20 rounded-xl p-4 text-left border border-white/5 mb-6">
                  <div className="text-xs font-mono text-gray-500 mb-2 uppercase">Bio / Directive</div>
                  <p className="text-sm text-gray-300 leading-relaxed italic">
                    "{profile.bio || "No directive established."}"
                  </p>
                </div>

                {/* Interests */}
                <div className="w-full text-left">
                   <div className="text-xs font-mono text-gray-500 mb-2 uppercase">Focus Areas</div>
                   <div className="flex flex-wrap gap-2">
                     {(profile.interests || []).length > 0 ? (
                       profile.interests.map((tag) => (
                         <span key={tag} className="px-2 py-1 rounded bg-secondary/10 border border-secondary/20 text-secondary text-xs">
                           {tag}
                         </span>
                       ))
                     ) : (
                       <span className="text-xs text-textMuted">No protocols defined.</span>
                     )}
                   </div>
                </div>

                <div className="w-full h-px bg-white/10 my-6" />

                <button 
                  onClick={handleEditClick}
                  className="w-full btn-neo flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" /> Update Credentials
                </button>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: STATS & EDITING */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* EDIT FORM OVERLAY (Shows when editing) */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-card border border-primary/30 overflow-hidden"
                >
                  <div className="p-6 bg-primary/5">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-primary" /> Modify User Data
                      </h3>
                      <button onClick={handleCancelEdit} className="text-textMuted hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-mono text-gray-400 uppercase">Full Name</label>
                          <input 
                            type="text" 
                            value={formData.name} 
                            onChange={e => handleFormChange("name", e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-mono text-gray-400 uppercase">Clearance Level</label>
                          <select 
                            value={formData.experienceLevel} 
                            onChange={e => handleFormChange("experienceLevel", e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary outline-none"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-400 uppercase">Directive (Bio)</label>
                        <textarea 
                          rows={2} 
                          value={formData.bio} 
                          onChange={e => handleFormChange("bio", e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-400 uppercase">Protocols (Interests)</label>
                        <input 
                          type="text" 
                          value={formData.interestsText} 
                          onChange={e => handleFormChange("interestsText", e.target.value)}
                          placeholder="e.g. React, Cybersecurity, Neural Networks"
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-primary outline-none"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-mono text-gray-400 uppercase">Avatar Matrix</label>
                        <div className="flex gap-3">
                          {avatarPresets.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => handleAvatarPresetChange(preset.id)}
                              className={`
                                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                                ${formData.avatarPreset === preset.id ? 'border-white scale-110 shadow-glow' : 'border-transparent opacity-70'}
                              `}
                              style={{ backgroundColor: preset.color }}
                            >
                              <span className="text-xs font-bold text-white">{preset.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                        <Button variant="ghost" type="button" onClick={handleCancelEdit}>Cancel</Button>
                        <button 
                          type="submit" 
                          disabled={isSaving}
                          className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" /> Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* HUD STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard icon={Target} label="Technologies" value={stats.totalTechnologies} color="text-blue-400" />
              <StatsCard icon={Clock} label="Uptime Hours" value={stats.totalHoursSpent} color="text-green-400" />
              <StatsCard icon={Award} label="Sync Streak" value={stats.streak} color="text-yellow-400" />
              <StatsCard icon={Zap} label="User Level" value={stats.level} color="text-purple-400" />
            </div>

            {/* PROGRESS MONITOR */}
            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-secondary" /> System Progress
                </h3>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Stats Text */}
                <div className="flex-1 grid grid-cols-2 gap-6 w-full">
                  <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                    <div className="text-xs text-gray-500 uppercase font-mono mb-1">Completed</div>
                    <div className="text-3xl font-bold text-white">{stats.completedTechnologies}</div>
                  </div>
                  <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                    <div className="text-xs text-gray-500 uppercase font-mono mb-1">In Progress</div>
                    <div className="text-3xl font-bold text-primary">{stats.inProgressTechnologies}</div>
                  </div>
                </div>

                {/* Progress Ring */}
                <div className="relative">
                  <ProgressRing 
                    percentage={completionPct} 
                    size={140} 
                    color="primary" 
                    showPercentage={true} 
                  />
                  {/* Decorative Glow behind ring */}
                  <div className="absolute inset-0 bg-primary/20 blur-2xl -z-10 rounded-full" />
                </div>
              </div>
            </div>

            {/* RECENT ACTIVITY LOG */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-gray-400" /> Activity Log
              </h3>
              
              <div className="space-y-3">
                {recentProgress.map((item, index) => (
                  <div key={index} className="group flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl hover:border-white/10 hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-surfaceHighlight flex items-center justify-center text-white border border-white/5">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-white font-medium group-hover:text-primary transition-colors">
                          {item.technology}
                        </div>
                        <div className="text-xs text-gray-500">Updated {item.lastUpdated}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-white">{item.progress}%</div>
                        <div className="text-[10px] text-gray-500 uppercase">Sync Status</div>
                      </div>
                      <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
                      </div>
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
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-surface/60 border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center backdrop-blur-sm hover:border-white/10 transition-colors group">
    <div className={`mb-2 p-2 rounded-full bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-[10px] uppercase tracking-wider text-textMuted mt-1">{label}</div>
  </div>
);

export default Profile;