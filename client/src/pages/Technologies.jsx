import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate 
} from 'framer-motion';
import { 
  Search, ChevronRight, ChevronDown, Loader, X, Layers, LayoutGrid, 
  Database, Zap, Activity, Globe, Cpu, Server, Shield, 
  FlaskConical, Anchor, Plane, Hammer, Stethoscope, Scale, Palette
} from 'lucide-react';
import * as LucideIcons from 'lucide-react'; 
import api from '../services/api';
import { DOMAINS, FIELDS } from '../data/fieldsData'; 

// ==========================================
// 1. SMART FALLBACK DATA (For Empty Sectors)
// ==========================================
const FALLBACK_DB = {
  // ENGINEERING
  ee: [
    { _id: 'e1', name: 'Embedded Systems', category: 'Hardware', icon: 'Cpu', slug: 'embedded' },
    { _id: 'e2', name: 'VLSI Design', category: 'Chip Arch', icon: 'Microchip', slug: 'vlsi' },
    { _id: 'e3', name: 'IoT Protocols', category: 'Connectivity', icon: 'Wifi', slug: 'iot' },
    { _id: 'e4', name: 'Power Systems', category: 'Energy', icon: 'Zap', slug: 'power-sys' },
  ],
  me: [
    { _id: 'm1', name: 'Robotics', category: 'Automation', icon: 'Bot', slug: 'robotics' },
    { _id: 'm2', name: 'Thermodynamics', category: 'Physics', icon: 'Flame', slug: 'thermo' },
    { _id: 'm3', name: 'CAD/CAM', category: 'Design', icon: 'PenTool', slug: 'cad' },
    { _id: 'm4', name: 'Aerodynamics', category: 'Fluids', icon: 'Wind', slug: 'aero' },
  ],
  civil: [
    { _id: 'c1', name: 'Structural Eng', category: 'Construction', icon: 'Building', slug: 'structural' },
    { _id: 'c2', name: 'Urban Planning', category: 'Design', icon: 'Map', slug: 'urban' },
    { _id: 'c3', name: 'Geotech', category: 'Soil', icon: 'Mountain', slug: 'geotech' },
  ],
  // BUSINESS
  finance: [
    { _id: 'f1', name: 'Algorithmic Trading', category: 'FinTech', icon: 'TrendingUp', slug: 'algo-trade' },
    { _id: 'f2', name: 'Risk Management', category: 'Analysis', icon: 'ShieldAlert', slug: 'risk' },
    { _id: 'f3', name: 'Blockchain Finance', category: 'Crypto', icon: 'Bitcoin', slug: 'defi' },
  ],
  marketing: [
    { _id: 'mk1', name: 'SEO Optimization', category: 'Digital', icon: 'Search', slug: 'seo' },
    { _id: 'mk2', name: 'Brand Strategy', category: 'Creative', icon: 'Megaphone', slug: 'brand' },
    { _id: 'mk3', name: 'Growth Hacking', category: 'Analytics', icon: 'Rocket', slug: 'growth' },
  ],
  // MEDICINE
  clinical: [
    { _id: 'med1', name: 'Cardiology', category: 'Specialty', icon: 'Heart', slug: 'cardio' },
    { _id: 'med2', name: 'Neurology', category: 'Brain', icon: 'Brain', slug: 'neuro' },
    { _id: 'med3', name: 'Robotic Surgery', category: 'Tech', icon: 'Scissors', slug: 'surgery' },
  ],
  // LAW
  legal: [
    { _id: 'l1', name: 'Corporate Law', category: 'Business', icon: 'Briefcase', slug: 'corp-law' },
    { _id: 'l2', name: 'IP Rights', category: 'Protection', icon: 'Copyright', slug: 'ip-law' },
    { _id: 'l3', name: 'Cyber Law', category: 'Digital', icon: 'Lock', slug: 'cyber-law' },
  ],
  // CREATIVE
  design: [
    { _id: 'd1', name: '3D Modeling', category: 'Visual', icon: 'Box', slug: '3d-model' },
    { _id: 'd2', name: 'Motion Graphics', category: 'Animation', icon: 'Film', slug: 'motion' },
    { _id: 'd3', name: 'Typography', category: 'Print', icon: 'Type', slug: 'typo' },
  ],
  // SPACE
  physics: [
    { _id: 'p1', name: 'Quantum Mechanics', category: 'Theoretical', icon: 'Atom', slug: 'quantum' },
    { _id: 'p2', name: 'Astrophysics', category: 'Space', icon: 'Star', slug: 'astro' },
    { _id: 'p3', name: 'Particle Physics', category: 'Research', icon: 'Microscope', slug: 'particle' },
  ]
};

