import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import { 
  Users, ShieldAlert, Building, FileText,
  UserCheck, CheckCircle, XCircle, Bell, Settings,
  ArrowRight, UserPlus, FileOutput
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/users/profile/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = {
    green: '#22c55e',
    amber: '#f59e0b',
    red: '#ef4444',
    blue: '#3b82f6',
    purple: '#a855f7',
    emerald: '#10b981',
    slate: '#94a3b8'
  };

  const getPieData = () => {
    if (!stats) return [];
    return [
      { name: 'Approved', value: stats.approvedRequests || 0, color: COLORS.green },
      { name: 'Pending', value: stats.pendingRequests || 0, color: COLORS.amber },
      { name: 'Rejected', value: stats.rejectedRequests || 0, color: COLORS.red }
    ].filter(i => i.value > 0);
  };

  const getRoleData = () => {
    if (!stats) return [];
    return [
      { name: 'Students', value: stats.totalStudents || 0, color: COLORS.blue },
      { name: 'Faculty', value: stats.totalFaculty || 0, color: COLORS.emerald },
      { name: 'HODs', value: stats.totalHOD || 0, color: COLORS.amber }
    ].filter(i => i.value > 0);
  };

  const getFacultyDeptData = () => {
    if (!stats?.facultyByDept) return [];
    const colors = [COLORS.blue, COLORS.purple, COLORS.green, COLORS.amber, COLORS.red, COLORS.emerald];
    return stats.facultyByDept.map((item, idx) => ({ ...item, color: colors[idx % colors.length] }));
  };

  if (loading) return <div className="flex h-full items-center justify-center font-bold text-text-muted animate-pulse">Loading Admin Data...</div>;

  return (
    <>
      {/* STAT CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <MiniStat title="Total Students" value={stats.totalStudents} icon={<Users size={16} className="text-blue-500" />} trend="+12.5%" trendColor="text-green-500" />
            <MiniStat title="Total Faculty" value={stats.totalFaculty} icon={<UserCheck size={16} className="text-emerald-500" />} trend="+8.3%" trendColor="text-green-500" />
            <MiniStat title="Pending Requests" value={stats.pendingRequests} icon={<FileText size={16} className="text-amber-500" />} trend="+5.6%" trendColor="text-amber-500" />
            <MiniStat title="Approved Requests" value={stats.approvedRequests} icon={<CheckCircle size={16} className="text-green-500" />} trend="+15.2%" trendColor="text-green-500" />
            <MiniStat title="Rejected Requests" value={stats.rejectedRequests} icon={<XCircle size={16} className="text-red-500" />} trend="-3.1%" trendColor="text-red-500" />
            <MiniStat title="Departments" value={stats.totalDepartments} icon={<Building size={16} className="text-purple-500" />} trend="No change" trendColor="text-slate-400" />
          </div>

          {/* CHARTS GRID ROW 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Overview Donut */}
            <DashboardCard title="OD Requests Overview">
              <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={getPieData()} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none">
                      {getPieData().map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-slate-500 font-bold uppercase">Total</span>
                  <span className="text-xl font-black">{stats.totalRequests}</span>
                </div>
              </div>
            </DashboardCard>

            {/* Monthly Trend Line Chart */}
            <DashboardCard title="OD Requests Trend (Monthly)">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.monthlyTrend || []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="Requests" stroke={COLORS.blue} strokeWidth={3} dot={{ r: 4, fill: COLORS.blue, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            {/* Department Wise Requests Bar Chart */}
            <DashboardCard title="Department-wise OD Requests">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.departmentRequests || []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="value" fill={COLORS.purple} radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>

          {/* CHARTS GRID ROW 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Faculty Distribution by Dept */}
            <DashboardCard title="Faculty Distribution by Department">
              <div className="h-48 w-full flex items-center">
                <div className="w-1/2 h-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={getFacultyDeptData()} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" stroke="none">
                        {getFacultyDeptData().map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-black">{stats.totalFaculty + stats.totalHOD}</span>
                  </div>
                </div>
                <div className="w-1/2 flex flex-col justify-center space-y-2 pr-4">
                  {getFacultyDeptData().map((e, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.color }}></span>
                        <span className="text-slate-600 truncate">{e.name}</span>
                      </div>
                      <span className="font-bold shrink-0">{e.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardCard>

            {/* Approval Workflow Layout */}
            <DashboardCard title="OD Approval Workflow" className="lg:col-span-2">
              <div className="h-48 w-full flex flex-col justify-center px-4">
                <div className="flex items-center justify-between w-full mb-8 relative">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
                  
                  <WorkflowNode icon={<Users className="text-blue-500" />} label="Student" sub="Submitted" value={stats.totalRequests} bg="bg-blue-50 border-blue-200" />
                  <Arrow />
                  <WorkflowNode icon={<UserCheck className="text-amber-500" />} label="Advisor" sub="Approved" value={stats.approvedRequests + stats.pendingRequests} bg="bg-amber-50 border-amber-200" />
                  <Arrow />
                  <WorkflowNode icon={<Building className="text-purple-500" />} label="HOD" sub="Approved" value={stats.approvedRequests} bg="bg-purple-50 border-purple-200" />
                  <Arrow />
                  <WorkflowNode icon={<CheckCircle className="text-emerald-500" />} label="Completed" sub="Final" value={stats.approvedRequests} bg="bg-emerald-50 border-emerald-200" />
                </div>
                
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1 relative">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${stats.totalRequests ? (stats.approvedRequests/stats.totalRequests)*100 : 0}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>Overall Completion</span>
                  <span className="text-emerald-600">{stats.totalRequests ? Math.round((stats.approvedRequests/stats.totalRequests)*100) : 0}%</span>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* GRID ROW 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DashboardCard title="User Role Distribution">
               <div className="h-48 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={getRoleData()} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                        {getRoleData().map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                      <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
            </DashboardCard>

            <DashboardCard title="Quick Actions" className="lg:col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-full content-center">
                <ActionButton icon={<UserPlus className="text-emerald-500" />} label="Add Faculty" bg="bg-emerald-50 hover:bg-emerald-100 border-emerald-100" onClick={() => navigate('/admin/add-user?role=Faculty')} />
                <ActionButton icon={<UserPlus className="text-amber-500" />} label="Add HOD" bg="bg-amber-50 hover:bg-amber-100 border-amber-100" onClick={() => navigate('/admin/add-user?role=HOD')} />
                <ActionButton icon={<Building className="text-purple-500" />} label="Add Department" bg="bg-purple-50 hover:bg-purple-100 border-purple-100" onClick={() => navigate('/admin/add-department')} />
                <ActionButton icon={<FileOutput className="text-orange-500" />} label="Generate Report" bg="bg-orange-50 hover:bg-orange-100 border-orange-100" onClick={() => navigate('/admin/reports')} />
                <ActionButton icon={<ShieldAlert className="text-indigo-500" />} label="Export Data" bg="bg-indigo-50 hover:bg-indigo-100 border-indigo-100" onClick={() => navigate('/admin/export')} />
              </div>
            </DashboardCard>
          </div>

    </>
  );
}

// Components
function MiniStat({ title, value, icon, trend, trendColor }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-28 hover:border-emerald-500/30 transition-colors group">
      <div className="flex justify-between items-start">
        <div className="p-1.5 bg-slate-50 dark:bg-gray-700 rounded-lg border border-slate-100 dark:border-gray-600 group-hover:bg-white transition-colors">{icon}</div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</p>
        <div className="flex items-end gap-2 mt-0.5">
          <span className="text-2xl font-black">{value || 0}</span>
          <span className={`text-[10px] font-bold pb-1 ${trendColor}`}>{trend}</span>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm p-5 flex flex-col ${className}`}>
      <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">{title}</h2>
      <div className="flex-1 flex flex-col justify-center">{children}</div>
    </div>
  );
}

function WorkflowNode({ icon, label, sub, value, bg }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white border-2 shadow-sm z-10 ${bg}`}>
        {icon}
      </div>
      <span className="text-xs font-bold mt-2 text-slate-700 dark:text-slate-200">{label}</span>
      <span className="text-[10px] font-bold text-slate-400 uppercase">{sub}</span>
      <span className="text-sm font-black mt-0.5">{value || 0}</span>
    </div>
  );
}

function Arrow() {
  return <ArrowRight className="text-slate-300 mx-2 hidden sm:block" size={16} />;
}

function ActionButton({ icon, label, bg, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all active:scale-95 cursor-pointer ${bg}`}>
      <div className="mb-2 bg-white p-1.5 rounded-lg shadow-sm">{icon}</div>
      <span className="text-[10px] font-bold text-slate-700 text-center">{label}</span>
    </button>
  );
}
