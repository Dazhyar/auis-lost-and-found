import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Trash2 } from 'lucide-react';

const LostItemsTab = ({ allLost, handleResolveLost, handleDeleteLost }) => {
    return (
        <motion.div key="lost_items" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="glass-card overflow-hidden mt-2">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                    <h3 className="font-bold text-xl text-auis-blue flex items-center gap-2"><FileText size={20} className="text-red-500" /> Lost Reports</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Student</th>
                                <th className="p-4 font-semibold">Item & Category</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allLost.map(lost => (
                                <tr key={lost.id} className="hover:bg-gray-50/50">
                                    <td className="p-4"><p className="font-semibold">{lost.student_name}</p><p className="text-xs text-gray-500">{lost.student_email}</p></td>
                                    <td className="p-4"><p className="font-bold text-gray-800">{lost.item_name}</p><p className="text-xs text-blue-600">{lost.category}</p></td>
                                    <td className="p-4">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${lost.is_resolved ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{lost.is_resolved ? 'Resolved' : 'Active'}</span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => handleResolveLost(lost.id, lost.is_resolved)} className="text-xs font-bold bg-blue-50 text-auis-blue px-3 py-1.5 rounded hover:bg-blue-100 transition-colors">Toggle Status</button>
                                        <button onClick={() => handleDeleteLost(lost.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors inline-block"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                            {allLost.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No lost reports found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default LostItemsTab;
