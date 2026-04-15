import { StarDisplay } from './StarRating';

const mealColors = {
  Breakfast: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Lunch: 'bg-green-500/20 text-green-300 border-green-500/30',
  Snacks: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Dinner: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
};

const mealEmoji = { Breakfast: '🌅', Lunch: '☀️', Snacks: '🍵', Dinner: '🌙' };

export default function ReviewCard({ review, onDelete, isOwn }) {
  const { user, hostel, mealTiming, date, ratings, overallRating, comment, menuItems, createdAt } = review;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const ratingBars = [
    { label: 'Taste', value: ratings.taste },
    { label: 'Hygiene', value: ratings.hygiene },
    { label: 'Quantity', value: ratings.quantity },
    { label: 'Variety', value: ratings.variety },
  ];

  return (
    <div className="card hover:border-white/20 transition-all duration-200 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold font-display text-lg">
            {user?.fullName?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{user?.fullName || 'Unknown'}</p>
            <p className="text-xs text-white/40">{user?.uid} · {hostel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${mealColors[mealTiming]}`}>
            {mealEmoji[mealTiming]} {mealTiming}
          </span>
        </div>
      </div>

      {/* Overall Rating */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-display font-bold text-white">{overallRating}</span>
          <span className="text-white/30 text-sm">/5</span>
        </div>
        <StarDisplay value={overallRating} size="md" />
        <span className="ml-auto text-xs text-white/30">{date}</span>
      </div>

      {/* Rating breakdown */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {ratingBars.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-xs text-white/40 w-14">{label}</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all"
                style={{ width: `${(value / 5) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-white/60 w-3">{value}</span>
          </div>
        ))}
      </div>

      {/* Menu Items */}
      {menuItems && (
        <div className="mb-3 px-3 py-2 bg-white/5 rounded-lg">
          <p className="text-xs text-white/40 mb-0.5">Menu</p>
          <p className="text-sm text-white/70">{menuItems}</p>
        </div>
      )}

      {/* Comment */}
      {comment && (
        <p className="text-sm text-white/60 italic leading-relaxed">"{comment}"</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
        <span className="text-xs text-white/25">{formatDate(createdAt)}</span>
        {isOwn && onDelete && (
          <button
            onClick={() => onDelete(review._id)}
            className="text-xs text-red-400/60 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
