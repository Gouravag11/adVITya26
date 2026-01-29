import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Cloud } from '@react-three/drei';

const SmokeOverlay = ({ variant = 'default' }) => {
    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-50 contrast-125 saturate-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ alpha: true }}>
                <ambientLight intensity={0.8} />

                {variant === 'default' ? (
                    <>
                        {/* Background Layer */}
                        <Cloud
                            opacity={0.4}
                            speed={0.2}
                            width={25}
                            depth={1.5}
                            segments={20}
                            position={[0, 0, -5]}
                        />

                        {/* Foreground Layer (Subtle) */}
                        <Cloud
                            opacity={0.3}
                            speed={0.15}
                            width={15}
                            depth={2}
                            segments={15}
                            position={[0, -2, 0]}
                        />
                    </>
                ) : (
                    <>
                        {/* Left Bottom */}
                        <Cloud
                            opacity={0.09}
                            speed={0.3}
                            width={10}
                            depth={1}
                            segments={15}
                            position={[-9, -4, -2]}
                        />

                        {/* Top Center */}
                        <Cloud
                            opacity={0.3}
                            speed={0.2}
                            width={12}
                            depth={1}
                            segments={15}
                            position={[0, 4.5, -3]}
                        />

                        {/* Right */}
                        <Cloud
                            opacity={0.3}
                            speed={0.3}
                            width={10}
                            depth={1}
                            segments={15}
                            position={[9, 0, -2]}
                        />
                    </>
                )}
            </Canvas>
        </div>
    );
};

export default SmokeOverlay;
