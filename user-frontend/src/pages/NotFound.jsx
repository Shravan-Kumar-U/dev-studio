import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const NotFound = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="max-w-4xl w-full flex flex-col items-center relative">
        
        {/* Massive 404 Background Text */}
        <h1 className="text-[120px] md:text-[200px] font-black text-[var(--color-primary)] leading-none select-none drop-shadow-sm opacity-90 z-0">
          404
        </h1>
        
        {/* Central Graphic & Speech Bubble Layout */}
        <div className="relative flex flex-col md:flex-row items-center justify-center -mt-12 md:-mt-24 w-full z-10">
          
          {/* GitHub-style Message Box / Speech Bubble */}
          <div className="bg-[var(--surface-color)] border border-[var(--border-color)] shadow-xl rounded-2xl p-6 md:p-8 text-center md:text-left mb-8 md:mb-0 md:mr-12 max-w-sm relative">
            
            {/* Desktop Speech Bubble Pointer (Right) */}
            <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-[var(--surface-color)] border-t border-r border-[var(--border-color)] transform rotate-45"></div>
            
            {/* Mobile Speech Bubble Pointer (Bottom) */}
            <div className="md:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[var(--surface-color)] border-b border-r border-[var(--border-color)] transform rotate-45"></div>
            
            <h2 className="text-2xl font-bold text-[var(--text-color)] mb-2">Page not found</h2>
            <p className="text-[var(--text-muted)] text-lg">
              This is not the web page you are looking for.
            </p>
          </div>

          {/* Large Responsive Company Logo */}
          <img
            src="/logo.png"
            alt="Dev Studio Logo"
            className="h-40 md:h-64 w-auto object-contain drop-shadow-2xl transition-all duration-300"
            style={{ filter: isDarkMode ? 'none' : 'brightness(0)' }}
          />
        </div>

        {/* Bottom Action Area */}
        <div className="mt-16 w-full max-w-md flex flex-col items-center space-y-4">
          <p className="text-[var(--text-muted)] text-sm">Find your way back to the application:</p>
          <Link 
            to="/"
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[var(--surface-color)] border border-[var(--border-color)] hover:border-[var(--color-primary)] text-[var(--text-color)] font-medium transition-all hover:shadow-md group"
          >
            <Home size={20} className="text-[var(--text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
            Return to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;