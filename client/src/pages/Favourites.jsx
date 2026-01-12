import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Search, Zap, ChevronRight, 
  Code2, Database, Cpu, Trash2, PlayCircle 
} from 'lucide-react';

// --- MOCK DATA (Logic Preserved) ---
const mockFavourites = [
  {
    _id: '1',
    name: 'React.js',
    slug: 'reactjs',
    shortDescription: 'A JavaScript library for building user interfaces.',
    category: 'Frontend',
    difficulty: 'Intermediate',
    isTrending: true,
    tags: ['frontend', 'javascript', 'ui'],
    estimatedTime: '2-3 months',
    icon: <Code2 className="w-8 h-8" />,
    color: '#61DAFB',
    progress: {
      completedSteps: 4,
      totalSteps: 6,
      percentage: 68,
      lastUpdated: '2 days ago',
    },
  },
  {
    _id: '3',
    name: 'MongoDB',
    slug: 'mongodb',
    shortDescription: 'A flexible, scalable NoSQL database.',
    category: 'Database',
    difficulty: 'Beginner',
    isTrending: true,
    tags: ['database', 'nosql', 'json'],
    estimatedTime: '1-2 months',
    icon: <Database className="w-8 h-8" />,
    color: '#47A248',
    progress: {
      completedSteps: 1,
      totalSteps: 4,
      percentage: 25,
      lastUpdated: '1 week ago',
    },
  },
  {
    _id: '5',
    name: 'Machine Learning',
    slug: 'machine-learning-fundamentals',
    shortDescription: 'Core concepts powering AI and Data Science.',
    category: 'AI/ML',
    difficulty: 'Advanced',
    isTrending: true,
    tags: ['ai', 'ml', 'python'],
    estimatedTime: '4-6 months',
    icon: <Cpu className="w-8 h-8" />,
    color: '#FF6B6B',
    progress: null,
  },
];

const Favourites = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Filter Logic
  const filteredFavourites = mockFavourites.filter(
    (tech) =>
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden pt-28 pb-20 px-6">
      
      {/* 1. CINEMATIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 2. HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 text-red-400 mb-2 font-mono text-sm tracking-widest uppercase">
              <Heart className="w-4 h-4 fill-current animate-pulse" />
              <span>Saved Protocols</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
              My <span className="text-gradient-primary">Arsenal</span>
            </h1>
            <p className="text-textMuted mt-2 max-w-xl">
              Quick access to your active learning paths and saved technologies.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-96"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-primary/20 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative flex items-center bg-surface/90 backdrop-blur-xl border border-white/10 rounded-lg p-1">
                <Search className="w-5 h-5 text-textMuted ml-3" />
                <input
                  type="text"
                  placeholder="Filter saved items..."
                  className="w-full bg-transparent border-none text-white placeholder-textMuted px-4 py-3 focus:ring-0 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3. FAVOURITES GRID */}
        {filteredFavourites.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-3xl bg-surface/30 backdrop-blur-sm"
          >
            <div className="w-20 h-20 bg-surfaceHighlight rounded-full flex items-center justify-center mb-6 shadow-glow">
              <Heart className="w-10 h-10 text-textMuted opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {searchQuery ? 'No matching protocols found' : 'System Empty'}
            </h3>
            <p className="text-textMuted mb-8 max-w-md text-center">
              {searchQuery 
                ? 'Adjust your search parameters to locate saved items.' 
                : 'Your arsenal is empty. Visit the Discovery Engine to add new technologies.'}
            </p>
            <button 
              onClick={() => navigate('/technologies')}
              className="btn-neo flex items-center gap-2"
            >
              <Zap className="w-4 h-4" /> Initialize Discovery
            </button>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredFavourites.map((tech) => (
                <FavouriteCard key={tech._id} tech={tech} navigate={navigate} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- LEGENDARY CARD COMPONENT ---
const FavouriteCard = ({ tech, navigate }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ y: -5 }}
    className="group relative bg-surface/60 border border-white/5 backdrop-blur-xl rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300"
  >
    {/* Hover Glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="p-6 relative z-10 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-surfaceHighlight border border-white/10 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
            {tech.icon}
          </div>
          <div>
            <h3 
              onClick={() => navigate(`/technologies/${tech.slug}`)}
              className="text-lg font-bold text-white group-hover:text-primary transition-colors cursor-pointer"
            >
              {tech.name}
            </h3>
            <span className="text-xs text-textMuted bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {tech.category}
            </span>
          </div>
        </div>
        
        <button className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
          <Heart className="w-5 h-5 fill-current" />
        </button>
      </div>

      <p className="text-sm text-gray-400 mb-6 line-clamp-2 flex-grow">
        {tech.shortDescription}
      </p>

      {/* Progress Module */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/5 mb-4">
        {tech.progress ? (
          <>
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-mono text-primary uppercase tracking-wider">System Sync</span>
              <span className="text-sm font-bold text-white">{tech.progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${tech.progress.percentage}%` }}
                className="h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              />
            </div>
            <div className="mt-2 text-[10px] text-gray-500 text-right">
              Last active: {tech.progress.lastUpdated}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 rounded-full bg-gray-600" />
            <span>Not initialized yet</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 mt-auto">
        <button 
          onClick={() => navigate(`/technologies/${tech.slug}`)}
          className="flex-1 btn-neo py-2 text-sm flex items-center justify-center gap-2"
        >
          {tech.progress ? <PlayCircle className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          {tech.progress ? 'Resume' : 'Start'}
        </button>
        <button 
          onClick={() => navigate(`/technologies/${tech.slug}`)}
          className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-textMuted hover:text-white transition-colors"
        >
          Details
        </button>
      </div>
    </div>
  </motion.div>
);

export default Favourites;