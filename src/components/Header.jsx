import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function Header() {
    const [scrolled, setScrolled] = useState(false);

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
        { name: 'Sponsors', path: '/sponsors' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`fixed w-full py-2 z-50 transition-all duration-300 ${isOpen
                ? 'bg-transparent'
                : scrolled
                    ? 'backdrop-blur-md shadow-lg border-white/20'
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
                                src="/Logo_VITBhopal.svg"
                                alt="VIT Bhopal"
                                className={`h-10 sm:h-12 w-auto transition-all duration-300 ${isOpen ? 'brightness-0 invert' : ''}`}
                            />
                        </Link>
                    </motion.div>
                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative z-50 p-2 group h-10 w-10 flex flex-col items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div
                            className={`absolute h-[3px] rounded-full transition-all duration-300 transform ${isOpen
                                ? 'w-6 sm:w-8 rotate-45 bg-white'
                                : 'w-6 sm:w-8 -translate-y-2 bg-[#470067]'
                                }`}
                        />
                        <div
                            className={`absolute h-[3px] rounded-full transition-all duration-300 transform ${isOpen
                                ? 'opacity-0'
                                : 'w-6 sm:w-8 bg-[#470067]'
                                }`}
                        />
                        <div
                            className={`absolute h-[3px] rounded-full transition-all duration-300 transform ${isOpen
                                ? 'w-6 sm:w-8 -rotate-45 bg-white'
                                : 'w-4 translate-y-2 translate-x-1 sm:translate-x-2 bg-[#470067] group-hover:w-8 group-hover:translate-x-0'
                                }`}
                        />
                    </motion.button>
                </div>
            </nav>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
                        animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
                        exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
                        transition={{ type: "spring", stiffness: 40, damping: 15 }}
                        className="fixed inset-0 bg-[#12001A] h-screen z-40 flex items-center justify-center"
                    >
                        <div className="flex flex-col items-center gap-8">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.path}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                >
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className="text-4xl font-bold text-white/80 hover:text-purple-400 transition-colors relative group"
                                    >
                                        {item.name}
                                        <span className="absolute -bottom-2 left-0 w-0 h-1 bg-purple-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + navItems.length * 0.1 }}
                            >
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="px-10 py-3 mt-4 text-white rounded-xl text-2xl font-bold transition-all shadow-lg hover:shadow-purple-500/50 inline-block hover:scale-105"
                                    style={{
                                        backgroundImage: 'url(/Button_BG.png)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                >
                                    Login
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

export default Header;
