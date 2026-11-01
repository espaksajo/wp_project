import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Logged in successfully!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F2] flex items-center justify-center px-6">
      <Toaster position="top-right" />

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-2">Welcome back</h1>
          <p className="text-[#888888]">Sign in to your SortMyScene account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-white border border-[#ddd] rounded text-[#1A1A1A] placeholder:text-[#aaa] focus:outline-none focus:border-[#FF3B5C] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-white border border-[#ddd] rounded text-[#1A1A1A] placeholder:text-[#aaa] focus:outline-none focus:border-[#FF3B5C] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1A1A1A] text-white font-medium rounded btn-lift hover:bg-[#333333] transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[#888888] text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#FF3B5C] font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
