/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

function LoginForm({ onSuccess }) {
    const { loginWithGoogle, loginWithMagicLink, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [magicLinkSent, setMagicLinkSent] = useState(false);
    const [error, setError] = useState('');
    const [sendingLink, setSendingLink] = useState(false);

    const handleMagicLinkLogin = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your college email ID');
            return;
        }
        setError('');
        setSendingLink(true);

        try {
            const res = await loginWithMagicLink(email);
            if (res.success) {
                setMagicLinkSent(true);
            } else {
                setError('Failed to send magic link. Please try again.');
            }
        } catch {
            setError('An unexpected error occurred.');
        } finally {
            setSendingLink(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 w-full h-full">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="
                relative z-10
                w-full max-w-5xl
                min-h-[70vh] md:min-h-162.5
                px-4 sm:px-8 md:px-12 lg:px-20
                py-6 md:py-10
                shadow-2xl
                flex justify-center items-center
            "
        >
            {/* 💎 FORM GLASS CARD */}
            <div
                className="
                    relative
                    w-full md:w-1/2
                    rounded-3xl
                    overflow-hidden
                    shadow-2xl
                "
            >
                {/* 🖼️ Background Image (In Case ever if you want a bg image for this form) */}
                {/* <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <img
                        src="/AdvityaTitle.png"
                        alt="Background"
                        className="w-full h-auto object-contain px-2 md:px-4"
                    />
                </div> */}

                {/* 🌫️ Glass Overlay */}
                <div className="absolute inset-0 bg-black/35 backdrop-blur-md" />

                {/* ✨ Actual Form Content */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="
                        relative z-10
                        mx-auto w-full
                        bg-white/10
                        border border-white/20
                        rounded-3xl
                        px-6 py-10 md:py-20
                    "
                >
                    <h1 className="text-4xl sm:text-5xl font-bold text-[#CDB7D9] mb-4 tracking-tight">LOGIN</h1>
                    <p className="text-[#CDB7D9]/80 text-sm leading-relaxed">
                        Dive into the heart of VIT Bhopal with AdVlTya'25 - an electrifying blend of technology and culture
                    </p>
                    <p className='text-white/40 text-xs mt-1 mb-10'>Crafted by the ingenious minds of VIT Bhopal students</p>

                    {magicLinkSent ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center"
                        >
                            <FontAwesomeIcon icon={faPaperPlane} className="text-3xl text-green-400 mb-3" />
                            <h3 className="text-white font-semibold mb-2">Check your inbox!</h3>
                            <p className="text-white text-sm">
                                We've sent a magic link to <span className="text-green-400">{email}</span>.
                                Click the link in the email to sign in.
                            </p>
                            <button
                                onClick={() => setMagicLinkSent(false)}
                                className="mt-4 text-sm text-white hover:text-white underline cursor-pointer"
                            >
                                Try another email
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleMagicLinkLogin} className="space-y-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your College Mail ID"
                                className="
                                    w-full bg-white/10 text-white placeholder-white/70
                                    rounded-xl px-5 py-4
                                    focus:outline-none focus:ring-2 focus:ring-[#CDB7D9]/50
                                "
                                required
                            />

                            {error && (
                                <p className="text-red-400 text-xs text-center">{error}</p>
                            )}

                            <AnimatePresence>
                                {email && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <button
                                            type="submit"
                                            disabled={sendingLink}
                                            className={`
                                                w-full py-4 rounded-xl text-sm font-semibold
                                                ${
                                                    sendingLink
                                                        ? 'bg-white/10 text-white/70 cursor-not-allowed'
                                                        : 'bg-[#CDB7D9]/30 hover:bg-[#CDB7D9]/50 text-white'
                                                }
                                            `}
                                        >
                                            {sendingLink ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                    Sending...
                                                </span>
                                            ) : 'Continue with Email'}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="relative flex items-center justify-center my-6">
                                <div className="absolute h-px w-full bg-white/10"></div>
                                <span className="relative bg-transparent px-6 text-gray-500 text-sm">Or</span>
                            </div>

                            <button
                                type="button"
                                onClick={async () => {
                                    await loginWithGoogle();
                                    if (onSuccess) onSuccess();
                                }}
                                className="w-full bg-[#CDB7D9]/10 hover:bg-[#CDB7D9]/30 cursor-pointer text-white/90 border border-white/5 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group"
                            >
                                <FontAwesomeIcon icon={faGoogle} className="text-xl text-[#CDB7D9]/80" />
                                <span className="text-sm">Sign in with Google</span>
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}

export default LoginForm;
