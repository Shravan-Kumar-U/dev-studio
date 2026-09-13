import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, X } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/products', icon: <Package size={20} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static top-0 left-0 z-50 h-screen w-64 
        bg-[var(--surface-color)] border-r border-[var(--border-color)]
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo Area - Increased container to h-24 */}
        <div className="h-24 flex items-center justify-between px-6 border-b border-[var(--border-color)]">
          <div className="flex items-center w-full">
            <img 
              src="/logo.png" 
              alt="Dev Studio Logo" 
              /* Increased logo size to h-16 */
              className="h-16 w-auto object-contain transition-all duration-300"
              style={{
                filter: isDarkMode ? 'none' : 'brightness(0)'
              }}
            />
          </div>
          <button 
            className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-color)] absolute right-4"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
                ${isActive 
                  ? 'bg-[var(--color-primary)] text-slate-900' 
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-color)] hover:text-[var(--text-color)]'}
              `}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;