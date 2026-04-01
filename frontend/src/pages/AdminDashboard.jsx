import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getItemReports, approveReport, rejectReport, createFoundItem, updateFoundItem, deleteFoundItem, getClaimRequests, updateClaimRequest, getLostReports, updateLostReport, deleteLostReport, getUsers, updateUser, getPickupSchedules } from '../api';
import { useItems } from '../context/ItemContext';
import { AlertTriangle, RefreshCw, Plus, Edit2, Trash2, X } from 'lucide-react';

// Subcomponents
import AnalyticsTab from '../components/admin/AnalyticsTab';
import ItemReportsTab from '../components/admin/ItemReportsTab';
import InventoryTab from '../components/admin/InventoryTab';
import ClaimsTab from '../components/admin/ClaimsTab';
import LostItemsTab from '../components/admin/LostItemsTab';
import UsersTab from '../components/admin/UsersTab';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { items: inventory, stats, refreshData, loading: globalLoading } = useItems();

    const [activeTab, setActiveTab] = useState('analytics'); // analytics, moderation, inventory, claims, lost_items, users

    const [pendingReports, setPendingReports] = useState([]);
    const [allClaims, setAllClaims] = useState([]);
    const [allLost, setAllLost] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allSchedules, setAllSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state for Inventory
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', category: 'Other', location_found: '', description: '', status: 'found', custody_status: 'office' });

    // State for Confirm Modal
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', action: null, confirmText: 'Confirm', variant: 'danger' });

    const performConfirmAction = () => {
        if (confirmModal.action) confirmModal.action();
        setConfirmModal({ ...confirmModal, isOpen: false });
    };

    const fetchAllData = async () => {
        setLoading(true);
        refreshData();
        try {
            const [repRes, claimRes, lostRes, userRes, schedRes] = await Promise.all([
                getItemReports(), getClaimRequests(), getLostReports(), getUsers(), getPickupSchedules()
            ]);
            setPendingReports(repRes.data.filter(rep => rep.status === 'pending'));
            setAllClaims(claimRes.data);
            setAllLost(lostRes.data);
            setAllUsers(userRes.data);
            setAllSchedules(schedRes.data);
        } catch (e) {
            toast.error('Failed to load admin data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user?.is_admin) { navigate('/'); return; }
        fetchAllData();
    }, [user, navigate]);

    // Actions
    const handleApprove = async (id) => { try { await approveReport(id); toast.success('Approved'); fetchAllData(); } catch { toast.error('Failed to approve.'); } };
    const handleReject = async (id) => { try { await rejectReport(id); toast.success('Rejected'); fetchAllData(); } catch { toast.error('Failed to reject.'); } };

    const handleDeleteItem = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Item',
            message: 'Are you sure you want to delete this item? This action cannot be undone.',
            confirmText: 'Delete Item',
            variant: 'danger',
            action: async () => {
                try { await deleteFoundItem(id); toast.success('Deleted'); fetchAllData(); } catch { toast.error('Failed to delete item.'); }
            }
        });
    };

    const handleClaimAction = async (id, status) => {
        try { await updateClaimRequest(id, { status }); toast.success(`Claim ${status}`); fetchAllData(); } catch { toast.error('Failed to update claim'); }
    };

    const handleResolveLost = async (id, currentStatus) => {
        try { await updateLostReport(id, { is_resolved: !currentStatus }); toast.success('Report resolved status updated'); fetchAllData(); } catch { toast.error('Failed to update report'); }
    };

    const handleDeleteLost = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Report',
            message: 'Are you sure you want to delete this lost report? This action cannot be undone.',
            confirmText: 'Delete Report',
            variant: 'danger',
            action: async () => {
                try { await deleteLostReport(id); toast.success('Report deleted'); fetchAllData(); } catch { toast.error('Failed to delete report'); }
            }
        });
    };

    const handleToggleAdmin = (id, currentStatus) => {
        setConfirmModal({
            isOpen: true,
            title: currentStatus ? 'Revoke Admin Rights' : 'Grant Admin Rights',
            message: `Are you sure you want to ${currentStatus ? 'revoke' : 'grant'} admin rights for this user?`,
            confirmText: currentStatus ? 'Revoke Rights' : 'Grant Rights',
            variant: 'danger',
            action: async () => {
                try { await updateUser(id, { is_admin: !currentStatus }); toast.success('User permissions updated'); fetchAllData(); } catch { toast.error('Failed to update user'); }
            }
        });
    };

    // Inventory Modal
    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({ name: item.name, category: item.category, location_found: item.location_found, description: item.description, status: item.status, custody_status: item.custody_status || 'office' });
        } else {
            setEditingItem(null);
            setFormData({ name: '', category: 'Electronics', location_found: '', description: '', status: 'found', custody_status: 'office' });
        }
        setIsModalOpen(true);
    };

    const handleSaveItem = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await updateFoundItem(editingItem.id, formData);
                toast.success('Item updated');
            } else {
                await createFoundItem(formData);
                toast.success('Item added');
            }
            setIsModalOpen(false);
            fetchAllData();
        } catch (err) { toast.error('Failed to save item'); }
    };

    if (loading || globalLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-auis-blue">
            <RefreshCw className="animate-spin mb-4" size={32} />
            <p className="font-semibold text-lg">Initializing Control Center...</p>
        </div>
    );

    return (
        <div className="pb-12">
            <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4 pt-4">
                <div>
                    <h1 className="text-3xl font-bold text-auis-blue mb-2 tracking-tight">Control Center</h1>
                </div>
                <div className="flex bg-white/60 p-1 rounded-xl glass-card flex-wrap gap-1">
                    {['analytics', 'moderation', 'inventory', 'claims', 'lost_items', 'users'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors flex items-center gap-1 ${activeTab === tab ? 'bg-auis-blue text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                            {tab.replace('_', ' ')}
                            {tab === 'moderation' && pendingReports.length > 0 && <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">{pendingReports.length}</span>}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'analytics' && (
                    <AnalyticsTab stats={stats} />
                )}

                {activeTab === 'moderation' && (
                    <ItemReportsTab
                        pendingReports={pendingReports}
                        handleApprove={handleApprove}
                        handleReject={handleReject}
                    />
                )}

                {activeTab === 'inventory' && (
                    <InventoryTab
                        inventory={inventory}
                        openModal={openModal}
                        handleDeleteItem={handleDeleteItem}
                    />
                )}

                {activeTab === 'claims' && (
                    <ClaimsTab
                        allClaims={allClaims}
                        handleClaimAction={handleClaimAction}
                        allSchedules={allSchedules}
                    />
                )}

                {activeTab === 'lost_items' && (
                    <LostItemsTab
                        allLost={allLost}
                        handleResolveLost={handleResolveLost}
                        handleDeleteLost={handleDeleteLost}
                    />
                )}

                {activeTab === 'users' && (
                    <UsersTab
                        allUsers={allUsers}
                        user={user}
                        handleToggleAdmin={handleToggleAdmin}
                    />
                )}
            </AnimatePresence>

            {/* Modal for Add/Edit Form */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                                <h3 className="font-bold text-lg text-auis-blue">{editingItem ? 'Edit Found Item' : 'Add New Item'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><X size={20} /></button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                <form id="item-form" onSubmit={handleSaveItem} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Item Name</label>
                                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-glass w-full shadow-sm bg-white" placeholder="e.g. Blue Dell Laptop" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Category</label>
                                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="input-glass w-full shadow-sm bg-white cursor-pointer h-[42px]">
                                                {['Electronics', 'IDs & Documents', 'Clothing', 'Keys', 'Bags', 'Accessories', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Status</label>
                                            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="input-glass w-full shadow-sm bg-white cursor-pointer h-[42px]">
                                                <option value="found">Found (Available)</option>
                                                <option value="claimed">Claimed</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Custody</label>
                                            <select value={formData.custody_status} onChange={e => setFormData({ ...formData, custody_status: e.target.value })} className="input-glass w-full shadow-sm bg-white cursor-pointer h-[42px]">
                                                <option value="office">University Office</option>
                                                <option value="finder">With Finder</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Location Found</label>
                                        <input type="text" required value={formData.location_found} onChange={e => setFormData({ ...formData, location_found: e.target.value })} className="input-glass w-full shadow-sm bg-white" placeholder="e.g. Library 2nd Floor" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Description</label>
                                        <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="input-glass w-full shadow-sm bg-white resize-none" placeholder="Details like color, brand, condition..."></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="p-5 border-t border-gray-100 bg-gray-50/80 flex justify-end gap-3 mt-auto shrink-0">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary py-2 text-sm">Cancel</button>
                                <button type="submit" form="item-form" className="btn-primary py-2 text-sm">{editingItem ? 'Save Changes' : 'Add Item'}</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                variant={confirmModal.variant}
                onConfirm={performConfirmAction}
                onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            />
        </div>
    );
};

export default AdminDashboard;
