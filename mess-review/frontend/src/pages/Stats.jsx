import { useEffect, useState } from 'react';
import api from '../utils/api';
import { StarDisplay } from '../components/StarRating';

const mealEmoji = { Breakfast: '🌅', Lunch: '☀️', Snacks: '🍵', Dinner: '🌙' };
const mealOrder = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

function RatingBar({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/40 w-16 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(value / 5) * 100}%`,
            background: `hsl(${(value / 5) * 120}, 70%, 55%)`
          }}
        />
      </div>
      <span className="text-xs font-semibold text-white w-6 text-right">{value}</span>
    </div>
  );
}

export default function Stats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeHostel, setActiveHostel] = useState('All');

  const HOSTELS = ['All', 'Hostel A', 'Hostel B', 'Hostel C', 'Hostel D', 'Hostel E'];

  useEffect(() => {
    api.get('/reviews/stats')
      .then(res => setStats(res.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeHostel === 'All' ? stats : stats.filter(s => s.hostel === activeHostel);

  // Group by hostel for leaderboard
  const hostelAvgs = HOSTELS.slice(1).map(h => {
    const hostelStats = stats.filter(s => s.hostel === h);
    if (!hostelStats.length) return { hostel: h, avg: null, total: 0 };
    const avg = (hostelStats.reduce((sum, s) => sum + s.avgOverall, 0) / hostelStats.length).toFixed(1);
    const total = hostelStats.reduce((sum, s) => sum + s.totalReviews, 0);
    return { hostel: h, avg: parseFloat(avg), total };
  }).filter(h => h.avg !== null).sort((a, b) => b.avg - a.avg);

  // Group filtered by meal
  const byMeal = mealOrder.map(meal => ({
    meal,
    data: filtered.filter(s => s.mealTiming === meal)
  })).filter(m => m.data.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Mess Statistics</h1>
        <p className="text-white/40">Aggregated ratings across all hostels and meal timings</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : stats.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-white/40">No data yet. Be the first to submit a review!</p>
        </div>
      ) : (
        <>
          {/* Leaderboard */}
          {hostelAvgs.length > 0 && (
            <div className="card mb-8 animate-slide-up">
              <h2 className="font-display font-bold text-white text-xl mb-5">🏆 Hostel Leaderboard</h2>
              <div className="space-y-3">
                {hostelAvgs.map((h, i) => (
                  <div key={h.hostel} className="flex items-center gap-4">
                    <span className={`text-lg font-display font-bold w-8 text-center ${
                      i === 0 ? 'text-yellow-400' : i === 1 ? 'text-white/60' : i === 2 ? 'text-orange-400' : 'text-white/30'
                    }`}>{i + 1}</span>
                    <span className="font-medium text-white w-20">{h.hostel}</span>
                    <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all duration-700"
                        style={{ width: `${(h.avg / 5) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 min-w-[80px] justify-end">
                      <span className="font-display font-bold text-white">{h.avg}</span>
                      <span className="text-xs text-white/30">({h.total} reviews)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hostel filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {HOSTELS.map(h => (
              <button
                key={h}
                onClick={() => setActiveHostel(h)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  activeHostel === h
                    ? 'border-brand-400 bg-brand-500/15 text-brand-400'
                    : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Stats by meal */}
          <div className="space-y-8">
            {byMeal.map(({ meal, data }) => (
              <div key={meal}>
                <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
                  <span>{mealEmoji[meal]}</span> {meal}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.sort((a, b) => b.avgOverall - a.avgOverall).map((s) => (
                    <div key={`${s.hostel}-${s.mealTiming}`} className="card hover:border-white/20 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-display font-bold text-white">{s.hostel}</h3>
                          <p className="text-xs text-white/35">{s.totalReviews} reviews</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-display font-bold text-white">{s.avgOverall}</div>
                          <StarDisplay value={s.avgOverall} size="sm" />
                        </div>
                      </div>
                      <div className="space-y-2 mt-3 pt-3 border-t border-white/10">
                        <RatingBar label="Taste" value={s.avgTaste} />
                        <RatingBar label="Hygiene" value={s.avgHygiene} />
                        <RatingBar label="Quantity" value={s.avgQuantity} />
                        <RatingBar label="Variety" value={s.avgVariety} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
