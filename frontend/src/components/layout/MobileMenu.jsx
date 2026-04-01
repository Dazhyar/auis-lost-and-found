import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, AlertCircle, LogOut, X } from 'lucide-react';

// Framer Motion Variants for Staggered Mobile Links
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// Mobile NavLink Component
const MobileLink = ({ to, icon, label, active, onClose, variants }) => (
    <motion.div variants={variants}>
        <Link
            to={to}
            onClick={onClose}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-colors ${active
                ? 'bg-blue-50 text-auis-blue border border-blue-100/50'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
        >
            <div className={`${active ? 'text-auis-blue' : 'text-gray-400'}`}>
                {icon}
            </div>
            {label}
        </Link>
    </motion.div>
);

const MobileMenu = ({ user, isActive, logout, setMobileMenuOpen }) => {
    return (
        <>
            {/* Blurred Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[90] md:hidden"
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Drawer */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: "spring", damping: 28, stiffness: 250 }}
                className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-white z-[100] md:hidden shadow-2xl flex flex-col"
            >
                {/* Drawer Header */}
                <div className="h-20 px-6 flex justify-between items-center border-b border-gray-100 bg-white shrink-0">
                    <span className="font-extrabold text-xl text-gray-900 tracking-tight">
                        AUIS <span className="text-auis-blue">L&F</span>
                    </span>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Drawer Links */}
                <div className="flex-1 overflow-y-auto py-8 px-6">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-3"
                    >
                        {user?.is_admin ? (
                            <MobileLink variants={itemVariants} to="/admin/dashboard" icon={<AlertCircle size={22} />} label="Admin Dashboard" active={isActive('/admin/dashboard')} onClose={() => setMobileMenuOpen(false)} />
                        ) : (
                            <>
                                <MobileLink variants={itemVariants} to="/" icon={<Search size={22} />} label="Browse Items" active={isActive('/')} onClose={() => setMobileMenuOpen(false)} />
                                <MobileLink variants={itemVariants} to="/report-lost" icon={<AlertCircle size={22} />} label="Report Lost Item" active={isActive('/report-lost')} onClose={() => setMobileMenuOpen(false)} />
                                <MobileLink variants={itemVariants} to="/report-found" icon={<Plus size={22} />} label="Submit Found Item" active={isActive('/report-found')} onClose={() => setMobileMenuOpen(false)} />
                            </>
                        )}
                    </motion.div>
                </div>

                {/* Drawer Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
                    {user ? (
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 shrink-0 rounded-full bg-auis-blue text-white flex items-center justify-center font-bold text-lg shadow-md ring-4 ring-white">
                                    {user.full_name.charAt(0)}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-base font-bold text-gray-900 truncate">{user.full_name}</p>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                                </div>
                            </div>

                            <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full flex justify-center items-center gap-2 py-3 bg-white border border-gray-200 hover:bg-red-50 text-red-600 rounded-xl text-sm font-bold transition-colors">
                                <LogOut size={18} /> Sign Out
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex w-full justify-center items-center py-3.5 bg-auis-blue hover:bg-blue-700 text-white rounded-xl text-base font-bold shadow-lg shadow-blue-200 transition-colors">
                            Sign In to Account
                        </Link>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default MobileMenu;
