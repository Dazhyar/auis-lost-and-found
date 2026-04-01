import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', variant = 'danger' }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col"
                    >
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                {variant === 'danger' && <AlertCircle size={20} className="text-red-500" />}
                                {title}
                            </h3>
                            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
                        </div>
                        <div className="p-5 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3 shrink-0">
                            <button onClick={onCancel} className="btn-secondary py-2 px-4 shadow-sm text-sm">
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`py-2 px-4 rounded-xl font-bold shadow-sm transition-all focus:ring-4 focus:outline-none text-sm ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200/50 focus:ring-red-100' : 'btn-primary'
                                    }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
