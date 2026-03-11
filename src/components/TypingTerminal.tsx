import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const TypingTerminal: React.FC = () => {
  const [text, setText] = useState('');
  const fullText = `def analyze_data(dataset):
    # Cleaning data
    cleaned = dataset.dropna()
    
    # Processing pipeline
    results = cleaned.groupby('category').mean()
    
    # Generating insights
    return results.sort_values(ascending=False)

# Running automation...
vansh_bot.run()`;

  useEffect(() => {
    let i = 0;
    let isDeleting = false;
    
    const type = () => {
      const currentText = fullText.slice(0, i);
      setText(currentText);

      if (!isDeleting && i < fullText.length) {
        i++;
        setTimeout(type, 50);
      } else if (isDeleting && i > 0) {
        i--;
        setTimeout(type, 20);
      } else {
        isDeleting = !isDeleting;
        setTimeout(type, isDeleting ? 3000 : 1000);
      }
    };

    const timeout = setTimeout(type, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full max-w-md glass rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-bg-card px-4 py-2 flex items-center gap-2 border-b border-[var(--border-color)]">
        <div className="w-3 h-3 rounded-full bg-red-500/50" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
        <div className="w-3 h-3 rounded-full bg-green-500/50" />
        <span className="ml-2 text-[10px] text-text-secondary font-mono">vansh_bot.py</span>
      </div>
      
      {/* Body */}
      <div className="p-6 font-mono text-sm leading-relaxed">
        <pre className="text-accent-cyan whitespace-pre-wrap">
          {text}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-accent-cyan ml-1 align-middle"
          />
        </pre>
      </div>
    </div>
  );
};

export default TypingTerminal;
