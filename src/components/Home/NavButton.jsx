import React from 'react';
import { motion } from 'framer-motion';

export default function NavButton({ children }) {
    return (
        <motion.button
            className="relative px-6 py-1.5 text-sm rounded-full overflow-hidden border border-white/30 text-white cursor-pointer group"
            whileHover="hover"
            initial="initial"
        >
            <motion.div
                className="absolute inset-0 bg-white"
                variants={{
                    initial: { scaleX: 0, originX: 0 },
                    hover: { scaleX: 1, originX: 0 }
                }}
                transition={{ duration: 0.4, ease: "circIn" }}
            />
            <span className="relative z-10 mix-blend-exclusion">{children}</span>
        </motion.button>
    );
}
