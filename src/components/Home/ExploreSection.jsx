import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const SAMPLE_LYRICS = [
    { time: 0, text: "Dive into the heart of VIT Bhopal" },
    { time: 3, text: "with AdVlTya'26 - an electrifying" },
    { time: 6, text: "blend of technology and culture." },
    { time: 9, text: "Crafted by the ingenious minds" },
    { time: 12, text: "of VIT Bhopal students," },
    { time: 15, text: "AdVlTya'26 transcends the ordinary," },
    { time: 18, text: "presenting a dynamic showcase" },
    { time: 21, text: "of innovation and creativity." },
    { time: 25, text: "Join us for an immersive experience" },
    { time: 29, text: "where every moment sparks brilliance," },
    { time: 33, text: "turning the campus into a canvas" },
    { time: 37, text: "of unbridled talent and celebration." },
    { time: 41, text: "AdVlTya'26 is more than an event;" },
    { time: 45, text: "it's a journey where the extraordinary" },
    { time: 49, text: "takes center stage," },
    { time: 53, text: "inviting you to witness" },
    { time: 56, text: "and be part of the magic!" }
];

export default function ExploreSection({ containerRef, contentRef, linesRef, isPlaying, audioRef }) {
    // Sync Active Index with Audio Time
    React.useEffect(() => {
        if (!audioRef?.current) return;

        const handleTimeUpdate = () => {
            // Logic for syncing if needed, currently mainly visual
        };

        const audio = audioRef.current;
        audio.addEventListener('timeupdate', handleTimeUpdate);
        return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
    }, [audioRef]);

    // Use `useGSAP` strictly for visuals (Scale/Blur) based on position
    useGSAP(() => {
        if (!containerRef.current || !contentRef.current) return;

        // Use a ticker to update visuals during scroll scrub
        const updateVisuals = () => {
            // Get current translation Y from the content element
            // We can use gsap.getProperty to get the current 'y' set by the scrollTrigger timeline
            const currentY = gsap.getProperty(contentRef.current, "y");
            const containerHeight = containerRef.current.offsetHeight;
            const centerLine = -currentY + (containerHeight / 2);

            linesRef.current.forEach((line, i) => {
                if (!line) return;

                const lineTop = line.offsetTop;
                const lineMid = lineTop + line.offsetHeight / 2;
                const dist = Math.abs(centerLine - lineMid);

                // Visual Logic based on distance from center
                // Continuous fluid transition using Gaussian-like falloff
                const maxDist = 250; // Range of influence
                // Calculate intensity (0 to 1) based on distance
                // using a power curve for sharper peak (single row focus)
                const normDist = Math.max(0, 1 - (dist / maxDist));
                const intensity = Math.pow(normDist, 3); // Cubic falloff makes it very focused on the center

                const scale = 1 + (0.2 * intensity); // 1.0 to 1.2
                const opacity = 0.2 + (0.8 * intensity); // 0.2 to 1.0
                const blur = Math.max(0, (1 - intensity) * 4); // 0 to 4px

                // Interpolate color for smooth transition
                // We use a simple threshold for efficiency or exact interpolation if needed
                // but for high perf loop, direct value or simple logic is best.
                // Let's use GSAP's utility if available, or just simple RGB logic for speed.
                // White: 255, 255, 255. Stone-400: 168, 162, 158 (#a8a29e)

                // Simple RGB interpolation
                const r = 168 + (255 - 168) * intensity;
                const g = 162 + (255 - 162) * intensity;
                const b = 158 + (255 - 158) * intensity;

                gsap.set(line, {
                    scale: scale,
                    opacity: opacity,
                    filter: `blur(${blur}px)`,
                    color: `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
                });
            });
        };

        const ticker = gsap.ticker.add(updateVisuals);
        return () => gsap.ticker.remove(ticker);
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="flex-1 w-full relative overflow-hidden"
            style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
            }}
        >
            <div ref={contentRef} className="absolute w-full flex flex-col items-center gap-4 py-20 px-4 will-change-transform">
                {SAMPLE_LYRICS.map((line, index) => (
                    <div
                        key={index}
                        ref={el => linesRef.current[index] = el}
                        className="text-center font-bold text-xl cursor-pointer transition-colors duration-300 transform-gpu"
                        onClick={() => {
                            if (audioRef.current) {
                                audioRef.current.currentTime = line.time;
                            }
                        }}
                    >
                        {line.text}
                    </div>
                ))}
                {/* Reduced bottom spacer to prevent overscroll */}
                <div className="h-20"></div>
            </div>
        </div>
    );
}
