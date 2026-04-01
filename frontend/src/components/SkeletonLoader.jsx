import React from 'react';

export const Shimmer = ({ className = '' }) => (
    <div className={`shimmer-bg rounded-lg ${className}`}></div>
);

const SkeletonLoader = () => {
    return (
        <div className="fixed inset-0 bg-auis-gray-light z-50 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-6">
                {/* AUIS Logo or stylized circle shimmer */}
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white/50 border border-white/20 shadow-xl backdrop-blur-xl flex items-center justify-center">
                    <div className="absolute inset-0 shimmer-bg opacity-30"></div>
                    <div className="w-16 h-16 rounded-full bg-auis-blue animate-pulse-slow"></div>
                </div>
                <div className="w-48 h-2 shimmer-bg rounded-full opacity-60"></div>
                <div className="w-32 h-2 shimmer-bg rounded-full opacity-40"></div>
            </div>
        </div>
    );
};

export default SkeletonLoader;
