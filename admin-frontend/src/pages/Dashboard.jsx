import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/products');
        const products = response.data.data;
        
        // Calculate basic stats
        const totalProducts = products.length;
        const totalValue = products.reduce((sum, product) => sum + (product.price || 0), 0);
        const recentProducts = products.slice(0, 5); // Get the 5 newest products

        setStats({
          totalProducts,
          totalValue,
          recentProducts
        });
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) return <LoadingSpinner message="Loading Dashboard..." />;
  if (error) return <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-color)]">Dashboard Overview</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">Welcome back! Here is a summary of your catalog.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Products Card */}
        <div className="bg-[var(--surface-color)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <p className="text-[var(--text-muted)] text-sm font-medium">Total Products</p>
            <h3 className="text-2xl font-bold text-[var(--text-color)]">{stats.totalProducts}</h3>
          </div>
        </div>

        {/* Catalog Value Card */}
        <div className="bg-[var(--surface-color)] p-6 rounded-xl border border-[var(--border-color)] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[var(--text-muted)] text-sm font-medium">Total Catalog Value</p>
            <h3 className="text-2xl font-bold text-[var(--text-color)]">{formatPrice(stats.totalValue)}</h3>
          </div>
        </div>
      </div>

      {/* Recent Products Section */}
      <div className="bg-[var(--surface-color)] rounded-xl border border-[var(--border-color)] shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--text-color)] font-semibold">
            <Clock size={18} className="text-[var(--text-muted)]" />
            Recently Added
          </div>
          <Link to="/products" className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] flex items-center gap-1 transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="divide-y divide-[var(--border-color)]">
          {stats.recentProducts.length === 0 ? (
            <p className="p-6 text-[var(--text-muted)] text-center">No products found.</p>
          ) : (
            stats.recentProducts.map(product => (
              <div key={product._id} className="p-4 px-6 flex items-center justify-between hover:bg-[var(--bg-color)]/50 transition-colors">
                <div className="flex items-center gap-4">
                  {product.images && product.images[0] ? (
                    <img src={product.images[0].url} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-[var(--border-color)]" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)]" />
                  )}
                  <div>
                    <h4 className="font-semibold text-[var(--text-color)]">{product.name}</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate max-w-[200px] sm:max-w-md">{product.description}</p>
                  </div>
                </div>
                <div className="font-medium text-[var(--text-color)]">
                  {formatPrice(product.price)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;