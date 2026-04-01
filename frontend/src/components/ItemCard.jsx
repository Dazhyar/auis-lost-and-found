import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } } };

const ItemCard = ({ item, isLostReport = false, onImageClick }) => {
    const navigate = useNavigate();

    const dateObj = new Date(isLostReport ? item.date_lost : item.date_found);

    const getRelativeTime = (date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formattedDate = getRelativeTime(dateObj);

    const locationText = isLostReport ? (item.location_lost || 'Unknown Area') : item.location_found;

    const renderStatus = () => {
        if (item.status === 'found') {
            return (
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer px-5 py-2 rounded-full border-2 border-auis-blue text-auis-blue font-semibold text-xs hover:bg-auis-blue hover:text-white transition-colors duration-[900ms]"
                    onClick={(e) => { e.stopPropagation(); navigate(`/claim?item_id=${item.id}`); }}
                >
                    Claim Item
                </motion.button>
            );
        }

        if (item.status === 'claimed') {
            return (
                <div className="px-5 py-2 rounded-full border border-gray-200 text-gray-400 font-semibold text-xs bg-gray-50">
                    Claimed
                </div>
            );
        }

        if (item.status === 'expired') {
            return (
                <div className="px-5 py-2 rounded-full border border-red-200 text-red-500 font-semibold text-xs bg-red-50">
                    Expired
                </div>
            );
        }

        return (
            <div className="px-5 py-2 rounded-full border border-gray-200 text-gray-400 font-semibold text-xs bg-gray-50">
                {item.status}
            </div>
        );
    };

    return (
        <motion.div
            variants={itemVariants}
            layoutId={`item-${item.id}`}
            className="flex flex-col h-full bg-white rounded-[20px] border border-gray-100 overflow-hidden cursor-pointer hover:shadow transition-shadow duration-[900ms] group"
            onClick={() => {
                const imageSrc = item.photo_url || item.image;
                if (imageSrc) onImageClick(imageSrc);
            }}
        >
            <div className="p-3 pb-0">
                <div className={`h-56 relative rounded-2xl overflow-hidden ${isLostReport ? 'bg-amber-50/50' : 'bg-gray-50'}`}>
                    {item.photo_url || item.image ? (
                        <img
                            src={item.photo_url || item.image}
                            alt={isLostReport ? item.item_name : item.name}
                            className="w-full h-full object-cover transition-opacity duration-[1300ms]"
                        />
                    ) : (
                        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${isLostReport ? 'from-amber-50 to-amber-100 text-amber-300' : 'from-gray-50 to-gray-100 text-gray-300'}`}>
                            <Package size={48} className="mb-2 opacity-50" strokeWidth={1} />
                            <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">
                                {isLostReport ? 'Lost Item' : 'No Photo'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col pt-4">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400 font-medium tracking-wide">
                        {item.category} {isLostReport && item.is_resolved ? '• Recovered' : null}
                    </span>
                    {!isLostReport && (
                        <span className={`text-[11px] font-semibold uppercase tracking-wider ${item.custody_status === 'office' ? 'text-auis-blue' : 'text-gray-400'}`}>
                            {item.custody_status === 'office' ? 'At Office' : 'With Finder'}
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2 group-hover:text-auis-blue transition-colors">
                    {isLostReport ? item.item_name : item.name}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-3 mb-6 leading-relaxed flex-1">
                    {isLostReport ? 'Lost near ' : 'Found at '}
                    <span className="font-medium text-gray-700">{locationText}</span>.
                    {item.description ? ` ${item.description}` : ''}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="text-sm font-bold text-gray-900 tracking-tight" title={new Date(isLostReport ? item.date_lost : item.date_found).toLocaleString()}>
                        {formattedDate}
                    </div>

                    {isLostReport ? (
                        <span className="px-5 py-2 rounded-full border border-gray-200 text-gray-600 font-medium text-xs">
                            {item.student_name.split(' ')[0]}'s Item
                        </span>
                    ) : (
                        renderStatus()
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ItemCard;