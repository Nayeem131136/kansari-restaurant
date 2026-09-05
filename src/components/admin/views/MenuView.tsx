import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { useRestaurant } from '../../../context/RestaurantContext';
import { MenuItem, MenuCategory } from '../../../types/admin';
import { 
  Plus, 
  Search, 
  Upload, 
  Edit, 
  Trash2, 
  Star, 
  CheckCircle2, 
  XCircle, 
  X, 
  Image as ImageIcon,
  UtensilsCrossed,
  Filter
} from 'lucide-react';

export function MenuView() {
  const { success, error } = useToast();
  const { refreshData } = useRestaurant();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    bengaliName: '',
    price: '',
    categoryId: '',
    description: '',
    bengaliDescription: '',
    image: '',
    tag: '',
    badge: '',
    featured: false,
    available: true,
    sortOrder: 1
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [menuRes, catRes] = await Promise.all([
        api.getMenu(),
        api.getAdminCategories()
      ]);
      setMenuItems(menuRes.menuItems);
      setCategories(catRes.categories);
    } catch (err: any) {
      error('Failed to load menu data');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      bengaliName: '',
      price: '৳',
      categoryId: categories[0]?.id || '',
      description: '',
      bengaliDescription: '',
      image: '',
      tag: '',
      badge: '',
      featured: false,
      available: true,
      sortOrder: menuItems.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      bengaliName: item.bengaliName,
      price: item.price,
      categoryId: item.categoryId,
      description: item.description || '',
      bengaliDescription: item.bengaliDescription || '',
      image: item.image,
      tag: item.tag || '',
      badge: item.badge || '',
      featured: Boolean(item.featured),
      available: item.available,
      sortOrder: item.sortOrder || 1
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await api.uploadImage(file);
      setFormData(prev => ({ ...prev, image: res.url }));
      success('Image uploaded successfully');
    } catch (err: any) {
      error(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.bengaliName || !formData.price || !formData.categoryId) {
      error('Please complete all required fields (Name, Bengali Name, Price, Category)');
      return;
    }

    try {
      if (editingItem) {
        await api.updateMenuItem(editingItem.id, formData);
        success(`"${formData.name}" updated successfully`);
      } else {
        await api.createMenuItem(formData);
        success(`"${formData.name}" added to menu`);
      }
      setIsModalOpen(false);
      fetchData();
      refreshData();
    } catch (err: any) {
      error(err.message || 'Failed to save menu item');
    }
  };

  const handleToggleAvailable = async (item: MenuItem) => {
    try {
      await api.toggleMenuItemAvailability(item.id);
      success(`"${item.name}" availability updated`);
      fetchData();
      refreshData();
    } catch (err: any) {
      error(err.message || 'Failed to toggle availability');
    }
  };

  const handleToggleFeatured = async (item: MenuItem) => {
    try {
      await api.toggleMenuItemFeatured(item.id);
      success(`"${item.name}" signature dish status updated`);
      fetchData();
      refreshData();
    } catch (err: any) {
      error(err.message || 'Failed to toggle featured status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteMenuItem(id);
      success('Menu item deleted');
      setDeleteConfirmId(null);
      fetchData();
      refreshData();
    } catch (err: any) {
      error(err.message || 'Failed to delete menu item');
    }
  };

  // Filtered items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.bengaliName.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === 'ALL' || item.categoryId === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-100 flex items-center gap-2">
            Menu & Food Items
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage food dishes, raw photography, Bengali names, pricing, and signature highlights.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-800/80">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All Categories ({menuItems.length})
          </button>
          {categories.map(cat => {
            const count = menuItems.filter(m => m.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dish by English or Bengali name (e.g., Kacchi, ইলিশ, কালাভুনা)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
          />
        </div>

      </div>

      {/* Menu Items Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs">
          Loading menu catalog...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-16 text-center text-slate-400 text-xs bg-slate-900/40 rounded-xl border border-slate-800">
          No food items match your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map(item => {
            const categoryObj = categories.find(c => c.id === item.categoryId);
            return (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm group"
              >
                {/* Image & Badges */}
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                      !item.available ? 'grayscale opacity-50' : ''
                    }`}
                  />
                  
                  {/* Category Tag */}
                  <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-semibold text-slate-300 px-2 py-0.5 rounded">
                    {categoryObj?.name || 'Dish'}
                  </div>

                  {/* Availability Badge */}
                  <button
                    onClick={() => handleToggleAvailable(item)}
                    className={`absolute top-2.5 right-2.5 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border transition-all cursor-pointer shadow-sm ${
                      item.available
                        ? 'bg-emerald-500/90 text-slate-950 border-emerald-400 font-bold'
                        : 'bg-rose-500/90 text-white border-rose-400 font-bold'
                    }`}
                    title="Click to toggle availability"
                  >
                    {item.available ? 'In Stock' : 'Sold Out'}
                  </button>

                  {/* Featured / Signature Star */}
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className={`absolute bottom-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                      item.featured
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-amber-400'
                    }`}
                    title={item.featured ? 'Featured Signature Dish' : 'Mark as Signature Dish'}
                  >
                    <Star size={13} fill={item.featured ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-100 text-sm leading-snug">
                          {item.name}
                        </h3>
                        <p className="font-serif text-xs text-amber-400 font-medium mt-0.5">
                          {item.bengaliName}
                        </p>
                      </div>
                      <span className="font-mono text-sm font-bold text-amber-400 shrink-0 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {item.price}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {item.bengaliDescription || item.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Order: #{item.sortOrder || 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 cursor-pointer transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Food Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl my-8 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-semibold text-slate-100 text-base">
                {editingItem ? `Edit "${editingItem.name}"` : 'Add New Food Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm max-h-[80vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    English Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Grand Kansari Mutton Kacchi"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Bengali Name (বাংলা নাম) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bengaliName}
                    onChange={(e) => setFormData({ ...formData, bengaliName: e.target.value })}
                    placeholder="যেমন: গ্র্যান্ড কাঁসারী খাসির কাচ্চি"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Price in BDT (মূল্য) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="৳৪৮০"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Menu Category *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.bengaliName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload & URL */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Food Photography (Raw Dish Picture)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-24 h-20 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-slate-600" size={24} />
                    )}
                  </div>
                  <div className="w-full space-y-2">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors">
                      <Upload size={13} />
                      <span>{uploadingImage ? 'Uploading Image...' : 'Upload Image File'}</span>
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

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Bengali Description (বাংলা বর্ণনা)
                </label>
                <textarea
                  rows={2}
                  value={formData.bengaliDescription}
                  onChange={(e) => setFormData({ ...formData, bengaliDescription: e.target.value })}
                  placeholder="খাবারের ঐতিহ্য, উপাদান ও স্বাদের সংক্ষিপ্ত বিবরণ..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-serif text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  English Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ingredients and culinary preparation details..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              {/* Tags & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    English Tag
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. SLOW BRAISED"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Bengali Badge
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="যেমন: সনাতন ঐতিহ্য"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 font-mono"
                  />
                </div>
              </div>

              {/* Checkboxes for Featured and Available */}
              <div className="flex items-center gap-6 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-800 cursor-pointer"
                  />
                  <span>Feature in "Signature Dishes" Section</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-800 cursor-pointer"
                  />
                  <span>Currently Available (In Stock)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
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
                  {editingItem ? 'Save Changes' : 'Create Food Item'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-5 space-y-4">
            <h4 className="font-semibold text-slate-100 text-sm">
              Confirm Food Item Deletion
            </h4>
            <p className="text-xs text-slate-400">
              Are you sure you want to permanently remove this dish from the menu? It will be removed from the live website immediately.
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
                Delete Dish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
