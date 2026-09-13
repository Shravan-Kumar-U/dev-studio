import React, { useContext } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Menu, Search, Moon, Sun, LogOut } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';

const Topbar = ({ setIsMobileOpen }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { admin, logout } = useContext(AuthContext);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('search') || '';

  const handleSearchChange = (e) => {
    const term = e.target.value;
    if (term) {
      navigate(`/products?search=${encodeURIComponent(term)}`, { 
        replace: location.pathname === '/products' 
      });
    } else {
      if (location.pathname === '/products') {
        navigate('/products', { replace: true });
      }
    }
  };

  return (
    /* Increased height to h-24 to match the Sidebar logo area */
    <header className="h-24 bg-[var(--surface-color)] border-b border-[var(--border-color)] flex items-center justify-between px-3 md:px-8 gap-3 sm:gap-6">
      
      {/* Left side: Mobile menu & Search */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        <button 
          className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-color)] shrink-0 p-1"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={26} />
        </button>
        
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-color)] rounded-lg border border-[var(--border-color)] w-full max-w-md focus-within:ring-2 focus-within:ring-[var(--color-primary)]/50 transition-shadow">
          <Search size={18} className="text-[var(--text-muted)] shrink-0" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-transparent border-none outline-none text-sm w-full text-[var(--text-color)]"
          />
        </div>
      </div>

      {/* Right side: Theme toggle & Profile */}
      <div className="flex items-center gap-1 sm:gap-4 shrink-0">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-[var(--bg-color)] text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors shrink-0"
          title="Toggle Theme"
        >
          {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-[var(--border-color)]">
          <div className="w-9 h-9 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {admin?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-semibold text-[var(--text-color)]">Admin</p>
            <p className="text-[var(--text-muted)] text-xs">Administrator</p>
          </div>
          <button 
            onClick={logout}
            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors shrink-0"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;