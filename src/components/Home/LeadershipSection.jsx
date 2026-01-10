/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const LeadershipSection = () => {
    const [isInLeadershipSection, setIsInLeadershipSection] = useState(false);

    const leaders = [
        { name: "Dr. G. Vishwanathan", position: "Chancellor" },
        { name: "Leader Name 2", position: "Position 2" },
        { name: "Leader Name 3", position: "Position 3" },
        { name: "Leader Name 4", position: "Position 4" },
        { name: "Leader Name 5", position: "Position 5" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const leadershipSection = document.getElementById('leadership');
            if (!leadershipSection) return;

            const isViewingLeadership =
                window.scrollY >
                leadershipSection.offsetTop - (window.innerHeight * 3) / 4;

            setIsInLeadershipSection(isViewingLeadership);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const sectionVariants = {
        hidden: {
            opacity: 0,
            pointerEvents: "none",
        },
        visible: {
            opacity: 1,
            pointerEvents: "auto",
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    return (
        <div
            id="leadership"
            className="relative w-full py-32 bg-[#12001A] overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-4xl md:text-5xl font-bold text-white mb-16 text-center"
                >
                    Our Leadership
                </motion.h2>

                {/* Swiper (Mounted Once) */}
                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate={isInLeadershipSection ? "visible" : "hidden"}
                >
                    <Swiper
                        spaceBetween={25}
                        slidesPerView={1.5}
                        centeredSlides
                        grabCursor
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                                centeredSlides: false,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                                centeredSlides: false,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 40,
                                centeredSlides: false,
                            },
                        }}
                        className="leadership-swiper"
                    >
                        {leaders.map((leader, index) => (
                            <SwiperSlide key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={
                                        isInLeadershipSection
                                            ? { opacity: 1, y: 0 }
                                            : { opacity: 0, y: 30 }
                                    }
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    whileHover={{
                                        y: -10,
                                        transition: { duration: 0.3 },
                                    }}
                                    style={{ backgroundColor: 'rgba(183, 201, 217, 0.1)' }}
                                    className="rounded-2xl py-6 px-2"
                                >
                                    <div className="w-full rounded-2xl overflow-hidden mb-3">
                                        <img
                                            src="/Chancellor.svg"
                                            alt={leader.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="text-left px-2">
                                        <h3 className="text-[#CDB7D9]/60 text-xl font-semibold mb-1">
                                            {leader.name}
                                        </h3>
                                        <p className="text-[#CDB7D9]/40 text-lg">
                                            {leader.position}
                                        </p>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>

            {/* Swiper overflow fix */}
            <style>{`
                .leadership-swiper,
                .leadership-swiper .swiper-wrapper {
                    overflow: visible !important;
                }
            `}</style>
        </div>
    );
};

export default LeadershipSection;
