import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { StarDisplay } from '../components/StarRating';

export default function Dashboard() {
  const { user } = useAuth();
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reviews/my')
      .then(res => setMyReviews(res.data.reviews))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const avgRating = myReviews.length
    ? (myReviews.reduce((sum, r) => sum + r.overallRating, 0) / myReviews.length).toFixed(1)
    : null;

  const mealCounts = myReviews.reduce((acc, r) => {
    acc[r.mealTiming] = (acc[r.mealTiming] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome header */}
      <div className="mb-10 animate-slide-up">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-2xl font-display font-bold text-brand-400">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              Hey, {user?.fullName?.split(' ')[0]}! 👋
            </h1>
            <p className="text-white/40 text-sm mt-0.5">{user?.uid} · {user?.hostel}</p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Reviews', value: myReviews.length, icon: '📝' },
          { label: 'Avg Rating Given', value: avgRating || '—', icon: '⭐' },
          { label: 'Your Hostel', value: user?.hostel, icon: '🏠' },
          { label: 'Meals Rated', value: Object.keys(mealCounts).length, icon: '🍴' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="card text-center">
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-2xl font-display font-bold text-white">{value}</div>
            <div className="text-xs text-white/35 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <Link to="/submit-review"
          className="card border-brand-500/20 hover:border-brand-500/40 bg-gradient-to-br from-brand-500/10 to-transparent transition-all group">
          <div className="flex items-center gap-4">
            <div className="text-4xl group-hover:scale-110 transition-transform">🍽️</div>
            <div>
              <h3 className="font-display font-bold text-white text-lg">Rate Today's Meal</h3>
              <p className="text-sm text-white/40">Submit a new mess review</p>
            </div>
            <span className="ml-auto text-brand-400 text-xl">→</span>
          </div>
        </Link>

        <Link to="/stats"
          className="card hover:border-white/20 transition-all group">
          <div className="flex items-center gap-4">
            <div className="text-4xl group-hover:scale-110 transition-transform">📊</div>
            <div>
              <h3 className="font-display font-bold text-white text-lg">View Stats</h3>
              <p className="text-sm text-white/40">Compare all hostel ratings</p>
            </div>
            <span className="ml-auto text-white/30 text-xl">→</span>
          </div>
        </Link>
      </div>

      {/* Recent reviews */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-display font-bold text-white">Your Recent Reviews</h2>
          {myReviews.length > 3 && (
            <Link to="/my-reviews" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
              View all →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : myReviews.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-4xl mb-3">🍴</div>
            <p className="text-white/40 mb-4">No reviews yet. Rate your first meal!</p>
            <Link to="/submit-review" className="btn-primary">Rate Now →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myReviews.slice(0, 3).map((review) => (
              <div key={review._id} className="card flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{review.mealTiming === 'Breakfast' ? '🌅' : review.mealTiming === 'Lunch' ? '☀️' : review.mealTiming === 'Snacks' ? '🍵' : '🌙'}</div>
                  <div>
                    <p className="font-medium text-white">{review.mealTiming} · {review.hostel}</p>
                    <p className="text-xs text-white/35">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarDisplay value={review.overallRating} size="sm" />
                  <span className="text-white font-bold text-sm">{review.overallRating}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
