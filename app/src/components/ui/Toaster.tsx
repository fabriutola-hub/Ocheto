import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToasts, toast, type ToastType } from '@/lib/toast';

const ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const COLORS: Record<ToastType, string> = {
  success: 'text-ocheto-green-700',
  error: 'text-ocheto-berry-600',
  info: 'text-ocheto-gold-600',
};

function ToastItem({
  id,
  type,
  message,
  link,
}: {
  id: number;
  type: ToastType;
  message: string;
  link?: string;
}) {
  const Icon = ICONS[type];
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    timerRef.current = window.setTimeout(() => toast.dismiss(id), 5000);
    return () => {
      if (timerRef.current !== undefined) window.clearTimeout(timerRef.current);
    };
  }, [id]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="pointer-events-auto w-[min(92vw,400px)] rounded-2xl bg-white border border-ocheto-cream-200 shadow-2xl shadow-ocheto-green-900/15 px-4 py-3 flex items-start gap-3"
      role="status"
    >
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${COLORS[type]}`} strokeWidth={2.2} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ocheto-coffee-900 leading-snug">{message}</p>
        {link && (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(link).catch(() => undefined);
              toast.dismiss(id);
            }}
            className="mt-1.5 text-xs font-semibold text-ocheto-green-700 hover:underline"
          >
            Copiar enlace de WhatsApp
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => toast.dismiss(id)}
        className="p-1 rounded-full hover:bg-ocheto-cream-100 transition-colors shrink-0"
        aria-label="Cerrar notificación"
      >
        <X className="w-3.5 h-3.5 text-ocheto-coffee-700/60" />
      </button>
    </motion.div>
  );
}

export default function Toaster() {
  const toasts = useToasts();

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col items-end gap-2.5 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
