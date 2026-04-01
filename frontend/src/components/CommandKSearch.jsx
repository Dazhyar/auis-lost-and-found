import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, Package, MapPin, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFoundItems } from '../api';

const CommandKSearch = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Fetch items once when opened
    useEffect(() => {
        if (isOpen && items.length === 0) {
            setLoading(true);
            getFoundItems().then(res => {
                setItems(res.data.filter(i => i.status === 'found'));
            }).catch(() => { }).finally(() => setLoading(false));
        }
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    // Handle search
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const q = query.toLowerCase();
        const filtered = items.filter(item =>
            item.name.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.location_found.toLowerCase().includes(q)
        ).slice(0, 5); // Max 5 results
        setResults(filtered);
    }, [query, items]);

    // Setup Cmd+K listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                isOpen ? onClose() : onClose(true); // Toggle logic handled by parent
            }
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSelect = (item) => {
        onClose();
        navigate(`/?search=${encodeURIComponent(item.name)}`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onClose()}
                        className="fixed inset-0 bg-[#001a45]/40 backdrop-blur-md z-[100]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_32px_64px_rgba(0,45,114,0.15)] overflow-hidden border border-white/60 pointer-events-auto"
                        >
                            {/* Search Input */}
                            <div className="flex items-center px-4 border-b border-gray-100">
                                <Search className="w-5 h-5 text-auis-blue opacity-50" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="w-full bg-transparent border-none px-4 py-5 text-lg text-auis-gray-dark placeholder:text-gray-400 focus:outline-none focus:ring-0"
                                    placeholder="Search items, locations, categories..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <div className="flex items-center gap-1 opacity-40 bg-gray-100 rounded-md px-2 py-1 text-xs font-semibold">
                                    <Command size={12} /><span>K</span>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="max-h-[60vh] overflow-y-auto p-2">
                                {!query.trim() && !loading && (
                                    <div className="px-4 py-8 text-center text-sm text-gray-400">
                                        Type to instantly scan the AUIS databse.
                                    </div>
                                )}

                                {loading && (
                                    <div className="px-4 py-8 flex justify-center">
                                        <div className="w-6 h-6 border-2 border-auis-gold border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}

                                {query.trim() && results.length === 0 && !loading && (
                                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                                        No items found matching "<span className="text-auis-blue font-semibold">{query}</span>"
                                    </div>
                                )}

                                {results.map((item, i) => (
                                    <motion.button
                                        key={item.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => handleSelect(item)}
                                        className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-auis-gray-light transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-auis-blue flex-shrink-0 group-hover:bg-auis-blue group-hover:text-white transition-colors">
                                            <Package size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-auis-gray-dark group-hover:text-auis-blue truncate">{item.name}</div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{item.category}</span>
                                                <span className="flex items-center gap-1 truncate"><MapPin size={10} /> {item.location_found}</span>
                                            </div>
                                        </div>
                                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-40 text-auis-blue transition-opacity" />
                                    </motion.button>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
                                <div><span className="font-semibold">esc</span> to close</div>
                                <div className="flex gap-4">
                                    <span><span className="font-semibold">↑↓</span> to navigate</span>
                                    <span><span className="font-semibold">enter</span> to select</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommandKSearch;
