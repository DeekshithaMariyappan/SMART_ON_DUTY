import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

export default function AdminDummyPage({ title }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto mt-20 bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-gray-700 text-center">
      <div className="w-20 h-20 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <Construction size={40} />
      </div>
      
      <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-4">{title}</h2>
      <p className="text-slate-500 font-medium mb-8">This module is currently under construction. Please check back later for updates!</p>
      
      <button onClick={() => navigate('/admin')} className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
      </button>
    </div>
  );
}
