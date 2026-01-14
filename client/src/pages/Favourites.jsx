import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate 
} from 'framer-motion';
import { 
  Heart, Search, Zap, ChevronRight, Code2, Database, Cpu, 
  Trash2, Play, LayoutGrid, List, ChevronDown, Check, Clock, Sparkles
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_DATA = [
  {
    _id: '1',
    name: 'React.js',
    slug: 'reactjs',
    shortDescription: 'A JavaScript library for building user interfaces.',
    category: 'Frontend',
    isTrending: true,
    tags: ['frontend', 'ui'],
    icon: <Code2 className="w-full h-full" />,
    color: 'text-cyan-400',
    border: 'group-hover:border-cyan-500/50',
    glow: 'group-hover:shadow-cyan-500/20',
    progress: { percentage: 68, lastUpdated: '2d ago' },
  },
  {
    _id: '3',
    name: 'MongoDB',
    slug: 'mongodb',
    shortDescription: 'Flexible NoSQL database for modern applications.',
    category: 'Database',
    isTrending: true,
    tags: ['database', 'backend'],
    icon: <Database className="w-full h-full" />,
    color: 'text-emerald-400',
    border: 'group-hover:border-emerald-500/50',
    glow: 'group-hover:shadow-emerald-500/20',
    progress: { percentage: 25, lastUpdated: '1w ago' },
  },
  {
    _id: '5',
    name: 'Neural Nets',
    slug: 'neural-networks',
    shortDescription: 'Deep learning algorithms modeled after the brain.',
    category: 'AI/ML',
    isTrending: true,
    tags: ['ai', 'python'],
    icon: <Cpu className="w-full h-full" />,
    color: 'text-purple-400',
    border: 'group-hover:border-purple-500/50',
    glow: 'group-hover:shadow-purple-500/20',
    progress: null,
  },
];

// --- 3D TILT CARD ---
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
        rotateX: useTransform(mouseY, [-50, 50], [2, -2]), 
        rotateY: useTransform(mouseX, [-50, 50], [-2, 2]), 
        transformStyle: "preserve-3d" 
      }}
      className={`relative group cursor-pointer ${className}`}
    >
      <div style={{ transform: "translateZ(0px)" }} className="h-full bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[24px] overflow-hidden relative shadow-lg transition-all duration-500 group-hover:border-white/10">
        <motion.div
          style={{ background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.07), transparent 80%)` }}
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="relative z-10 h-full p-6">{children}</div>
      </div>
    </motion.div>
  );
};

// --- CUSTOM DROPDOWN COMPONENT ---
const CustomDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-zinc-300 transition-colors border border-transparent hover:border-white/10"
      >
        <span className="text-zinc-500 font-medium">Sort:</span>
        <span className="text-white font-bold">{selectedLabel}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-40 bg-[#121214] border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => { onChange(option.value); setIsOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                {option.label}
                {value === option.value && <Check className="w-3 h-3 text-blue-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Favourites = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');

  const handleRemove = (e, id) => {
    e.stopPropagation();
    setItems(prev => prev.filter(item => item._id !== id));
  };

  const filteredItems = items
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'progress') return (b.progress?.percentage || 0) - (a.progress?.percentage || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-20 px-6 relative overflow-hidden font-sans selection:bg-rose-500/30">
      
      {/* 1. DYNAMIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-600/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 2. HEADER & TOOLBAR */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12 relative z-50">
          <div>
            <div className="flex items-center gap-2 text-rose-400 mb-3 font-mono text-xs tracking-[0.2em] uppercase">
              <Heart className="w-4 h-4 fill-current animate-pulse" />
              <span>Saved Protocols</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Arsenal</span>
            </h1>
          </div>

          {/* GLASS CONTROL BAR */}
          <div className="flex items-center gap-2 p-1.5 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative z-50">
            {/* Search */}
            <div className="relative group px-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-32 md:w-48 bg-transparent border-none text-sm text-white placeholder-zinc-600 pl-9 pr-2 py-2 focus:ring-0 transition-all focus:w-56"
              />
            </div>
            
            <div className="w-px h-6 bg-white/10" />

            {/* Custom Sort Dropdown */}
            <CustomDropdown 
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'recent', label: 'Recent' },
                { value: 'progress', label: 'Progress' },
                { value: 'name', label: 'Name' },
              ]}
            />

            <div className="w-px h-6 bg-white/10" />

            {/* View Toggle */}
            <div className="flex bg-zinc-950/50 rounded-lg p-1 border border-white/5">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. CONTENT GRID */}
        <motion.div 
          layout 
          className={`grid gap-6 relative z-0 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
        >
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((tech) => (
              <motion.div
                key={tech._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                transition={{ duration: 0.2 }}
              >
                <TiltCard 
                  onClick={() => navigate(`/technologies/${tech.slug}`)}
                  className={viewMode === 'list' ? 'h-auto' : 'h-full'}
                >
                  <div className={`${viewMode === 'list' ? 'flex items-center gap-8' : 'flex flex-col h-full'}`}>
                    
                    {/* Header */}
                    <div className={`flex justify-between items-start ${viewMode === 'list' ? 'w-1/3' : 'mb-6'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-950 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300 ${tech.color}`}>
                          {tech.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{tech.name}</h3>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full">{tech.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress / Status */}
                    <div className={`flex-1 ${viewMode === 'list' ? 'px-4' : 'mb-8'}`}>
                      {tech.progress ? (
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-400 font-medium">Sync Status</span>
                            <span className="text-white font-bold">{tech.progress.percentage}%</span>
                          </div>
                          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${tech.progress.percentage}%` }}
                              className={`h-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]`}
                            />
                          </div>
                          {viewMode === 'grid' && (
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                              <Clock className="w-3 h-3" /> 
                              <span>Last active {tech.progress.lastUpdated}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="w-2 h-2 rounded-full bg-zinc-600" />
                          <span className="text-xs font-medium text-zinc-400">Not initialized</span>
                        </div>
                      )}
                    </div>

                    {/* Action Footer */}
                    {/* ✅ FIXED: w-52 shrink-0 enforces equal button width in List View */}
                    <div className={`flex items-center gap-3 ${viewMode === 'list' ? 'w-52 shrink-0' : 'mt-auto'}`}>
                      
                      {/* Main Action Button */}
                      <button className="flex-1 group/btn relative overflow-hidden rounded-xl bg-white text-black font-bold py-3 px-6 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <div className="relative z-10 flex items-center justify-center gap-2">
                          {tech.progress ? <Play className="w-4 h-4 fill-black" /> : <Zap className="w-4 h-4 fill-black" />}
                          <span className="text-sm">{tech.progress ? 'Resume' : 'Start'}</span>
                        </div>
                        {/* Hover Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                      </button>
                      
                      {/* Remove Button */}
                      <button 
                        onClick={(e) => handleRemove(e, tech._id)}
                        className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all active:scale-95"
                        title="Remove from arsenal"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 border border-dashed border-zinc-800 rounded-[3rem] bg-zinc-900/20"
          >
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800 shadow-inner">
              <Sparkles className="w-10 h-10 text-zinc-700" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Empty Arsenal</h3>
            <p className="text-zinc-500 mb-8 max-w-md text-center">Your saved protocols will appear here. Start exploring the radar to build your stack.</p>
            <button 
              onClick={() => navigate('/technologies')}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" /> Initialize Discovery
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Favourites;