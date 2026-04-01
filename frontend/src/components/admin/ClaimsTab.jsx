import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar } from 'lucide-react';

const ClaimsTab = ({ allClaims, handleClaimAction, allSchedules }) => {
    return (
        <motion.div key="claims" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="glass-card overflow-hidden mt-2">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                    <h3 className="font-bold text-xl text-auis-blue flex items-center gap-2"><CheckCircle size={20} className="text-emerald-500" /> Claim Requests</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Claimant</th>
                                <th className="p-4 font-semibold">Item & Location</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allClaims.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50/50">
                                    <td className="p-4"><p className="font-semibold">{c.student_name}</p><p className="text-xs text-gray-500">{c.student_email}</p></td>
                                    <td className="p-4"><p className="font-semibold text-gray-800">{c.found_item_name}</p><p className="text-xs text-gray-500">Custody: {c.found_item_custody}</p></td>
                                    <td className="p-4"><span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${c.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : c.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{c.status}</span></td>
                                    <td className="p-4 text-right space-x-2">
                                        {c.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleClaimAction(c.id, 'approved')} className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded hover:bg-emerald-500 hover:text-white transition-colors">Approve</button>
                                                <button onClick={() => handleClaimAction(c.id, 'rejected')} className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition-colors">Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {allClaims.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No claim requests found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {allSchedules.length > 0 && (
                <div className="glass-card overflow-hidden mt-4">
                    <div className="p-4 sm:p-6 border-b border-gray-100">
                        <h3 className="font-bold text-xl text-auis-blue flex items-center gap-2"><Calendar size={20} className="text-amber-500" /> Legacy Pickup Schedules</h3>
                    </div>
                    <div className="p-4 text-sm text-gray-600">{allSchedules.length} ongoing legacy pickup appointments exist in the system.</div>
                </div>
            )}
        </motion.div>
    );
};

export default ClaimsTab;
