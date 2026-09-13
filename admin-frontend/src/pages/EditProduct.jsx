import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UploadCloud, X } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });
  const [existingImages, setExistingImages] = useState([]); // Images already in DB/Cloudinary
  const [newFiles, setNewFiles] = useState([]); // Newly selected files
  const [newPreviews, setNewPreviews] = useState([]); // Previews for newly selected files
  
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Fetch product data on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const product = response.data.data;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price
        });
        setExistingImages(product.images || []);
      } catch (err) {
        setError('Failed to load product details.');
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Process new file selections
  const processFiles = (files) => {
    if (files.length === 0) return;
    const validImages = files.filter(file => file.type.startsWith('image/'));
    
    if (validImages.length !== files.length) {
      setError('Some files were rejected. Please select only image files.');
    } else {
      setError('');
    }

    setNewFiles(prev => [...prev, ...validImages]);
    const previews = validImages.map(file => URL.createObjectURL(file));
    setNewPreviews(prev => [...prev, ...previews]);
  };

  const handleFileSelect = (e) => {
    processFiles(Array.from(e.target.files));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag and Drop
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  // Remove an EXISTING image (removes it from the array so it gets deleted on submit)
  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove a NEWly added image before upload
  const removeNewImage = (index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(newPreviews[index]);
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Submit the Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (existingImages.length === 0 && newFiles.length === 0) {
      setError('A product must have at least one image.');
      return;
    }

    setSubmitLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      
      // Pass the remaining existing images as a JSON string for the backend to compare
      data.append('existingImages', JSON.stringify(existingImages));
      
      // Append any new files
      newFiles.forEach(file => {
        data.append('images', file);
      });

      await api.put(`/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.');
      setSubmitLoading(false);
    }
  };

  if (pageLoading) return <LoadingSpinner message="Loading Product Details..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/products')}
          className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-color)] hover:text-[var(--text-color)] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-color)]">Edit Product</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Update existing 3D model information.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-[var(--surface-color)] rounded-xl border border-[var(--border-color)] p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Info */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-[var(--text-color)] border-b border-[var(--border-color)] pb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Product Name</label>
                <input
                  type="text" name="name" required value={formData.name} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Description</label>
                <textarea
                  name="description" required rows="4" value={formData.description} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Price (₹)</label>
                <input
                  type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-[var(--text-color)] border-b border-[var(--border-color)] pb-2">Product Images</h2>
            
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isDragging ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--border-color)] hover:bg-[var(--bg-color)]/50'}`}
              onClick={() => fileInputRef.current?.click()} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 transition-colors ${isDragging ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'bg-[var(--bg-color)] text-[var(--text-muted)]'}`}>
                <UploadCloud size={24} />
              </div>
              <p className="text-[var(--text-color)] font-medium mb-1">Add more images</p>
              <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
            </div>

            {/* Combined Image Gallery: Existing + New */}
            {(existingImages.length > 0 || newPreviews.length > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                
                {/* Render Existing Images */}
                {existingImages.map((img, index) => (
                  <div key={`existing-${index}`} className="relative group rounded-lg overflow-hidden border border-[var(--border-color)] aspect-square bg-[var(--bg-color)]">
                    <img src={img.url} alt={`Existing ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button" onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] py-1 text-center font-medium">Existing</div>
                  </div>
                ))}

                {/* Render New Previews */}
                {newPreviews.map((url, index) => (
                  <div key={`new-${index}`} className="relative group rounded-lg overflow-hidden border-2 border-[var(--color-primary)] border-dashed aspect-square bg-[var(--bg-color)]">
                    <img src={url} alt={`New Preview ${index}`} className="w-full h-full object-cover opacity-80" />
                    <button
                      type="button" onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-[var(--color-primary)] text-slate-900 text-[10px] py-1 text-center font-bold">New</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[var(--border-color)] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-6 py-2.5 rounded-lg border border-[var(--border-color)] text-[var(--text-color)] hover:bg-[var(--bg-color)] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="px-6 py-2.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-slate-900 font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[150px] flex justify-center"
            >
              {submitLoading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;