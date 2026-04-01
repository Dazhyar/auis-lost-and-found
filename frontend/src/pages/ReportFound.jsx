import React, { useState } from 'react';
import { createItemReport } from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle, Camera, MapPin, Tag, FileText, User, Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'IDs & Documents', 'Clothing', 'Keys', 'Bags', 'Accessories', 'Other'];

const ReportFound = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        reporter_name: user?.full_name || '',
        reporter_email: user?.email || '',
        item_name: '',
        category: 'Electronics',
        location_found: '',
        description: '',
        photo_url: '',
        custody_status: 'finder',
    });
    const [imageFile, setImageFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handle = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.reporter_email.endsWith('@auis.edu.krd')) {
            toast.error('Please use your AUIS email address.');
            return;
        }
        setLoading(true);

        // Prepare multipart form data
        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });
        if (imageFile) {
            submitData.append('image', imageFile);
        }

        try {
            await createItemReport(submitData);
            setSubmitted(true);
            toast.success('Report secured. Awaiting admin clearance.');
        } catch (err) {
            toast.error('Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card max-w-lg mx-auto text-center p-12 mt-12 border-2 border-dashed border-emerald-500/30">
                <CheckCircle size={64} className="text-emerald-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Report Logged Successfully</h2>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                    Your submission has entered the pending queue. An AUIS administrator will review the details before making it public.
                </p>
                <button className="btn-primary w-full max-w-xs mx-auto" onClick={() => navigate('/')}>Return Home</button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-auis-blue mb-3">Report a Found Item</h1>
                <p className="text-gray-500">Log an item you discovered on campus. All entries are moderated prior to public posting.</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 sm:p-10 relative overflow-hidden text-left">
                {/* Decorative BG element */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-auis-gold/10 rounded-full blur-3xl"></div>

                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2"><User size={16} className="text-auis-gold" /> Finder's Name</label>
                            <input className="input-glass" name="reporter_name" required value={formData.reporter_name} onChange={handle} placeholder="Full name" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2"><Mail size={16} className="text-auis-gold" /> AUIS Email</label>
                            <input className="input-glass" name="reporter_email" type="email" required value={formData.reporter_email} onChange={handle} placeholder="you@auis.edu.krd" />
                            {formData.reporter_email && !formData.reporter_email.endsWith('@auis.edu.krd') && (
                                <p className="text-red-500 text-xs mt-2 font-medium">Must use a valid @auis.edu.krd address</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2"><Tag size={16} className="text-auis-gold" /> Item Identification</label>
                        <input className="input-glass font-medium text-lg text-auis-blue placeholder:text-gray-300 placeholder:font-normal" name="item_name" required value={formData.item_name} onChange={handle} placeholder="e.g. Red Nike Backpack, AirPods Pro" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2">Primary Category</label>
                            <select className="input-glass bg-white" name="category" value={formData.category} onChange={handle}>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2"><MapPin size={16} className="text-auis-gold" /> Discovery Location</label>
                            <input className="input-glass" name="location_found" required value={formData.location_found} onChange={handle} placeholder="e.g. A-Building Room 112" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Current Custody Status</label>
                        <select className="input-glass bg-white" name="custody_status" value={formData.custody_status} onChange={handle}>
                            <option value="finder">I have the item with me</option>
                            <option value="office">I turned it into the University Office</option>
                        </select>
                        <p className="text-xs text-gray-400 mt-2 font-medium">Select where the item is currently located for recovery.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2"><FileText size={16} className="text-auis-gold" /> Physical Description</label>
                        <textarea className="input-glass" name="description" rows="3" value={formData.description} onChange={handle} placeholder="Notable marks, color, brand..." />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2"><Camera size={16} className="text-gray-400" /> Web Photo Link (Optional)</label>
                        <input className="input-glass" name="photo_url" type="url" value={formData.photo_url} onChange={handle} placeholder="https://imgur.com/..." />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">Upload Image (Optional)</label>
                        <input className="input-glass file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-auis-blue file:text-white hover:file:bg-blue-700 cursor-pointer transition-colors" type="file" accept="image/*" onChange={handleFileChange} />
                        <p className="text-xs text-gray-400 mt-2 font-medium">Or upload a photo directly from your device.</p>
                    </div>

                    <div className="pt-6">
                        <button type="submit" className="btn-primary w-full" disabled={loading || (formData.reporter_email && !formData.reporter_email.endsWith('@auis.edu.krd'))}>
                            {loading ? 'Processing...' : <><Send size={18} /> Submit to Moderation Queue</>}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <button type="button" className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors" onClick={() => navigate('/')}>
                            Cancel and return to Dashboard
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ReportFound;
