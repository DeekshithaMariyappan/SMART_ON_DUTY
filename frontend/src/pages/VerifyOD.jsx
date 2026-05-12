import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle, XCircle, Calendar, User, Building, FileText, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function VerifyOD() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        const res = await api.get(`/requests/verify/${id}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Verification failed. Invalid or unrecognized QR code.');
      } finally {
        setLoading(false);
      }
    };
    fetchVerification();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-900/40 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="animate-pulse flex flex-col items-center relative z-10">
          <ShieldCheck size={64} className="text-primary-500 drop-shadow-sm mb-6" />
          <p className="text-text-main font-bold tracking-widest uppercase text-sm transition-colors">Verifying Official Document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100 dark:bg-primary-900/30 rounded-full blur-[150px] pointer-events-none transition-colors"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[150px] pointer-events-none transition-colors"></div>

      <div className="max-w-md w-full bg-bg-card backdrop-blur-3xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-border-soft relative z-10 transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 via-primary-400 to-blue-500 shadow-sm transition-colors"></div>
        
        <div className="p-10 pb-8 text-center border-b border-border-soft relative transition-colors">
          {error || !data?.valid ? (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-red-500/10 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-500/20 relative transition-colors">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                <XCircle size={48} className="relative z-10 drop-shadow-sm" />
              </div>
              <h1 className="text-3xl font-black text-text-main mb-3 transition-colors">Verification Failed</h1>
              <p className="text-red-600 dark:text-red-400 font-bold bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 shadow-sm leading-relaxed transition-colors">{error || 'This OD Request is invalid or not fully approved.'}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-500/20 relative transition-colors">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl transition-colors"></div>
                <CheckCircle size={48} className="relative z-10 drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
              </div>
              <h1 className="text-3xl font-black text-text-main mb-3 transition-colors">Official Valid OD</h1>
              <div className="inline-flex items-center gap-2 bg-green-500/20 px-5 py-2 rounded-full border border-green-500/30 shadow-sm transition-colors">
                <ShieldCheck size={16} className="text-green-600 dark:text-green-400" />
                <p className="text-green-700 dark:text-green-300 font-black text-xs uppercase tracking-widest transition-colors">
                  Verified & Approved
                </p>
              </div>
            </div>
          )}
        </div>

        {data?.valid && (
          <div className="p-8 space-y-6">
            <div className="space-y-5 bg-bg-panel p-6 rounded-[2rem] border border-border-soft shadow-sm transition-colors">
              <InfoRow icon={<User size={18} className="text-primary-500" />} label="Student Name" value={data.studentName} />
              <InfoRow icon={<Building size={18} className="text-primary-500" />} label="Department" value={data.department} />
              <InfoRow icon={<FileText size={18} className="text-primary-500" />} label="Subject" value={data.reason} />
              
              <div className="pt-5 border-t border-border-soft transition-colors">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 block transition-colors">Event Details</label>
                <p className="text-text-main text-sm bg-bg-card p-4 rounded-2xl border border-border-soft leading-relaxed transition-colors shadow-sm">{data.eventDetails}</p>
              </div>

              <div className="pt-5 border-t border-border-soft grid grid-cols-2 gap-4 transition-colors">
                <div className="bg-bg-card p-4 rounded-2xl border border-border-soft shadow-sm transition-colors">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block transition-colors">From</label>
                  <div className="text-sm font-bold text-text-main flex items-center transition-colors">
                    <Calendar size={14} className="mr-2 text-primary-500" />
                    {new Date(data.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-bg-card p-4 rounded-2xl border border-border-soft shadow-sm transition-colors">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block transition-colors">To</label>
                  <div className="text-sm font-bold text-text-main flex items-center transition-colors">
                    <Calendar size={14} className="mr-2 text-primary-500" />
                    {new Date(data.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center mt-2 px-4 transition-colors">
              <p className="text-xs text-primary-600 dark:text-primary-400 font-bold tracking-wide transition-colors">Officially approved on {new Date(data.approvedDate).toLocaleString()}</p>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-2 transition-colors">SmartDuty Verification System</p>
            </div>
          </div>
        )}
        
        <div className="bg-bg-panel p-5 text-center border-t border-border-soft backdrop-blur-md transition-colors">
          <Link to="/" className="inline-flex items-center text-sm font-bold tracking-wider uppercase text-text-muted hover:text-text-main transition-colors bg-bg-card hover:bg-bg-panel px-6 py-2.5 rounded-xl border border-transparent hover:border-border-soft shadow-sm">
            <ArrowLeft size={16} className="mr-2" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start">
      <div className="mt-0.5 mr-4 p-2 bg-primary-100 dark:bg-primary-900/40 rounded-xl border border-primary-500/20 shadow-sm transition-colors">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 transition-colors">{label}</p>
        <p className="text-sm font-bold text-text-main tracking-wide transition-colors">{value}</p>
      </div>
    </div>
  );
}
