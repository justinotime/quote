'use client';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

type Props = {
  text: string;
  delay?: number;
  onDone?: () => void;
  className?: string;
  highlightIndex?: number; // where to split styles
};

const TypewriterText = ({ text, delay = 50, onDone, className, highlightIndex }: Props) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(0);
  const fullText = useRef(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize the text processing to avoid unnecessary recalculations
  const processedText = useMemo(() => {
    const beforeHighlight = displayedText.slice(0, highlightIndex);
    const afterHighlight = displayedText.slice(highlightIndex);
    return { beforeHighlight, afterHighlight };
  }, [displayedText, highlightIndex]);

  // Optimize the typewriter effect
  const startTypewriter = useCallback(() => {
    setDisplayedText('');
    indexRef.current = 0;
    fullText.current = text;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const nextChar = fullText.current.charAt(indexRef.current);
      if (nextChar) {
        setDisplayedText(fullText.current.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (onDone) onDone();
      }
    }, delay);
  }, [text, delay, onDone]);

  // Optimize cursor blinking
  const startCursorBlink = useCallback(() => {
    if (blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
    }
    
    blinkIntervalRef.current = setInterval(() => {
      setShowCursor(show => !show);
    }, 500);
  }, []);

  useEffect(() => {
    startTypewriter();
    startCursorBlink();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
      }
    };
  }, [startTypewriter, startCursorBlink]);

  return (
    <span className={className}>
      <span className="text-4xl md:text-6xl font-bold">{processedText.beforeHighlight}</span>
      <br /><br />
      <span className="text-xl md:text-3xl font-medium text-[#444]">{processedText.afterHighlight}</span>
      <span className="inline-block w-[1ch]">{showCursor ? '|' : ''}</span>
    </span>
  );
};

export default TypewriterText;
