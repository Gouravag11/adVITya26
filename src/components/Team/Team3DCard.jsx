import { motion } from 'framer-motion';

const Team3DCard = ({ name, role, image }) => {
    // Text-Only Layout (Split Background)
    if (!image) {
        return (
            <div
                className="relative group w-full overflow-hidden rounded-xl border border-purple-700/30 transition-all duration-300 hover:border-purple-400/80 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
            >
                {/* Name Section - White Background */}
                <div className="bg-white p-6 flex items-center justify-center min-h-[50px]">
                    <h3 className="text-xl font-bold text-[#1A0A28] text-center tracking-wide group-hover:scale-105 transition-transform duration-300">
                        {name}
                    </h3>
                </div>

                {/* Role Section - Dark Background */}
                <div className="bg-[#1A0A28] p-4 relative border-t border-purple-700/30">
                    {/* Decorative glowing line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent group-hover:w-full transition-all duration-500" />

                    <p className="text-purple-400 font-medium tracking-widest text-xs uppercase text-center opacity-80 group-hover:opacity-100 transition-opacity">
                        {role}
                    </p>
                </div>
            </div>
        );
    }

    // Standard Logic with Image
    return (
        <div
            className="relative group w-full bg-[#1A0A28] border border-purple-700/30 rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-400/80 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
        >
            {/* Rectangular Image Container */}
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-900 border-b border-purple-700/30">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A28] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
            </div>

            {/* Content Section */}
            <div className="p-4 relative">
                {/* Decorative glowing line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent group-hover:w-full transition-all duration-500" />

                <h3 className="text-xl font-bold text-white mb-2 text-center group-hover:text-purple-300 transition-colors tracking-wide">
                    {name}
                </h3>
                <p className="text-purple-400 font-medium tracking-widest text-xs uppercase text-center opacity-80 group-hover:opacity-100 transition-opacity">
                    {role}
                </p>
            </div>
        </div>
    );
};

export default Team3DCard;
