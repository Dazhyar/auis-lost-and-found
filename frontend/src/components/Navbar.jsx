import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Plus, AlertCircle, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import ProfileDropdown from './layout/ProfileDropdown';
import MobileMenu from './layout/MobileMenu';

const Navbar = ({ onOpenSearch }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isHome = location.pathname === '/';
    const isTransparent = isHome && !scrolled;

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const handleScroll = () => {
            if (location.pathname === '/') {
                // Keep transparent until scrolled past most of the hero section (approx 75vh)
                setScrolled(window.scrollY > window.innerHeight * 0.75);
            } else {
                setScrolled(window.scrollY > 20);
            }
        };
        window.addEventListener('scroll', handleScroll);
        // initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileMenuOpen]);

    const handleSearchClick = () => {
        setMobileMenuOpen(false);
        onOpenSearch();
    };

    // Dynamic text colors based on transparency
    const navTextClass = isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-gray-900';
    const logoTextClass = isTransparent ? 'text-white' : 'text-gray-900';
    const logoHighlightClass = isTransparent ? 'text-white' : 'text-auis-blue';
    const logoBg = isTransparent ? 'bg-white/10 border-white/20' : 'bg-blue-50 border-blue-100/50';

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent
                ? 'bg-transparent border-transparent'
                : 'bg-white/90 backdrop-blur-xl shadow-[0_4px_32px_rgba(0,0,0,0.05)] border-b border-gray-100'
                } h-16 lg:h-20 px-4 sm:px-6 lg:px-8`}>
                <div className="max-w-7xl mx-auto h-full flex items-center justify-between">

                    {/* Left: Hamburger & Logo */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            className={`md:hidden p-2 rounded-xl transition-colors -ml-2 ${isTransparent ? 'text-white hover:bg-white/10' : 'text-auis-blue hover:bg-blue-50'}`}
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>

                        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                            <motion.div
                                whileTap={{ scale: 0.95 }}
                                className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center transition-colors border overflow-hidden ${logoBg}`}
                            >
                                <img src="https://upload.wikimedia.org/wikipedia/en/5/56/American_University_of_Iraq%2C_Sulaimani_%28emblem%29.png" alt="AUIS Logo" className="w-full h-full object-cover p-1" />
                            </motion.div>
                            <span className={`font-bold text-lg lg:text-xl tracking-tight ${logoTextClass} transition-colors`}>
                                L&F
                            </span>
                        </Link>
                    </div>

                    {/* Middle: Search (Desktop) */}
                    <div className="hidden md:block flex-1 max-w-md mx-6 lg:mx-8">
                        <button
                            onClick={onOpenSearch}
                            className={`group flex w-full items-center gap-3 border rounded-full px-4 py-2.5 text-sm transition-all duration-300 ${isTransparent ? 'bg-white/20 border-white/30 text-white/80 hover:bg-white/30 backdrop-blur-md' : 'bg-gray-50 border-gray-200/80 text-gray-500 hover:bg-white hover:border-blue-200 hover:shadow-[0_2px_12px_rgba(37,99,235,0.08)]'}`}
                        >
                            <Search size={16} className={`${isTransparent ? 'text-white/80 group-hover:text-white' : 'text-gray-400 group-hover:text-auis-blue'} transition-colors`} />
                            <span className="flex-1 text-left">Quick search...</span>
                        </button>
                    </div>

                    {/* Right: Desktop Links & Mobile Search Icon & User Menu */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={handleSearchClick}
                            className={`md:hidden p-2.5 rounded-full transition-colors flex-shrink-0 ${isTransparent ? 'text-white bg-white/20 border border-white/30 backdrop-blur-md hover:bg-white/30' : 'text-auis-blue bg-blue-50 hover:bg-blue-100'}`}
                        >
                            <Search size={18} />
                        </button>

                        {!user?.is_admin && (
                            <div className={`hidden md:flex items-center gap-2 px-1 py-1 rounded-full ${isTransparent ? '' : 'bg-gray-50/80 border border-gray-100'}`}>
                                <NavLink to="/" label="Browse" active={isActive('/')} isTransparent={isTransparent} />
                                <NavLink to="/report-lost" label="Lost" active={isActive('/report-lost')} isTransparent={isTransparent} />
                                <NavLink to="/report-found" label="Found" active={isActive('/report-found')} isTransparent={isTransparent} />
                            </div>
                        )}

                        {user ? (
                            <ProfileDropdown isTransparent={isTransparent} />
                        ) : (
                            <Link to="/login" className={`hidden sm:block px-6 py-2.5 rounded-[4px] text-sm font-bold transition-all whitespace-nowrap ${isTransparent ? 'bg-[#cba84f] text-white hover:bg-[#b0903a]' : 'bg-[#cba84f] text-white hover:bg-[#b0903a] shadow-md shadow-yellow-200'}`}>
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Drawer Overlay */}
            {mobileMenuOpen && (
                <MobileMenu
                    user={user}
                    isActive={isActive}
                    logout={logout}
                    setMobileMenuOpen={setMobileMenuOpen}
                />
            )}
        </>
    );
};

// Desktop NavLink Component
const NavLink = ({ to, label, active, isTransparent }) => {
    let activeClass = '';
    let inactiveClass = '';

    if (isTransparent) {
        activeClass = 'text-white font-bold tracking-wide drop-shadow-md';
        inactiveClass = 'text-white/80 hover:text-white hover:drop-shadow-sm transition-all';
    } else {
        activeClass = 'bg-white shadow-sm text-auis-blue ring-1 ring-gray-200/50 scale-[1.02] font-bold';
        inactiveClass = 'text-gray-500 hover:text-gray-900 hover:bg-white/60 font-medium';
    }

    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-base transition-all duration-300 ${active ? activeClass : inactiveClass}`}
        >
            {label}
        </Link>
    );
};

export default Navbar;