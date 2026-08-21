import { NavLink, Link } from 'react-router';
import type { ReactNode } from 'react';
import { LayoutDashboard, Package, MapPin, Star, Store, LogOut, LayoutGrid, Images, Building2, Clock, Users, Mail, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/toast';
import { useNavigate } from 'react-router';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/productos', label: 'Productos', icon: Package, end: false },
  { to: '/admin/sucursales', label: 'Menús', icon: MapPin, end: false },
  { to: '/admin/destacados', label: 'Destacados', icon: Star, end: false },
  { to: '/admin/categorias', label: 'Categorías', icon: LayoutGrid, end: false },
  { to: '/admin/galeria', label: 'Galería', icon: Images, end: false },
  { to: '/admin/sucursales-imagenes', label: 'Sucursales Img', icon: Building2, end: false },
  { to: '/admin/historia', label: 'Historia', icon: Clock, end: false },
  { to: '/admin/equipo', label: 'Equipo', icon: Users, end: false },
  { to: '/admin/mensajes', label: 'Mensajes', icon: Mail, end: false },
  { to: '/admin/favoritos', label: 'Favoritos', icon: Heart, end: false },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Sesión cerrada');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-ocheto-cream-50 pt-20">
      <div className="container-ocheto py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link to="/admin" className="inline-flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-ocheto-green-700 flex items-center justify-center">
              <Store className="w-5 h-5 text-ocheto-cream-50" />
            </span>
            <span className="font-fraunces italic font-medium text-ocheto-coffee-900 text-xl">
              Panel Ocheto
            </span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-ocheto-coffee-900/15 text-sm font-semibold text-ocheto-coffee-900 hover:border-ocheto-berry-600 hover:text-ocheto-berry-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-8">
          {/* Sidebar */}
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1 lg:pb-0 lg:sticky lg:top-28 lg:self-start">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-ocheto-green-700 text-ocheto-cream-50 shadow-md shadow-ocheto-green-700/25'
                        : 'text-ocheto-coffee-700 hover:bg-white hover:text-ocheto-coffee-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {l.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Content */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
