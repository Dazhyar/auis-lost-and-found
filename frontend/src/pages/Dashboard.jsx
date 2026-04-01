import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Package, ChevronDown, X } from 'lucide-react';
import ImageLightbox from '../components/ImageLightbox';
import DashboardHero from '../components/DashboardHero';
import ItemCard from '../components/ItemCard';
import { useItems } from '../context/ItemContext';

const CATEGORIES = ['Electronics', 'IDs & Documents', 'Clothing', 'Keys', 'Bags', 'Accessories', 'Other'];

// Animation Variants
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.7 } } };

// Reusable Dropdown Component
const FilterDropdown = ({ label, options, selectedOptions, onToggle, isOpen, onOpenChange, isRadio = false }) => {
    return (
        <div className="relative">
            <button
                onClick={() => onOpenChange(!isOpen)}
                className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition-colors duration-[800ms] ${selectedOptions.length > 0 && !isRadio ? 'bg-auis-blue text-white border-auis-blue' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
            >
                {label}
                <ChevronDown size={16} className={`transition-transform duration-[800ms] ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => onOpenChange(false)} />
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-sm z-50 py-2 max-h-64 overflow-y-auto">
                        {options.map(opt => {
                            const isSelected = selectedOptions.includes(opt.value);
                            return (
                                <label key={opt.value} className="cursor-pointer flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors duration-[800ms]">
                                    <input
                                        type={isRadio ? "radio" : "checkbox"}
                                        checked={isSelected}
                                        onChange={() => {
                                            onToggle(opt.value);
                                            if (isRadio) onOpenChange(false);
                                        }}
                                        className="cursor-pointer rounded border-gray-300 text-auis-blue focus:ring-auis-blue w-4 h-4"
                                    />
                                    <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                                </label>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();

    const { items, lostItems } = useItems();

    const initialCategories = params.getAll('category');
    const [searchQuery, setSearchQuery] = useState(params.get('search') || '');
    const [selectedDate, setSelectedDate] = useState('');
    const [filterCategories, setFilterCategories] = useState(initialCategories.length > 0 && initialCategories[0] !== 'All' ? initialCategories : []);
    const [viewType, setViewType] = useState(params.get('view') || 'lost');

    // Dropdown open states
    const [openDropdown, setOpenDropdown] = useState(null); // 'category', 'status'


    // Lightbox State
    const [lightboxImage, setLightboxImage] = useState(null);

    // Sync URL Params
    useEffect(() => {
        const newParams = new URLSearchParams();
        if (searchQuery) newParams.set('search', searchQuery);
        if (filterCategories.length > 0) {
            filterCategories.forEach(cat => newParams.append('category', cat));
        }
        if (viewType !== 'found') newParams.set('view', viewType);
        setParams(newParams, { replace: true });
    }, [searchQuery, filterCategories, viewType, setParams]);

    const activeCollection = viewType === 'found' ? items : lostItems;

    const filteredItems = activeCollection.filter(item => {
        const itemName = viewType === 'found' ? item.name : item.item_name;
        const matchSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
            const itemDate = new Date(viewType === 'found' ? item.date_found : item.date_lost);
        const matchDate = !selectedDate || (
        itemDate.toISOString().split('T')[0] === selectedDate
        );

        const matchCategory = filterCategories.length === 0 || filterCategories.includes(item.category);
        return matchSearch && matchCategory && matchDate;
    });

    const toggleCategory = (cat) => {
        setFilterCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const clearFilters = () => {
        setFilterCategories([]);
        setSearchQuery('');
        setViewType('lost');
        setSelectedDate('');
    };

    const hasFilters = filterCategories.length > 0 || searchQuery !== '' || selectedDate !== '';

    const getCategoryLabel = () => {
        if (filterCategories.length === 0) return 'Category';
        if (filterCategories.length === 1) return filterCategories[0];
        return `${filterCategories.length} categories`;
    };

    const statusOptions = [
        { label: 'Found Items', value: 'found' },
        { label: 'Lost & Looking', value: 'lost' }
    ];

    const categoryOptions = CATEGORIES.map(c => ({ label: c, value: c }));

    return (
        <div className="pb-16 bg-auis-gray-light min-h-screen">
            <DashboardHero />

            {/* Standard Human-Made UI Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-30">
                <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm mb-6 lg:mb-8 transition-all duration-[900ms]">

                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                        {/* Search Input */}
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-auis-blue transition-colors duration-[800ms]" size={18} />
                            <input
                                className="w-full cursor-text bg-white border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-auis-blue focus:border-auis-blue transition-all duration-[800ms]"
                                placeholder="Search inventory by keyword..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Filter Controls Row */}
                        <div className="flex flex-wrap items-center gap-3">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="px-3 py-2 border rounded-lg text-sm"
                            />

                            <FilterDropdown
                                label={getCategoryLabel()}
                                options={categoryOptions}
                                selectedOptions={filterCategories}
                                onToggle={toggleCategory}
                                isOpen={openDropdown === 'category'}
                                onOpenChange={(open) => setOpenDropdown(open ? 'category' : null)}
                            />

                            <FilterDropdown
                                label={viewType === 'found' ? 'Found Items' : 'Lost Items'}
                                options={statusOptions}
                                selectedOptions={[viewType]}
                                onToggle={setViewType}
                                isOpen={openDropdown === 'status'}
                                onOpenChange={(open) => setOpenDropdown(open ? 'status' : null)}
                                isRadio={true}
                            />



                            {/* Clear Filters */}
                            <button
                                onClick={clearFilters}
                                className={`cursor-pointer text-sm font-medium transition-colors duration-[800ms] px-2 py-2 ${hasFilters ? 'text-gray-500 hover:text-gray-900' : 'text-gray-300 cursor-not-allowed'}`}
                                disabled={!hasFilters}
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="flex items-center justify-between mb-4 lg:mb-6 mt-2 lg:mt-4 px-1">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                        {viewType === 'found' ? 'Browse Found Inventory' : 'Active Lost Reports'}
                    </h2>
                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{filteredItems.length} items</span>
                </div>

                <AnimatePresence mode="popLayout">
                    {filteredItems.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="py-20 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-200 border-dashed"
                        >
                            <Package size={48} className="text-gray-300 mb-4" strokeWidth={1.5} />
                            <h3 className="text-xl font-bold text-auis-blue mb-2">No matching items found</h3>
                            <p className="text-gray-500 max-w-sm mb-6">
                                We couldn't find anything matching your criteria. Let our system keep an eye out for you.
                            </p>
                            <div className="flex gap-4 items-center">
                                {hasFilters && (
                                    <button onClick={clearFilters} className="btn-secondary">
                                        Clear Filters
                                    </button>
                                )}
                                {viewType === 'found' ? (
                                    <button onClick={() => navigate('/report-lost')} className="btn-primary">
                                        Report a Lost Item
                                    </button>
                                ) : (
                                    <button onClick={() => navigate('/report-found')} className="btn-primary">
                                        Report a Found Item
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            variants={containerVariants} initial="hidden" animate="show" exit="hidden"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredItems.map(item => (
                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    isLostReport={viewType === 'lost'}
                                    onImageClick={setLightboxImage}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <ImageLightbox
                isOpen={!!lightboxImage}
                imageSrc={lightboxImage}
                onClose={() => setLightboxImage(null)}
            />
        </div>
    );
};

export default Dashboard;

