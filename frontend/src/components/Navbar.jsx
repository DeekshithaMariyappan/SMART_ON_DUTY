import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <nav className="bg-bg-main/80 backdrop-blur-md border-b border-border-soft sticky top-0 z-50 transition-colors duration-300 w-full shadow-sm shadow-shadow-card">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between h-16 w-full">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <motion.div whileHover={{ rotate: 10 }} className="mr-3 text-primary-500">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </motion.div>
            <span className="font-bold text-xl tracking-tight text-text-main transition-colors">
              Smart<span className="text-primary-500">Duty</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4 sm:space-x-6">
            {user?.role === 'Student' && (
               <div className="hidden lg:flex space-x-1 font-semibold text-sm mr-2 bg-bg-panel p-1 rounded-xl border border-border-soft transition-colors">
                 <Link to="/student/dashboard" className="px-4 py-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-card transition-all shadow-sm">Dashboard</Link>
                 <Link to="/student/track" className="px-4 py-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-card transition-all">Track Status</Link>
               </div>
            )}
            {(user?.role === 'Faculty' || user?.role === 'HOD') && (
               <div className="hidden lg:flex space-x-1 font-semibold text-sm mr-2 bg-bg-panel p-1 rounded-xl border border-border-soft transition-colors">
                 <Link to="/faculty/dashboard" className="px-4 py-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-card transition-all shadow-sm">Dashboard</Link>
               </div>
            )}
            {user?.role === 'Admin' && (
               <div className="hidden lg:flex space-x-1 font-semibold text-sm mr-2 bg-bg-panel p-1 rounded-xl border border-border-soft transition-colors">
                 <Link to="/admin/dashboard" className="px-4 py-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-bg-card transition-all shadow-sm">Dashboard</Link>
               </div>
            )}

            {user ? (
              <>
                <div className="flex flex-col items-end mr-2 hidden sm:flex">
                  <span className="text-sm font-semibold text-text-main transition-colors">{user.name}</span>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-text-muted bg-bg-panel border border-border-soft px-2 py-0.5 rounded-full mt-0.5 transition-colors">
                    {user.role}
                  </span>
                </div>
                <Link to="/profile" className="flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-bg-panel flex items-center justify-center text-primary-500 border border-border-soft hover:bg-bg-card transition-colors shadow-sm">
                    <UserIcon size={20} />
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors duration-200 ml-1"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <div className="space-x-3 ml-2 flex items-center">
                <Link to="/login" className="text-text-muted hover:text-text-main font-medium px-3 py-2 transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="bg-primary-600 hover:bg-primary-500 text-white font-bold px-5 py-2 rounded-lg shadow-md shadow-shadow-glow transition-all duration-200 hover:-translate-y-0.5">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
