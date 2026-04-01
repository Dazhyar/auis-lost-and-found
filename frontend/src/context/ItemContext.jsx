import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFoundItems, getLostReports, getAdminStats } from '../api';

const ItemContext = createContext(null);

export const ItemProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [lostItems, setLostItems] = useState([]);
    const [stats, setStats] = useState({ total_found: 0, pending_reports: 0, total_claimed: 0 });
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [itemsRes, lostRes] = await Promise.all([
                getFoundItems(),
                getLostReports()
            ]);
            setItems(itemsRes.data || []);
            setLostItems(lostRes.data || []);
        } catch (error) {
            console.error('Failed to fetch items:', error);
        }

        try {
            const userStr = sessionStorage.getItem('auis_user');
            const user = userStr ? JSON.parse(userStr) : null;
            if (user && user.is_admin) {
                const statsRes = await getAdminStats();
                setStats(statsRes.data || { total_found: 0, pending_reports: 0, total_claimed: 0 });
            }
        } catch (error) {
            // Non-admin users will expectedly hit a 403 here, which is fine, but checking beforehand avoids browser console errors.
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refreshData = () => {
        fetchData();
    };

    return (
        <ItemContext.Provider value={{ items, lostItems, stats, loading, refreshData }}>
            {children}
        </ItemContext.Provider>
    );
};

export const useItems = () => {
    const context = useContext(ItemContext);
    if (!context) {
        throw new Error('useItems must be used within an ItemProvider');
    }
    return context;
};
