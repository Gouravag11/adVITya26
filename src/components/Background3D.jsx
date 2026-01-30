import { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';

const ParallaxBackground = () => {
    const { viewport } = useThree();
    const ref = useRef();
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event) => {
            // Normalize mouse position to -1 to 1
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame(() => {
        // Parallax effect using global mouse coordinates
        const x = (mouse.current.x * viewport.width) / 40;
        const y = (mouse.current.y * viewport.height) / 40;

        // Smooth interpolation
        if (ref.current) {
            ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x, 0.1);
            ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, y, 0.1);
        }
    });

    return (
        <Image
            ref={ref}
            url="/Herosection_BG.svg"
            scale={[viewport.width * 1.2, viewport.height * 1.2, 1]}
            transparent
            opacity={0.5}
        />
    );
};

const Background3D = () => {
    return (
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-[#0F041C]">
            <Canvas>
                <Suspense fallback={null}>
                    <ParallaxBackground />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Background3D;
