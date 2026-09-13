import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Copy, SearchX } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ConfirmModal from '../components/ui/ConfirmModal';
import ImageGalleryModal from '../components/ui/ImageGalleryModal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Extract search parameter from URL
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Image Gallery State
  const [galleryState, setGalleryState] = useState({ isOpen: false, images: [], startIndex: 0 });

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDeleteModal = (id) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/products/${productToDelete}`);
      setProducts(products.filter(p => p._id !== productToDelete));
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert('Failed to delete product.');
      console.error(err);
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const openGallery = (images, startIndex) => {
    if (!images || images.length === 0) return;
    setGalleryState({ isOpen: true, images, startIndex });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) return <LoadingSpinner message="Loading Products..." />;
  if (error) return <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-color)]">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Products'}
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Manage your 3D models. Add, edit, update or remove products.</p>
        </div>
        <Link 
          to="/products/add"
          className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-slate-900 px-4 py-2.5 rounded-lg font-semibold transition-colors"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="bg-[var(--surface-color)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-sm">
        <div className="sm:hidden px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs text-center border-b border-[var(--border-color)]">
          Swipe horizontally to view all columns
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--bg-color)] border-b border-[var(--border-color)] text-[var(--text-muted)] text-sm">
                <th className="px-6 py-4 font-medium">Images</th>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {/* Handle empty states securely */}
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center justify-center">
                      <Package size={48} className="text-[var(--border-color)] mb-4" />
                      <p className="font-medium text-[var(--text-color)] text-lg mb-1">Your catalog is empty</p>
                      <p>Click "Add Product" to create your first 3D model listing.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center justify-center">
                      <SearchX size={48} className="text-[var(--border-color)] mb-4" />
                      <p className="font-medium text-[var(--text-color)] text-lg mb-1">No products found</p>
                      <p>No products match the search term "{searchQuery}".</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-[var(--bg-color)]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {product.images?.slice(0, 3).map((img, index) => (
                          <img 
                            key={index} 
                            src={img.url} 
                            alt={`${product.name} ${index + 1}`} 
                            onClick={() => openGallery(product.images, index)}
                            className="w-14 h-14 rounded-lg object-cover border border-[var(--border-color)] bg-[var(--bg-color)] cursor-pointer hover:opacity-80 transition-opacity"
                            title="Click to view gallery"
                          />
                        ))}
                        {product.images?.length > 3 && (
                          <div 
                            onClick={() => openGallery(product.images, 3)}
                            className="w-14 h-14 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] flex flex-col items-center justify-center text-xs text-[var(--text-muted)] font-medium cursor-pointer hover:bg-[var(--surface-color)] transition-colors"
                            title="View all images"
                          >
                            <span>View More</span>
                            <span>+{product.images.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[var(--text-color)] text-base">{product.name}</p>
                      <p className="text-[var(--text-muted)] text-sm mt-1 line-clamp-2 max-w-md whitespace-normal">{product.description}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-[var(--text-color)]">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3">
                        <Link 
                          to={`/products/edit/${product._id}`}
                          className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-[var(--bg-color)] transition-colors flex items-center justify-center" 
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </Link>
                        {/* <button className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-[var(--bg-color)] transition-colors" title="Duplicate">
                          <Copy size={16} />
                        </button> */}
                        <button 
                          onClick={() => openDeleteModal(product._id)}
                          className="p-2 rounded-lg border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" 
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination subtly updated to reflect search results */}
        <div className="px-6 py-4 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-color)]/30">
          <p className="text-sm text-[var(--text-muted)]">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 rounded border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--surface-color)]">&lt;</button>
            <button className="px-3 py-1.5 rounded bg-[var(--color-primary)] text-slate-900 font-medium">1</button>
            <button className="px-3 py-1.5 rounded border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--surface-color)]">&gt;</button>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? All associated images will be permanently removed from the server. This action cannot be undone."
        confirmText="Delete Product"
        isLoading={isDeleting} 
      />

      <ImageGalleryModal
        isOpen={galleryState.isOpen}
        onClose={() => setGalleryState({ isOpen: false, images: [], startIndex: 0 })}
        images={galleryState.images}
        initialIndex={galleryState.startIndex}
      />
    </div>
  );
};

export default Products;