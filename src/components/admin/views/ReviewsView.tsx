import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { useRestaurant } from '../../../context/RestaurantContext';
import { Review } from '../../../types/admin';
import { Plus, Star, Trash2, Edit, X } from 'lucide-react';

export function ReviewsView() {
  const { success, error } = useToast();
  const { refreshData } = useRestaurant();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    text: '',
    date: '',
    rating: 5,
    published: true
  });

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getAdminReviews();
      setReviews(res.reviews);
    } catch (err: any) {
      error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleOpenAdd = () => {
    setEditingReview(null);
    setFormData({
      name: '',
      text: '',
      date: new Date().toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' }),
      rating: 5,
      published: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rev: Review) => {
    setEditingReview(rev);
    setFormData({
      name: rev.name,
      text: rev.text,
      date: rev.date,
      rating: rev.rating || 5,
      published: rev.published !== false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.text) {
      error('Please provide reviewer name and testimonial message');
      return;
    }

    try {
      if (editingReview) {
        await api.updateReview(editingReview.id, formData);
        success('Review updated successfully');
      } else {
        await api.createReview(formData);
        success('Review created successfully');
      }
      setIsModalOpen(false);
      fetchReviews();
      refreshData();
    } catch (err: any) {
      error(err.message || 'Failed to save review');
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await api.toggleReviewPublish(id);
      success('Review publication status updated');
      fetchReviews();
      refreshData();
    } catch (err: any) {
      error(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteReview(id);
      success('Review deleted');
      setDeleteConfirmId(null);
      fetchReviews();
      refreshData();
    } catch (err: any) {
      error(err.message || 'Failed to delete review');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-100 flex items-center gap-2">
            Customer Testimonials & Reviews
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage diner feedback displayed on the customer-facing website.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading testimonials...</div>
      ) : reviews.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs">No reviews found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map(rev => (
            <div
              key={rev.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-100 text-sm">{rev.name}</h3>
                    <span className="text-[11px] text-slate-400 font-mono">{rev.date}</span>
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={13}
                        fill={star <= rev.rating ? 'currentColor' : 'none'}
                        className={star <= rev.rating ? 'text-amber-400' : 'text-slate-700'}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed pt-1">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => handleTogglePublish(rev.id)}
                  className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                    rev.published
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {rev.published ? 'Published' : 'Hidden / Draft'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(rev)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(rev.id)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-semibold text-slate-100 text-base">
                {editingReview ? 'Edit Testimonial' : 'Add Testimonial'}
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
                  Customer / Reviewer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. তাহসান রহমান (Tahsan Rahman)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Display Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. অক্টোবর ২০২৫"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-serif"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 cursor-pointer"
                  >
                    <option value={5}>5 Stars (★★★★★)</option>
                    <option value={4}>4 Stars (★★★★☆)</option>
                    <option value={3}>3 Stars (★★★☆☆)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Review Text / Quote *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="কাচ্চি বিরিয়ানির মাংস এত তুলতুলে আর চালের সুবাস চমৎকার..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-serif text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-800"
                  />
                  <span>Publish immediately on website</span>
                </label>
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
                  Save Review
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
              Confirm Testimonial Deletion
            </h4>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete this customer review?
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
