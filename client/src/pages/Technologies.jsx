import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate 
} from 'framer-motion';
import { 
  Search, ChevronRight, ChevronDown, X, Layers, LayoutGrid 
} from 'lucide-react';
import * as LucideIcons from 'lucide-react'; 
import api from '../services/api';
import { DOMAINS, FIELDS } from '../data/fieldsData'; 

// --- 1. OPTIMIZED TILT CARD ---
const TiltCard = ({ children, className = "", onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 400, damping: 50 });
  const mouseY = useSpring(y, { stiffness: 400, damping: 50 });

  function onMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  // Reduced rotation intensity to make it feel more stable/less "large"
  const rotateX = useTransform(mouseY, [-100, 100], [4, -4]);
  const rotateY = useTransform(mouseX, [-100, 100], [-4, 4]);

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group cursor-pointer h-full ${className}`}
    >
      <div style={{ transform: "translateZ(10px)" }} className="h-full bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden relative shadow-md group-hover:shadow-indigo-500/10 transition-all duration-500">
        <motion.div
          style={{ background: useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(99, 102, 241, 0.08), transparent 80%)` }}
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="relative z-10 h-full p-5">{children}</div>
      </div>
    </motion.div>
  );
};

const Technologies = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
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
        const { data } = await api.get('/technologies', {
          params: { fieldId: currentSectorId, search: searchQuery || undefined }
        });
        setTechnologies(data.data.technologies);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
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
    <div className="min-h-screen bg-[#030712] text-white pt-6 pb-12 px-6 md:px-12 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* BACKGROUND FX - Subtle Scale */}
      <div className="fixed inset-0 pointer-events-none">
         <div className={`absolute top-0 right-0 w-[60vw] h-[60vw] bg-gradient-to-br ${currentSector.color} opacity-[0.05] blur-[120px] rounded-full`} />
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* SIDEBAR - Fixed height with scroll */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-5 h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-hide">
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.25em] flex items-center gap-2 px-2">
              <Layers className="w-3.5 h-3.5" /> Sector Navigation
            </h3>
            
            <div className="space-y-1.5">
              {DOMAINS.map((domain) => {
                const isOpen = openDomains.includes(domain.id);
                return (
                  <div key={domain.id} className="overflow-hidden border border-white/[0.03] rounded-2xl bg-zinc-900/10">
                    <button 
                      onClick={() => toggleDomain(domain.id)}
                      className={`w-full flex items-center justify-between p-3.5 transition-all duration-300 ${isOpen ? 'bg-white/5 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${domain.color} shadow-sm`} />
                        <span className="text-xs font-bold tracking-tight">{domain.title}</span>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'text-zinc-700'}`} />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-black/20">
                          <div className="p-2 space-y-1">
                            {domain.sectors.map((sector) => {
                              const isActive = currentSectorId === sector.id;
                              return (
                                <button
                                  key={sector.id}
                                  onClick={() => navigate(`/technologies?sector=${sector.id}`)}
                                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all text-[11px] font-semibold border-l-2 ${isActive ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                                >
                                  {renderIcon(sector.icon, "w-3.5 h-3.5 opacity-70")}
                                  <span className="truncate uppercase tracking-wider">{sector.name}</span>
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

        {/* MAIN CONTENT */}
        <main className="lg:col-span-9 space-y-8">
          
          {/* HERO HEADER - Scaled Down */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-3xl p-8 md:p-10 border border-white/5 bg-zinc-900/20 backdrop-blur-sm overflow-hidden">
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-2">
                   <div className={`p-2 rounded-lg bg-zinc-950 border border-white/5 ${currentSector.accent}`}>
                      {renderIcon(currentSector.icon, "w-5 h-5")}
                   </div>
                   <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{parentDomain.title}</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                  {currentSector.name} <span className="text-zinc-600 font-medium">Radar</span>
                </h1>
                
                <p className="text-sm md:text-base text-zinc-400 font-medium leading-relaxed max-w-xl">
                  {currentSector.description}
                </p>
              </div>

              {/* SEARCH BAR - Scaled Down */}
              <div className="w-full xl:w-80 group relative">
                <div className="relative bg-zinc-950 border border-white/10 rounded-2xl flex items-center p-1 transition-all group-focus-within:border-indigo-500/50">
                  <Search className="ml-3 w-4 h-4 text-zinc-500" />
                  <input 
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Find tech...`}
                    className="w-full bg-transparent border-none text-white px-3 py-3 text-sm focus:ring-0 placeholder-zinc-700"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-1.5 mr-1 hover:bg-zinc-800 rounded-lg text-zinc-500">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* GRID - More columns, less gap */}
          {loading ? (
             <div className="h-64 flex flex-col items-center justify-center gap-4">
                <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase">Synchronizing...</p>
             </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {technologies.map((tech) => (
                  <TiltCard key={tech._id} onClick={() => navigate(`/technologies/${tech.slug}`)}>
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-950 border border-white/5 transition-transform duration-500 ${currentSector.accent}`}>
                          {renderIcon(tech.icon, "w-5 h-5")}
                        </div>
                        <div className="p-1.5 rounded-lg bg-white/5 text-zinc-600 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      
                      <div className="space-y-1 mb-4">
                        <h3 className="text-base font-bold text-white tracking-tight">{tech.name}</h3>
                        <div className="flex items-center gap-2">
                           <span className="w-1 h-1 rounded-full bg-indigo-500" />
                           <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{tech.category}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-2 w-full bg-white/[0.02] rounded-full h-0.5 overflow-hidden">
                         <div className="h-full bg-indigo-500/40 w-0 group-hover:w-full transition-all duration-1000 ease-out" />
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </AnimatePresence>
              
              {!loading && technologies.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-3xl">
                  <LayoutGrid className="w-8 h-8 text-zinc-800 mx-auto mb-4" />
                  <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">No protocols detected</p>
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