import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Trash2, History, Package, AlertCircle, ChevronRight, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, getUserHistory, updateUserProfile, deleteUserAccount } from '../api';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, logout } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [history, setHistory] = useState({ lost_reports: [], found_reports: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(user?.is_admin ? 'settings' : 'history');
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [profileRes, historyRes] = await Promise.all([
                    getUserProfile(),
                    getUserHistory()
                ]);
                setProfileData(profileRes.data);
                setHistory(historyRes.data);
            } catch (error) {
                toast.error("Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const handleToggleNotifications = async () => {
        if (!profileData) return;
        const newStatus = !profileData.email_notifications;
        try {
            setProfileData(prev => ({ ...prev, email_notifications: newStatus }));
            await updateUserProfile(profileData.id, { email_notifications: newStatus });
            toast.success("Notification settings updated.");
        } catch (error) {
            setProfileData(prev => ({ ...prev, email_notifications: !newStatus }));
            toast.error("Failed to update settings.");
        }
    };

    const handleDeleteAccount = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Account',
            message: 'Are you absolutely sure you want to delete your account? This action is permanent and will delete all your active reports and pending claims.',
            confirmText: 'Permanently Delete',
            variant: 'danger',
            action: async () => {
                setIsDeleting(true);
                try {
                    await deleteUserAccount();
                    toast.success("Account deleted successfully.");
                    logout(); // Forces redirect to login
                } catch (error) {
                    toast.error("Failed to delete account.");
                    setIsDeleting(false);
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-auis-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-16">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">Account Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {!user?.is_admin && (
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === 'history' ? 'bg-auis-blue text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'}`}
                        >
                            <History size={18} />
                            My Activity
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === 'settings' ? 'bg-auis-blue text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'}`}
                    >
                        <User size={18} />
                        Profile Preferences
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${activeTab === 'security' ? 'bg-red-600 text-white shadow-md' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'}`}
                    >
                        <Shield size={18} />
                        Danger Zone
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* ACTIVITY TAB */}
                            {activeTab === 'history' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <AlertCircle className="text-amber-500" size={20} /> My Active Lost Reports
                                            </h2>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                            {history.lost_reports.length === 0 ? (
                                                <div className="p-8 text-center text-gray-500 text-sm">You have no active lost reports.</div>
                                            ) : (
                                                history.lost_reports.map(report => (
                                                    <div key={report.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                                                        <div>
                                                            <div className="font-bold text-gray-900">{report.item_name}</div>
                                                            <div className="text-sm text-gray-500 mt-1">Lost at {report.location_lost} <span className="mx-2">•</span> {new Date(report.date_lost).toLocaleDateString()}</div>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${report.is_resolved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                            {report.is_resolved ? 'Resolved' : 'Still Missing'}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                <CheckCircle2 className="text-emerald-500" size={20} /> Found Items I Reported
                                            </h2>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                            {history.found_reports.length === 0 ? (
                                                <div className="p-8 text-center text-gray-500 text-sm">You haven't reported any found items yet.</div>
                                            ) : (
                                                history.found_reports.map(report => (
                                                    <div key={report.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                                                        <div>
                                                            <div className="font-bold text-gray-900">{report.item_name}</div>
                                                            <div className="text-sm text-gray-500 mt-1">Found at {report.location_found} <span className="mx-2">•</span> {new Date(report.date_found).toLocaleDateString()}</div>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${report.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : report.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SETTINGS TAB */}
                            {activeTab === 'settings' && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                    <div className="flex items-center gap-6 pb-8 border-b border-gray-100 mb-8">
                                        <div className="w-20 h-20 rounded-full bg-blue-100 text-auis-blue flex items-center justify-center text-3xl font-bold">
                                            {user.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{user.full_name}</h2>
                                            <p className="text-gray-500 font-medium">{user.email}</p>
                                            <span className="inline-block mt-2 text-xs font-bold uppercase tracking-widest bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                {user.is_admin ? "Administrator" : "Student"}
                                            </span>
                                        </div>
                                    </div>

                                    {!user.is_admin ? (
                                        <>
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h3>
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div>
                                                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                                                        <Bell size={18} className="text-auis-blue" /> Email Notifications
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1">Receive updates when matches are found or claims are approved.</div>
                                                </div>
                                                <button
                                                    onClick={handleToggleNotifications}
                                                    className={`relative w-12 h-6 rounded-full transition-colors ${profileData?.email_notifications ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                                >
                                                    <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-transform ${profileData?.email_notifications ? 'left-7' : 'left-1'}`} />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Shield className="mx-auto h-12 w-12 text-auis-gold opacity-50 mb-4" />
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">Admin Account</h3>
                                            <p className="text-gray-500 max-w-sm mx-auto">
                                                You are currently logged in as an administrator. Your primary actions and activity logs are managed within the Control Center.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SECURITY TAB */}
                            {activeTab === 'security' && (
                                <div className="bg-red-50 rounded-2xl border border-red-100 p-6 sm:p-8">
                                    <h2 className="text-xl font-bold text-red-900 mb-2">Delete Account</h2>
                                    <p className="text-red-700/80 mb-6 text-sm">
                                        Permanently remove your personal information and all data tied to this account, including active lost reports and pending claims. Found items you submitted that were approved by admins will be retained for inventory integrity, but your identity will be anonymized.
                                    </p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={isDeleting}
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md shadow-red-200 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Trash2 size={18} />
                                        {isDeleting ? "Deleting..." : "Permanently Delete Account"}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                variant={confirmModal.variant}
                onConfirm={() => {
                    if (confirmModal.action) confirmModal.action();
                    setConfirmModal({ ...confirmModal, isOpen: false });
                }}
                onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            />
        </div>
    );
};

export default Profile;
