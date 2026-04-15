import { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const HOSTELS = ['', 'Hostel A', 'Hostel B', 'Hostel C', 'Hostel D', 'Hostel E'];
const MEALS = ['', 'Breakfast', 'Lunch', 'Snacks', 'Dinner'];

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ hostel: '', mealTiming: '', date: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchReviews = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (filters.hostel) params.append('hostel', filters.hostel);
      if (filters.mealTiming) params.append('mealTiming', filters.mealTiming);
      if (filters.date) params.append('date', filters.date);

      const { data } = await api.get(`/reviews?${params}`);
      setReviews(data.reviews);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchReviews(1); }, [fetchReviews]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews(pagination.page);
    } catch {
      toast.error('Could not delete review');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-display font-bold text-white mb-2">All Reviews</h1>
        <p className="text-white/40">{pagination.total} reviews from hostelites</p>
      </div>

      {/* Filters */}
      <div className="card mb-8 animate-slide-up">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Hostel</label>
            <select
              value={filters.hostel}
              onChange={e => setFilters(f => ({ ...f, hostel: e.target.value }))}
              className="input-field"
            >
              {HOSTELS.map(h => <option key={h} value={h} className="bg-[#1a1a1a]">{h || 'All Hostels'}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Meal Timing</label>
            <select
              value={filters.mealTiming}
              onChange={e => setFilters(f => ({ ...f, mealTiming: e.target.value }))}
              className="input-field"
            >
              {MEALS.map(m => <option key={m} value={m} className="bg-[#1a1a1a]">{m || 'All Meals'}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              value={filters.date}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
              className="input-field"
            />
          </div>
        </div>
        {(filters.hostel || filters.mealTiming || filters.date) && (
          <button
            onClick={() => setFilters({ hostel: '', mealTiming: '', date: '' })}
            className="mt-3 text-sm text-white/40 hover:text-brand-400 transition-colors"
          >
            ✕ Clear filters
          </button>
        )}
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🍽️</div>
          <p className="text-white/40 text-lg">No reviews found for selected filters.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map(review => (
              <ReviewCard
                key={review._id}
                review={review}
                isOwn={user && review.user?._id === user.id}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => fetchReviews(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn-outline px-4 py-2 text-sm disabled:opacity-30"
              >← Prev</button>
              <span className="px-4 py-2 text-white/40 text-sm">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => fetchReviews(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="btn-outline px-4 py-2 text-sm disabled:opacity-30"
              >Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
