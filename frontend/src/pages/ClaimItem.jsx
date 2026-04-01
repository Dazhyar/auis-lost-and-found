import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemContext';
import { createClaimRequest } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MapPin, Package, ChevronLeft, ArrowRight, ShieldAlert, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';

const ClaimItem = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const itemId = params.get('item_id');

    const { items } = useItems();
    const item = items.find(i => String(i.id) === String(itemId)) || null;

    const [confirmOwner, setConfirmOwner] = useState(false);
    const [confirmEmail, setConfirmEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async () => {
        if (!confirmOwner || !confirmEmail) {
            return toast.error('You must agree to both conditions to claim this item.');
        }
        setLoading(true);
        try {
            await createClaimRequest({
                student_name: user?.full_name,
                student_email: user?.email,
                found_item: itemId,
                notes: 'Submitted via fast claim.'
            });
            setDone(true);
            toast.success('Claim Request Submitted.');
        } catch {
            toast.error('Claim submission failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    if (done) return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-lg mx-auto mt-20 text-center p-12">
            <CheckCircle size={64} className="text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-auis-blue mb-3">Claim Request Submitted!</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
                Your request has been sent for review. Please proceed to the location listed below to verify your identity and collect the item.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left border border-gray-100">
                <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wider">Collection Location</p>
                <p className="font-medium text-gray-800 flex items-center gap-2">
                    <MapPin size={16} className="text-auis-blue" />
                    {item?.custody_status === 'office' ? 'University Office (Building C, Room 101)' : 'Coordinate with Finder'}
                </p>
            </div>
            <button className="btn-primary w-full max-w-[200px] mx-auto" onClick={() => navigate('/')}>Return Home</button>
        </motion.div>
    );

    if (!item) {
        return <div className="text-center mt-20 text-gray-500">Item not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-auis-blue mb-3">Claim This Item</h1>
                <p className="text-gray-500">Verify your ownership to initiate the recovery process.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left: Item Preview */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 border-t-4 border-t-auis-gold sticky top-28">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-auis-gold">
                            <Package size={14} /> Item Details
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${item.custody_status === 'office' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                            {item.custody_status === 'office' ? 'At Office' : 'With Finder'}
                        </span>
                    </div>

                    {item.photo_url || item.image ? (
                        <img src={item.image || item.photo_url} alt={item.name} className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-100 shadow-sm" />
                    ) : (
                        <div className="w-full h-40 bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-gray-300 border border-gray-100">
                            <Package size={48} />
                        </div>
                    )}

                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{item.description || 'No description provided.'}</p>

                    <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                        <span>Found at:<br /><strong>{item.location_found}</strong></span>
                    </div>
                </motion.div>

                {/* Right: Claim Form */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">

                    <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 flex gap-4 items-start">
                        <ShieldAlert className="text-amber-500 shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="font-bold text-amber-900 mb-1">Identity Verification Required</h4>
                            <p className="text-sm text-amber-800/80 leading-relaxed">
                                Submitting a claim is a formal request. You must present a valid AUIS Student ID matching the name <strong>{user?.full_name}</strong> to the staff or finder to successfully collect this item. False claims may result in disciplinary action.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-6 space-y-4">
                        <h3 className="font-bold text-gray-800 mb-4">Declarations</h3>

                        <div
                            className={`flex gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${confirmOwner ? 'bg-blue-50 border-auis-blue' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                            onClick={() => setConfirmOwner(!confirmOwner)}
                        >
                            <div className="mt-0.5 text-auis-blue">
                                {confirmOwner ? <CheckSquare size={20} /> : <Square size={20} className="text-gray-400" />}
                            </div>
                            <p className={`text-sm select-none ${confirmOwner ? 'text-auis-blue font-medium' : 'text-gray-600'}`}>
                                I formally confirm that I am the rightful, legal owner of this item and can provide proof of ownership if requested.
                            </p>
                        </div>

                        <div
                            className={`flex gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${confirmEmail ? 'bg-blue-50 border-auis-blue' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                            onClick={() => setConfirmEmail(!confirmEmail)}
                        >
                            <div className="mt-0.5 text-auis-blue">
                                {confirmEmail ? <CheckSquare size={20} /> : <Square size={20} className="text-gray-400" />}
                            </div>
                            <p className={`text-sm select-none ${confirmEmail ? 'text-auis-blue font-medium' : 'text-gray-600'}`}>
                                I authorize the system to record my AUIS email (<strong>{user?.email}</strong>) and share it with the finder or office for coordination.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button className="btn-secondary px-6" onClick={() => navigate(-1)}>
                            <ChevronLeft size={18} /> Cancel
                        </button>
                        <button
                            className={`flex-1 py-4 flex items-center justify-center gap-2 rounded-xl font-bold transition-all shadow-md text-white text-base ${confirmOwner && confirmEmail ? 'bg-auis-blue hover:bg-blue-800 hover:shadow-lg' : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}
                            onClick={handleSubmit}
                            disabled={loading || !confirmOwner || !confirmEmail}
                        >
                            Submit Claim Request <ArrowRight size={18} />
                        </button>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default ClaimItem;