// --- 2. REUSABLE 3D TILT CARD ---
const TiltCard = ({ children, className = "", onClick }) => {
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
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ 
        rotateX: useTransform(mouseY, [-50, 50], [3, -3]), 
        rotateY: useTransform(mouseX, [-50, 50], [-3, 3]), 
        transformStyle: "preserve-3d" 
      }}
      className={`relative group cursor-pointer ${className}`}
    >
      <div style={{ transform: "translateZ(0px)" }} className="h-full bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden relative shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/10 transition-all duration-500">
        <motion.div
          style={{ background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.05), transparent 80%)` }}
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="relative z-10 h-full p-6">{children}</div>
      </div>
    </motion.div>
  );
};

const Technologies = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 1. Get Context & Theme Colors
  const currentSectorId = searchParams.get('sector') || 'cs';
  const currentSector = FIELDS.find(f => f.id === currentSectorId) || FIELDS[0];
  const parentDomain = DOMAINS.find(d => d.sectors.some(s => s.id === currentSectorId)) || DOMAINS[0];

  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDomains, setOpenDomains] = useState([parentDomain.id]);

  useEffect(() => {
    const fetchTechnologies = async () => {
      setLoading(true);
      try {
        // A. Try Fetching from API
        const { data } = await api.get('/technologies', {
          params: { fieldId: currentSectorId, search: searchQuery || undefined }
        });
        
        // B. If API returns empty, use Fallback Data
        if (data.data.technologies.length === 0 && !searchQuery) {
          console.log(`No API data for ${currentSectorId}. Using fallback.`);
          setTechnologies(FALLBACK_DB[currentSectorId] || []);
        } else {
          setTechnologies(data.data.technologies);
        }

      } catch (err) { 
        console.warn("API Failed, using fallback", err); 
        // C. If API Fails entirely, use Fallback
        setTechnologies(FALLBACK_DB[currentSectorId] || []);
      } 
      finally { setLoading(false); }
    };
    
    // Smooth transition delay
    const timer = setTimeout(fetchTechnologies, 400);
    return () => clearTimeout(timer);
  }, [currentSectorId, searchQuery]);

  const toggleDomain = (domainId) => {
    setOpenDomains(prev => prev.includes(domainId) ? prev.filter(id => id !== domainId) : [...prev, domainId]);
  };

  const renderIcon = (iconName, className) => {
    const Icon = LucideIcons[iconName] || LucideIcons.Code2;
    return <Icon className={className} />;
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-10 pb-20 px-4 md:px-8 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* 2. DYNAMIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none transition-colors duration-1000">
         <div className={`absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br ${currentSector.color} opacity-[0.07] blur-[150px] rounded-full`} />
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* --- SIDEBAR --- */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-hide">
          <div className="glass-panel rounded-[2rem] p-4 bg-zinc-900/30 backdrop-blur-xl border border-white/5">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 pl-4 pt-2">
              <Layers className="w-4 h-4" /> Global Sectors
            </h3>
            
            <div className="space-y-2">
              {DOMAINS.map((domain) => {
                const isOpen = openDomains.includes(domain.id);
                return (
                  <div key={domain.id} className="overflow-hidden">
                    <button 
                      onClick={() => toggleDomain(domain.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group ${
                        isOpen ? 'bg-white/5 text-white shadow-lg' : 'hover:bg-white/5 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${domain.color} shadow-[0_0_10px_currentColor] group-hover:scale-125 transition-transform`} />
                        <span className="text-sm font-bold tracking-tight">{domain.title}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'text-zinc-600'}`} />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 pl-4 space-y-1">
                            {domain.sectors.map((sector) => {
                              const isActive = currentSectorId === sector.id;
                              return (
                                <button
                                  key={sector.id}
                                  onClick={() => navigate(`/technologies?sector=${sector.id}`)}
                                  className={`w-full text-left pl-4 pr-3 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 border-l-[2px] ${
                                    isActive 
                                      ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                                      : 'border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'
                                  }`}
                                >
                                  <div className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-zinc-600'}`}>
                                     {renderIcon(sector.icon, "w-full h-full")}
                                  </div>
                                  <span className="text-xs font-bold uppercase tracking-wide truncate">{sector.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="lg:col-span-9 space-y-8">
          
          {/* HERO HEADER */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="relative rounded-[2.5rem] p-10 md:p-14 overflow-hidden border border-white/5 bg-zinc-900/20 backdrop-blur-sm"
          >
            <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br ${currentSector.color} opacity-[0.15] blur-[100px] rounded-full pointer-events-none mix-blend-screen`} />
            
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-3">
                   <div className={`p-2.5 rounded-xl bg-zinc-950 border border-white/10 ${currentSector.accent} shadow-lg`}>
                      {renderIcon(currentSector.icon, "w-6 h-6")}
                   </div>
                   <div className="h-px w-12 bg-white/10" />
                   <span className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">
                     {parentDomain.title}
                   </span>
                </div>
                
                <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white leading-[0.9]">
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentSector.color}`}>
                    {currentSector.name}
                  </span> Radar
                </h1>
                
                <p className="text-lg text-zinc-400 font-medium leading-relaxed border-l-2 border-white/10 pl-6">
                  {currentSector.description}
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full xl:w-96 group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-50 blur transition duration-500" />
                <div className="relative bg-zinc-950 rounded-2xl flex items-center p-1">
                  <Search className="ml-4 w-5 h-5 text-zinc-500" />
                  <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${currentSector.name}...`}
                    className="w-full bg-transparent border-none text-white px-4 py-4 focus:ring-0 placeholder-zinc-600 font-medium"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-2 mr-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* TECH GRID */}
          {loading ? (
             <div className="h-96 flex flex-col items-center justify-center space-y-6">
               <div className="relative w-20 h-20">
                 <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
                 <div className="absolute inset-3 rounded-full border-t-2 border-purple-500 animate-spin-slow" />
               </div>
               <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 animate-pulse">Initializing Scan...</p>
             </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {technologies.map((tech) => (
                  <TiltCard 
                    key={tech._id}
                    onClick={() => navigate(`/technologies/${tech.slug}`)}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-950 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500 ${currentSector.accent}`}>
                        {renderIcon(tech.icon, "w-7 h-7")}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-200 transition-all">
                        {tech.name}
                      </h3>
                      <div className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                         <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{tech.category}</span>
                      </div>
                    </div>

                    <div className="w-full bg-zinc-950 rounded-full h-1 overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-0 group-hover:w-full transition-all duration-700 ease-out" />
                    </div>
                  </TiltCard>
                ))}
              </AnimatePresence>
              
              {!loading && technologies.length === 0 && (
                <div className="col-span-full py-32 text-center border border-dashed border-zinc-800 rounded-[2rem] bg-zinc-900/10">
                  <LayoutGrid className="w-12 h-12 text-zinc-700 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-zinc-300 mb-2">Signal Lost</h3>
                  <p className="text-zinc-500">No active nodes found for "{searchQuery}".</p>
                </div>
              )}
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Technologies;