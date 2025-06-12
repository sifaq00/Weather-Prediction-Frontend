import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

const variants = {
    success: {
        icon: CheckCircle,
        className: 'bg-green-50 text-green-800 border-green-200',
    },
    error: {
        icon: AlertCircle,
        className: 'bg-red-50 text-red-800 border-red-200',
    },
    info: {
        icon: Info,
        className: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    warning: {
        icon: AlertTriangle,
        className: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    },
};

export function Toast({
    message,
    variant = 'info',
    duration = 5000,
    onClose,
    className,
    ...props
}) {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const { icon: Icon, className: variantClassName } = variants[variant];

    return (
        <div
            className={cn(
                'flex items-center p-4 mb-4 rounded-lg border',
                'animate-in slide-in-from-right-5',
                variantClassName,
                className
            )}
            {...props}
        >
            <Icon className="h-5 w-5 mr-3" />
            <p className="text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-black/5"
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
}

export function ToastContainer({ children }) {
    return (
        <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
            {children}
        </div>
    );
} 