import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const ItemReportsTab = ({ pendingReports, handleApprove, handleReject }) => {
    return (
        <motion.div key="moderation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex items-center justify-between mb-4 mt-2">
                <h3 className="font-bold text-xl text-auis-blue flex items-center gap-2">
                    <AlertTriangle size={20} className="text-red-500" /> Pending Moderation
                </h3>
            </div>
            {pendingReports.length === 0 ? (
                <div className="glass-card p-12 text-center text-gray-400 mt-4">
                    <CheckCircle size={48} className="mx-auto mb-4 opacity-50 text-emerald-500" />
                    <p className="font-semibold text-lg text-gray-600">All caught up!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {pendingReports.map(report => (
                        <div key={report.id} className="glass-card p-5 border-t-4 border-t-red-500 flex flex-col relative">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-auis-blue bg-blue-50 px-2 py-1 rounded">{report.category}</span>
                            </div>
                            <h4 className="font-bold text-lg text-gray-900 mb-1">{report.item_name}</h4>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{report.description || 'No description provided.'}</p>
                            <div className="bg-gray-50 p-3 rounded-lg mb-5 flex-1">
                                <span className="text-xs text-gray-400 uppercase font-bold">Location</span>
                                <div className="text-sm font-semibold mb-2">{report.location_found}</div>
                                <span className="text-xs text-gray-400 uppercase font-bold">Custody</span>
                                <div className="text-sm font-semibold text-auis-blue">{report.custody_status === 'office' ? 'Office' : 'Finder'}</div>
                                <span className="text-xs text-gray-400 uppercase font-bold mt-2 block">Reporter</span>
                                <div className="text-xs font-medium text-gray-600">{report.reporter_email}</div>
                            </div>
                            <div className="flex gap-2 mt-auto">
                                <button onClick={() => handleApprove(report.id)} className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-lg text-sm font-bold transition-colors">Approve</button>
                                <button onClick={() => handleReject(report.id)} className="flex-1 py-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 rounded-lg text-sm font-bold transition-colors">Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default ItemReportsTab;
