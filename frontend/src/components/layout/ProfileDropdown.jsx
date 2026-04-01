import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfileDropdown = ({ isTransparent }) => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    if (!user) return null;

    return (
        <div className="relative flex-shrink-0" ref={dropdownRef}>
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-3 pl-2 pr-1.5 py-1.5 rounded-full transition-colors border ${isTransparent ? 'hover:bg-white/10 border-transparent hover:border-white/20' : 'hover:bg-gray-50 border-transparent hover:border-gray-200'}`}
            >
                <div className="text-right hidden xl:block">
                    <div className={`text-sm font-bold leading-none ${isTransparent ? 'text-white' : 'text-gray-900'}`}>{user.full_name}</div>
                    <div className={`text-[11px] font-medium mt-1 ${isTransparent ? 'text-white/80' : 'text-gray-500'}`}>{user.is_admin ? 'Admin' : 'Student'}</div>
                </div>
                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ring-2 ${isTransparent ? 'bg-white text-auis-blue ring-white/50' : 'bg-auis-blue text-white ring-white'}`}>
                    {user.full_name.charAt(0)}
                </div>
            </motion.button>

            <AnimatePresence>
                {dropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden py-2 z-50 origin-top-right"
                    >
                        <div className="px-5 py-4 border-b border-gray-50 mb-2 bg-gradient-to-b from-gray-50/50 to-white">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.full_name}</p>
                            <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                        </div>

                        {user.is_admin && (
                            <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-auis-blue transition-colors">
                                <AlertCircle size={18} /> Admin Dashboard
                            </Link>
                        )}

                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            <UserIcon size={18} /> Profile Settings
                        </Link>

                        <div className="h-px bg-gray-100 my-2 mx-4"></div>

                        <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                            <LogOut size={18} /> Sign out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown;
