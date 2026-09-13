import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const PageLoader = ({ onComplete }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading sequence (1.5 seconds total)
    const duration = 1500; 
    const intervalTime = 30;
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const percentage = Math.min(Math.round((currentStep / totalSteps) * 100), 100);
      setProgress(percentage);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        // Brief pause at 100% before unmounting
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[var(--bg-color)]">
      
      {/* Dynamic Logo with subtle pulse animation */}
      <div className="mb-12 animate-pulse">
        <img
          src="/logo.png"
          alt="Dev Studio Logo"
          className="h-28 w-auto object-contain transition-all duration-300"
          style={{ filter: isDarkMode ? 'none' : 'brightness(0)' }}
        />
      </div>

      {/* Progress Bar Section */}
      <div className="w-64 max-w-[80vw]">
        <p className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] mb-4 uppercase">
          Initializing Experience...
        </p>
        
        {/* Track */}
        <div className="h-1 w-full bg-[var(--border-color)] rounded-full overflow-hidden mb-2">
          {/* Fill */}
          <div 
            className="h-full bg-[var(--color-primary)] transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Percentage Counter */}
        <div className="flex justify-end">
          <span className="text-[10px] font-medium text-[var(--text-muted)]">
            {progress}%
          </span>
        </div>
      </div>
      
    </div>
  );
};

export default PageLoader;