import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Background Vector Component - Simplified for performance/token limits but maintaining aesthetic
const BgVector = () => {
    return (
        <svg className="w-full h-full object-cover text-[#b388ff]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <defs>
                <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
                </pattern>
                <linearGradient id="fade-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#130722" stopOpacity="0" />
                    <stop offset="50%" stopColor="#130722" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#130722" stopOpacity="1" />
                </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#grid-pattern)" opacity="0.3" />
            {/* Decorative circles */}
            <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="0.2" strokeOpacity="0.1" />
            <circle cx="80" cy="80" r="25" stroke="currentColor" strokeWidth="0.2" strokeOpacity="0.1" />
            <path d="M0 100 L100 0" stroke="currentColor" strokeWidth="0.2" strokeOpacity="0.1" />
        </svg>
    );
};

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
    });
    const [isScrambling, setIsScrambling] = useState(true);

    // Target Date: 26th February 2026 at 00:00:00
    const targetDate = new Date("2026-02-26T00:00:00").getTime();

    useEffect(() => {
        let scrambleInterval;
        let countdownInterval;

        // Phase 1: Scramble Animation (Flipping through numbers)
        const startScramble = () => {
            scrambleInterval = setInterval(() => {
                setTimeLeft({
                    days: Math.floor(Math.random() * 90 + 10).toString(),
                    hours: Math.floor(Math.random() * 24).toString().padStart(2, "0"),
                    minutes: Math.floor(Math.random() * 60).toString().padStart(2, "0"),
                    seconds: Math.floor(Math.random() * 60).toString().padStart(2, "0"),
                });
            }, 60); // Speed of flipping
        };

        // Phase 2: Actual Countdown
        const startCountdown = () => {
            clearInterval(scrambleInterval);
            setIsScrambling(false);

            const updateTimer = () => {
                const now = new Date().getTime();
                const difference = targetDate - now;

                if (difference > 0) {
                    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                    setTimeLeft({
                        days: days.toString().padStart(2, "0"),
                        hours: hours.toString().padStart(2, "0"),
                        minutes: minutes.toString().padStart(2, "0"),
                        seconds: seconds.toString().padStart(2, "0"),
                    });
                } else {
                    setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
                }
            };

            updateTimer(); // Immediate update
            countdownInterval = setInterval(updateTimer, 1000);
        };

        // Run Scramble for 2.5 seconds, then switch to real time
        startScramble();
        const timer = setTimeout(() => {
            startCountdown();
        }, 2000);

        return () => {
            clearInterval(scrambleInterval);
            clearInterval(countdownInterval);
            clearTimeout(timer);
        };
    }, []);

    const TimeUnit = ({ value, label }) => (
        <div className="flex flex-col items-center mx-2 sm:mx-4">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative px-3 sm:px-6 py-2 sm:py-4 bg-[#130722] ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center">
                    <span className="text-3xl sm:text-5xl md:text-6xl font-black text-white tabular-nums drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                        {value}
                    </span>
                </div>
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#b388ff] mt-2 uppercase tracking-wider">
                {label}
            </span>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center font-poppins z-20 w-full max-w-5xl">

            {/* Massive Days Counter */}
            <div className="mb-8 sm:mb-12 flex flex-col items-center relative">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <span
                        className={`text-[6rem] sm:text-[8rem] md:text-[12rem] leading-none font-black text-white tracking-tighter transition-all duration-100 ${isScrambling ? 'blur-[1px] opacity-80' : 'blur-0 opacity-100 drop-shadow-[0_0_30px_rgba(139,92,246,0.6)]'
                            }`}
                    >
                        {timeLeft.days}
                    </span>
                    <div className="absolute -bottom-2 md:bottom-2 right-0 bg-[#b388ff] text-[#130722] text-xs sm:text-base font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded shadow-lg transform rotate-[-5deg]">
                        DAYS TO GO
                    </div>
                </motion.div>
            </div>

            {/* Hours, Minutes, Seconds */}
            <div className="flex justify-center items-center divide-x-2 divide-[#b388ff]/20">
                <TimeUnit value={timeLeft.hours} label="Hours" />
                <TimeUnit value={timeLeft.minutes} label="Minutes" />
                <TimeUnit value={timeLeft.seconds} label="Seconds" />
            </div>

            {/* Teaser Text */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={!isScrambling ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-12 text-center"
            >
                <p className="text-white/60 text-sm sm:text-lg tracking-[0.2em] font-light uppercase">
                    February 26-28, 2026 • VIT Bhopal University
                </p>
            </motion.div>
        </div>
    );
};

const PreLoader = ({ show = true }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.5,
                        filter: "blur(20px)",
                        transition: { duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }
                    }}
                    className="fixed inset-0 w-full h-screen bg-[#130722] z-[9999] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Background Vector - Simplified Pattern */}
                    <div className="absolute inset-0 z-0 opacity-10 md:opacity-20 pointer-events-none mix-blend-screen">
                        <BgVector />
                    </div>

                    {/* Glowing Orb Background Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[100px] z-0 pointer-events-none"></div>

                    {/* Main Content */}
                    <div className="relative z-10 w-full flex flex-col items-center justify-center p-4">
                        <Countdown />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PreLoader;
