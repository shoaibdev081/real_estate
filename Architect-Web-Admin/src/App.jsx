
import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Team from './pages/Team';
import Reviews from './pages/Reviews';
import Gallery from './pages/Gallery';
import Newsletter from './pages/Newsletter';
import Owner from './pages/Owner';
import Contact from './pages/Contact';
import HomePageManager from './pages/HomePageManager';
import AboutPageManager from './pages/AboutPageManager';
import Blogs from './pages/Blogs';
import MainAreas from './pages/MainAreas';
import FooterManager from './pages/FooterManager';
import MetaPixel from './pages/MetaPixel';
import FlashNewsManager from './pages/FlashNewsManager';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--bg-main) text-(--text-primary)">
        <div className="rounded-xl border border-(--border-subtle) bg-(--surface-card) px-6 py-4 text-sm">
          Checking session…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="home" element={<HomePageManager />} />
        <Route path="projects" element={<Projects />} />
        <Route path="services" element={<Services />} />
        <Route path="about" element={<AboutPageManager />} />
        <Route path="team" element={<Team />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="main-areas" element={<MainAreas />} />
        <Route path="newsletter" element={<Newsletter />} />
        <Route path="owner" element={<Owner />} />
        <Route path="contact" element={<Contact />} />
        <Route path="footer" element={<FooterManager />} />
        <Route path="meta-pixel" element={<MetaPixel />} />
        <Route path="flash-news" element={<FlashNewsManager />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;


