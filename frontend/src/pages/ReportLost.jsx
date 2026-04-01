import React, { useState, useEffect } from 'react';
import { createLostReport } from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Package, MapPin, FileText, Check, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import FormStepper from '../components/forms/FormStepper';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'IDs & Documents', 'Clothing', 'Keys', 'Bags', 'Accessories', 'Other'];

const ReportLost = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        student_name: user?.full_name || '',
        student_email: user?.email || '',
        item_name: '',
        category: 'Electronics',
        location_lost: '',
        description: '',
        photo_url: '',
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

    // Removed AI matches effect

    const handleSubmit = async () => {
        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });
        if (imageFile) {
            submitData.append('image', imageFile);
        }

        setLoading(true);
        try {
            await createLostReport(submitData);
            setSubmitted(true);
            toast.success('Report submitted successfully!');
            setTimeout(() => navigate('/'), 2500);
        } catch (err) {
            toast.error('Failed to submit report.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card max-w-lg mx-auto mt-20 text-center p-12">
                <CheckCircle size={64} className="text-emerald-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-auis-blue mb-3">Monitoring Active</h2>
                <p className="text-gray-600 mb-6">We'll alert <strong>{formData.student_email}</strong> instantly if a match is turned in to the office.</p>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Redirecting to Dashboard...</p>
            </motion.div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-0 bg-auis-blue/5 rounded-3xl blur-3xl -translate-y-12 -z-10"></div>

            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-auis-blue mb-3">Report a Lost Item</h1>
                <p className="text-gray-500">Provide details so our system can monitor the inventory for matches.</p>
            </div>

            <div className="glass-card overflow-visible p-8 sm:p-10">
                {/* Step Indicator */}
                <FormStepper
                    step={step}
                    steps={[
                        { num: 1, label: 'Your Info' },
                        { num: 2, label: 'Item Details' }
                    ]}
                />

                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Step 1 */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2"><User size={16} className="text-auis-gold" /> Full Name</label>
                                <input className="input-glass" name="student_name" value={formData.student_name} onChange={handle} placeholder="Ahmed Al-Rashid" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2"><Mail size={16} className="text-auis-gold" /> AUIS Email</label>
                                <input className="input-glass" name="student_email" type="email" value={formData.student_email} onChange={handle} placeholder="student@auis.edu.krd" />
                                {formData.student_email && !formData.student_email.endsWith('@auis.edu.krd') && (
                                    <p className="text-red-500 text-xs mt-2 font-medium">Must use a valid @auis.edu.krd address</p>
                                )}
                            </div>
                            <button className="btn-primary w-full mt-8" onClick={() => setStep(2)} disabled={!formData.student_name || !formData.student_email.endsWith('@auis.edu.krd')}>
                                Continue to Details <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">What did you lose?</h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2"><Package size={16} className="text-auis-gold" /> Item Name</label>
                                <input className="input-glass" name="item_name" value={formData.item_name} onChange={handle} placeholder="Blue Dell Laptop" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Category</label>
                                    <select className="input-glass bg-white" name="category" value={formData.category} onChange={handle}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2"><MapPin size={16} className="text-auis-gold" /> Location Lost</label>
                                    <input className="input-glass" name="location_lost" value={formData.location_lost} onChange={handle} placeholder="Library 2nd Floor" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2"><FileText size={16} className="text-auis-gold" /> Distinctive Features</label>
                                <textarea className="input-glass" name="description" rows="3" value={formData.description} onChange={handle} placeholder="Stickers, scratches, specific model..." />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Web Photo Link (Optional)</label>
                                    <input className="input-glass" name="photo_url" type="url" value={formData.photo_url} onChange={handle} placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Upload Image (Optional)</label>
                                    <input className="input-glass file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-auis-blue file:text-white hover:file:bg-blue-700 cursor-pointer" type="file" accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button className="btn-secondary flex-1" onClick={() => setStep(1)}><ChevronLeft size={18} /> Back</button>
                                <button className="btn-primary flex-[2]" onClick={handleSubmit} disabled={!formData.item_name || loading}>
                                    {loading ? 'Processing...' : <><Check size={18} /> Submit Report</>}
                                </button>
                            </div>
                            <div className="text-center mt-4">
                                <button className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors" onClick={() => navigate('/')}>
                                    Cancel and return to Dashboard
                                </button>
                            </div>
                        </div>
                    )}

                </motion.div>
            </div>
        </div>
    );
};

export default ReportLost;
