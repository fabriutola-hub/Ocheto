import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  danger = false,
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7"
            role="alertdialog"
            aria-modal="true"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                danger ? 'bg-ocheto-berry-600/10' : 'bg-ocheto-gold-500/15'
              }`}
            >
              <AlertTriangle
                className={`w-6 h-6 ${danger ? 'text-ocheto-berry-600' : 'text-ocheto-gold-600'}`}
              />
            </div>
            <h3 className="font-fraunces italic font-medium text-ocheto-coffee-900 text-2xl leading-tight">
              {title}
            </h3>
            <p className="mt-2 text-sm text-ocheto-coffee-700/75 leading-relaxed">{message}</p>
            {children && <div className="mt-4">{children}</div>}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-ocheto-coffee-700 hover:bg-ocheto-cream-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-colors shadow-lg ${
                  danger
                    ? 'bg-ocheto-berry-600 hover:bg-ocheto-berry-700 shadow-ocheto-berry-600/25'
                    : 'bg-ocheto-green-700 hover:bg-ocheto-green-600 shadow-ocheto-green-700/25'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
