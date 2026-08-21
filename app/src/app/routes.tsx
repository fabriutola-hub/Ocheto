import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { RequireAuth, RequireAdmin } from '@/features/auth/guards';

const Home = lazy(() => import('@/pages/Home'));
const Menu = lazy(() => import('@/pages/Menu'));
const Shop = lazy(() => import('@/pages/Shop'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const BranchMenu = lazy(() => import('@/pages/BranchMenu'));
const Profile = lazy(() => import('@/pages/Profile'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const Recover = lazy(() => import('@/pages/auth/Recover'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));
const AdminRoot = lazy(() => import('@/pages/admin/AdminRoot'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/Products'));
const AdminBranches = lazy(() => import('@/pages/admin/Branches'));
const AdminFeatured = lazy(() => import('@/pages/admin/Featured'));
const AdminCategories = lazy(() => import('@/pages/admin/Categories'));
const AdminGalleryImages = lazy(() => import('@/pages/admin/GalleryImages'));
const AdminLocationImages = lazy(() => import('@/pages/admin/LocationImages'));
const AdminMilestones = lazy(() => import('@/pages/admin/MilestonesAdmin'));
const AdminTeam = lazy(() => import('@/pages/admin/TeamAdmin'));
const AdminMessages = lazy(() => import('@/pages/admin/ContactMessages'));
const AdminFavorites = lazy(() => import('@/pages/admin/FavoritesAnalytics'));

const Fallback = () => <div className="min-h-screen" />;

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Fallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:slug" element={<BranchMenu />} />
          <Route path="/tienda" element={<Shop />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/contacto" element={<Contact />} />

          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/recover" element={<Recover />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />

          <Route
            path="/perfil"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminRoot />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProducts />} />
            <Route path="sucursales" element={<AdminBranches />} />
            <Route path="destacados" element={<AdminFeatured />} />
            <Route path="categorias" element={<AdminCategories />} />
            <Route path="galeria" element={<AdminGalleryImages />} />
            <Route path="sucursales-imagenes" element={<AdminLocationImages />} />
            <Route path="historia" element={<AdminMilestones />} />
            <Route path="equipo" element={<AdminTeam />} />
            <Route path="mensajes" element={<AdminMessages />} />
            <Route path="favoritos" element={<AdminFavorites />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}
