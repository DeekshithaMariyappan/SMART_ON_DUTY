import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex w-full relative min-h-[calc(100vh-64px)] overflow-hidden bg-bg-main transition-colors duration-300">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-300/20 rounded-full blur-[120px] pointer-events-none transition-colors duration-300"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none transition-colors duration-300"></div>

      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row relative z-10">
        
        {/* Left Side - Form Card */}
        <div className="w-full md:w-1/2 flex items-start justify-center p-6 sm:p-8 lg:p-12 mt-6 md:mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-bg-card backdrop-blur-xl border border-border-soft p-6 sm:p-8 rounded-[2rem] shadow-2xl transition-colors duration-300 shadow-shadow-card"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-text-main tracking-tight mb-2 transition-colors">Welcome Back!</h2>
              <p className="text-text-muted text-sm leading-relaxed font-medium mt-2 transition-colors">Track your OD approvals and keep progress in one place.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm font-medium flex items-center">
                <ShieldCheck size={16} className="mr-2 text-red-500" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-bg-panel border border-border-soft rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all text-text-main outline-none placeholder-text-muted text-sm font-medium shadow-sm"
                    placeholder="e.g. user@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-bg-panel border border-border-soft rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all text-text-main outline-none placeholder-text-muted font-medium tracking-widest shadow-sm text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-md shadow-shadow-glow text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 disabled:opacity-70 group hover:shadow-lg hover:-translate-y-0.5"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                  {!loading && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-text-muted border-t border-border-soft pt-6 transition-colors">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-500 font-bold transition-colors">
                Register now
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden md:flex md:w-1/2 items-start justify-center p-8 lg:p-12 mt-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative w-full max-w-lg"
          >
            <div className="absolute inset-0 bg-primary-300/20 blur-[100px] rounded-full transition-colors duration-300"></div>
            <img 
              src="/illustration.png" 
              alt="Programming Illustration" 
              className="w-full relative z-10 drop-shadow-2xl hover:-translate-y-2 transition-transform duration-700" 
            />
          </motion.div>
        </div>

      </div>
    </div>
  );
}
