import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, CheckCircle, Navigation, Users, FileText, ArrowRight } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (user?.role === 'Student') navigate('/student/dashboard');
    else if (user?.role === 'Faculty' || user?.role === 'HOD') navigate('/faculty/dashboard');
    else if (user?.role === 'Admin') navigate('/admin/dashboard');
    else navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-bg-main overflow-hidden w-full selection:bg-primary-500/30 transition-colors duration-300">

      {/* Ambient background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-300/20 rounded-full blur-[120px] pointer-events-none transition-colors duration-300"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none transition-colors duration-300"></div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 relative z-10 w-full flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-10 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-bg-panel text-primary-600 text-sm font-bold border border-border-soft shadow-sm ring-1 ring-primary-500/20 backdrop-blur-sm transition-colors duration-300">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              Welcome to the Future of Institutional Workflow
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-text-main tracking-tight leading-[1.1] mb-6 drop-shadow-sm transition-colors duration-300"
          >
            The Intelligent Way to Manage <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-500 drop-shadow-sm">
              On-Duty Requests
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-text-muted mb-8 max-w-2xl mx-auto leading-relaxed font-medium transition-colors duration-300"
          >
            SmartDuty streamlines the entire OD application process. From student submissions to multi-level faculty approvals, tracking your institutional presence has never been easier.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-5 items-center"
          >
            {user ? (
              <button 
                onClick={handleDashboardRedirect}
                className="group flex items-center justify-center px-8 py-4 text-white bg-primary-600 hover:bg-primary-500 rounded-2xl font-bold text-lg shadow-md shadow-shadow-glow transition-all hover:-translate-y-1 hover:shadow-lg w-full sm:w-auto"
              >
                Go to My Dashboard
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="group flex items-center justify-center px-8 py-4 text-white bg-primary-600 hover:bg-primary-500 rounded-2xl font-bold text-lg shadow-md shadow-shadow-glow transition-all hover:-translate-y-1 hover:shadow-lg w-full sm:w-auto"
                >
                  Get Started For Free
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link 
                  to="/login"
                  className="flex items-center justify-center px-8 py-4 text-text-main bg-bg-panel hover:bg-bg-card border border-border-soft rounded-2xl font-bold text-lg shadow-sm w-full sm:w-auto transition-all hover:-translate-y-1 backdrop-blur-md"
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
