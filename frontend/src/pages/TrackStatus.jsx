import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle2, Clock, XCircle, FileText, ArrowRight } from 'lucide-react';

export default function TrackStatus() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests');
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getMetrics = () => {
    const total = requests.length;
    const approved = requests.filter(r => r.status === 'Approved').length;
    const rejected = requests.filter(r => r.status === 'Rejected').length;
    const pending = total - approved - rejected;
    return { total, approved, rejected, pending };
  };

  const metrics = getMetrics();

  // Helper to render progress steps
  const renderProgress = (req) => {
    const steps = [
      { label: 'Advisor', key: 'advisor' },
      { label: 'HOD', key: 'hod' }
    ];

    return (
      <div className="flex items-center space-x-2 mt-4 w-full">
        {steps.map((step, index) => {
          let stepStatus = 'Pending';
          // Check if this specific tier has approved/rejected
          if (req.approvalWorkflow && req.approvalWorkflow[step.key]) {
             stepStatus = req.approvalWorkflow[step.key].status;
          }
          
          let bgColor = 'bg-bg-panel border-border-soft';
          let textColor = 'text-text-muted';
          let icon = <Clock size={14} className="mr-1" />;

          if (stepStatus === 'Approved' || (step.key === 'advisor' && (req.currentApprover === 'HOD' || req.currentApprover === 'Admin' || req.currentApprover === 'Completed'))) {
            bgColor = 'bg-green-500/10 border-green-500/20';
            textColor = 'text-green-600 dark:text-green-400 font-bold';
            icon = <CheckCircle2 size={14} className="mr-1" />;
          } else if (stepStatus === 'Rejected' || (req.status === 'Rejected' && req.currentApprover === 'Completed')) {
             // Mark the tier that rejected it
             if (stepStatus === 'Rejected') {
               bgColor = 'bg-red-500/10 border-red-500/20';
               textColor = 'text-red-600 dark:text-red-400 font-bold';
               icon = <XCircle size={14} className="mr-1" />;
             } else {
               // If a previous tier rejected it, subsequent ones are skipped/dimmed
               bgColor = 'bg-bg-panel opacity-50 border-border-soft';
               textColor = 'text-text-muted opacity-50';
               icon = <XCircle size={14} className="mr-1" />;
             }
          } else if (req.currentApprover.toLowerCase() === step.key.toLowerCase()) {
            bgColor = 'bg-amber-500/10 border-amber-500/30 shadow-sm ring-1 ring-amber-500/50';
            textColor = 'text-amber-600 dark:text-amber-400 font-bold';
          }

          return (
            <React.Fragment key={step.key}>
              <div className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl flex-1 transition-all border ${bgColor} ${textColor}`}>
                <div className="flex items-center text-xs">
                  {icon}
                  {step.label}
                </div>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight size={16} className={`text-border-soft flex-shrink-0 ${req.currentApprover.toLowerCase() === step.key.toLowerCase() ? 'animate-pulse text-amber-500' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center bg-bg-card backdrop-blur-xl p-6 rounded-[2rem] shadow-xl shadow-shadow-card border border-border-soft transition-colors duration-300">
        <div className="p-4 bg-primary-100 dark:bg-primary-900/40 border border-primary-500/20 text-primary-600 dark:text-primary-400 rounded-2xl mr-6 shadow-sm transition-colors">
          <Activity size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-wide transition-colors">Track Status</h1>
          <p className="text-text-muted mt-1 font-medium transition-colors">Analytics and visual progress tracking for your On-Duty requests</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { label: 'Total Requests', value: metrics.total, color: 'blue' },
          { label: 'Approved', value: metrics.approved, color: 'green' },
          { label: 'Pending', value: metrics.pending, color: 'amber' },
          { label: 'Rejected', value: metrics.rejected, color: 'red' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-bg-card backdrop-blur-xl p-6 rounded-[2rem] border relative overflow-hidden group ${
              stat.color === 'blue' ? 'border-blue-500/20 shadow-sm hover:border-blue-500/40' :
              stat.color === 'green' ? 'border-green-500/20 shadow-sm hover:border-green-500/40' :
              stat.color === 'amber' ? 'border-amber-500/20 shadow-sm hover:border-amber-500/40' :
              'border-red-500/20 shadow-sm hover:border-red-500/40'
            } transition-all duration-300`}
          >
            <div className={`absolute -right-4 -top-8 w-24 h-24 rounded-full opacity-[0.05] dark:opacity-10 blur-xl transition-colors ${
              stat.color === 'blue' ? 'bg-blue-500' :
              stat.color === 'green' ? 'bg-green-500' :
              stat.color === 'amber' ? 'bg-amber-500' :
              'bg-red-500'
            }`}></div>
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1 transition-colors">{stat.label}</p>
            <p className={`text-4xl font-black transition-colors ${
              stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
              stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
              stat.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
              'text-red-600 dark:text-red-400'
            } drop-shadow-sm`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Detailed Tracking Timeline */}
      <h2 className="text-xl font-bold text-text-main px-2 pt-4 flex items-center transition-colors">
        <Activity size={20} className="mr-3 text-primary-500" />
        Progress Flow
      </h2>
      
      <div className="space-y-5">
        {loading ? (
          <div className="bg-bg-panel p-6 rounded-[2.5rem] border border-border-soft h-40 animate-pulse shadow-sm transition-colors"></div>
        ) : requests.length === 0 ? (
          <div className="bg-bg-panel backdrop-blur-md p-12 rounded-[2.5rem] border border-border-soft text-center flex flex-col items-center shadow-md transition-colors duration-300">
            <FileText size={56} className="text-text-muted mb-5 drop-shadow-sm opacity-50" />
            <h3 className="text-xl font-bold text-text-main tracking-wide transition-colors">No requests to track</h3>
            <p className="text-text-muted mt-2 font-medium transition-colors">Submit an OD request on your dashboard to see progress here.</p>
          </div>
        ) : (
          <AnimatePresence>
            {requests.map((req, idx) => (
              <motion.div
                key={req._id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-bg-card backdrop-blur-xl p-7 rounded-[2.5rem] border border-border-soft shadow-xl shadow-shadow-card hover:shadow-2xl hover:border-primary-500/30 transition-all relative overflow-hidden group"
              >
                {/* Status colored sliver */}
                <div className={`absolute top-0 right-0 h-full w-2 transition-colors ${
                  req.status === 'Approved' ? 'bg-green-500' :
                  req.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-400'
                }`}></div>

                <div className="pl-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 pr-4">
                    <h3 className="font-bold text-text-main text-xl mb-2 sm:mb-0 leading-tight transition-colors">{req.reason}</h3>
                    <span className="w-fit text-xs font-bold tracking-wider text-text-muted bg-bg-panel border border-border-soft px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap transition-colors">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-text-muted font-medium text-sm mb-6 line-clamp-2 leading-relaxed bg-bg-panel p-3 rounded-xl border border-border-soft shadow-sm mr-4 transition-colors">
                    {req.eventDetails}
                  </p>

                  <div className="bg-bg-panel rounded-2xl p-5 border border-border-soft shadow-sm transition-colors">
                    <p className="text-[10px] font-black tracking-widest text-text-muted uppercase mb-4 pl-1 transition-colors">Approval Pipeline</p>
                    {renderProgress(req)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
