import React from 'react';

export default function VolumeControl({ volume, setVolume }) {
    const knobRef = React.useRef(null);
    const isDragging = React.useRef(false);

    React.useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging.current || !knobRef.current) return;

            const rect = knobRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            let angle = Math.atan2(dy, dx) * (180 / Math.PI);

            // Clamp angle between -60 and +60 degrees
            if (angle < -60) angle = -60;
            if (angle > 60) angle = 60;

            // Map angle to volume (0 to 1)
            const newVolume = (angle + 60) / 120;

            setVolume(newVolume);
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            document.body.style.cursor = 'default';
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [setVolume]);

    const handleMouseDown = () => {
        isDragging.current = true;
        document.body.style.cursor = 'grabbing';
    };

    const r = Math.round(255 + (168 - 255) * volume);
    const g = Math.round(255 + (85 - 255) * volume);
    const b = Math.round(255 + (247 - 255) * volume);
    const indicatorColor = `rgb(${r}, ${g}, ${b})`;
    const rotation = (volume * 120) - 60;

    return (
        <div className='rounded-4xl bg-black w-full h-full relative flex flex-col justify-between p-8 overflow-hidden select-none'>
            <div className="flex justify-end">
                <div
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: indicatorColor }}
                >
                    <div className="w-2 h-2 bg-black rounded-full" />
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center my-4">
                <div
                    ref={knobRef}
                    className="w-56 h-56 relative cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
                    onMouseDown={handleMouseDown}
                >
                    <img
                        src="/HomePage/SoundKnob.png"
                        alt="Volume Knob"
                        className="w-full h-full object-contain pointer-events-none"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            transition: isDragging.current ? 'none' : 'transform 0.1s ease-out'
                        }}
                    />
                </div>
            </div>

            <div>
                <h3 className="text-white text-xl font-bold mb-2 tracking-wide">VIBE CHECK</h3>
                <p className="text-stone-500 text-[10px] leading-relaxed font-medium pr-4">
                    Adjust the atmosphere. Control the volume to immerse yourself in the AdVITya experience.
                </p>
            </div>
        </div>
    );
}
