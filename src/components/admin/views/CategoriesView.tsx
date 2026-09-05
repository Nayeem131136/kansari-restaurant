import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { useRestaurant } from '../../../context/RestaurantContext';
import { MenuCategory } from '../../../types/admin';
import { Plus, Edit, Trash2, X, FolderTree } from 'lucide-react';

export function CategoriesView() {
  const { success, error } = useToast();
  const { refreshData } = useRestaurant();

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    bengaliName: '',
    subLabel: '',
    sortOrder: 1,
    isVisible: true
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getAdminCategories();
      setCategories(res.categories);
    } catch (err: any) {
      error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      bengaliName: '',
      subLabel: '',
      sortOrder: categories.length + 1,
      isVisible: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: MenuCategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      bengaliName: cat.bengaliName,
      subLabel: cat.subLabel || '',
      sortOrder: cat.sortOrder || 1,
      isVisible: cat.isVisible !== false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.bengaliName) {
      error('Please provide both English and Bengali names');
      return;
    }

    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
        success(`Category "${formData.name}" updated`);
      } else {
        await api.createCategory(formData);
        success(`Category "${formData.name}" created`);
      }
      setIsModalOpen(false);
      fetchCategories();
      refreshData();
    } catch (err: any) {
      error(err.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCategory(id);
      success('Category removed');
      setDeleteConfirmId(null);
      fetchCategories();
      refreshData();
    } catch (err: any) {
      error(err.message || 'Cannot delete category');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-100 flex items-center gap-2">
            Menu Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize culinary courses, starters, biryani, fish, meat, desserts, and drinks.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table / List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">No categories created yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-medium text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">English Category</th>
                  <th className="py-3 px-4">Bengali Title</th>
                  <th className="py-3 px-4">Sub-label</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-300">
                      #{cat.sortOrder}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-100 text-sm">
                      {cat.name}
                    </td>
                    <td className="py-3 px-4 font-serif text-amber-400 font-medium text-sm">
                      {cat.bengaliName}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {cat.subLabel || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        cat.isVisible !== false
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {cat.isVisible !== false ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(cat.id)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-semibold text-slate-100 text-base">
                {editingCategory ? `Edit "${editingCategory.name}"` : 'Create Category'}
              </h3>
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
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. KANSARI SPECIALS"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Bengali Category Title (বাংলা নাম) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.bengaliName}
                  onChange={(e) => setFormData({ ...formData, bengaliName: e.target.value })}
                  placeholder="যেমন: কাঁসারী স্পেশাল"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Sub-label / English Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subLabel}
                  onChange={(e) => setFormData({ ...formData, subLabel: e.target.value })}
                  placeholder="e.g. Chef's Signatures"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
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

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.isVisible}
                      onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-800"
                    />
                    <span>Visible in Menu</span>
                  </label>
                </div>
              </div>

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
                  {editingCategory ? 'Save Category' : 'Create Category'}
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
              Confirm Category Deletion
            </h4>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete this category? (Note: Categories containing existing menu items cannot be removed).
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
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
