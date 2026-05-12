import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Calendar, FileText, ToggleLeft, ToggleRight, UserCheck } from 'lucide-react';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [availability, setAvailability] = useState(user.availability || 'Available');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
    fetchMe();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests');
      setRequests(res.data.filter(r => r.status === 'Pending'));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchMe = async () => {
    try {
      const res = await api.get('/users/me');
      setAvailability(res.data.availability);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvailabilityToggle = async (status) => {
    try {
      await api.put('/users/availability', { availability: status });
      setAvailability(status);
    } catch (err) {
      console.error(err);
      alert('Failed to update availability');
    }
  };

  const handleAction = async (id, status) => {
    setActionLoading(id);
    try {
      await api.put(`/requests/${id}/approve`, { status });
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert('Failed to update request');
    }
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-bg-card backdrop-blur-xl p-6 rounded-[2rem] shadow-xl shadow-shadow-card border border-border-soft transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold text-text-main transition-colors">Review Requests</h1>
          <p className="text-text-muted mt-1 font-medium transition-colors">Manage pending On-Duty applications from students</p>
        </div>
        
        {user?.role !== 'HOD' && (
          <div className="mt-4 md:mt-0 flex items-center bg-bg-panel p-2 rounded-2xl border border-border-soft transition-colors">
            <span className="text-sm font-semibold text-text-muted mr-4 ml-2 flex items-center transition-colors">
              <UserCheck size={16} className="mr-2" /> My Status
            </span>
            <div className="flex space-x-1">
              {['Available', 'Busy', 'Absent'].map(status => (
                <button
                  key={status}
                  onClick={() => handleAvailabilityToggle(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    availability === status
                      ? status === 'Available' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 shadow-sm' 
                        : status === 'Busy' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                      : 'text-text-muted hover:bg-bg-card border border-transparent'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text-main px-1 mb-4 flex items-center transition-colors">
          <Clock size={18} className="mr-2 text-primary-500" />
          Pending Approvals
          <span className="ml-3 bg-primary-100 dark:bg-primary-500/20 border border-primary-500/20 text-primary-600 dark:text-primary-300 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {requests.length}
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="bg-bg-panel p-6 rounded-[2rem] border border-border-soft h-48 animate-pulse shadow-sm transition-colors"></div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 bg-bg-panel backdrop-blur-md p-12 rounded-[2rem] border border-border-soft text-center flex flex-col items-center shadow-md transition-colors duration-300">
              <CheckCircle size={48} className="text-primary-500 mb-4 drop-shadow-sm" />
              <h3 className="text-xl font-bold text-text-main transition-colors">You're all caught up!</h3>
              <p className="text-text-muted mt-2 font-medium transition-colors">No pending OD requests require your attention right now.</p>
            </div>
          ) : (
            <AnimatePresence>
              {requests.map((req, idx) => (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-bg-card backdrop-blur-xl p-6 rounded-[2rem] border border-border-soft shadow-xl flex flex-col justify-between group hover:shadow-2xl hover:border-primary-500/30 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-primary-500 shadow-sm"></div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-2 pr-4">
                      <h3 className="font-bold text-text-main text-lg transition-colors">{req.reason}</h3>
                    </div>
                    
                    <div className="flex items-center text-sm font-bold text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/40 border border-primary-500/20 w-fit px-3 py-1.5 rounded-xl mb-4 shadow-sm transition-colors">
                      <UserCheck size={16} className="mr-2 opacity-80" />
                      {req.studentId?.name || 'Unknown Student'}
                    </div>

                    <p className="text-text-muted text-sm mb-5 line-clamp-3 leading-relaxed transition-colors">{req.eventDetails}</p>
                    
                    {req.posterUrl && req.paymentProofUrl && (
                      <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                        <div className="rounded-2xl overflow-hidden border border-border-soft bg-bg-panel flex justify-center py-2 transition-colors">
                          <img src={`http://localhost:5000${req.posterUrl}`} alt="Event Poster" className="max-w-full max-h-48 object-contain rounded-xl" />
                        </div>
                        <div className="rounded-2xl overflow-hidden border border-border-soft bg-bg-panel flex justify-center py-2 transition-colors">
                          <img src={`http://localhost:5000${req.paymentProofUrl}`} alt="Proof of Payment" className="max-w-full max-h-48 object-contain rounded-xl" />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs font-bold text-text-muted mb-6 bg-bg-panel p-3 rounded-xl border border-border-soft transition-colors">
                      <Calendar size={14} className="mr-2 text-primary-500" />
                      {new Date(req.startDate).toLocaleDateString()} &mdash; {new Date(req.endDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <button
                      onClick={() => handleAction(req._id, 'Rejected')}
                      disabled={actionLoading === req._id}
                      className="flex justify-center items-center py-2.5 px-4 rounded-xl font-bold text-sm text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50 shadow-sm"
                    >
                      <XCircle size={16} className="mr-2" /> Reject
                    </button>
                    <button
                      onClick={() => handleAction(req._id, 'Approved')}
                      disabled={actionLoading === req._id}
                      className="flex justify-center items-center py-2.5 px-4 rounded-xl font-bold text-sm text-green-600 dark:text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-all shadow-sm disabled:opacity-50"
                    >
                      <CheckCircle size={16} className="mr-2" /> Approve
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
