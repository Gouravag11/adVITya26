'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUI } from '@/contexts/UIContext';
import LoginForm from './LoginForm';
import NavButton from './Home/NavButton';

function Header() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/events' },
        { name: 'Sports Fest', path: '/sportfest' },
        { name: 'Sponsor Us', path: '/sponsor' },
        { name: 'About Us', path: '/team' }
    ];

    const { isHeaderOpen, openHeader, closeHeader, headerMode, setHeaderMode } = useUI();
    const isOpen = isHeaderOpen;
    const setIsOpen = (state) => state ? openHeader() : closeHeader();
    const isDashboard = location.pathname.startsWith('/dashboard');
    if (isDashboard) {
        return null;
    }
    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`fixed w-full py-2 z-50 transition-all duration-300 ${scrolled && !isOpen
                    ? 'border-white/20'
                    : 'bg-transparent'
                    }`}
            >
                <nav className="mx-auto px-8 sm:px-10 md:px-20 py-6">
                    <div className="flex items-center justify-between">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            className="relative z-50"
                        >
                            <Link to="/" className="flex items-center gap-3">
                                <img
                                    src="Images/VITB_Logo.png"
                                    alt="VIT Bhopal"
                                    className={`w-auto transition-all duration-300 ${isOpen ? 'brightness-0 invert h-10 sm:h-10' : 'h-10 sm:h-7 mt-8'}`}
                                />
                            </Link>
                        </motion.div>
                        <div className="flex items-center gap-4 relative z-50">
                            {isOpen && (
                                <NavButton>
                                    <Link
                                        to="/register"
                                        className="hidden sm:flex items-center gap-2 px-1 py-1 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        <img src="/Images/Register.svg" alt="Register" className="w-5 h-5 brightness-0 invert" />
                                        <span>REGISTER</span>
                                    </Link>
                                </NavButton>

                            )}
                            {/* Close/Hamburger Button */}
                            <motion.button
                                onClick={() => setIsOpen(!isOpen)}
                                className="relative z-50 p-2 group h-10 w-10 flex flex-col items-center justify-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div
                                    className={`absolute h-[3px] rounded-full transition-all duration-300 transform ${isOpen
                                        ? 'w-6 sm:w-8 rotate-45 bg-white'
                                        : 'w-6 sm:w-4 -translate-y-2 translate-x-1 sm:translate-x-2 bg-white group-hover:w-8 group-hover:translate-x-0'
                                        }`}
                                />

                                <div
                                    className={`absolute h-[3px] rounded-full transition-all duration-300 transform ${isOpen
                                        ? 'w-6 sm:w-8 -rotate-45 bg-white'
                                        : 'w-6 sm:w-8 bg-white'
                                        }`}
                                />
                            </motion.button>
                        </div>
                    </div>
                </nav>
            </motion.header>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-[#00000095] backdrop-blur-2xl z-40 flex overflow-hidden"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex z-0"
                        >
                            <img
                                src="/Images/Herosection_BG.svg"
                                alt="Background Left"
                                className="w-full sm:w-1/2 grayscale opacity-30 h-full object-cover"
                            />
                            <img
                                src="/Images/Herosection_BG.svg"
                                alt="Background Right"
                                className="hidden sm:block grayscale opacity-30 w-1/2 h-full object-cover"
                            />
                        </motion.div>

                        {headerMode === 'login' ? (
                            <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                                <LoginForm onSuccess={() => {
                                    closeHeader();
                                    navigate('/dashboard');
                                }} />
                            </div>
                        ) : (
                            <>
                                {/* Left Side - Images Staggered Grid */}
                                <div className="hidden lg:flex w-1/2 h-full relative z-10 p-8 items-end justify-center pb-0">
                                    <div className="grid grid-cols-2 gap-6 w-full max-w-xl translate-y-[20%]">
                                        <div className="flex flex-col gap-6 -translate-y-12">
                                            <motion.div
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 0.6, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="w-full aspect-1"
                                            >
                                                <img src="/Images/Image1.svg" alt="Gallery 1" className="w-full h-full object-cover rounded-2xl" />
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 0.6, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="w-full aspect-[3/4]"
                                            >
                                                <img src="/Images/Image3.svg" alt="Gallery 3" className="w-full h-full object-cover rounded-2xl" />
                                            </motion.div>
                                        </div>

                                        {/* Right Column - Positioned slightly lower */}
                                        <div className="flex flex-col gap-6 translate-y-8">
                                            <motion.div
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 0.6, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                                className="w-full aspect-1"
                                            >
                                                <img src="/Images/Image2.svg" alt="Gallery 2" className="w-full h-full object-cover rounded-2xl" />
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 0.6, y: 0 }}
                                                transition={{ delay: 0.5 }}
                                                className="w-full aspect-1"
                                            >
                                                <img src="/Images/Image1.svg" alt="Gallery 4" className="w-full h-full object-cover rounded-2xl" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Menu */}
                                <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center px-8 sm:px-16 md:px-24 pt-32 relative z-10 transition-all">
                                    {/* Centered Content Container */}
                                    <div className="flex flex-col pt-20 pb-10 items-center justify-center w-full h-full">
                                        <div className="flex flex-col items-center justify-between w-full h-full">
                                            <div className="flex flex-col items-center gap-8 sm:gap-6 mb-12">
                                                {navItems.map((item, index) => (
                                                    <motion.div
                                                        key={item.path}
                                                        initial={{ opacity: 0, x: 50 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 + index * 0.1 }}
                                                    >
                                                        <Link
                                                            to={item.path}
                                                            onClick={() => setIsOpen(false)}
                                                            className={`text-4xl sm:text-5xl font-semibold text-white transition-opacity uppercase text-center block ${location.pathname === item.path ? 'opacity-100' : 'opacity-50 hover:opacity-70'}`}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </motion.div>
                                                ))}

                                                {isOpen && (
                                                    <Link
                                                        to="#"
                                                        className="flex sm:hidden block items-center gap-2 px-4 py-2 rounded-lg bg-[#CDB7D9] text-[#280338] font-semibold hover:opacity-90 transition-opacity"
                                                    >
                                                        <img src="/Images/Register.svg" alt="Register" className="w-5 h-5" />
                                                        <span>REGISTER</span>
                                                    </Link>
                                                )}
                                            </div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 }}
                                                className="hidden sm:flex flex-col items-center gap-4 mt-8"
                                            >
                                                <a href="mailto:advitya@vitbhopal.ac.in" className="text-white hover:text-white transition-colors text-sm tracking-wider uppercase font-semibold">Email Us</a>

                                                <div className="flex items-center gap-3 mt-2">
                                                    <a href="https://www.youtube.com/@VITBHOPALOfficial" className="text-white hover:text-white transition-colors uppercase tracking-widest font-medium text-sm" target="_blank" rel="noopener noreferrer">
                                                        YOUTUBE
                                                    </a>
                                                    <a href="https://www.instagram.com/vit.bhopal/?hl=en" className="text-white hover:text-white transition-colors uppercase tracking-widest font-medium text-sm">
                                                        INSTAGRAM
                                                    </a>
                                                    <a href="https://www.linkedin.com/school/vit-bhopal-university/posts/?feedView=all" className="text-white hover:text-white transition-colors uppercase tracking-widest font-medium text-sm">
                                                        LINKEDIN
                                                    </a>
                                                    <a href="https://www.facebook.com/VITUnivBhopal/" className="text-white hover:text-white transition-colors uppercase tracking-widest font-medium text-sm">
                                                        FACEBOOK
                                                    </a>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Header;
