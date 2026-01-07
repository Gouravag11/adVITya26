import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const EventsSection = () => {
    const events = [
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
    ];

    return (
        <div className="relative w-full py-20 bg-white overflow-hidden">
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

                <Swiper
                    modules={[EffectCoverflow]}
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView="auto"
                    loop={true}
                    loopedSlides={1}
                    watchSlidesProgress={true}
                    preloadImages={true}
                    updateOnImagesReady={true}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                        slideShadows: false,
                    }}
                    className="events-swiper !overflow-visible"
                >
                    {events.map((event, index) => (
                        <SwiperSlide key={index} className="!w-[300px] md:!w-[400px]">
                            <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src={event}
                                    alt={`Event ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="eager"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <style jsx>{`
                :global(.events-swiper .swiper-slide) {
                    transition: transform 0.3s ease;
                }
                
                :global(.events-swiper .swiper-slide-active) {
                    transform: scale(1.1);
                    z-index: 2;
                }
                
                :global(.events-swiper) {
                    overflow: visible !important;
                }
                
                :global(.events-swiper .swiper-wrapper) {
                    overflow: visible !important;
                }
            `}</style>
        </div>
    );
};

export default EventsSection;
