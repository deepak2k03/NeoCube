import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Grid, List, ChevronRight, Layers, Loader 
} from 'lucide-react';
import * as LucideIcons from 'lucide-react'; 
import api from '../services/api'; // Ensure you have your Axios instance here

// Static Field Info (For headers/colors) - we still keep this for UI styling
import { FIELDS } from '../data/fieldsData'; 

const Technologies = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 1. Get Sector from URL
  const currentSectorId = searchParams.get('sector') || 'cs';
  const currentField = FIELDS.find(f => f.id === currentSectorId) || FIELDS[0];

  // 2. State for Database Data
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 3. FETCH FROM API (The "Switch")
  useEffect(() => {
    const fetchTechnologies = async () => {
      setLoading(true);
      try {
        // Call your backend with the sector filter
        const { data } = await api.get('/technologies', {
          params: { 
            fieldId: currentSectorId,
            category: selectedCategory !== 'All' ? selectedCategory : undefined,
            search: searchQuery || undefined
          }
        });
        
        // The backend returns { success: true, data: { technologies: [...] } }
        setTechnologies(data.data.technologies);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load radar data.");
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchTechnologies();
    }, 300);

    return () => clearTimeout(timer);
  }, [currentSectorId, selectedCategory, searchQuery]);

  // Helper to render dynamic icons from string names
  const renderIcon = (iconName) => {
    const Icon = LucideIcons[iconName] || LucideIcons.Code2;
    return <Icon className="w-full h-full" />;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden pt-28 pb-20 px-6">
      
      {/* Dynamic Background FX */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br ${currentField.color} opacity-10 rounded-full blur-[150px]`} />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className={`flex items-center gap-2 mb-2 font-medium ${currentField.accent}`}>
              {currentField.icon}
              <span>{currentField.name} Radar</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
              Explore <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentField.color}`}>Technologies</span>
            </h1>
            
            <button 
              onClick={() => navigate('/fields')}
              className="text-sm text-textMuted hover:text-white mt-4 flex items-center gap-2 group"
            >
              <Layers className="w-4 h-4" />
              Switch Sector
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="relative w-full md:w-96 group"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-textMuted group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3 bg-surface/50 border border-white/10 rounded-xl text-white placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all backdrop-blur-sm"
              placeholder={`Search ${currentField.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>

        {/* FILTERS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-4 rounded-2xl mb-8 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between"
        >
          <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-textMuted uppercase tracking-wider">
                <Layers className="w-3 h-3" /> Category
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', ...currentField.categories].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat 
                      ? 'bg-white text-black shadow-glow' 
                      : 'bg-surfaceHighlight/50 text-textMuted hover:text-white hover:bg-surfaceHighlight'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex bg-surfaceHighlight/50 p-1 rounded-lg border border-white/5">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-surface text-white' : 'text-textMuted'}`}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-surface text-white' : 'text-textMuted'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-textMuted">
            <Loader className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p>Scanning Sector Database...</p>
          </div>
        ) : error ? (
           <div className="text-center py-20 text-red-400">{error}</div>
        ) : technologies.length === 0 ? (
          <div className="text-center py-20 text-textMuted border border-dashed border-white/10 rounded-3xl bg-surface/20">
            <Filter className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No technologies found.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
          >
            <AnimatePresence>
              {technologies.map((tech) => (
                <TechCard 
                  key={tech._id} 
                  tech={{...tech, iconComponent: renderIcon(tech.icon)}} 
                  viewMode={viewMode} 
                  accentColor={currentField.accent}
                  onClick={() => navigate(`/technologies/${tech.slug}`)} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Sub-Component: The Tech Card
const TechCard = ({ tech, viewMode, onClick, accentColor }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    onClick={onClick}
    className={`
      group relative bg-surface/60 border border-white/5 backdrop-blur-sm 
      hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] 
      transition-all duration-300 cursor-pointer overflow-hidden
      ${viewMode === 'grid' ? 'rounded-2xl p-6 flex flex-col h-full' : 'rounded-xl p-4 flex items-center gap-6'}
    `}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className={`
      flex items-center justify-center rounded-xl bg-surfaceHighlight border border-white/5 
      ${accentColor} group-hover:scale-110 group-hover:text-white transition-all duration-300
      ${viewMode === 'grid' ? 'w-14 h-14 mb-4' : 'w-12 h-12 flex-shrink-0'}
    `}>
      {tech.iconComponent}
    </div>

    <div className="flex-grow z-10">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
          {tech.name}
        </h3>
        {tech.isTrending && viewMode === 'grid' && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase">
            Trending
          </span>
        )}
      </div>
      <p className="text-sm text-gray-400 line-clamp-2 mb-4 mt-2">
        {tech.shortDescription}
      </p>
      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
        <span className={`text-[10px] px-2 py-0.5 rounded border border-white/10 text-textMuted bg-white/5`}>
          {tech.difficulty}
        </span>
        <ChevronRight className="w-4 h-4 text-textMuted group-hover:text-white transition-transform" />
      </div>
    </div>
  </motion.div>
);

export default Technologies;