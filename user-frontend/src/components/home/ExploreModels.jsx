import React, { useState, useEffect } from 'react';
import { ArrowRight, LayoutGrid, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useRealtimeProducts } from '../../hooks/useRealtimeProducts';

const ExploreModels = () => {
  const { products: fetchedProducts, loading } = useRealtimeProducts(); // <-- Use Hook
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (fetchedProducts.length > 0) {
      const latestSix = fetchedProducts.slice(0, 6);
      setProducts([...latestSix, ...latestSix, ...latestSix, ...latestSix]);
    } else {
      setProducts([]);
    }
  }, [fetchedProducts]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price || 0);
  };

  return (
    <div id="models" className="bg-[var(--bg-color)] py-12 sm:py-16 lg:py-24 border-b border-[var(--border-color)] overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-16 2xl:px-32 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6 relative z-10">
          <div>
            <p className="text-xs sm:text-sm font-bold text-[var(--color-primary)] tracking-widest uppercase mb-1 sm:mb-2">Explore Our Models</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[var(--text-color)] mb-2 sm:mb-3">Explore 3D Models</h2>
            <p className="text-[var(--text-muted)] text-sm sm:text-lg">Find the perfect model for your next 3D print.</p>
          </div>
          <Link to="/models" className="group flex items-center gap-2 text-[var(--text-color)] text-sm sm:text-base font-semibold hover:text-[var(--color-primary)] transition-colors">
            <LayoutGrid size={18} className="text-[var(--color-primary)] sm:w-5 sm:h-5" />
            View All Products
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform sm:w-[18px] sm:h-[18px]" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="relative w-full overflow-hidden">
          <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 md:w-40 bg-gradient-to-r from-[var(--bg-color)] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 md:w-40 bg-gradient-to-l from-[var(--bg-color)] to-transparent z-10 pointer-events-none" />
          
          <div className="flex w-max animate-marquee-ltr pause-on-hover gap-4 sm:gap-6 md:gap-8 px-4 sm:px-8 py-4 sm:py-8">
            {products.map((product, index) => (
              <div key={`${product._id}-${index}`} className="group flex flex-col w-[260px] sm:w-[280px] md:w-[320px] flex-shrink-0 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl sm:rounded-2xl overflow-hidden hover:border-[var(--color-primary)] sm:hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_15px_40px_-10px_rgba(255,193,7,0.15)] transition-all duration-500 relative">
                
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-black/70 backdrop-blur-md text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10 shadow-lg flex items-center gap-1 sm:gap-1.5 opacity-90 sm:group-hover:opacity-100 sm:group-hover:scale-105 transition-all duration-300">
                  <Tag size={12} className="text-[var(--color-primary)] sm:w-3.5 sm:h-3.5" />
                  {formatPrice(product.price)}
                </div>

                <div className="relative aspect-square overflow-hidden bg-[var(--bg-color)] p-3 sm:p-4 border-b border-[var(--border-color)]/50">
                  <img src={product.images[0]?.url || '/placeholder.png'} alt={product.name} className="w-full h-full object-contain transform sm:group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-color)] via-transparent to-transparent opacity-50 sm:opacity-90" />
                </div>

                <div className="flex flex-col flex-grow p-4 sm:p-6 pt-3 sm:pt-4 relative z-10">
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--text-color)] mb-1 sm:mb-2 group-hover:text-[var(--color-primary)] transition-colors truncate">{product.name}</h3>
                  <p className="text-[var(--text-muted)] text-xs sm:text-sm line-clamp-2 mb-4 sm:mb-6">{product.description}</p>
                  
                  {/* Both elements are now clickable Links pointing to the product details page */}
                  <div className="mt-auto flex items-center justify-between">
                    <Link to={`/models/${product._id}`} className="px-4 py-1.5 rounded-full border border-[var(--border-color)] text-[var(--text-color)] text-xs sm:text-sm font-bold group-hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-slate-900 transition-colors">
                      View Model
                    </Link>
                    <Link to={`/models/${product._id}`} className="w-8 h-8 sm:w-10 sm:h-10 bg-[var(--color-primary)] text-slate-900 rounded-full flex items-center justify-center transform group-hover:scale-110 hover:bg-[var(--color-primary-hover)] transition-all shadow-md">
                      <ArrowRight size={16} className="font-bold sm:w-[18px] sm:h-[18px]" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 text-sm sm:text-base text-[var(--text-muted)]">No products available yet.</div>
      )}
    </div>
  );
};

export default ExploreModels;