import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useItems } from '../context/ItemContext';

function TypewriterText({ text }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const displayText = useTransform(rounded, (latest) => text.slice(0, latest));

    useEffect(() => {
        const controls = animate(count, text.length, {
            type: "tween",
            duration: 1.5,
            ease: "easeInOut",
        });
        return controls.stop;
    }, [text, count]);

    return (
        <span>
            <motion.span>{displayText}</motion.span>
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-[3px] h-[1em] bg-white ml-1 align-middle"
            />
        </span>
    );
}

function AnimatedNumber({ value }) {
    const [displayValue, setDisplayValue] = useState("00");

    useEffect(() => {
        const controls = animate(0, value, {
            duration: 2,
            ease: "easeOut",
            onUpdate(cur) {
                setDisplayValue(Math.round(cur).toString().padStart(2, '0'));
            }
        });
        return controls.stop;
    }, [value]);

    return <span>{displayValue}</span>;
}

const DashboardHero = () => {
    const { items, stats, lostItems } = useItems();

    // total found items
    const foundCount = stats?.total_found || 0;
    // total lost reports
    const lostCount = stats?.total_lost_reports || lostItems?.length || 0;

    return (
        <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-[88px] lg:-mt-[120px] mb-12 flex items-center justify-center overflow-hidden min-h-[75vh] md:min-h-[85vh]">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('https://archive.auis.edu.krd/sites/default/files/AUIS%20-%20A%20Brief%20History.jpg')" }}
            >
                {/* Dark/Blue overlay */}
                <div className="absolute inset-0 bg-[#1e293b]/50 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-blue-900/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent opacity-10"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16 flex flex-col items-center justify-center">

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-white drop-shadow-lg min-h-[1.2em]">
                    <TypewriterText text="AUIS Lost and Found" />
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                    className="text-gray-100 text-lg sm:text-xl md:text-2xl mb-12 max-w-3xl font-medium leading-relaxed drop-shadow-md"
                >
                    Browse items turned into the AUIS office. Search items easily or report something you lost to get notified instantly.
                </motion.p>

                {/* Statistics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.8 }}
                    className="flex flex-row justify-center items-center gap-12 sm:gap-24"
                >
                    <div className="text-center">
                        <div className="text-xl sm:text-2xl text-gray-200 mb-2 font-semibold tracking-wide drop-shadow-sm">Lost Items</div>
                        <div className="text-6xl sm:text-7xl font-bold text-white drop-shadow-lg">
                            <AnimatedNumber value={lostCount} />
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-xl sm:text-2xl text-gray-200 mb-2 font-semibold tracking-wide drop-shadow-sm">Found Items</div>
                        <div className="text-6xl sm:text-7xl font-bold text-white drop-shadow-lg">
                            <AnimatedNumber value={foundCount} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DashboardHero;
