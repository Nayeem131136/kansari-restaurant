import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { useRestaurant } from '../../../context/RestaurantContext';
import { GalleryItem } from '../../../types/admin';
import { Plus, Trash2, Upload, X, Star, Image as ImageIcon } from 'lucide-react';

export function GalleryView() {
  const { success, error } = useToast();
  const { refreshData } = useRestaurant();

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    url: '',
    title: '',
    bengali: '',
    aspect: 'square' as GalleryItem['aspect'],
    sortOrder: 1,
    featured: false
  });

  const fetchGallery = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getGallery();
      setGallery(res.gallery);
    } catch (err: any) {
      error('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleOpenAdd = () => {
    setFormData({
      url: '',
      title: '',
      bengali: '',
      aspect: 'square',
      sortOrder: gallery.length + 1,
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await api.uploadImage(file);
      setFormData(prev => ({ ...prev, url: res.url }));
      success('Image uploaded successfully');
    } catch (err: any) {
      error(err.message || 'Failed to upload photo');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url || !formData.title) {
      error('Please provide both image and title');
      return;
    }

    try {
      await api.createGalleryItem(formData);
      success(`Photo "${formData.title}" added to gallery`);
      setIsModalOpen(false);
      fetchGallery();
      refreshData();
    } catch (err: any) {
      error(err.message || 'Failed to save gallery photo');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteGalleryItem(id);
      success('Gallery item deleted');
      setDeleteConfirmId(null);
      fetchGallery();
      refreshData();
    } catch (err: any) {
      error(err.message || 'Failed to delete gallery item');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-100 flex items-center gap-2">
            Restaurant Atmosphere & Food Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visual dining ambience, craftsmanship, and raw culinary presentations on the website.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Photo to Gallery</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading photo gallery...</div>
      ) : gallery.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs">No gallery photos added yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gallery.map(item => (
            <div
              key={item.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm group hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] uppercase font-mono text-slate-300 px-2 py-0.5 rounded">
                  {item.aspect}
                </span>
                {item.featured && (
                  <span className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow">
                    Hero Featured
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-100 text-sm">{item.title}</h3>
                    {item.bengali && (
                      <p className="font-serif text-xs text-amber-400 font-medium mt-0.5">
                        {item.bengali}
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    #{item.sortOrder}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end">
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-semibold text-slate-100 text-base">Add Photo to Gallery</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Image Photo Upload / URL *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-24 h-20 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                    {formData.url ? (
                      <img src={formData.url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-slate-600" size={24} />
                    )}
                  </div>
                  <div className="w-full space-y-2">
                    <input
                      type="url"
                      required
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors">
                      <Upload size={13} />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Photo Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Slow-Cooked Kacchi Brass Platter"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Bengali Subtitle (বাংলা শিরোনাম)
                </label>
                <input
                  type="text"
                  value={formData.bengali}
                  onChange={(e) => setFormData({ ...formData, bengali: e.target.value })}
                  placeholder="যেমন: ঐতিহ্যবাহী কাঁসার পাত্রে পরিবেশন"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Aspect Ratio Format
                  </label>
                  <select
                    value={formData.aspect}
                    onChange={(e) => setFormData({ ...formData, aspect: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 cursor-pointer"
                  >
                    <option value="square">Square (1:1)</option>
                    <option value="video">Landscape / Video (16:9)</option>
                    <option value="portrait">Portrait (3:4)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs cursor-pointer shadow-md shadow-amber-500/20"
                >
                  Add to Gallery
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-5 space-y-4">
            <h4 className="font-semibold text-slate-100 text-sm">
              Confirm Photo Deletion
            </h4>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove this image from the gallery?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold cursor-pointer shadow-md shadow-rose-500/20"
              >
                Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
