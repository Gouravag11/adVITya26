import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NavButton({ children, to }) {
    const content = (
        <>
            <motion.div
                className="absolute inset-0 bg-white"
                variants={{
                    initial: { scaleX: 0, originX: 0 },
                    hover: { scaleX: 1, originX: 0 }
                }}
                transition={{ duration: 0.4, ease: "circIn" }}
            />
            <span className="relative z-10 mix-blend-exclusion">{children}</span>
        </>
    );

    const className = "relative px-6 py-1.5 text-sm rounded-full overflow-hidden border border-[#EFD2FF]/30 text-white cursor-pointer group";

    if (to) {
        return (
            <motion.div whileHover="hover" initial="initial">
                <Link to={to} className={className}>
                    {content}
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.button
            className={className}
            whileHover="hover"
            initial="initial"
        >
            {content}
        </motion.button>
    );
}
