import { EASE } from '@/shared/motion';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Search, User, ShoppingBag, Menu, X, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useCartActions, useCartTotals } from '@/features/cart/CartContext';
import { useAuth } from '@/features/auth/store';

type NavLinkItem = { label: string; to: string };
type BranchItem = { label: string; to: string };

const navLinks: readonly NavLinkItem[] = [
  { label: 'Inicio', to: '/' },
  { label: 'Tienda', to: '/tienda' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/contacto' },
];

const branchMenuItems: readonly BranchItem[] = [
  { label: 'Federico Suazo', to: '/menu/federico-suazo' },
  { label: 'Oruro', to: '/menu/oruro' },
  { label: 'Illampu', to: '/menu/illampu' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const { isScrolled } = useScrollPosition();
  const { setIsOpen } = useCartActions();
  const { totalItems } = useCartTotals();
  const { session, profile } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Solid on scroll, while mobile menu is open, OR on content pages
  // (content pages have cream backgrounds — white logo would be unreadable there)
  const solid = isScrolled || mobileMenuOpen || !isHome;

  const inkColor = solid ? 'text-[hsl(var(--ocheto-green-700))]' : 'text-white';
  const inkHover = solid ? 'hover:text-[hsl(var(--ocheto-green-600))]' : 'hover:text-white/85';

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -120 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          solid
            ? 'bg-[hsl(var(--ocheto-cream-50))]/85 backdrop-blur-xl shadow-[0_8px_32px_-12px_hsla(var(--ocheto-green-950),0.18)] py-2.5 border-b border-[hsl(var(--ocheto-green-700)/0.08)]'
            : 'bg-transparent py-4 md:py-5'
        }`}
      >
        {/* SVG filter for green logo on scroll */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="logo-green-filter">
              <feColorMatrix
                type="matrix"
                values="0 0 0 0.23 0
                        0 0 0 0.45 0
                        0 0 0 0.28 0
                        0 0 0 1 0"
              />
            </filter>
          </defs>
        </svg>
        <div className="container-ocheto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            aria-label="Ocheto Coffee — Inicio"
            className="relative z-[60] flex items-center"
          >
            <motion.img
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              src="/assets/logo-ocheto.webp"
              alt="Ocheto Coffee"
              className="h-12 sm:h-14 md:h-14 lg:h-16 w-auto object-contain"
              style={{
                filter: solid
                  ? 'url(#logo-green-filter)'
                  : 'brightness(0) invert(1) drop-shadow(0 2px 10px rgba(0,0,0,0.4))',
                transition: 'filter 0.5s ease',
              }}
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center">
            {navLinks.map((link, i) => (
              <motion.li
                key={link.to}
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
              >
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={`group relative inline-flex items-center px-4 lg:px-5 py-2 text-[0.93rem] lg:text-[0.97rem] font-semibold tracking-wide transition-colors duration-300 ${inkColor} ${inkHover}`}
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{link.label}</span>

                      {/* Hover underline — scales from center */}
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute left-4 right-4 lg:left-5 lg:right-5 -bottom-0.5 h-[1.5px] origin-center scale-x-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                          solid
                            ? 'bg-[hsl(var(--ocheto-green-700))]'
                            : 'bg-white'
                        }`}
                      />

                      {/* Active underline — shared layoutId morphs between routes */}
                      {isActive && (
                        <motion.span
                          layoutId="ocheto-nav-underline"
                          aria-hidden
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          className="absolute left-4 right-4 lg:left-5 lg:right-5 -bottom-1 h-[2.5px] rounded-full bg-[hsl(var(--ocheto-gold-500))] shadow-[0_2px_8px_rgba(184,128,32,0.45)]"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.li>
            ))}

            {/* Menú dropdown */}
            <motion.li
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.36, ease: 'easeOut' }}
              className="relative"
              onMouseEnter={() => setMenuDropdownOpen(true)}
              onMouseLeave={() => setMenuDropdownOpen(false)}
            >
              <button
                className={`group relative inline-flex items-center gap-1.5 px-4 lg:px-5 py-2 text-[0.93rem] lg:text-[0.97rem] font-semibold tracking-wide transition-colors duration-300 ${inkColor} ${inkHover}`}
                aria-label="Menú de sucursales"
                aria-expanded={menuDropdownOpen}
              >
                <span className="relative z-10">Menú</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${menuDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>

                {/* Hover underline */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-4 right-4 lg:left-5 lg:right-5 -bottom-0.5 h-[1.5px] origin-center scale-x-0 rounded-full transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                    solid
                      ? 'bg-[hsl(var(--ocheto-green-700))]'
                      : 'bg-white'
                  }`}
                />
              </button>

              {/* Dropdown panel */}
              <AnimatePresence>
                {menuDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-full left-0 mt-2 w-56 rounded-xl shadow-[0_12px_40px_-8px_hsla(var(--ocheto-green-950),0.22)] bg-[hsl(var(--ocheto-cream-50))] border border-[hsl(var(--ocheto-green-700)/0.1)] overflow-hidden z-50"
                  >
                    <div className="py-1.5">
                      <div className="px-3 py-2 border-b border-[hsl(var(--ocheto-green-700)/0.08)]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ocheto-green-700">
                          Selecciona sucursal
                        </p>
                      </div>
                      {branchMenuItems.map((branch) => (
                        <Link
                          key={branch.to}
                          to={branch.to}
                          onClick={() => setMenuDropdownOpen(false)}
                          className={`block px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                            solid
                              ? 'text-ocheto-coffee-800 hover:bg-ocheto-green-700/8 hover:text-white'
                              : 'text-white/90 hover:bg-white/15 hover:text-white'
                          }`}
                        >
                          {branch.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          </ul>

          {/* Right cluster — desktop */}
          <div className="hidden md:flex items-center gap-0.5">
            <NavIcon label="Buscar" solid={solid}>
              <Search className="w-[1.15rem] h-[1.15rem] lg:w-5 lg:h-5" strokeWidth={1.8} />
            </NavIcon>
            <Link
              to={session ? '/perfil' : '/auth/login'}
              aria-label={session ? 'Mi perfil' : 'Iniciar sesión'}
              className={`relative p-2.5 rounded-full transition-colors duration-300 ${inkColor} ${inkHover}`}
            >
              <motion.span
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="inline-flex"
              >
                <User className="w-[1.15rem] h-[1.15rem] lg:w-5 lg:h-5" strokeWidth={1.8} />
              </motion.span>
              {profile?.role === 'admin' && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-ocheto-gold-500 ring-2 ring-[hsl(var(--ocheto-cream-50))]" />
              )}
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className={`relative p-2.5 rounded-full transition-colors duration-300 ${inkColor} ${inkHover}`}
              aria-label={`Carrito${totalItems > 0 ? ` (${totalItems})` : ''}`}
            >
              <motion.span
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="inline-flex"
              >
                <ShoppingBag
                  className="w-[1.15rem] h-[1.15rem] lg:w-5 lg:h-5"
                  strokeWidth={1.8}
                />
              </motion.span>
              <CartBadge count={totalItems} />
            </button>
          </div>

          {/* Right cluster — mobile: cart + hamburger */}
          <div className="flex md:hidden items-center gap-0.5 relative z-[60]">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className={`relative p-2.5 rounded-full transition-colors duration-300 ${inkColor}`}
              aria-label={`Carrito${totalItems > 0 ? ` (${totalItems})` : ''}`}
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />
              <CartBadge count={totalItems} compact />
            </button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={() => setMobileMenuOpen((v) => !v)}
              className={`w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-300 ${inkColor}`}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              aria-controls="ocheto-mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex"
                  >
                    <X className="w-6 h-6" strokeWidth={2} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex"
                  >
                    <Menu className="w-6 h-6" strokeWidth={2} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden bg-[hsl(var(--ocheto-coffee-900))]/35 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden
          >
            <motion.div
              id="ocheto-mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menú principal"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="relative overflow-hidden bg-[hsl(var(--ocheto-cream-50))] pt-24 pb-10 px-6 border-b border-[hsl(var(--ocheto-green-700)/0.08)] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtle dotted texture */}
              <div
                className="absolute inset-0 dots-bg opacity-40 pointer-events-none"
                aria-hidden
              />

              <nav className="relative flex flex-col items-center gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
                    className="w-full"
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      className={({ isActive }) =>
                        `relative block text-center py-3 font-display text-[1.65rem] sm:text-3xl font-semibold transition-colors duration-300 ${
                          isActive
                            ? 'text-[hsl(var(--ocheto-green-700))]'
                            : 'text-[hsl(var(--ocheto-coffee-900))] hover:text-[hsl(var(--ocheto-green-600))]'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <span className="relative inline-flex items-center gap-2.5">
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--ocheto-gold-500))]" />
                          )}
                          <span className={isActive ? 'italic' : ''}>{link.label}</span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--ocheto-gold-500))]" />
                          )}
                        </span>
                      )}
                    </NavLink>
                  </motion.div>
                ))}

                {/* Menú dropdown — mobile */}
                <MobileMenuDropdown
                  solid={solid}
                  items={branchMenuItems}
                  onClose={() => setMobileMenuOpen(false)}
                />

                {/* Decorative divider */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.45, duration: 0.5, ease: 'easeOut' }}
                  className="my-5 flex items-center gap-3 origin-center"
                >
                  <span className="block w-10 h-px bg-[hsl(var(--ocheto-gold-500)/0.45)]" />
                  <Coffee
                    className="w-4 h-4 text-[hsl(var(--ocheto-gold-500))]"
                    strokeWidth={1.5}
                  />
                  <span className="block w-10 h-px bg-[hsl(var(--ocheto-gold-500)/0.45)]" />
                </motion.div>

                {/* Secondary row */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="flex items-center gap-7 mt-1"
                >
                  <Link
                    to={session ? '/perfil' : '/auth/login'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--ocheto-coffee-700))] hover:text-[hsl(var(--ocheto-green-700))] transition-colors"
                  >
                    <User className="w-4 h-4" strokeWidth={1.8} />
                    {session ? 'Mi perfil' : 'Iniciar sesión'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsOpen(true);
                    }}
                    className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--ocheto-coffee-700))] hover:text-[hsl(var(--ocheto-green-700))] transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" strokeWidth={1.8} />
                    Carrito
                    {totalItems > 0 && (
                      <span className="ml-0.5 text-[0.65rem] font-bold text-[hsl(var(--ocheto-coffee-900))] bg-[hsl(var(--ocheto-gold-500))] rounded-full px-1.5 py-0.5 tabular-nums">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="font-caveat text-2xl text-[hsl(var(--ocheto-caramel-600))] mt-6"
                >
                  Hecho con cariño en La Paz
                </motion.p>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Local helpers                                                              */
/* -------------------------------------------------------------------------- */

function NavIcon({
  children,
  label,
  href,
  solid,
}: {
  children: ReactNode;
  label: string;
  href?: string;
  solid: boolean;
}) {
  const cls = `relative p-2.5 rounded-full transition-colors duration-300 ${
    solid
      ? 'text-[hsl(var(--ocheto-green-700))] hover:text-[hsl(var(--ocheto-green-600))]'
      : 'text-white hover:text-white/85'
  }`;
  const motionProps = {
    whileHover: { scale: 1.15 },
    whileTap: { scale: 0.9 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
  };

  if (href) {
    return (
      <motion.a href={href} aria-label={label} className={cls} {...motionProps}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      type="button"
      aria-label={label}
      className={cls}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}

function CartBadge({ count, compact = false }: { count: number; compact?: boolean }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className={`absolute -top-0.5 -right-0.5 flex items-center justify-center font-bold tabular-nums rounded-full text-[hsl(var(--ocheto-coffee-900))] bg-[hsl(var(--ocheto-gold-500))] shadow-[0_2px_6px_rgba(184,128,32,0.4)] ring-2 ring-[hsl(var(--ocheto-cream-50))]/70 ${
            compact
              ? 'min-w-[1.05rem] h-[1.05rem] text-[0.62rem] px-1'
              : 'min-w-[1.15rem] h-[1.15rem] text-[0.66rem] px-1.5'
          }`}
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function MobileMenuDropdown({
  solid,
  items,
  onClose,
}: {
  solid: boolean;
  items: readonly { label: string; to: string }[];
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + items.length * 0.06, duration: 0.4, ease: 'easeOut' }}
      className="w-full"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative block w-full text-center py-3 font-display text-[1.65rem] sm:text-3xl font-semibold transition-colors duration-300 ${
          solid
            ? 'text-[hsl(var(--ocheto-green-700))]'
            : 'text-[hsl(var(--ocheto-coffee-900))]'
        }`}
        aria-expanded={open}
        aria-label="Menú de sucursales"
      >
        <span className="inline-flex items-center gap-2.5">
          Menú
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-col items-center gap-1 pb-2">
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    onClose();
                    setOpen(false);
                  }}
                  className={`text-center py-2 font-medium text-lg transition-colors ${
                    solid
                      ? 'text-ocheto-coffee-700 hover:text-ocheto-green-700'
                      : 'text-ocheto-coffee-800 hover:text-ocheto-green-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
