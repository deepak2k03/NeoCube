import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, BookOpen, PenTool, Save, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const RoadmapStep = ({ step, index, userProgress, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const [localNote, setLocalNote] = useState('');
  const progress = userProgress?.steps?.find(s => s.stepIndex === index);
  const isDone = progress?.status === 'completed';

  useEffect(() => {
    if (progress?.notes) setLocalNote(progress.notes);
  }, [progress]);

  return (
    <div className={`relative pl-8 pb-10 border-l-2 transition-all ${isDone ? 'border-indigo-500' : 'border-zinc-800'}`}>
      <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-4 border-zinc-950 z-10 flex items-center justify-center cursor-pointer transition-all ${isDone ? 'bg-indigo-500' : 'bg-zinc-800 hover:border-zinc-700'}`} onClick={() => onUpdate(index, isDone ? 'pending' : 'completed', localNote)}>
        {isDone ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Circle className="w-4 h-4 text-zinc-600" />}
      </div>

      <div className={`bg-zinc-900/40 border rounded-[2rem] transition-all duration-300 ${isExpanded ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-800 hover:border-zinc-700'}`}>
        <div className="p-6 flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 block mb-1">Module 0{index + 1}</span>
            <h3 className={`text-xl font-bold tracking-tight ${isDone ? 'text-zinc-500 line-through' : 'text-zinc-100'}`}>{step.title}</h3>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
        </div>

        {isExpanded && (
          <div className="px-6 pb-8 pt-2 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-zinc-800/50 animate-in fade-in duration-500">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2"><BookOpen className="w-3 h-3"/> Resources</h4>
              {step.resources?.map((res, i) => (
                <a key={i} href={res.url} target="_blank" className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-indigo-500/50 transition-all group">
                  <span className="text-sm font-medium text-zinc-300 truncate pr-4">{res.title}</span>
                  <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-indigo-400" />
                </a>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-2"><PenTool className="w-3 h-3"/> Lab Notes</h4>
              <div className="relative group">
                <textarea value={localNote} onChange={(e) => setLocalNote(e.target.value)} placeholder="Key takeaways..." className="w-full h-32 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-sm focus:ring-1 focus:ring-indigo-500 outline-none resize-none transition-all" />
                <button onClick={() => onUpdate(index, progress?.status || 'pending', localNote)} className="absolute bottom-3 right-3 p-2 bg-indigo-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><Save className="w-4 h-4 text-white" /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapStep;