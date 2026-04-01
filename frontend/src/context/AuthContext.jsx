import React, { createContext, useContext, useState, useCallback } from 'react';
import { verifyGoogleToken } from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(sessionStorage.getItem('auis_user')) || null;
        } catch { return null; }
    });
    const [loading, setLoading] = useState(false);

    const login = useCallback(userData => {
        setUser(userData);
        sessionStorage.setItem('auis_user', JSON.stringify(userData));
        return userData;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        sessionStorage.removeItem('auis_user');
        toast.success('Logged out successfully.');
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
