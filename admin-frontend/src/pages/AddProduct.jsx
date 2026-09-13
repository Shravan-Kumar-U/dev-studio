import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, X } from 'lucide-react';
import api from '../services/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reusable file processing logic
  const processFiles = (files) => {
    if (files.length === 0) return;

    const validImages = files.filter(file => file.type.startsWith('image/'));
    
    if (validImages.length !== files.length) {
      setError('Some files were rejected. Please select only image files.');
    } else {
      setError('');
    }

    setSelectedFiles(prev => [...prev, ...validImages]);

    const newPreviews = validImages.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  // Input click handler
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const removeImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedFiles.length === 0) {
      setError('Please select at least one image for the product.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      
      selectedFiles.forEach(file => {
        data.append('images', file);
      });

      await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product. Please try again.');
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-[var(--text-color)]">Add New Product</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Create a new 3D model listing in your catalog.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-[var(--surface-color)] rounded-xl border border-[var(--border-color)] p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-[var(--text-color)] border-b border-[var(--border-color)] pb-2">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-colors"
                  placeholder="e.g., Detailed Church Model"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-colors resize-none"
                  placeholder="Describe the 3D model, its features, and details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-colors"
                  placeholder="e.g., 1999"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-[var(--text-color)] border-b border-[var(--border-color)] pb-2">Product Images</h2>
            
            {/* Drag and Drop Upload Box */}
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                ${isDragging 
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' 
                  : 'border-[var(--border-color)] hover:bg-[var(--bg-color)]/50'
                }
              `}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 transition-colors
                ${isDragging ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'bg-[var(--bg-color)] text-[var(--text-muted)]'}
              `}>
                <UploadCloud size={24} />
              </div>
              <p className="text-[var(--text-color)] font-medium mb-1">
                {isDragging ? 'Drop images here' : 'Drag & drop images here or click to browse'}
              </p>
              <p className="text-[var(--text-muted)] text-sm">PNG, JPG, WEBP up to 5MB each</p>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
            </div>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-[var(--border-color)] aspect-square bg-[var(--bg-color)]">
                    <img 
                      src={url} 
                      alt={`Preview ${index}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[var(--border-color)] flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-slate-900 font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[150px] flex justify-center"
            >
              {loading ? 'Uploading...' : 'Save Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;