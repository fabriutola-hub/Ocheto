import { motion } from 'framer-motion';
import { Link } from 'react-router';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-ocheto-cream-50 pt-24 pb-16 relative overflow-hidden">
      <div aria-hidden className="absolute top-0 left-0 right-0 h-64 bg-ocheto-green-950" />
      <div
        aria-hidden
        className="absolute top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-ocheto-caramel-500/15 blur-3xl pointer-events-none"
      />
      <div className="relative container-ocheto max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl border border-ocheto-cream-200 shadow-2xl shadow-ocheto-green-900/10 overflow-hidden"
        >
          <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-ocheto-cream-200/70">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ocheto-green-700 hover:text-ocheto-green-600 transition-colors mb-5"
            >
              <span aria-hidden>←</span> Volver a Ocheto
            </Link>
            <h1 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-3xl leading-tight">
              {title}
            </h1>
            <p className="mt-2 text-sm text-ocheto-coffee-700/70 leading-relaxed">{subtitle}</p>
          </div>
          <div className="px-6 sm:px-8 py-7">{children}</div>
          {footer && (
            <div className="px-6 sm:px-8 py-5 bg-ocheto-cream-50 border-t border-ocheto-cream-200/70 text-center text-sm text-ocheto-coffee-700/80">
              {footer}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export const inputClass =
  'w-full px-4 py-3 rounded-xl bg-ocheto-cream-50 border border-ocheto-cream-200 text-ocheto-coffee-900 placeholder:text-ocheto-coffee-700/40 focus:outline-none focus:ring-2 focus:ring-ocheto-green-700/40 focus:border-ocheto-green-700 transition-all text-sm';

export const labelClass =
  'block text-xs font-bold uppercase tracking-[0.14em] text-ocheto-coffee-700/80 mb-1.5';

export const errorClass = 'text-sm text-ocheto-berry-600 font-medium';

export const primaryButtonClass =
  'w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-sm text-ocheto-cream-50 bg-ocheto-green-700 hover:bg-ocheto-green-600 transition-colors shadow-lg shadow-ocheto-green-700/25 disabled:opacity-60 disabled:cursor-not-allowed';
