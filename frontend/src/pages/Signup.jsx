import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error('Please fill in all fields correctly');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Account created successfully!');
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
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight mb-2">Get started</h1>
          <p className="text-[#888888]">Create your SortMyScene account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-white border border-[#ddd] rounded text-[#1A1A1A] placeholder:text-[#aaa] focus:outline-none focus:border-[#FF3B5C] transition-colors"
            />
          </div>

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
              placeholder="Create a password"
              className="w-full px-4 py-3 bg-white border border-[#ddd] rounded text-[#1A1A1A] placeholder:text-[#aaa] focus:outline-none focus:border-[#FF3B5C] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
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
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[#888888] text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#FF3B5C] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
