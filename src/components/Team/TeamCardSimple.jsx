import { motion } from 'framer-motion';

const TeamCardSimple = ({ name, role, image }) => {
    return (
        <div className="flex flex-col w-full max-w-[280px] bg-white border-2 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(168,85,247,0.8)] hover:shadow-[12px_12px_0px_0px_rgba(168,85,247,1)] transition-all duration-300 hover:-translate-y-1">
            {/* Image Section */}
            {image && (
                <div className="w-full aspect-[4/5] bg-gray-200 border-b-2 border-black overflow-hidden relative">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Name Section - White Background */}
            <div className="bg-white py-3 px-2 flex items-center justify-center border-b-2 border-black">
                <h3 className="text-lg md:text-xl font-bold text-black text-center leading-tight">
                    {name}
                </h3>
            </div>

            {/* Role Section - Purple Background */}
            <div className="bg-[#a855f7] py-2 px-2 flex items-center justify-center">
                <p className="text-white font-semibold text-sm md:text-base uppercase tracking-wider text-center">
                    {role}
                </p>
            </div>
        </div>
    );
};

export default TeamCardSimple;
