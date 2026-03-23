'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TimelineMessageProps {
  message: string;
  date: string;
}

export default function TimelineMessage({ message, date }: TimelineMessageProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(message.substring(0, i));
      i++;
      if (i > message.length) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isInView, message]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      onViewportEnter={() => setIsInView(true)}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="max-w-xl mx-auto my-8 glass-panel p-8 rounded-3xl"
    >
      <div className="text-quartz text-sm font-medium mb-3 tracking-widest uppercase font-sans">
        {date}
      </div>
      <p className="text-foreground text-lg italic leading-relaxed min-h-[3rem] font-serif font-light">
        {displayedText}
        {isInView && displayedText.length < message.length && (
          <span className="animate-pulse ml-1 inline-block w-1.5 h-5 bg-quartz align-middle"></span>
        )}
      </p>
    </motion.div>
  );
}
