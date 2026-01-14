import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, Layers, Search, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { DOMAINS } from '../data/fieldsData';

const Fields = () => {
  const navigate = useNavigate();
  const [activeDomainId, setActiveDomainId] = useState(DOMAINS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. GLOBAL SEARCH LOGIC
  // Flatten all sectors to search across Engineering, Business, etc.
  const allSectors = useMemo(() => DOMAINS.flatMap(d => d.sectors), []);

  const displayedSectors = useMemo(() => {
    if (!searchQuery.trim()) {
      // Not searching? Show sectors for the active domain only
      return DOMAINS.find(d => d.id === activeDomainId)?.sectors || [];
    }
    // Searching? Filter EVERYTHING
    return allSectors.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, activeDomainId, allSectors]);

  const activeDomain = DOMAINS.find(d => d.id === activeDomainId);

  const renderIcon = (iconName) => {
    const Icon = LucideIcons[iconName] || LucideIcons.Circle;
    return <Icon className="w-full h-full" />;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12 px-4 md:px-8 overflow-hidden">
      <div className="max-w-[1600px] mx-auto h-full">
        
        {/* HEADER & SEARCH BAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Path</span>.
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl">
              Select a specialized industry domain to unlock professional-grade roadmaps.
            </p>
          </div>

          {/* FUNCTIONAL SEARCH INPUT */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sectors (e.g., 'AI', 'Finance')..."
              className="w-full pl-11 pr-10 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-xl"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-h-[600px]">
          
          {/* LEFT SIDE: Domain Menu (Hidden when searching to reduce clutter) */}
          <div className={`lg:col-span-4 flex flex-col gap-4 transition-all duration-500 ${searchQuery ? 'opacity-50 pointer-events-none blur-sm' : 'opacity-100'}`}>
            {DOMAINS.map((domain) => {
              const isActive = activeDomainId === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomainId(domain.id)}
                  className={`group relative w-full text-left p-6 rounded-3xl border transition-all duration-500 overflow-hidden ${
                    isActive 
                      ? 'bg-zinc-900 border-zinc-700 shadow-2xl shadow-indigo-500/10 scale-[1.02]' 
                      : 'bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${domain.color} opacity-0 transition-opacity duration-500 ${isActive ? 'opacity-10' : 'group-hover:opacity-5'}`} />
                  {isActive && <motion.div layoutId="active-pill" className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-gradient-to-b ${domain.color}`} />}
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h3 className={`text-xl font-bold mb-1 transition-colors ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{domain.title}</h3>
                      <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{domain.sectors.length} Sectors</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${isActive ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-600 border-zinc-700 -rotate-45'}`}>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT SIDE: Dynamic Grid */}
          <div className="lg:col-span-8 bg-zinc-900/20 rounded-[3rem] border border-zinc-800/50 p-8 relative overflow-hidden min-h-[500px]">
            {/* Background Glow */}
            {!searchQuery && (
              <div className={`absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-br ${activeDomain.color} opacity-[0.07] blur-[100px] rounded-full pointer-events-none transition-colors duration-1000`} />
            )}

            <AnimatePresence mode="popLayout">
              {/* Header: Changes based on Search vs Selection */}
              <motion.div 
                key={searchQuery ? 'search' : 'domain'}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-8"
              >
                 <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${searchQuery ? 'text-white' : activeDomain.accent}`}>
                    {searchQuery ? <Search className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                 </div>
                 <h2 className="text-2xl font-bold text-white">
                   {searchQuery ? `Search Results for "${searchQuery}"` : activeDomain.description}
                 </h2>
              </motion.div>

              {/* THE GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {displayedSectors.length > 0 ? (
                  displayedSectors.map((sector) => (
                    <motion.div
                      layout
                      key={sector.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => navigate(`/technologies?sector=${sector.id}`)}
                      className="group cursor-pointer bg-zinc-950 border border-zinc-800 hover:border-zinc-600 p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${sector.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center ${sector.accent} group-hover:scale-110 transition-transform duration-300`}>
                          {renderIcon(sector.icon)}
                        </div>
                        <ArrowRight className="w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2">{sector.name}</h3>
                      <p className="text-sm text-zinc-500 line-clamp-2">{sector.description}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center text-zinc-500">
                    No sectors found matching "{searchQuery}".
                  </div>
                )}
              </div>
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Fields;