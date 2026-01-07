import { useState } from 'react';
import { motion } from 'framer-motion';

const TeaserSection = () => {
    const [selectedYear, setSelectedYear] = useState('2026');

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

    return (
        <div className="relative w-full py-20 bg-[#12001A] overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="mb-12"
                >
                    <motion.h3 variants={itemVariants} className="text-[#CDB7D9] text-opacity-60 text-4xl md:text-6xl font-bold mb-2">Teaser of</motion.h3>
                    <motion.h2 variants={itemVariants} className="text-[#CDB7D9] text-opacity-60 text-5xl md:text-7xl font-bold mb-4">ADVITYA 2026</motion.h2>
                    <motion.p variants={itemVariants} className="text-[#CDB7D9] text-opacity-60 text-xl md:text-2xl">Experience like never before</motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mb-12"
                >
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl">
                        <iframe
                            width="100%"
                            height="100%"
                            src={videos[selectedYear]}
                            title="ADVITYA Teaser"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full"
                        ></iframe>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
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
