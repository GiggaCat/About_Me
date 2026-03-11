import React, { useState, useEffect, useCallback } from 'react';

interface ScrambleTextProps {
  text: string;
  duration?: number;
  delay?: number;
  className?: string;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  duration = 1000,
  delay = 0,
  className = '',
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isScrambling, setIsScrambling] = useState(false);

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

  const scramble = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text, characters]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsScrambling(true);
      scramble();
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, scramble]);

  return <span className={className}>{displayText}</span>;
};

export default ScrambleText;
