import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Clock, XCircle, Users, Calendar, FileText } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    department: user.department || '',
    reason: '',
    eventDetails: '',
    startDate: '',
    endDate: '',
    poster: null,
    paymentProof: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reqsRes, facRes] = await Promise.all([
        api.get('/requests'),
        api.get('/users/faculty')
      ]);
      setRequests(reqsRes.data);
      // Filter faculty by same department if preferred, but doing all for now
      setFaculty(facRes.data.filter(f => f.department === user.department));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      // Explicitly pull department from the authenticated user context 
      // instead of local state in case local state initialized before user was ready
      data.append('department', user.department || formData.department);
      data.append('reason', formData.reason);
      data.append('eventDetails', formData.eventDetails);
      data.append('startDate', formData.startDate);
      data.append('endDate', formData.endDate);
      data.append('poster', formData.poster);
      data.append('paymentProof', formData.paymentProof);

      await api.post('/requests', data);
      
      setShowModal(false);
      setFormData({ ...formData, reason: '', eventDetails: '', startDate: '', endDate: '', poster: null, paymentProof: null });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to submit request: ' + (err.response?.data?.message || err.message));
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'Rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-amber-600 bg-amber-50 border-amber-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <CheckCircle2 size={16} className="mr-1.5" />;
      case 'Rejected': return <XCircle size={16} className="mr-1.5" />;
      default: return <Clock size={16} className="mr-1.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-bg-card backdrop-blur-xl p-6 rounded-[2rem] shadow-xl shadow-shadow-card border border-border-soft transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-bold text-text-main transition-colors">My Applications</h1>
          <p className="text-text-muted mt-1 font-medium transition-colors">Track and manage your On-Duty requests</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 flex items-center bg-primary-600 hover:bg-primary-500 text-white px-5 py-3 rounded-xl font-bold shadow-md shadow-shadow-glow transition-all hover:shadow-lg active:scale-95"
        >
          <Plus size={18} className="mr-2" />
          New Request
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Requests List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-text-main px-1 transition-colors">Recent Requests</h2>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-bg-panel p-5 rounded-[2rem] border border-border-soft h-24 shadow-sm transition-colors"></div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-bg-panel backdrop-blur-md p-10 rounded-[2rem] border border-border-soft text-center flex flex-col items-center shadow-md transition-colors duration-300">
              <FileText size={48} className="text-text-muted mb-4 drop-shadow-sm opacity-50" />
              <h3 className="text-xl font-bold text-text-main transition-colors">No requests found</h3>
              <p className="text-text-muted mt-2 font-medium transition-colors">You haven't submitted any OD requests yet.</p>
              <button onClick={() => setShowModal(true)} className="mt-6 text-primary-500 font-bold hover:text-primary-400 transition-colors">
                Create your first request &rarr;
              </button>
            </div>
          ) : (
            <AnimatePresence>
              {requests.map((req, idx) => (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-bg-card backdrop-blur-xl p-6 rounded-[2rem] border border-border-soft shadow-xl shadow-shadow-card hover:shadow-2xl hover:border-primary-500/30 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div className="flex-1 pr-4">
                      <h3 className="font-bold text-text-main text-lg transition-colors">{req.reason}</h3>
                      <p className="text-text-muted text-sm mb-4 line-clamp-2 mt-1 leading-relaxed transition-colors">{req.eventDetails}</p>
                    </div>
                    <span className={`flex items-center px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border shadow-sm whitespace-nowrap ${
                      req.status === 'Approved' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' :
                      req.status === 'Rejected' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' :
                      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    }`}>
                      {getStatusIcon(req.status)}
                      {req.status}
                    </span>
                  </div>
                  
                  {req.posterUrl && req.paymentProofUrl && (
                    <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                      <div className="rounded-2xl overflow-hidden border border-border-soft bg-bg-panel flex justify-center py-2 transition-colors">
                        <img src={`http://localhost:5000${req.posterUrl}`} alt="Event Poster" className="max-w-full max-h-96 object-contain rounded-xl" />
                      </div>
                      <div className="rounded-2xl overflow-hidden border border-border-soft bg-bg-panel flex justify-center py-2 transition-colors">
                        <img src={`http://localhost:5000${req.paymentProofUrl}`} alt="Proof of Payment" className="max-w-full max-h-96 object-contain rounded-xl" />
                      </div>
                    </div>
                  )}

                  {req.qrCode && req.status === 'Approved' && (
                    <div className="mb-5 p-5 rounded-[1.5rem] border border-primary-500/20 bg-primary-50 dark:bg-primary-900/20 shadow-sm flex flex-col items-center justify-center relative z-10 transition-colors">
                      <p className="text-sm font-black text-primary-600 dark:text-primary-400 mb-3 tracking-wide uppercase transition-colors">Official Verified QR Code</p>
                      <div className="p-2 border border-border-soft rounded-xl bg-white shadow-md">
                        <img src={req.qrCode} alt="Verification QR Code" className="w-36 h-36 rounded-lg" />
                      </div>
                      <p className="text-xs text-primary-500 dark:text-primary-300 mt-4 font-bold tracking-wider uppercase transition-colors">Scan to verify authenticity</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-medium text-text-muted border-t border-border-soft pt-4 mt-2 relative z-10 transition-colors">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <Calendar size={14} className="mr-2 text-primary-500" />
                      {new Date(req.startDate).toLocaleDateString()} &mdash; {new Date(req.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center sm:justify-end">
                      <span className="text-text-muted mr-2 uppercase tracking-wide font-bold text-[10px] transition-colors">Pending with:</span>
                      <span className="bg-bg-panel text-text-main px-2.5 py-1 rounded-lg font-bold shadow-sm border border-border-soft transition-colors">
                        {req.currentApprover}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Sidebar - Faculty Availability */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text-main px-1 transition-colors">Dept. Faculty Status</h2>
          <div className="bg-bg-card backdrop-blur-xl rounded-[2rem] border border-border-soft shadow-xl shadow-shadow-card p-6 transition-colors duration-300">
            <div className="flex items-center mb-6 text-text-muted border-b border-border-soft pb-4 transition-colors">
              <Users size={18} className="mr-2 text-primary-500" />
              <span className="text-sm font-bold uppercase tracking-wide">{user.department} Department</span>
            </div>
            
            <div className="space-y-3">
              {faculty.length === 0 && !loading && (
                <p className="text-sm text-text-muted italic p-4 text-center">No faculty found.</p>
              )}
              {faculty.map(fac => (
                <div key={fac._id} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-bg-panel transition-colors border border-transparent hover:border-border-soft group">
                  <div className="flex flex-col">
                    <span className="font-bold text-text-main text-sm transition-colors">{fac.name}</span>
                    <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider transition-colors">{fac.role}</span>
                  </div>
                  {fac.role !== 'HOD' ? (
                    <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold shadow-sm ${
                      fac.availability === 'Available' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' :
                      fac.availability === 'Busy' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                    }`}>
                      {fac.availability}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold bg-bg-panel text-text-muted border border-border-soft shadow-sm transition-colors">
                      HOD
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Request Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-main/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-card border border-border-soft rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300"
            >
              <div className="px-6 py-5 border-b border-border-soft flex justify-between items-center bg-bg-panel shrink-0 transition-colors">
                <h3 className="text-lg font-bold text-text-main tracking-wide transition-colors">New OD Request</h3>
                <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-text-main bg-bg-panel hover:bg-bg-card transition-colors p-1.5 rounded-full border border-transparent hover:border-border-soft shadow-sm">
                  <XCircle size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto custom-scrollbar flex-grow">
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 transition-colors">Reason for OD</label>
                  <input
                    type="text"
                    required
                    maxLength="100"
                    placeholder="E.g. Tech Symposium Participation"
                    className="w-full px-4 py-3 bg-bg-panel border border-border-soft rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-text-main placeholder-text-muted shadow-sm text-sm font-medium"
                    value={formData.reason}
                    onChange={e => setFormData({...formData, reason: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 transition-colors">Event Details</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Provide detailed description of the event..."
                    className="w-full px-4 py-3 bg-bg-panel border border-border-soft rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-text-main placeholder-text-muted shadow-sm text-sm font-medium resize-none"
                    value={formData.eventDetails}
                    onChange={e => setFormData({...formData, eventDetails: e.target.value})}
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 transition-colors">From Date</label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-3 bg-bg-panel border border-border-soft rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-text-main shadow-sm text-sm font-medium"
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 transition-colors">To Date</label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-3 bg-bg-panel border border-border-soft rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-text-main shadow-sm text-sm font-medium"
                      value={formData.endDate}
                      onChange={e => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 transition-colors">Event Poster</label>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      className="w-full px-4 py-3 bg-bg-panel border border-border-soft rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm text-sm text-text-muted file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-primary-50 file:dark:bg-primary-900/50 file:text-primary-600 file:dark:text-primary-400 hover:file:bg-primary-100 hover:file:dark:bg-primary-900/80 file:border file:border-primary-500/20 cursor-pointer"
                      onChange={e => setFormData({...formData, poster: e.target.files[0]})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 transition-colors">Proof of Payment</label>
                    <input
                      type="file"
                      required
                      accept="image/*"
                      className="w-full px-4 py-3 bg-bg-panel border border-border-soft rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm text-sm text-text-muted file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-primary-50 file:dark:bg-primary-900/50 file:text-primary-600 file:dark:text-primary-400 hover:file:bg-primary-100 hover:file:dark:bg-primary-900/80 file:border file:border-primary-500/20 cursor-pointer"
                      onChange={e => setFormData({...formData, paymentProof: e.target.files[0]})}
                    />
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-border-soft flex justify-end space-x-3 transition-colors">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 text-sm font-bold text-text-muted hover:text-text-main transition-colors hover:bg-bg-panel rounded-xl border border-transparent hover:border-border-soft"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-xl shadow-md shadow-shadow-glow transition-all active:scale-95 hover:-translate-y-0.5"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
