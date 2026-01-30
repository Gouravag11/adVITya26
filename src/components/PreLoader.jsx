import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
                        days: days.toString(),
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

        // Run Scramble for 2 seconds, then switch to real time
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

    return (
        <div className="flex items-center justify-center font-poppins z-20">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4 sm:gap-8 md:gap-12"
            >
                {/* Days - Large number on left */}
                <div className="flex flex-col items-left">
                    <span
                        className={`text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[12rem] leading-none font-fugaz text-white tracking-tight transition-all duration-100 ${isScrambling ? 'blur-[1px] opacity-80' : 'blur-0 opacity-100'
                            }`}
                        style={{ fontFamily: 'Arial Black, sans-serif' }}
                    >
                        {timeLeft.days}
                    </span>
                    <span className="text-[#B080CA] text-xl text-left px-4 font-fugaz sm:text-2xl md:text-6xl font-medium tracking-wide">
                        Days
                    </span>
                </div>

                {/* Hours, Minutes, Seconds - Stacked on right */}
                <div className="flex flex-col gap-1 sm:gap-2">
                    {/* Hours */}
                    <div className="flex items-baseline gap-2">
                        <span
                            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-fugaz transition-all duration-100 ${isScrambling ? 'blur-[0.5px] opacity-80' : 'blur-0 opacity-100'
                                }`}
                            style={{ fontFamily: 'Arial Black, sans-serif' }}
                        >
                            {timeLeft.hours}
                        </span>
                        <span className="text-[#B080CA] font-fugaz text-lg sm:text-xl md:text-3xl lg:text-4xl font-medium">
                            Hours
                        </span>
                    </div>

                    {/* Minutes */}
                    <div className="flex items-baseline gap-2">
                        <span
                            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white italic transition-all duration-100 ${isScrambling ? 'blur-[0.5px] opacity-80' : 'blur-0 opacity-100'
                                }`}
                            style={{ fontFamily: 'Arial Black, sans-serif' }}
                        >
                            {timeLeft.minutes}
                        </span>
                        <span className="text-[#B080CA] font-fugaz text-lg sm:text-xl md:text-3xl lg:text-4xl font-medium">
                            Minutes
                        </span>
                    </div>

                    {/* Seconds */}
                    <div className="flex items-baseline gap-2">
                        <span
                            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white italic transition-all duration-100 ${isScrambling ? 'blur-[0.5px] opacity-80' : 'blur-0 opacity-100'
                                }`}
                            style={{ fontFamily: 'Arial Black, sans-serif' }}
                        >
                            {timeLeft.seconds}
                        </span>
                        <span className="text-[#B080CA] font-fugaz text-lg sm:text-xl md:text-3xl lg:text-4xl font-medium">
                            Seconds
                        </span>
                    </div>
                </div>
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
                        scale: 1.1,
                        filter: "blur(20px)",
                        transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
                    }}
                    className="fixed inset-0 w-full h-screen bg-[#12001A] z-[9999] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Background Vector Image */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <img
                            src="/HomePage/TitleVector.png"
                            alt=""
                            className="w-full h-full object-cover opacity-40"
                        />
                    </div>

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
