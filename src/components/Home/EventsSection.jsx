import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const eventsData = [
    {
        id: 1,
        title: 'Technical Events',
        description: 'The technical events at Advitya are where innovation meets execution. Designed to challenge problem-solvers, builders, and thinkers, these events bring together coding battles, hackathons, robotics, design sprints, data challenges, and tech quizzes under high-pressure, real-world scenarios.',
        image: null
    },
    {
        id: 2,
        title: 'Non-Technical Events',
        description: 'The technical events at Advitya are where innovation meets execution. Designed to challenge problem-solvers, builders, and thinkers, these events bring together coding battles, hackathons, robotics, design sprints, data challenges, and tech quizzes under high-pressure, real-world scenarios.',
        image: null
    },
    {
        id: 3,
        title: 'Cultural Events',
        description: 'Celebrate the vibrant arts and culture at Advitya. From dance competitions to music showcases, drama performances to fashion shows, these events bring creativity and expression to the forefront of our festival.',
        image: null
    },
    {
        id: 4,
        title: 'Gaming Events',
        description: 'Enter the arena of competitive gaming at Advitya. Battle it out in popular esports titles, prove your skills in LAN tournaments, and compete for glory in our high-stakes gaming championships.',
        image: null
    },
    {
        id: 5,
        title: 'Sports Events',
        description: 'Get your adrenaline pumping with our sports events. From traditional sports to fun games, compete with the best athletes and showcase your physical prowess in our action-packed sports carnival.',
        image: null
    },
    {
        id: 6,
        title: 'Literary Events',
        description: 'Words have power, and our literary events prove it. Participate in debates, quizzes, creative writing, and poetry slams that challenge your intellect and communication skills.',
        image: null
    }
];

const EventCard = ({ event, index }) => (
    <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
        className="flex flex-col md:flex-row gap-4 md:gap-2 items-start mb-8"
    >
        {/* Image placeholder with border */}
        <div className="w-full md:w-48 h-40 md:h-48 border-[3px] border-[#12001A] rounded-xl flex-shrink-0 bg-[#CDB7D9]" />

        {/* Dotted line connector - hidden on mobile */}
        <div className="hidden md:flex flex-col items-center mx-4">
            <div className="w-0.5 h-48 border-l-[3px] border-dotted border-[#12001A]" />
        </div>

        {/* Content with title tab and description box */}
        <div className="flex flex-col gap-0 flex-1 w-full md:max-w-2xl">
            {/* Title tab */}
            <div className="inline-flex top-2 relative self-start">
                <span className="bg-[#12001A] text-white text-sm md:text-base font-medium px-4 md:px-6 pt-2 pb-3 rounded-t-xl">
                    {event.title}
                </span>
            </div>

            {/* Description box */}
            <div className="border-[3px] border-[#12001A] z-10 rounded-xl p-4 md:p-6 bg-[#CDB7D9]">
                <p className="text-[#12001A] text-sm md:text-[15px] leading-relaxed">
                    {event.description}
                </p>
            </div>
        </div>
    </motion.div>
);

export default function EventsSection() {
    const sectionRef = useRef(null);

    // Track scroll progress within this section
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Transform the scroll progress to Y position for the LIMITLESS text
    const limitlessY = useTransform(scrollYProgress, [0, 1], [200, -600]);

    return (
        <section
            ref={sectionRef}
            className="w-full relative bg-[#12001A] overflow-hidden flex flex-col lg:flex-row"
        >
            {/* Left section - Main content with pink/lavender background */}
            <div className="flex-1 w-full relative bg-[#CDB7D9] rounded-b-4xl lg:rounded-b-none lg:rounded-r-4xl lg:min-h-screen">
                <img src="/HomePage/EventsBGTop.svg" alt="BG" className='w-full h-full absolute top-0 object-cover' />
                {/* Content */}
                <div className="relative z-10 w-full h-full px-4 sm:px-8 md:px-12 py-10 md:py-16">
                    {/* Header */}
                    <motion.div
                        className="flex items-center gap-3 mb-8 md:mb-12"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#1a0a2e] font-fugaz">
                            Our Events
                        </h2>
                        <img src="/HomePage/Star.png" alt="Star" className='w-6 md:w-8 relative -top-2 h-6 md:h-8' />
                    </motion.div>

                    {/* Events list */}
                    <div className="flex flex-col items-start">
                        {eventsData.map((event, index) => (
                            <EventCard key={event.id} event={event} index={index} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right section - Dark vertical text with scroll animation - hidden on mobile */}
            <div className="hidden lg:flex w-64 bg-[#12001A] relative items-center justify-center sticky top-0 h-screen">
                <motion.div
                    className="flex items-center gap-4"
                    style={{ y: limitlessY }}
                >
                    {/* LIMITLESS vertical text */}
                    <div
                        className="text-[#c9b3dd] font-fugaz text-8xl font-bold tracking-wider"
                        style={{
                            writingMode: 'vertical-rl',
                            textOrientation: 'mixed',
                            letterSpacing: '0.15em',
                            fontFamily: 'Arial, sans-serif',
                            fontWeight: '900',
                            transform: 'rotate(180deg)'
                        }}
                    >
                        <span>///</span>
                        LIMITLESS
                        <span>///</span>
                        LIMITLESS
                        <span>///</span>
                        LIMITLESS
                    </div>
                </motion.div>
            </div>

            {/* Mobile LIMITLESS text - horizontal at bottom */}
            <div className="lg:hidden w-full bg-[#12001A] py-8 overflow-hidden">
                <div className="text-[#c9b3dd] font-fugaz text-4xl sm:text-5xl font-bold tracking-wider text-center whitespace-nowrap animate-pulse">
                    /// LIMITLESS ///
                </div>
            </div>
        </section>
    );
}
