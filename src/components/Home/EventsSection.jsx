/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

const EventsSection = () => {
    const [isInEventsSection, setIsInEventsSection] = useState(false);

    const events = [
        {
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
            title: "Night Beats",
            club: "Musicians Club",
            date: "12 Feb 2026",
            venue: "Open Air Theatre",
        },
        {
            image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
            title: "Echoes",
            club: "Rhythm Society",
            date: "18 Feb 2026",
            venue: "Main Auditorium",
        },
        {
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            title: "Sunset Jam",
            club: "Live Wire",
            date: "22 Feb 2026",
            venue: "Central Lawn",
        },
        {
            image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
            title: "Bass Drop",
            club: "DJ Society",
            date: "1 Mar 2026",
            venue: "Indoor Arena",
        },
        {
            image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
            title: "Unplugged",
            club: "Acoustics Club",
            date: "5 Mar 2026",
            venue: "Seminar Hall",
        },
        {
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
            title: "Night Beats",
            club: "Musicians Club",
            date: "12 Feb 2026",
            venue: "Open Air Theatre",
        },
        {
            image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
            title: "Echoes",
            club: "Rhythm Society",
            date: "18 Feb 2026",
            venue: "Main Auditorium",
        },
        {
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            title: "Sunset Jam",
            club: "Live Wire",
            date: "22 Feb 2026",
            venue: "Central Lawn",
        },
        {
            image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
            title: "Bass Drop",
            club: "DJ Society",
            date: "1 Mar 2026",
            venue: "Indoor Arena",
        },
        {
            image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
            title: "Unplugged",
            club: "Acoustics Club",
            date: "5 Mar 2026",
            venue: "Seminar Hall",
        },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const section = document.getElementById("events");
            if (!section) return;

            const visible =
                window.scrollY >
                section.offsetTop - (window.innerHeight * 3) / 4;

            setIsInEventsSection(visible);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
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
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    return (
        <div
            id="events"
            className="relative w-full py-20 bg-white overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 0.4, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-6xl md:text-8xl font-bold text-center mb-16 text-[#6F00A0]"
                >
                    EVENTS
                </motion.h2>

                {/* Load Once Transition Always */}
                <motion.div
                    variants={sectionVariants}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInEventsSection ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.8, y: 30, scale: 0.8 }}
                    transition={{ duration: 0.8 }}
                >
                    <Swiper
                        modules={[EffectCoverflow]}
                        effect="coverflow"
                        grabCursor
                        centeredSlides
                        slidesPerView="auto"
                        loop
                        loopAdditionalSlides={2}
                        watchSlidesProgress
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 100,
                            modifier: 2.5,
                            slideShadows: false,
                        }}
                        className="events-swiper overflow-visible!"
                    >
                        {events.map((event, index) => (
                            <SwiperSlide key={index} className="w-75! md:w-100!">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                    whileHover={{
                                        y: -10,
                                        transition: { duration: 0.3 },
                                    }}
                                >
                                    <div className="group relative w-full h-100 md:h-125 rounded-2xl overflow-hidden shadow-xl">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                            draggable={false}
                                        />

                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 in-[.swiper-slide-active]:opacity-100 md:group-hover:opacity-100 transition-opacity duration-300">
                                            <p className="text-3xl font-semibold">
                                                {event.title}
                                            </p>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-base">
                                                    {event.club}
                                                </span>
                                                <span className="text-xs flex items-end">
                                                    {event.date}
                                                </span>
                                            </div>
                                            <p className="text-xs text-right">
                                                {event.venue}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>

            <style>{`
                :global(.events-swiper .swiper-slide) {
                    transition: transform 0.3s ease;
                }

                :global(.events-swiper .swiper-slide-active) {
                    transform: scale(1.1);
                    z-index: 2;
                }

                :global(.events-swiper),
                :global(.events-swiper .swiper-wrapper) {
                    overflow: visible !important;
                }
            `}</style>
        </div>
    );
};

export default EventsSection;
