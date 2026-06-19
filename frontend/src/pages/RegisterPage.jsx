import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiHome } from 'react-icons/fi';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const becomeHost = params.get('become') === 'host';

  const [form, setForm] = useState({ name: '', email: '', password: '', role: becomeHost ? 'host' : 'guest' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Account created! Welcome to StayHaven 🎉');
      navigate(form.role === 'host' ? '/host/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900"
          alt="Treehouse"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center">
              <FiHome className="text-white w-5 h-5" />
            </div>
            <span className="font-display font-bold text-2xl text-white">StayHaven</span>
          </Link>
          <div>
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              {becomeHost ? 'Start earning\nwith your space' : 'Join 2 million\ntravellers'}
            </h2>
            <p className="text-white/60 text-lg">
              {becomeHost
                ? 'List your property and reach guests from around the world.'
                : 'Create a free account and discover your next adventure.'}
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <FiHome className="text-white w-4 h-4" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">StayHaven</span>
          </Link>

          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Create account</h1>
          <p className="text-gray-500 mb-8">Fill in your details to get started</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-gray-100 rounded-xl">
            {[{ id: 'guest', label: '🧳 I\'m a traveller' }, { id: 'host', label: '🏠 I\'m a host' }].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setForm(f => ({ ...f, role: r.id }))}
                className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${form.role === r.id ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >{r.label}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="text" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field pl-10" placeholder="Jane Smith" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-field pl-10" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pl-10 pr-10" placeholder="Min. 6 characters" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</span>
                : `Create ${form.role === 'host' ? 'Host' : ''} Account`}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-6 leading-relaxed">
            By signing up, you agree to our{' '}
            <a href="#" className="text-gray-600 underline">Terms of Service</a> and{' '}
            <a href="#" className="text-gray-600 underline">Privacy Policy</a>
          </p>

          <p className="text-center text-gray-500 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-brand font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
