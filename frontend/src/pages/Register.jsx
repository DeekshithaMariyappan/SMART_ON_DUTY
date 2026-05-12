import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building, UserCircle2, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
    department: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
            className="w-full max-w-lg bg-bg-card backdrop-blur-xl border border-border-soft p-6 sm:p-8 rounded-[2rem] shadow-2xl transition-colors duration-300 shadow-shadow-card"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-text-main tracking-tight mb-2 transition-colors">Join SmartDuty!</h2>
              <p className="text-text-muted text-sm leading-relaxed font-medium mt-2 transition-colors">Create an account to manage your on-duty requests seamlessly.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm font-medium flex items-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 transition-colors">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary-500 transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-bg-panel border border-border-soft rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all text-text-main outline-none placeholder-text-muted text-sm font-medium shadow-sm"
                      placeholder="John Doe"
                      onChange={handleChange}
                      value={formData.name}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 transition-colors">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-bg-panel border border-border-soft rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all text-text-main outline-none placeholder-text-muted text-sm font-medium shadow-sm"
                      placeholder="e.g. user@gmail.com"
                      onChange={handleChange}
                      value={formData.email}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 transition-colors">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      name="password"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-bg-panel border border-border-soft rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all text-text-main outline-none placeholder-text-muted font-medium tracking-widest shadow-sm text-sm"
                      placeholder="••••••••"
                      onChange={handleChange}
                      value={formData.password}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 transition-colors">Department</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary-500 transition-colors">
                      <Building size={18} />
                    </div>
                    <input
                      type="text"
                      name="department"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-bg-panel border border-border-soft rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all text-text-main outline-none placeholder-text-muted text-sm font-medium shadow-sm"
                      placeholder="e.g. Computer Science"
                      onChange={handleChange}
                      value={formData.department}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-md shadow-shadow-glow text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 disabled:opacity-70 group hover:shadow-lg hover:-translate-y-0.5"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                  {!loading && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-text-muted border-t border-border-soft pt-6 transition-colors">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-500 font-bold transition-colors">
                Sign in
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
