import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ReviewCard from '../components/ReviewCard';
import toast from 'react-hot-toast';

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const { data } = await api.get('/reviews/my');
      setReviews(data.reviews);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch {
      toast.error('Could not delete review');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">My Reviews</h1>
          <p className="text-white/40">{reviews.length} review{reviews.length !== 1 ? 's' : ''} submitted</p>
        </div>
        <Link to="/submit-review" className="btn-primary">+ New Review</Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-white/40 text-lg mb-4">You haven't submitted any reviews yet.</p>
          <Link to="/submit-review" className="btn-primary">Rate Your First Meal →</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {reviews.map(review => (
            <ReviewCard
              key={review._id}
              review={{ ...review, user: { fullName: 'You', uid: review.user?.uid || '' } }}
              isOwn={true}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
