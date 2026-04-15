import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '⭐', title: 'Rate Every Meal', desc: 'Give detailed ratings for taste, hygiene, quantity and variety across all meal timings.' },
  { icon: '🏠', title: 'All Hostels', desc: 'Browse and compare mess food quality across Hostel A through E in real-time.' },
  { icon: '📊', title: 'Live Stats', desc: 'See aggregated ratings and trends to know which mess is serving the best food today.' },
  { icon: '🔒', title: 'Verified Students', desc: 'Login with your University ID (UID) to ensure all reviews come from real hostelites.' },
];

const meals = [
  { time: 'Breakfast', emoji: '🌅', timing: '7:30 – 9:30 AM', color: 'from-yellow-500/20 to-transparent' },
  { time: 'Lunch', emoji: '☀️', timing: '12:30 – 2:30 PM', color: 'from-green-500/20 to-transparent' },
  { time: 'Snacks', emoji: '🍵', timing: '4:30 – 6:00 PM', color: 'from-purple-500/20 to-transparent' },
  { time: 'Dinner', emoji: '🌙', timing: '7:30 – 9:30 PM', color: 'from-blue-500/20 to-transparent' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="py-20 md:py-28 text-center relative">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[600px] h-[300px] bg-brand-500/10 rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6 animate-fade-in">
          <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
          Hostel Food Transparency Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-[1.05] mb-6 animate-slide-up">
          Your Mess,<br />
          <span className="text-brand-400">Your Voice.</span>
        </h1>
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
          Rate hostel mess food across all meal timings. Help fellow students make informed choices and push mess management for better quality.
        </p>

        <div className="flex flex-wrap gap-3 justify-center animate-slide-up">
          {user ? (
            <>
              <Link to="/submit-review" className="btn-primary text-base px-7 py-3">
                Rate Today's Meal →
              </Link>
              <Link to="/reviews" className="btn-outline text-base px-7 py-3">
                Browse Reviews
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup" className="btn-primary text-base px-7 py-3">
                Get Started Free →
              </Link>
              <Link to="/reviews" className="btn-outline text-base px-7 py-3">
                View Reviews
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Meal timings */}
      <section className="py-12 border-t border-white/10">
        <p className="text-center text-white/30 text-sm font-medium uppercase tracking-widest mb-8">Meal Timings Covered</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {meals.map((meal) => (
            <div key={meal.time} className={`card bg-gradient-to-br ${meal.color} text-center`}>
              <div className="text-4xl mb-2">{meal.emoji}</div>
              <h3 className="font-display font-bold text-white text-lg">{meal.time}</h3>
              <p className="text-xs text-white/40 mt-1">{meal.timing}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-white/10">
        <h2 className="text-3xl font-display font-bold text-white text-center mb-12">
          Why <span className="text-brand-400">MessRate</span>?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="card hover:border-brand-500/30 transition-all group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
              <h3 className="font-display font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-16 border-t border-white/10 text-center">
          <div className="card max-w-2xl mx-auto bg-gradient-to-br from-brand-500/10 to-transparent border-brand-500/20">
            <h2 className="text-3xl font-display font-bold text-white mb-3">Ready to Rate?</h2>
            <p className="text-white/50 mb-6">Sign up with your University ID and start reviewing your hostel mess today.</p>
            <Link to="/signup" className="btn-primary text-base px-8 py-3">
              Create Account →
            </Link>
          </div>
        </section>
      )}

      <footer className="border-t border-white/10 py-8 text-center text-white/25 text-sm">
        MessRate © {new Date().getFullYear()} — Built for hostelites, by hostelites.
      </footer>
    </div>
  );
}
