// client/src/pages/Fields.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, ArrowRight, Sparkles } from 'lucide-react';
import { FIELDS } from '../data/fieldsData.jsx';

const Fields = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden pt-28 pb-20 px-6">
      
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-glow text-sm font-mono uppercase tracking-wider backdrop-blur-md mb-6"
          >
            <Layers className="w-4 h-4" />
            <span>Select Operational Sector</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6"
          >
            Choose Your <span className="text-gradient-cyan">Field</span>
          </motion.h1>
          
          <p className="text-textMuted max-w-2xl mx-auto text-lg">
            NeoCube generates specialized roadmaps for every major industry. Select a domain to initialize the Technology Radar.
          </p>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FIELDS.map((field, index) => (
            <FieldCard 
              key={field.id} 
              field={field} 
              index={index} 
              onClick={() => navigate(`/technologies?sector=${field.id}`)} 
            />
          ))}
        </div>

      </div>
    </div>
  );
};

const FieldCard = ({ field, index, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    onClick={onClick}
    className="group relative h-80 cursor-pointer perspective-1000"
  >
    {/* Card Container */}
    <div className="absolute inset-0 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col transition-all duration-500 group-hover:bg-surface/60 group-hover:border-white/20 group-hover:translate-y-[-10px] group-hover:shadow-2xl overflow-hidden">
      
      {/* Gradient Background (Hidden by default, reveals on hover) */}
      <div className={`absolute inset-0 bg-gradient-to-br ${field.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Icon Container */}
      <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-auto group-hover:scale-110 transition-transform duration-500 shadow-lg ${field.accent}`}>
        {field.icon}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-colors">
          {field.name}
        </h3>
        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-2">
          {field.description}
        </p>
      </div>

      {/* Footer / Action */}
      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">
          View Radar
        </span>
        <div className={`p-2 rounded-full bg-white/5 ${field.accent} group-hover:bg-white group-hover:text-black transition-all duration-300`}>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

    </div>
  </motion.div>
);

export default Fields;