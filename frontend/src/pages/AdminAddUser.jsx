import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function AdminAddUser() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultRole = searchParams.get('role') || 'Faculty';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: defaultRole,
    department: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      await api.post('/users/add', formData);
      setSuccess(`${formData.role} added successfully!`);
      setFormData({ name: '', email: '', password: '', role: defaultRole, department: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
      <button onClick={() => navigate('/admin')} className="mb-6 flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300">
        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
        <UserPlus size={24} className="mr-3 text-emerald-500" />
        Add New {defaultRole}
      </h2>

      {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl border border-red-200 dark:border-red-500/20">{error}</div>}
      {success && <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold rounded-xl border border-emerald-200 dark:border-emerald-500/20">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="john@university.edu" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Temporary Password</label>
          <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm tracking-widest" placeholder="Required" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role</label>
          <input 
            type="text" 
            disabled 
            value={formData.role === 'Faculty' ? 'Faculty Advisor' : formData.role === 'HOD' ? 'Head of Department (HOD)' : formData.role} 
            className="w-full px-4 py-3 bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl outline-none text-sm text-slate-500 font-bold cursor-not-allowed" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
          <input required type="text" name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="e.g. Computer Science" />
        </div>
        <button disabled={loading} type="submit" className="w-full py-3.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all disabled:opacity-50 mt-4">
          {loading ? 'Processing...' : '+ Create Account'}
        </button>
      </form>
    </div>
  );
}
