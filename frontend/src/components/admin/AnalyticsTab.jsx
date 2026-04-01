import React from 'react';
import { motion } from 'framer-motion';

const AnalyticsTab = ({ stats }) => {
    return (
        <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-8 border-t-4 border-t-auis-blue flex flex-col justify-center text-center">
                <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-2">Total Available Items</h3>
                <div className="text-5xl font-black text-auis-blue">{stats?.total_found_available || 0}</div>
            </div>
            <div className="glass-card p-8 border-t-4 border-t-emerald-500 flex flex-col justify-center text-center">
                <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-2">Total Claimed / Returned</h3>
                <div className="text-5xl font-black text-emerald-500">{stats?.total_claimed || 0}</div>
            </div>
            <div className="glass-card p-8 border-t-4 border-t-amber-500 flex flex-col justify-center text-center">
                <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-2">Total Browsing (Lost Reports)</h3>
                <div className="text-5xl font-black text-amber-500">{stats?.total_lost_reports || 0}</div>
            </div>
        </motion.div>
    );
};

export default AnalyticsTab;
