import { useState, useEffect } from 'react';

/**
 * Custom hook for typewriter effect
 * @param {string} text - The text to animate
 * @param {number} speed - Typing speed in milliseconds (default: 100)
 * @param {number} delay - Delay before starting animation (default: 0)
 * @returns {string} The current displayed text
 */
export function useTypewriter(text, speed = 100, delay = 0) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);

    const delayTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= text.length) {
            clearInterval(interval);
            return prevIndex;
          }
          setDisplayedText(text.slice(0, prevIndex + 1));
          return prevIndex + 1;
        });
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(delayTimeout);
  }, [text, speed, delay]);

  return displayedText;
}
