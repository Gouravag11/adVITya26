import React, { useEffect, useState, useRef, useCallback } from 'react';

const RecordPlayer = ({ isPlaying, audioRef, isHovered, onTogglePlay }) => {
    const [armRotation, setArmRotation] = useState(83);
    const [isDragging, setIsDragging] = useState(false);
    const pivotRef = useRef(null);
    const dragOffset = useRef(0);
    useEffect(() => {
        if (!audioRef?.current || isDragging) return;

        const updateRotation = () => {
            if (isPlaying && audioRef.current.duration) {
                const progress = audioRef.current.currentTime / audioRef.current.duration;
                const newRotation = 93 + (progress * 20);
                setArmRotation(newRotation);
            } else if (!isPlaying) {
                setArmRotation(83);
            }
        };

        const audio = audioRef.current;
        audio.addEventListener('timeupdate', updateRotation);

        // Initial update
        updateRotation();

        return () => {
            audio.removeEventListener('timeupdate', updateRotation);
        };
    }, [isPlaying, audioRef, isDragging]);

    const calculateAngle = (clientX, clientY) => {
        if (!pivotRef.current) return 0;
        const rect = pivotRef.current.getBoundingClientRect();
        const pivotX = rect.left + rect.width / 2;
        const pivotY = rect.top + rect.height / 2;

        const deltaX = clientX - pivotX;
        const deltaY = clientY - pivotY;

        const angleRad = Math.atan2(deltaY, deltaX);
        let angleDeg = angleRad * (180 / Math.PI);

        return angleDeg;
    };

    const handleMouseDown = (e) => {
        if (!isPlaying || !audioRef?.current) return;

        setIsDragging(true);
        const startMouseAngle = calculateAngle(e.clientX, e.clientY);
        dragOffset.current = armRotation - startMouseAngle;

        e.preventDefault();
        e.stopPropagation();
    };

    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !audioRef?.current) return;

        const currentMouseAngle = calculateAngle(e.clientX, e.clientY);
        let newRotation = currentMouseAngle + dragOffset.current;

        if (newRotation < 93) newRotation = 93;
        if (newRotation > 113) newRotation = 113;

        setArmRotation(newRotation);

        const percentage = (newRotation - 93) / 20;
        if (audioRef.current.duration) {
            audioRef.current.currentTime = percentage * audioRef.current.duration;
        }

    }, [isDragging, audioRef]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <div
            className="relative scale-[0.9] hover:scale-[0.92] transition-all duration-400 w-full h-full flex items-center justify-center cursor-pointer"
            onClick={onTogglePlay}
        >
            <div
                ref={pivotRef}
                className="absolute w-1 h-1 pointer-events-none opacity-0"
                style={{
                    left: 'calc(10% + 221px)',
                    top: 'calc(79% + 45px)'
                }}
            />

            <div className="record-player origin-center" style={{
                transform: `rotate(90deg) scale(0.75)`,
                position: 'relative',
                transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}>
                <div
                    className="player-shadow"
                    style={{
                        boxShadow: isHovered
                            ? '0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 18px 36px -18px rgba(0, 0, 0, 0.7)'
                            : '0 0 0 0 transparent',
                        transition: 'box-shadow 0.5s ease-out',
                        zIndex: -1
                    }}
                ></div>

                <div className="player-body">
                    <div className="player-surface">
                        <div className="voltage-selector">
                            <div className="voltage-text">
                                220 V<br />
                                160 V<br />
                                110 V
                            </div>
                            <div className="voltage-indicator"></div>
                            <div className="voltage-knob">
                                <div className="voltage-knob-dot"></div>
                            </div>
                        </div>

                        {/* Ticker Display */}
                        <div className="ticker" id="ticker">
                            <div className="ticker-content">
                                <span>NOW PLAYING: TRACK 1</span>
                                <span style={{ marginLeft: '20px' }}>NOW PLAYING: TRACK 1</span>
                                <span style={{ marginLeft: '20px' }}>NOW PLAYING: TRACK 1</span>
                            </div>
                        </div>
                        {/* Shimmer Effect */}
                        <div className="shimmer"></div>
                    </div>
                </div>
            </div>

            {/* Rotating Record - larger size */}
            <img
                src="/HomePage/Record3.png"
                alt="Vinyl Record"
                className="absolute"
                style={{
                    width: '316px',
                    height: '316px',
                    top: '34%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(90deg)`,
                    animation: isPlaying ? 'spin 2s linear infinite' : 'none',
                    zIndex: 1
                }}
            />

            {/* Tone Arm - larger and correctly positioned */}
            <svg
                onMouseDown={handleMouseDown}
                className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-grab transition-transform duration-700 ease-linear'}`}
                width="260"
                height="280"
                viewBox="0 0 613 1090"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    top: '79%',
                    left: '10%',
                    transformOrigin: '85% 16%',
                    transform: `rotate(${armRotation}deg)`,
                    zIndex: 2,
                    pointerEvents: isPlaying ? 'auto' : 'none' // Only interact when playing
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <g filter="url(#svg184878473_5813_filter0_i_585_2145)">
                    <rect x="135.521" y="968.233" width="17.5677" height="76.8585" rx="2.19596" transform="rotate(-29 135.521 968.233)" fill="url(#svg184878473_5813_paint0_linear_585_2145)"></rect>
                </g>
                <g filter="url(#svg184878473_5813_filter1_dddiiiii_585_2145)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M608.264 97.6849C610.531 92.0005 607.714 85.5594 602 83.3661L546.754 62.1593C541.104 59.9903 534.764 62.8027 532.58 68.4472L257.278 779.864C248.719 801.983 233.227 820.735 213.122 833.316L28.4191 948.891C22.5927 952.537 20.5475 960.049 23.7215 966.145L46.7257 1010.33C50.2723 1017.14 58.87 1019.49 65.3861 1015.42L270.195 887.655C290.032 875.281 305.4 856.897 314.063 835.181L608.264 97.6849Z" fill="url(#svg184878473_5813_paint1_linear_585_2145)"></path>
                </g>
                <defs>
                    <filter id="svg184878473_5813_filter0_i_585_2145" x="136.31" y="960.505" width="51.0488" height="74.1611" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                        <feOffset dy="-2.19596"></feOffset>
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.981884 0 0 0 0 0.981884 0 0 0 0 0.981884 0 0 0 0.8 0"></feColorMatrix>
                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_585_2145"></feBlend>
                    </filter>
                    <filter id="svg184878473_5813_filter1_dddiiiii_585_2145" x="-32.6681" y="10.9202" width="696.615" height="1065.79" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                        <feOffset dy="4.39192"></feOffset>
                        <feGaussianBlur stdDeviation="27.4495"></feGaussianBlur>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"></feColorMatrix>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_585_2145"></feBlend>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                        <feOffset></feOffset>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.580392 0 0 0 0 0.521569 0 0 0 0 0.407843 0 0 0 0.2 0"></feColorMatrix>
                        <feBlend mode="normal" in2="effect1_dropShadow_585_2145" result="effect2_dropShadow_585_2145"></feBlend>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                        <feOffset dy="-2.19596"></feOffset>
                        <feGaussianBlur stdDeviation="1.09798"></feGaussianBlur>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.847059 0 0 0 0 0.819608 0 0 0 0 0.764706 0 0 0 0.6 0"></feColorMatrix>
                        <feBlend mode="normal" in2="effect2_dropShadow_585_2145" result="effect3_dropShadow_585_2145"></feBlend>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_585_2145" result="shape"></feBlend>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                        <feOffset dx="13.1757" dy="13.1757"></feOffset>
                        <feGaussianBlur stdDeviation="3.29394"></feGaussianBlur>
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.937255 0 0 0 0 0.929412 0 0 0 0 0.909804 0 0 0 1 0"></feColorMatrix>
                        <feBlend mode="normal" in2="shape" result="effect4_innerShadow_585_2145"></feBlend>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                        <feOffset dx="6.58787" dy="2.19596"></feOffset>
                        <feGaussianBlur stdDeviation="3.29394"></feGaussianBlur>
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.811765 0 0 0 0 0.792157 0 0 0 0 0.760784 0 0 0 0.8 0"></feColorMatrix>
                        <feBlend mode="normal" in2="effect4_innerShadow_585_2145" result="effect5_innerShadow_585_2145"></feBlend>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                        <feOffset dx="-10.9798" dy="10.9798"></feOffset>
                        <feGaussianBlur stdDeviation="4.39192"></feGaussianBlur>
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0"></feColorMatrix>
                        <feBlend mode="normal" in2="effect5_innerShadow_585_2145" result="effect6_innerShadow_585_2145"></feBlend>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                        <feOffset dy="-4.39192"></feOffset>
                        <feGaussianBlur stdDeviation="3.29394"></feGaussianBlur>
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.700122 0 0 0 0 0.691476 0 0 0 0 0.661213 0 0 0 1 0"></feColorMatrix>
                        <feBlend mode="normal" in2="effect6_innerShadow_585_2145" result="effect7_innerShadow_585_2145"></feBlend>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                        <feOffset dy="-6.58787"></feOffset>
                        <feGaussianBlur stdDeviation="5.48989"></feGaussianBlur>
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.737255 0 0 0 0 0.713726 0 0 0 0 0.678431 0 0 0 0.5 0"></feColorMatrix>
                        <feBlend mode="normal" in2="effect7_innerShadow_585_2145" result="effect8_innerShadow_585_2145"></feBlend>
                    </filter>
                    <linearGradient id="svg184878473_5813_paint0_linear_585_2145" x1="135.521" y1="968.233" x2="135.521" y2="1045.09" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#464240"></stop>
                        <stop offset="0.088788" stopColor="#9B9997"></stop>
                        <stop offset="0.182644" stopColor="#433F3C"></stop>
                        <stop offset="0.295371" stopColor="#574E4B"></stop>
                        <stop offset="0.805873" stopColor="#5B5A55"></stop>
                        <stop offset="1" stopColor="#767772"></stop>
                    </linearGradient>
                    <linearGradient id="svg184878473_5813_paint1_linear_585_2145" x1="553.542" y1="-173.47" x2="123.217" y2="-202.061" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFFCFA"></stop>
                        <stop offset="1" stopColor="#EBEBEB"></stop>
                    </linearGradient>
                </defs>
            </svg>

            <style jsx>{`
                @keyframes spin {
                    from { transform: translate(-50%, -50%) rotate(90deg); }
                    to { transform: translate(-50%, -50%) rotate(450deg); }
                }
            `}</style>
        </div>
    );
};

export default RecordPlayer;