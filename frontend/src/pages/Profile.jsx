import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { User, Activity, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/users/profile/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch profile stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getPieData = () => {
    if (!stats || user.role !== 'Student') return [];
    const pending = stats.total - stats.approved - stats.rejected;
    return [
      { name: 'Approved', value: stats.approved, color: '#22c55e' }, // green-500
      { name: 'Pending', value: pending, color: '#f59e0b' },         // amber-500
      { name: 'Rejected', value: stats.rejected, color: '#ef4444' }  // red-500
    ].filter(item => item.value > 0);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold drop-shadow-md">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) return <div className="flex justify-center p-8 text-text-muted font-bold tracking-wider animate-pulse transition-colors">Loading profile data...</div>;
  if (!user || !stats) return <div className="flex justify-center p-8 text-red-600 dark:text-red-400 font-bold bg-red-500/10 rounded-2xl border border-red-500/20 max-w-lg mx-auto mt-10 shadow-sm">Failed to load profile. Connection error.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-bg-card backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-shadow-card border border-border-soft p-8 flex items-center gap-6 relative overflow-hidden group transition-colors duration-300">
        <div className="absolute -right-10 -bottom-10 opacity-[0.03] dark:opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-[2] group-hover:rotate-0 duration-700">
          <User size={250} />
        </div>
        <div className="h-28 w-28 rounded-[2rem] bg-primary-100 dark:bg-primary-900/40 border border-primary-500/20 flex items-center justify-center text-primary-500 flex-shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-105">
          <User size={56} strokeWidth={1.5} />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-text-main tracking-tight transition-colors">{user.name}</h1>
          <div className="flex items-center gap-3 mt-3 text-text-muted font-bold text-xs tracking-wider uppercase bg-bg-panel w-fit px-3 py-1.5 rounded-xl border border-border-soft shadow-sm transition-colors">
            <Shield size={14} className="text-primary-500" />
            <span>{user.role}</span>
            {user.role === 'Student' && user.department && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-border-soft"></span>
                <span>{user.department}</span>
              </>
            )}
          </div>
          <p className="text-text-muted mt-3 font-medium flex items-center bg-bg-panel w-fit px-3 py-1 rounded-lg border border-border-soft shadow-sm transition-colors">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            {user.email}
          </p>
        </div>
      </div>

      {/* Statistics Grid */}
      <h2 className="text-xl font-bold text-text-main mt-10 mb-6 flex items-center px-2 transition-colors">
        <Activity size={22} className="mr-3 text-primary-500 drop-shadow-sm" />
        Request Statistics Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {user.role === 'Student' ? (
          <>
            <StatCard 
              title="Total Requests" 
              value={stats.total} 
              icon={<Activity size={24} className="text-blue-500 dark:text-blue-400" />} 
              bg="bg-blue-500/10 border-blue-500/20" 
            />
            <StatCard 
              title="Approved" 
              value={stats.approved} 
              icon={<CheckCircle size={24} className="text-green-500 dark:text-green-400" />} 
              bg="bg-green-500/10 border-green-500/20" 
            />
            <StatCard 
              title="Rejected" 
              value={stats.rejected} 
              icon={<XCircle size={24} className="text-red-500 dark:text-red-400" />} 
              bg="bg-red-500/10 border-red-500/20" 
            />
          </>
        ) : user.role === 'Admin' ? (
          <>
            <StatCard 
              title="Total Students" 
              value={stats.totalStudents || 0} 
              icon={<User size={24} className="text-blue-500 dark:text-blue-400" />} 
              bg="bg-blue-500/10 border-blue-500/20" 
            />
            <StatCard 
              title="Total Faculty" 
              value={stats.totalFaculty || 0} 
              icon={<Shield size={24} className="text-green-500 dark:text-green-400" />} 
              bg="bg-green-500/10 border-green-500/20" 
            />
            <StatCard 
              title="Total HODs" 
              value={stats.totalHOD || 0} 
              icon={<Shield size={24} className="text-purple-500 dark:text-purple-400" />} 
              bg="bg-purple-500/10 border-purple-500/20" 
            />
            <StatCard 
              title="Total Requests" 
              value={stats.totalRequests || 0} 
              icon={<Activity size={24} className="text-amber-500 dark:text-amber-400" />} 
              bg="bg-amber-500/10 border-amber-500/20" 
            />
          </>
        ) : (
          <>
            <StatCard 
              title="Pending Review" 
              value={stats.pendingReview} 
              icon={<Clock size={24} className="text-amber-500 dark:text-amber-400" />} 
              bg="bg-amber-500/10 border-amber-500/20" 
            />
            <StatCard 
              title="Approved by Me" 
              value={stats.approvedByMe} 
              icon={<CheckCircle size={24} className="text-green-500 dark:text-green-400" />} 
              bg="bg-green-500/10 border-green-500/20" 
            />
            <StatCard 
              title="Rejected by Me" 
              value={stats.rejectedByMe} 
              icon={<XCircle size={24} className="text-red-500 dark:text-red-400" />} 
              bg="bg-red-500/10 border-red-500/20" 
            />
            <StatCard 
              title="Total Reviewed" 
              value={stats.totalReviewed} 
              icon={<Activity size={24} className="text-blue-500 dark:text-blue-400" />} 
              bg="bg-blue-500/10 border-blue-500/20" 
            />
          </>
        )}
      </div>

      {/* Student OD Status Pie Chart */}
      {user.role === 'Student' && stats && stats.total > 0 && (
        <div className="bg-bg-card backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-shadow-card border border-border-soft p-8 flex flex-col items-center mt-6 transition-colors duration-300">
          <h3 className="text-lg font-bold text-text-main mb-6 w-full text-left flex items-center">
            <Activity size={20} className="mr-2 text-primary-500" /> OD Status Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getPieData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={true}
                >
                  {getPieData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: '1px solid var(--border-soft)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 'bold' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontWeight: 'bold', fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, bg }) {
  return (
    <div className="bg-bg-card backdrop-blur-xl rounded-[2rem] shadow-xl shadow-shadow-card border border-border-soft hover:border-primary-500/30 p-6 flex flex-col justify-between transition-all group overflow-hidden relative duration-300">
      <div className="absolute right-[-20%] top-[10%] opacity-[0.03] dark:opacity-5 scale-[3] rotate-12 group-hover:rotate-0 transition-transform duration-500">
        {icon}
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <div className={`p-4 rounded-2xl border shadow-sm ${bg}`}>
          {icon}
        </div>
      </div>
      <div className="mt-5 mb-1 relative z-10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1 transition-colors">{title}</h3>
        <span className="text-4xl font-black text-text-main drop-shadow-sm transition-colors">{value}</span>
      </div>
    </div>
  );
}
