import React from 'react';
import { motion } from 'framer-motion';

export default function MusicTrigger({ isPlaying, onClick, variants }) {
    return (
        <motion.button
            variants={variants}
            onClick={onClick}
            className="absolute top-10 right-10 w-10 h-10 rounded-full border border-white flex items-center justify-center gap-0.5 group hover:bg-white transition-all duration-300 cursor-pointer overflow-hidden z-20 outline-none"
        >
            {/* 4 Wave Bars */}
            {[2.5, 4, 3, 1.5].map((h, i) => (
                <div
                    key={i}
                    className={`w-0.5 rounded-full transition-colors duration-300 group-hover:bg-black bg-white ${isPlaying ? `h-${h} animate-[bounce_1s_infinite]` : 'h-1'}`}
                    style={{ height: isPlaying ? `${h * 4}px` : '4px', animationDuration: `${0.8 + i * 0.1}s` }}
                />
            ))}
        </motion.button>
    );
}
