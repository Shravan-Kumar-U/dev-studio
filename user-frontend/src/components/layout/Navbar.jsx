import React, { useContext, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Home, LayoutGrid, Info, Mail, ArrowLeft, X, Tag } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import api from '../../services/api';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let animationFrameId;
    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = windowHeight > 0 ? (totalScroll / windowHeight) : 0;
        setScrollProgress(scroll * 100);

        const sections = ['home', 'models', 'about', 'contact'];
        for (const section of sections.reverse()) {
          if (section === 'home' && window.scrollY < 300) {
            setActiveSection('home');
            break;
          }
          const element = document.getElementById(section);
          if (element && window.scrollY >= (element.offsetTop - 150)) {
            setActiveSection(section);
            break;
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Close search dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Fetch live search results from backend API
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await api.get('/products');
        const filtered = res.data.data.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
      } catch (err) {
        console.error('Search fetch failed:', err);
      }
    };

    const timer = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setActiveSection(targetId);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToSection(targetId), 100);
    } else {
      scrollToSection(targetId);
    }
  };

  const scrollToSection = (id) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 112;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price || 0);
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-[var(--bg-color)]/80 backdrop-blur-lg border-[var(--border-color)]/50 shadow-sm' 
          : 'bg-[var(--bg-color)] border-[var(--border-color)]'
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-16 2xl:px-32 relative">
          <div className="flex items-center justify-between h-16 md:h-28">
            
            {/* Header Left: Back Button + Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              {location.pathname !== '/' && (
                <button 
                  onClick={() => navigate(-1)} 
                  className="lg:hidden p-1.5 border border-[var(--border-color)] rounded-full text-[var(--text-color)] hover:bg-[var(--surface-color)] transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div className="cursor-pointer" onClick={(e) => handleNavClick(e, 'home')}>
                <img 
                  src="/logo.png" 
                  alt="Dev Studio Logo" 
                  className="h-8 md:h-20 w-auto transition-all duration-300"
                  style={{ filter: isDarkMode ? 'none' : 'brightness(0)' }}
                />
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-8 lg:space-x-12">
              {['home', 'models', 'about', 'contact'].map((item) => (
                <button 
                  key={item}
                  onClick={(e) => handleNavClick(e, item)} 
                  className={`text-sm md:text-base font-medium transition-colors py-10 border-b-2 capitalize
                    ${activeSection === item ? 'text-[var(--color-primary)] border-[var(--color-primary)]' : 'text-[var(--text-color)] border-transparent hover:text-[var(--color-primary)]'}
                  `}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Header Right: Navbar Integrated Search Bar + Theme Toggle */}
            <div className="flex items-center gap-3 md:gap-4 lg:gap-8">
              
              {/* Integrated Search Bar (Desktop & Mobile Responsive) */}
              <div className="relative" ref={searchRef}>
                <div className="flex items-center px-3.5 py-2 md:px-5 md:py-2.5 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-full focus-within:border-[var(--color-primary)] transition-colors w-40 sm:w-56 md:w-64 lg:w-80 xl:w-96 shadow-sm">
                  <Search size={16} className="text-[var(--text-muted)] mr-2 md:mr-3 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search 3D models..." 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearching(true);
                    }}
                    onFocus={() => setIsSearching(true)}
                    className="bg-transparent border-none outline-none text-xs md:text-sm w-full text-[var(--text-color)]"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-[var(--text-muted)] hover:text-[var(--text-color)] ml-1">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Modern Live Search Results Dropdown */}
                {isSearching && searchQuery.trim() !== '' && (
                  <div className="absolute right-0 mt-2 w-[85vw] sm:w-80 md:w-96 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-muted)] font-semibold">
                      <span>Search Results</span>
                      <span>{searchResults.length} found</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-color)]/50">
                      {searchResults.length > 0 ? (
                        searchResults.map((item) => (
                          <div 
                            key={item._id}
                            onClick={() => {
                              navigate(`/models/${item._id}`);
                              setIsSearching(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-[var(--bg-color)] transition-colors cursor-pointer group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-[var(--bg-color)] border border-[var(--border-color)] p-1 shrink-0 overflow-hidden">
                              <img src={item.images[0]?.url || '/placeholder.png'} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs md:text-sm font-bold text-[var(--text-color)] truncate group-hover:text-[var(--color-primary)] transition-colors">{item.name}</h4>
                              <p className="text-[10px] md:text-xs text-[var(--text-muted)] line-clamp-1">{item.description}</p>
                            </div>
                            <div className="text-xs font-bold text-[var(--color-primary)] shrink-0 flex items-center gap-1 bg-[var(--color-primary)]/10 px-2 py-1 rounded-full">
                              <Tag size={10} />
                              {formatPrice(item.price)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-10 text-center flex flex-col items-center justify-center px-4">
                          <Search size={32} className="text-[var(--border-color)] mb-2 animate-bounce" />
                          <h4 className="text-sm font-bold text-[var(--text-color)] mb-1">No products found</h4>
                          <p className="text-xs text-[var(--text-muted)]">We couldn't find anything matching "{searchQuery}". Try a different keyword.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button onClick={toggleTheme} className="p-2 md:p-2.5 rounded-full border border-[var(--color-primary)] lg:border-transparent lg:hover:border-[var(--border-color)] text-[var(--color-primary)] lg:text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors" title="Toggle Theme">
                {isDarkMode ? <Moon size={18} className="md:w-[22px] md:h-[22px]" /> : <Sun size={18} className="md:w-[22px] md:h-[22px]" />}
              </button>
            </div>
          </div>
        </div>
        
        <div 
          className="absolute bottom-0 left-0 h-[3px] bg-[var(--color-primary)] transition-all duration-75 ease-linear z-50 rounded-r-full"
          style={{ width: `${scrollProgress}%`, boxShadow: '0 0 10px var(--color-primary), 0 0 4px var(--color-primary)' }}
        />
      </nav>

      {/* Mobile Bottom App Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[var(--surface-color)]/95 backdrop-blur-lg border-t border-[var(--border-color)] pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-around h-16 px-2">
          <button onClick={(e) => handleNavClick(e, 'home')} className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${activeSection === 'home' ? 'text-[var(--color-primary)]' : 'text-[var(--text-muted)]'}`}>
            <Home size={22} className={activeSection === 'home' ? 'fill-[var(--color-primary)]/20' : ''} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={(e) => handleNavClick(e, 'models')} className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${activeSection === 'models' ? 'text-[var(--color-primary)]' : 'text-[var(--text-muted)]'}`}>
            <LayoutGrid size={22} className={activeSection === 'models' ? 'fill-[var(--color-primary)]/20' : ''} />
            <span className="text-[10px] font-bold">Models</span>
          </button>
          <button onClick={(e) => handleNavClick(e, 'about')} className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${activeSection === 'about' ? 'text-[var(--color-primary)]' : 'text-[var(--text-muted)]'}`}>
            <Info size={22} className={activeSection === 'about' ? 'fill-[var(--color-primary)]/20' : ''} />
            <span className="text-[10px] font-bold">About</span>
          </button>
          <button onClick={(e) => handleNavClick(e, 'contact')} className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${activeSection === 'contact' ? 'text-[var(--color-primary)]' : 'text-[var(--text-muted)]'}`}>
            <Mail size={22} className={activeSection === 'contact' ? 'fill-[var(--color-primary)]/20' : ''} />
            <span className="text-[10px] font-bold">Contact</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;