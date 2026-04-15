import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const HOSTELS = ['Hostel A', 'Hostel B', 'Hostel C', 'Hostel D', 'Hostel E'];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', uid: '', password: '', confirmPassword: '', hostel: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.uid || !form.password || !form.hostel)
      return toast.error('All fields are required');
    if (form.password.length < 6)
      return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword)
      return toast.error('Passwords do not match');

    setLoading(true);
    try {
      const data = await signup({ fullName: form.fullName, uid: form.uid, password: form.password, hostel: form.hostel });
      toast.success(`Account created! Welcome, ${data.user.fullName.split(' ')[0]}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎓</div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/40">Join your hostel's review community</p>
        </div>

        <div className="card border-white/15">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">University ID (UID)</label>
              <input
                type="text"
                name="uid"
                value={form.uid}
                onChange={handleChange}
                placeholder="e.g. 22BCS001"
                className="input-field uppercase"
              />
              <p className="text-xs text-white/25 mt-1">This will be your login credential</p>
            </div>

            <div>
              <label className="label">Hostel</label>
              <select
                name="hostel"
                value={form.hostel}
                onChange={handleChange}
                className="input-field"
              >
                <option value="" disabled className="bg-[#1a1a1a]">Select your hostel</option>
                {HOSTELS.map(h => (
                  <option key={h} value={h} className="bg-[#1a1a1a]">{h}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
