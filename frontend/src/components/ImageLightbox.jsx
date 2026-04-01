import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ImageLightbox = ({ imageSrc, altText, isOpen, onClose }) => {
    // Close on escape key
    React.useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && imageSrc && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#001c47]/80 backdrop-blur-xl cursor-zoom-out"
                    />

                    {/* Image Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative z-10 max-w-5xl w-full max-h-full flex flex-col items-center justify-center"
                    >
                        <button
                            onClick={onClose}
                            className="absolute -top-12 right-0 md:-right-12 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        <img
                            src={imageSrc}
                            alt={altText || "Item Preview"}
                            className="max-h-[85vh] w-auto object-contain rounded-xl shadow-[0_32px_128px_rgba(0,0,0,0.5)] border border-white/20"
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ImageLightbox;
