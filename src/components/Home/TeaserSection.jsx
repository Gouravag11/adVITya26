/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence  } from 'framer-motion';

const TeaserSection = () => {
    const [selectedYear, setSelectedYear] = useState('2026');
    const [isInTeaserSection, setIsInTeaserSection] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(true);


    const videos = {
        '2024': 'https://www.youtube.com/embed/mFk9eCZ9bpo',
        '2025': 'https://www.youtube.com/embed/mFk9eCZ9bpo',
        '2026': 'https://www.youtube.com/embed/mFk9eCZ9bpo',
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    useEffect(() => {
        const handleScroll = () => {
        // Tracks user entering Leadership section
        const teaserSection = document.getElementById('teaser');
        if(teaserSection){
            const isViewingTeaser = window.scrollY > teaserSection.offsetTop - window.innerHeight * 3/4
            setIsInTeaserSection(isViewingTeaser);
        }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Reset loader when year changes
    useEffect(() => {
        setIsVideoLoading(true);
    }, [selectedYear]);

    return (
        <div className="relative w-full py-20 bg-[#12001A] overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInTeaserSection ? "visible" : "hidden"}
                    className="mb-12"
                >
                    <motion.h3 variants={itemVariants} className="text-[#CDB7D9] text-opacity-60 text-4xl md:text-6xl font-bold mb-2">Teaser of</motion.h3>
                    <motion.h2 variants={itemVariants} className="text-[#CDB7D9] text-opacity-60 text-5xl md:text-7xl font-bold mb-4">ADVITYA {selectedYear}</motion.h2>
                    <motion.p variants={itemVariants} className="text-[#CDB7D9] text-opacity-60 text-xl md:text-2xl">Experience like never before</motion.p>
                </motion.div>

                {/* Video */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInTeaserSection ? { opacity: 1, scale: 1 } : { opacity: 0.8, scale: 0.8 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mb-12"
                >
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl">
                        {/* Loader Overlay */}
                        <AnimatePresence>
                            {isVideoLoading && (
                                <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md gap-4"
                                >
                                {/* Outer Ring */}
                                <div className="relative flex items-center justify-center">
                                    <motion.div
                                    className="h-16 w-16 rounded-full border-t-2 border-r-2 border-[#CDB7D9]"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    {/* Inner Counter-Rotating Ring */}
                                    <motion.div
                                    className="absolute h-10 w-10 rounded-full border-b-2 border-l-2 border-white/50"
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    />
                                </div>

                                {/* Text with subtle shimmer */}
                                <motion.p
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-[#CDB7D9] uppercase tracking-[0.2em] font-medium"
                                >
                                    Loading Teaser
                                </motion.p>
                                </motion.div>
                            )}
                            </AnimatePresence>

                        <iframe
                            key={selectedYear}
                            src={videos[selectedYear]}
                            title="ADVITYA Teaser"
                            frameBorder="0"
                            allowFullScreen
                            onLoad={() => setIsVideoLoading(false)}
                            className="absolute top-0 left-0 w-full h-full"
                        />
                    </div>
                </motion.div>

                {/* Year Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={isInTeaserSection ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.8, y: 30, scale: 0.8 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex justify-center"
                >
                    <div style={{ backgroundColor: 'rgba(183, 201, 217, 0.1)' }} className="rounded-full p-2 flex gap-2 w-full max-w-2xl">
                        {['2024', '2025', '2026'].map((year) => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`flex-1 py-3 rounded-full text-lg font-semibold transition-all duration-300 text-[#CDB7D9]`}
                                style={selectedYear === year ? { backgroundColor: 'rgba(205, 183, 217, 0.3)' } : {}}
                                onMouseEnter={(e) => {
                                    if (selectedYear !== year) {
                                        e.currentTarget.style.backgroundColor = 'rgba(205, 183, 217, 0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedYear !== year) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div >
    );
};

export default TeaserSection;
