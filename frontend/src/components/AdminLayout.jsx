import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LayoutDashboard, FileText, UserCheck, Users, Building, FileOutput, Settings, Calendar as CalendarIcon, Bell } from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-gray-900 overflow-hidden text-slate-900 dark:text-slate-100 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-slate-200 dark:border-gray-700 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-gray-700">
          <ShieldAlert size={24} className="text-emerald-500 mr-2" />
          <span className="font-bold text-lg tracking-tight">Smart<span className="text-emerald-500">Duty</span></span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={location.pathname === '/admin' || location.pathname === '/admin/'} onClick={() => navigate('/admin')} />
          <SidebarItem icon={<FileText size={18} />} label="OD Requests" />
          
          <div className="pt-4 pb-1">
            <span className="px-3 text-xs font-black uppercase tracking-wider text-slate-400">Users</span>
          </div>
          <SidebarItem icon={<UserCheck size={18} />} label="Faculty" active={location.pathname === '/admin/add-user' && location.search.includes('Faculty')} onClick={() => navigate('/admin/add-user?role=Faculty')} />
          <SidebarItem icon={<Users size={18} />} label="HODs" active={location.pathname === '/admin/add-user' && location.search.includes('HOD')} onClick={() => navigate('/admin/add-user?role=HOD')} />
          <SidebarItem icon={<Building size={18} />} label="Departments" active={location.pathname === '/admin/add-department'} onClick={() => navigate('/admin/add-department')} />
          
          <div className="pt-4 pb-1">
            <span className="px-3 text-xs font-black uppercase tracking-wider text-slate-400">System</span>
          </div>
          <SidebarItem icon={<FileOutput size={18} />} label="Reports" />
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-gray-700">
          <div className="flex items-center gap-3 p-2 bg-slate-100 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors" onClick={logout}>
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">A</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">System Admin</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Logout</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* HEADER */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-lg font-bold">Welcome back, Admin! 👋</h1>
            <p className="text-xs text-slate-500 font-medium">Here's what's happening in your system today.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-gray-700 px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-600">
              <CalendarIcon size={16} className="text-slate-500" />
              <span className="text-xs font-bold">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <button className="relative text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </button>
          </div>
        </header>

        {/* SCROLLABLE OUTLET */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50 dark:bg-gray-900">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer font-bold text-sm transition-colors ${
      active 
        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-700'
    }`}>
      {icon}
      {label}
    </div>
  );
}
