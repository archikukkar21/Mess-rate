import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const HOSTELS = ['Hostel A', 'Hostel B', 'Hostel C', 'Hostel D', 'Hostel E'];
const MEALS = [
  { value: 'Breakfast', emoji: '🌅', time: '7:30 – 9:30 AM' },
  { value: 'Lunch', emoji: '☀️', time: '12:30 – 2:30 PM' },
  { value: 'Snacks', emoji: '🍵', time: '4:30 – 6:00 PM' },
  { value: 'Dinner', emoji: '🌙', time: '7:30 – 9:30 PM' },
];

const RATING_FIELDS = [
  { key: 'taste', label: 'Taste', desc: 'How did the food taste?', icon: '😋' },
  { key: 'hygiene', label: 'Hygiene', desc: 'Was the kitchen/food clean?', icon: '🧼' },
  { key: 'quantity', label: 'Quantity', desc: 'Was the serving sufficient?', icon: '🥘' },
  { key: 'variety', label: 'Variety', desc: 'Was the menu varied?', icon: '🌈' },
];

export default function SubmitReview() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    hostel: user?.hostel || '',
    mealTiming: '',
    date: new Date().toISOString().split('T')[0],
    ratings: { taste: 0, hygiene: 0, quantity: 0, variety: 0 },
    comment: '',
    menuItems: ''
  });
  const [loading, setLoading] = useState(false);

  const setRating = (key, val) =>
    setForm(f => ({ ...f, ratings: { ...f.ratings, [key]: val } }));

  const overallPreview = () => {
    const { taste, hygiene, quantity, variety } = form.ratings;
    if (!taste || !hygiene || !quantity || !variety) return null;
    return ((taste + hygiene + quantity + variety) / 4).toFixed(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ratings } = form;
    if (!form.hostel || !form.mealTiming || !form.date)
      return toast.error('Please fill all required fields');
    if (!ratings.taste || !ratings.hygiene || !ratings.quantity || !ratings.variety)
      return toast.error('Please rate all categories');

    setLoading(true);
    try {
      await api.post('/reviews', form);
      toast.success('Review submitted! 🎉');
      navigate('/my-reviews');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const overall = overallPreview();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Rate Your Meal</h1>
        <p className="text-white/40">Share your honest feedback to help improve mess quality</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
        {/* Hostel & Date */}
        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-white">Meal Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Hostel *</label>
              <select
                value={form.hostel}
                onChange={e => setForm(f => ({ ...f, hostel: e.target.value }))}
                className="input-field"
              >
                <option value="" disabled className="bg-[#1a1a1a]">Select hostel</option>
                {HOSTELS.map(h => <option key={h} value={h} className="bg-[#1a1a1a]">{h}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Date *</label>
              <input
                type="date"
                value={form.date}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Meal Timing */}
        <div className="card">
          <h2 className="font-display font-semibold text-white mb-4">Meal Timing *</h2>
          <div className="grid grid-cols-2 gap-3">
            {MEALS.map(meal => (
              <button
                key={meal.value}
                type="button"
                onClick={() => setForm(f => ({ ...f, mealTiming: meal.value }))}
                className={`p-4 rounded-xl border transition-all text-left ${
                  form.mealTiming === meal.value
                    ? 'border-brand-400 bg-brand-500/15 text-white'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70'
                }`}
              >
                <div className="text-2xl mb-1">{meal.emoji}</div>
                <div className="font-semibold text-sm">{meal.value}</div>
                <div className="text-xs opacity-60 mt-0.5">{meal.time}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Ratings */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white">Rate the Meal *</h2>
            {overall && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-500/15 rounded-xl border border-brand-500/30">
                <span className="text-brand-400 font-display font-bold text-lg">{overall}</span>
                <span className="text-brand-400/60 text-xs">/5 overall</span>
              </div>
            )}
          </div>
          <div className="space-y-5">
            {RATING_FIELDS.map(({ key, label, desc, icon }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <p className="font-medium text-white text-sm">{label}</p>
                    <p className="text-xs text-white/35">{desc}</p>
                  </div>
                </div>
                <StarRating
                  value={form.ratings[key]}
                  onChange={(val) => setRating(key, val)}
                  size="md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Optional fields */}
        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-white">Additional Info <span className="text-white/30 text-sm font-normal">(optional)</span></h2>
          <div>
            <label className="label">Menu Items Served</label>
            <input
              type="text"
              value={form.menuItems}
              onChange={e => setForm(f => ({ ...f, menuItems: e.target.value }))}
              placeholder="e.g. Dal, Rice, Aloo Sabzi, Chapati, Curd"
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Comment</label>
            <textarea
              value={form.comment}
              onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
              placeholder="Share your experience..."
              rows={3}
              maxLength={500}
              className="input-field resize-none"
            />
            <p className="text-xs text-white/25 text-right mt-1">{form.comment.length}/500</p>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </span>
          ) : 'Submit Review →'}
        </button>
      </form>
    </div>
  );
}
