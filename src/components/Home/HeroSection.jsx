import { motion } from 'framer-motion';

const HeroSection = () => {
    return (
        <>
            <div className="relative w-full h-[400px] sm:min-h-[720px] overflow-hidden bg-white">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex z-0"
                >
                    <img
                        src="/Herosection_BG.svg"
                        alt="Background Left"
                        className="w-full sm:w-1/2 h-full object-cover"
                    />
                    <img
                        src="/Herosection_BG.svg"
                        alt="Background Right"
                        className="hidden sm:block w-1/2 h-full object-cover"
                    />
                </motion.div>

                <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-0">
                    <div className="absolute top-[150px] sm:top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-full max-w-4xl px-4 z-20">
                        <img
                            src="/AdvityaTitle.png"
                            alt="AdVITya 2024"
                            className="w-full h-auto drop-shadow-2xl"
                        />
                    </div>

                    <div className="relative w-full max-w-7xl mx-auto mt-auto flex items-end justify-center pointer-events-none">

                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 10 }}
                            transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
                            className="absolute bottom-0 left-[15%] sm:left-[8%] lg:left-[20%] h-56 sm:h-[450px] md:h-[500px] z-30 transform"
                        >
                            <img
                                src="/Mohit.png"
                                alt="Mohit Chauhan"
                                className="w-auto h-full object-cover drop-shadow-xl"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 10 }}
                            transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
                            className="absolute bottom-0 right-[5%] sm:right-[0%] md:right-[5%] lg:right-[17%] h-56 sm:h-[450px] md:h-[500px] z-30 transform"
                        >
                            <img
                                src="/Raghu.png"
                                alt="Raghu Dixit"
                                className="w-auto h-full object-cover drop-shadow-xl"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.4, ease: "easeOut" }}
                            className="absolute bottom-0 w-full flex justify-center h-56 sm:h-[500px] md:h-[550px] z-40"
                        >
                            <img
                                src="/Sunidhi.png"
                                alt="Sunidhi Chauhan"
                                className="h-full ml-22 sm:ml-40 object-cover drop-shadow-2xl"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
            <div className="w-full pointer-events-none">
                <div className="absolute z-30 left-0 top-[300px] sm:top-[550px] md:top-[530px] lg:top-[450px] xl:top-[360px] w-full">
                    <svg
                        viewBox="0 0 1440 600"
                        className="hidden sm:block w-full h-full"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill="#6F00A0"
                            fillOpacity="1"
                            d="M -113.1358 456.74 L -49.8771 434.136 C 19.0804 413.188 149.9001 367.18 300.1551 363.716 C 456.1095 361.91 637.196 404.306 795.942 407.412 C 948.99 408.86 1086.792 375.13 1209.236 314.388 C 1331.6765 253.644 1435.8505 169.1428 1493.639 128.549 L 1545.726 86.2984 L 1515.7345 -0 L 1463.6475 42.2506 C 1405.859 82.8444 1301.685 167.3458 1179.241 228.088 C 1056.8005 288.832 918.9985 322.562 765.9505 321.114 C 607.2045 318.008 426.1145 275.612 270.1622 277.418 C 119.9072 280.88 -10.9125 326.89 -79.8704 347.838 L -143.1286 370.442 L -113.1358 456.74 Z"
                        ></path>
                    </svg>
                    <svg
                        viewBox="0 0 1440 600"
                        className="sm:hidden block w-full h-full"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill="#6F00A0"
                            fillOpacity="1"
                            d="M -85 552 L -16 519 C 154 442 208 446 319 445 C 512 451 573 483 806 475 C 997 454 1057 456 1278 355 C 1408 287 1420 283 1552 177 L 1595 137 L 1515.7345 0 L 1463.6475 42.2506 C 1405.859 82.8444 1301.685 167.3458 1179.241 228.088 C 1056.8005 288.832 918.9985 322.562 765.9505 321.114 C 607.2045 318.008 426.1145 275.612 270.1622 277.418 C 119.9072 280.88 -10.9125 326.89 -79.8704 347.838 L -143.1286 370.442 L -125 436 Z"
                        ></path>
                    </svg>
                </div>
            </div>
            <div className="w-full h-full">
                <div className="absolute z-20 min-h-screen top-[300px] sm:top-[550px] md:top-[530px] lg:top-[450px] xl:top-[350px] left-0 w-full -z-10">
                    <svg
                        viewBox="0 0 1440 1800"
                        className="hidden md:block w-full h-full"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="bgGradientDesktop" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#42005e" stopOpacity="1" />
                                <stop offset="50%" stopColor="#7203a2ff" stopOpacity="1" />
                                <stop offset="80%" stopColor="#d2bfdbff" stopOpacity="1" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                            </linearGradient>
                        </defs>
                        <path
                            fill="url(#bgGradientDesktop)"
                            d="M -113.1358 456.74 L -49.8771 434.136 C 19.0804 413.188 149.9001 367.18 300.1551 363.716 C 456.1095 361.91 637.196 404.306 795.942 407.412 C 948.99 408.86 1086.792 375.13 1209.236 314.388 C 1331.6765 253.644 1435.8505 169.1428 1493.639 128.549 L 1545.726 86.2984 L 1557 1537 L -125 1548 Z"
                        ></path>
                    </svg>
                    <svg
                        viewBox="0 0 1440 5000"
                        className="block md:hidden w-full h-full"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="bgGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#42005e" stopOpacity="1" />
                                <stop offset="50%" stopColor="#660390" stopOpacity="0.6" />
                                <stop offset="90%" stopColor="#7e4a95" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            fill="url(#bgGradientMobile)"
                            d="M -113.1358 456.74 L -49.8771 434.136 C 19.0804 413.188 149.9001 367.18 300.1551 363.716 C 456.1095 361.91 637.196 404.306 795.942 407.412 C 948.99 408.86 1086.792 375.13 1209.236 314.388 C 1331.6765 253.644 1435.8505 169.1428 1493.639 128.549 L 1545.726 86.2984 L 1585 3300 L -98 3300 Z"
                        ></path>
                    </svg>
                </div>
            </div>
        </>
    );
};
export default HeroSection;