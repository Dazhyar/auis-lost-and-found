import React from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Edit2, Trash2 } from 'lucide-react';

const InventoryTab = ({ inventory, openModal, handleDeleteItem }) => {
    return (
        <motion.div key="inventory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="glass-card overflow-hidden mt-2">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="font-bold text-xl text-auis-blue flex items-center gap-2">
                        <Package size={20} className="text-auis-gold" /> Active Inventory
                    </h3>
                    <button onClick={() => openModal()} className="btn-primary py-2 px-4 shadow-sm w-full sm:w-auto text-sm">
                        <Plus size={16} /> Add Found Item
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Item</th>
                                <th className="p-4 font-semibold">Category</th>
                                <th className="p-4 font-semibold">Location</th>
                                <th className="p-4 font-semibold">Custody</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {inventory.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4"><p className="font-semibold text-gray-900">{item.name}</p></td>
                                    <td className="p-4"><span className="text-xs font-bold text-auis-blue bg-blue-50 px-2 py-1 rounded inline-block">{item.category}</span></td>
                                    <td className="p-4 text-sm text-gray-600">{item.location_found}</td>
                                    <td className="p-4 text-sm font-medium text-auis-blue">{item.custody_status === 'office' ? 'Office' : 'Finder'}</td>
                                    <td className="p-4">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${item.status === 'claimed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => openModal(item)} className="p-2 text-auis-blue hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
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

export default InventoryTab;
