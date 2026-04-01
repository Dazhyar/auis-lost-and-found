import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const UsersTab = ({ allUsers, user, handleToggleAdmin }) => {
    return (
        <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="glass-card overflow-hidden mt-2">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                    <h3 className="font-bold text-xl text-auis-blue flex items-center gap-2"><Users size={20} className="text-blue-500" /> User Management</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allUsers.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50/50">
                                    <td className="p-4 flex items-center gap-3">
                                        {u.photo_url ? <img src={u.photo_url} alt="" className="w-8 h-8 rounded-full border border-gray-200" /> : <div className="w-8 h-8 bg-gray-200 rounded-full"></div>}
                                        <p className="font-semibold text-gray-900">{u.full_name}</p>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${u.is_admin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {u.is_admin ? 'Admin' : 'Student'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleToggleAdmin(u.id, u.is_admin)} className="text-xs font-bold border border-gray-200 bg-white text-gray-700 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors" disabled={u.email === user.email}>
                                            {u.is_admin ? 'Revoke Admin' : 'Make Admin'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default UsersTab;
