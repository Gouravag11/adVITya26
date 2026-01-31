import React from 'react';
import { motion } from 'framer-motion';

export default function BookingCard({ variants }) {
    return (
        <motion.div variants={variants} className='bg-[#735483]/30 bakckdrop-blur-xl w-full h-full rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden text-white'>
            {/* Abstract Background Stars */}
            <div className="absolute top-2 right-4 text-xs opacity-50 space-x-0.5">
                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
            </div>

            <div className="relative z-10 mt-2">
                <h3 className="text-xl font-bold uppercase leading-tight font-sans tracking-tight">AdVITya'26<br /><span className="text-purple-100">Entry Pass</span></h3>
                <p className="text-[10px] text-stone-300 leading-relaxed max-w-[90%]">
                    Experience the biggest tech-fest with exclusive access to all events and pro-shows.
                </p>
            </div>

            <div className="relative z-10">
                <motion.button
                    className="w-full bg-white rounded-full h-10 relative overflow-hidden group cursor-pointer"
                    whileHover="hover"
                    initial="initial"
                >
                    <motion.div
                        className="absolute inset-0 bg-[#12001A]"
                        variants={{
                            initial: { scaleX: 0, originX: 0 },
                            hover: { scaleX: 1, originX: 0 }
                        }}
                        transition={{ duration: 0.4, ease: "circIn" }}
                    />
                    <div className="relative z-10 flex items-center justify-between px-1 pr-1 w-full h-full mix-blend-exclusion">
                        <span className=" px-3 text-sm text-white">LIMITED</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider pl-2 pr-4 border-l border-white/10 h-full flex items-center text-white">Book Now</span>
                        <div className="w-8 h-8 bg-[#12001A] rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                        </div>
                    </div>
                </motion.button>
            </div>

            {/* Glow effect */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 blur-2xl rounded-full pointer-events-none"></div>
        </motion.div>
    );
}
