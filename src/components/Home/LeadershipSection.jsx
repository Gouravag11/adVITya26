import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const LeadershipSection = () => {
    const leaders = [
        { name: "Dr. G. Vishwanathan", position: "Chancellor" },
        { name: "Leader Name 2", position: "Position 2" },
        { name: "Leader Name 3", position: "Position 3" },
        { name: "Leader Name 4", position: "Position 4" },
        { name: "Leader Name 5", position: "Position 5" },
    ];

    return (
        <div className="relative w-full py-32 bg-[#12001A] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-4xl md:text-5xl font-bold text-white mb-16 text-center"
                >
                    Our Leadership
                </motion.h2>

                <Swiper
                    spaceBetween={25}
                    slidesPerView={1.5}
                    centeredSlides={true}
                    grabCursor={true}
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
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
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
                                    <h3 className="text-[#CDB7D9] text-opacity-60 text-xl font-semibold mb-1">
                                        {leader.name}
                                    </h3>
                                    <p className="text-[#CDB7D9] text-opacity-40 text-lg">
                                        {leader.position}
                                    </p>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default LeadershipSection;
