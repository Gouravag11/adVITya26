/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const SponsoredBy = () => {
    const sponsors = [
        "/Sponsor1.png",
        "/Sponsor2.png",
        "/Sponsor3.png",
        "/Sponsor4.png",
        "/Sponsor5.png",
    ];

    return (
        <div className="relative w-full py-20 overflow-hidden">
            <div className="flex justify-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex items-center gap-3 px-8 py-3 bg-[#6F00A02E] border-2 border-[#6F00A0] rounded-full"
                >
                    <div className="w-4 h-4 bg-[#6F00A0] rounded-full animate-pulse"></div>
                    <h2 className="text-lg sm:text-2xl font-bold text-[#6F00A0]">
                        Sponsered By
                    </h2>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full max-w-6xl mx-auto px-4"
            >
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={20}
                    slidesPerView={2}
                    loop={true}
                    speed={800}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 40,
                        },
                    }}
                    className="sponsor-swiper"
                >
                    {sponsors.map((sponsor, index) => (
                        <SwiperSlide key={index}>
                            <div className="flex items-center justify-center p-4 h-24">
                                <img
                                    src={sponsor}
                                    alt={`Sponsor ${index + 1}`}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>
        </div>
    );
};

export default SponsoredBy;
