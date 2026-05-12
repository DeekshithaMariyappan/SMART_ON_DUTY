import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminAddUser from './pages/AdminAddUser';
import AdminDummyPage from './pages/AdminDummyPage';
import TrackStatus from './pages/TrackStatus';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import VerifyOD from './pages/VerifyOD';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  return children;
};

const MainLayout = ({ children }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
    {children}
  </div>
);

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full text-slate-800">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow flex flex-col w-full">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:id" element={<VerifyOD />} />
          
          <Route path="/student/*" element={
            <ProtectedRoute allowedRoles={['Student']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="track" element={<TrackStatus />} />
                  <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/faculty/*" element={
            <ProtectedRoute allowedRoles={['Faculty', 'HOD']}>
              <MainLayout><FacultyDashboard /></MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="add-user" element={<AdminAddUser />} />
            <Route path="add-department" element={<AdminDummyPage title="Add Department" />} />
            <Route path="reports" element={<AdminDummyPage title="Generate Reports" />} />
            <Route path="export" element={<AdminDummyPage title="Export Data" />} />
          </Route>

          <Route path="/profile" element={
            <ProtectedRoute>
              <MainLayout><Profile /></MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
