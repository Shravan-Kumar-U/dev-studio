import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Tag, LayoutGrid } from 'lucide-react';
import api from '../services/api';
import PageLoader from '../components/ui/PageLoader';
import { useRealtimeProducts } from '../hooks/useRealtimeProducts';

const AllModels = () => {
  const { products, loading } = useRealtimeProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(price || 0);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <PageLoader onComplete={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color)] pb-20">
      
      {/* Breadcrumb Navigation */}
      <div className="w-full px-4 sm:px-6 lg:px-16 2xl:px-32 py-4 sm:py-6 border-b border-[var(--border-color)]/50">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[var(--text-muted)] font-medium">
          <Link to="/" className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors">
            <Home size={14} className="sm:w-4 sm:h-4" />
          </Link>
          <ChevronRight size={14} className="sm:w-4 sm:h-4" />
          <span className="text-[var(--text-color)]">All Models</span>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-16 2xl:px-32 py-6 sm:py-10 md:py-16 mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6 relative z-10">
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-bold text-[var(--color-primary)] tracking-widest uppercase mb-1 sm:mb-2">
              Complete Catalog
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[var(--text-color)] mb-3 flex items-center gap-2 sm:gap-4">
              <LayoutGrid className="text-[var(--color-primary)] w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
              All 3D Models
            </h1>
            <p className="text-[var(--text-muted)] text-sm md:text-lg max-w-2xl">
              Browse our entire collection of high-quality, meticulously crafted 3D models ready for your next printing project. Use the search bar in the navbar above anytime to quickly find specific models.
            </p>
          </div>
          
          <div className="text-[var(--text-muted)] text-xs sm:text-sm font-semibold bg-[var(--surface-color)] border border-[var(--border-color)] px-4 py-2 rounded-full shadow-sm whitespace-nowrap self-start md:self-auto">
            <span className="text-[var(--text-color)]">{products.length}</span> Total Products
          </div>
        </div>

        {/* Product Grid (3 Columns on Mobile) */}
        {products.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {products.map((product) => (
              <div 
                key={product._id} 
                onClick={() => navigate(`/models/${product._id}`)}
                className="group flex flex-col bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--color-primary)] hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_15px_30px_-10px_rgba(255,193,7,0.15)] transition-all duration-300 relative"
              >
                <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-20 bg-black/80 backdrop-blur-md text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/10 shadow-lg flex items-center gap-1 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300">
                  <Tag size={10} className="text-[var(--color-primary)] hidden sm:block" />
                  {formatPrice(product.price)}
                </div>

                <div className="relative aspect-square overflow-hidden bg-[var(--bg-color)] p-1 sm:p-3 border-b border-[var(--border-color)]/50">
                  <img 
                    src={product.images[0]?.url || '/placeholder.png'} 
                    alt={product.name}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-color)]/80 via-transparent to-transparent opacity-90 pointer-events-none" />
                </div>

                <div className="flex flex-col flex-grow p-2 sm:p-4 relative z-10 text-center sm:text-left">
                  <h3 className="text-[10px] sm:text-base font-bold text-[var(--text-color)] mb-0.5 sm:mb-1 group-hover:text-[var(--color-primary)] transition-colors truncate">
                    {product.name}
                  </h3>
                  <p className="hidden sm:block text-[var(--text-muted)] text-xs line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-2xl sm:rounded-3xl">
            <LayoutGrid size={40} className="text-[var(--border-color)] mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-color)] mb-2">No Models Available</h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">Check back soon for new additions!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllModels;