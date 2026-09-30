import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoadingScreen from './components/common/LoadingScreen';
import AuthLayout from './components/layouts/AuthLayout';
import AdminLayout from './components/layouts/AdminLayout';
import MemberLayout from './components/layouts/MemberLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import RoleRedirect from './routes/RoleRedirect';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMembers from './pages/admin/Members';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminHymns from './pages/admin/Hymns';
import AdminLivestreams from './pages/admin/Livestreams';
import AdminSMS from './pages/admin/SMS';
import AdminFinance from './pages/admin/Finance';
import AdminEvents from './pages/admin/Events';
import AdminSettings from './pages/admin/Settings';
import MemberHome from './pages/member/Home';
import MemberHymns from './pages/member/Hymns';
import MemberLivestreams from './pages/member/Livestreams';
import MemberEvents from './pages/member/Events';
import MemberProfile from './pages/member/Profile';
import ProfilePage from './pages/shared/Profile';
import { ROLE_GROUPS, ROLES } from './utils/constants';
import { useAuthInit } from './hooks/useAuthInit';

const App = () => {
  const initialized = useAuthInit();

  if (!initialized) {
    return <LoadingScreen fullscreen label="Starting application..." />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Suspense fallback={<LoadingScreen fullscreen label="Loading page..." />}>
        <Routes>
          <Route path="/" element={<RoleRedirect />} />

          <Route element={<PublicRoute />}>
            <Route
              path="/login"
              element={(
                <AuthLayout
                  title="Welcome back"
                  subtitle="Sign in to shepherd the PCEA community with excellence."
                >
                  <LoginPage />
                </AuthLayout>
              )}
            />
            <Route
              path="/register"
              element={(
                <AuthLayout
                  title="Join the community"
                  subtitle="Create an account to access the member portal."
                >
                  <RegisterPage />
                </AuthLayout>
              )}
            />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={ROLE_GROUPS.ADMIN_TEAM} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="members" element={<AdminMembers />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="hymns" element={<AdminHymns />} />
              <Route path="livestreams" element={<AdminLivestreams />} />
              <Route path="sms" element={<AdminSMS />} />
              <Route path="finance" element={<AdminFinance />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.MEMBER]} />}>
            <Route path="/member" element={<MemberLayout />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<MemberHome />} />
              <Route path="hymns" element={<MemberHymns />} />
              <Route path="livestreams" element={<MemberLivestreams />} />
              <Route path="events" element={<MemberEvents />} />
              <Route path="profile" element={<MemberProfile />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
