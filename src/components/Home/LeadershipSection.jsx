/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const LeadershipSection = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isInLeadershipSection, setIsInLeadershipSection] = useState(false);

    const leaders = [
        { name: "Dr. G. Vishwanathan", position: "Chancellor", img: "/Chancellor.jpg" },
        { name: "Mr. Sankar Viswanathan", position: "Vice President", img: "/VP.jpg" },
        { name: "Mrs. Kadhambari S Viswanathan", position: "Assistant Vice President", img: "/AVP.jpg" },
        { name: "Prof. T. B. Sridharan", position: "Pro-Vice Chancellor", img: "/Pro_VC.jpg" },
        { name: "Mr. K.K. Nair", position: "Acting Registrar", img: "/Registrar.jpg" },
    ];

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const section = document.getElementById('leadership');
            if (!section) return;

            const isViewing =
                window.scrollY >
                section.offsetTop - (window.innerHeight * 3) / 4;

            setIsInLeadershipSection(isViewing);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            id="leadership"
            className="relative w-full py-32 bg-[#12001A] overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={isInLeadershipSection ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0.8, scale: 0.9, y: 40 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-20 text-center"
                >
                    Our Leadership
                </motion.h2>

                {/* TOP ROW – 3 CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10 px-8 md:px-20">
                    {leaders.slice(0, 3).map((leader, index) => (
                        <LeaderCard
                            key={index}
                            leader={leader}
                            index={index}
                            isMobile={isMobile}
                            isVisible={isInLeadershipSection}
                        />
                    ))}
                </div>

                {/* BOTTOM ROW – 2 CENTERED CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:max-w-3xl mx-auto gap-8 mb-10 px-8 md:px-20">
                    {leaders.slice(3).map((leader, index) => (
                        <LeaderCard
                            key={index + 3}
                            leader={leader}
                            index={index + 3}
                            isMobile={isMobile}
                            isVisible={isInLeadershipSection}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const LeaderCard = ({ leader, index, isMobile, isVisible }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : 30,
            }}
            transition={{
                duration: 0.6,
                delay: index * 0.15,
            }}
            whileHover={{
                y: -10,
                transition: { duration: 0.3 },
            }}
            style={{ backgroundColor: 'rgba(183, 201, 217, 0.1)' }}
            className="rounded-2xl py-6 px-2"
        >
            <div className="w-full rounded-2xl overflow-hidden mb-3">
                <img
                    src={leader.img}
                    alt={leader.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="text-left px-2">
                <h3 className="text-[#CDB7D9]/60 text-md md:text-xl font-bold mb-1 min-h-[2.5em] md:min-h-[3.2em]">
                    {leader.name}
                </h3>
                <p className="text-[#CDB7D9]/40 text-sm md:text-lg">
                    {leader.position}
                </p>
            </div>
        </motion.div>
    );
};

export default LeadershipSection;
