/**
 * Modal Component
 * Dialog/Modal for user interactions
 */

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnEscape = true,
  closeOnClickOutside = true,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={() => closeOnClickOutside && onClose()}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            'relative w-full bg-white rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 duration-300',
            sizeClasses[size]
          )}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-lg font-semibold text-secondary-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-secondary-400 hover:text-secondary-600 transition-colors p-1"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {!title && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-secondary-400 hover:text-secondary-600 transition-colors p-1 z-10"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export { Modal };
