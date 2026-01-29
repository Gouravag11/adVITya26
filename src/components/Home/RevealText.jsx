import React from 'react';
import { motion } from 'framer-motion';

export default function RevealText({ text, delay = 0 }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: 0.05,
                        delayChildren: delay
                    }
                }
            }}
            className="inline-block"
        >
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    variants={{
                        hidden: { y: "100%", opacity: 0 },
                        visible: { y: 0, opacity: 1, transition: { ease: [0.33, 1, 0.68, 1], duration: 0.5 } }
                    }}
                    className="inline-block origin-bottom"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.div>
    );
}
