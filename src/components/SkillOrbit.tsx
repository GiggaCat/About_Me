import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Code, 
  Terminal, 
  Layers, 
  Cpu, 
  Globe, 
  GitBranch, 
  Cloud, 
  Zap,
  Box,
  X
} from 'lucide-react';

interface Skill {
  name: string;
  icon: React.ReactNode;
  level: number;
  description: string;
}

const skills: Skill[][] = [
  // Inner Ring
  [
    { name: 'Python', icon: <Code size={20} />, level: 95, description: 'Core language for automation and data.' },
    { name: 'SQL', icon: <Database size={20} />, level: 90, description: 'Complex queries and database design.' },
    { name: 'Git', icon: <GitBranch size={20} />, level: 85, description: 'Version control and collaboration.' },
  ],
  // Middle Ring
  [
    { name: 'Pandas', icon: <Layers size={20} />, level: 88, description: 'Data manipulation and analysis.' },
    { name: 'FastAPI', icon: <Zap size={20} />, level: 92, description: 'High-performance API development.' },
    { name: 'Supabase', icon: <Database size={20} />, level: 85, description: 'Backend-as-a-service integration.' },
  ],
  // Outer Ring
  [
    { name: 'Docker', icon: <Box size={20} />, level: 80, description: 'Containerization and deployment.' },
    { name: 'AWS', icon: <Cloud size={20} />, level: 75, description: 'Cloud infrastructure basics.' },
    { name: 'JS', icon: <Globe size={20} />, level: 82, description: 'Frontend interactivity and logic.' },
    { name: 'Linux', icon: <Terminal size={20} />, level: 88, description: 'Server management and scripting.' },
  ],
];

const SkillOrbit: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="relative w-full aspect-square max-w-[600px] mx-auto flex items-center justify-center overflow-visible">
      {/* Central Node */}
      <div className="relative z-20 w-32 h-32 rounded-full glass flex flex-col items-center justify-center border-accent-cyan/30 shadow-[0_0_50px_rgba(0,212,255,0.2)]">
        <Cpu className="text-accent-cyan mb-2" size={32} />
        <span className="text-xs font-bold text-text-heading uppercase tracking-widest">Tech Stack</span>
        <div className="absolute inset-0 rounded-full border border-accent-cyan/20 animate-ping" />
      </div>

      {/* Orbital Rings */}
      {skills.map((ring, ringIndex) => {
        const radius = 100 + ringIndex * 80;
        const duration = 20 + ringIndex * 10;
        const direction = ringIndex % 2 === 0 ? 1 : -1;

        return (
          <motion.div
            key={ringIndex}
            animate={{ rotate: isPaused ? 0 : 360 * direction }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {/* Ring Circle */}
            <div
              className="absolute rounded-full border border-border-subtle"
              style={{ width: radius * 2, height: radius * 2 }}
            />

            {/* Skill Bubbles */}
            {ring.map((skill, skillIndex) => {
              const angle = (skillIndex / ring.length) * Math.PI * 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={skill.name}
                  onClick={() => {
                    if (selectedSkill?.name === skill.name) {
                      setSelectedSkill(null);
                      setIsPaused(false);
                    } else {
                      setSelectedSkill(skill);
                      setIsPaused(true);
                    }
                  }}
                  onMouseEnter={() => {
                    setIsPaused(true);
                    setSelectedSkill(skill);
                  }}
                  onMouseLeave={() => {
                    if (!selectedSkill) {
                      setIsPaused(false);
                    }
                  }}
                  className="absolute pointer-events-auto cursor-pointer group"
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)' }}
                >
                  <motion.div
                    animate={{ rotate: isPaused ? 0 : -360 * direction }}
                    transition={{
                      duration: duration,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:border-accent-cyan/70 group-hover:scale-150 group-hover:shadow-[0_0_40px_rgba(0,212,255,0.8),0_0_15px_rgba(168,85,247,0.4)] transition-all duration-700 ease-out"
                  >
                    <div className="text-text-secondary group-hover:text-accent-cyan transition-colors duration-700">
                      {skill.icon}
                    </div>
                  </motion.div>
                  
                  {/* Label */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none group-hover:translate-y-2">
                    <span className="text-[10px] font-bold text-text-heading uppercase tracking-tighter whitespace-nowrap bg-bg-card backdrop-blur-md px-2 py-1 rounded border border-[var(--border-color)]">
                      {skill.name}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        );
      })}

      {/* Skill Info Overlay */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 w-64 glass p-4 rounded-xl border-accent-cyan/20 shadow-2xl pointer-events-auto cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-accent-cyan text-sm">{selectedSkill.name}</h4>
              <button 
                onClick={() => {
                  setSelectedSkill(null);
                  setIsPaused(false);
                }}
                className="text-text-secondary hover:text-text-heading transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="w-full h-1 bg-bg-surface rounded-full mb-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${selectedSkill.level}%` }}
                className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple"
              />
            </div>
            <p className="text-[11px] text-text-primary leading-relaxed">
              {selectedSkill.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillOrbit;
