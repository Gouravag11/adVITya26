import React, { useRef, useEffect, useState } from 'react';

const PaintReveal = ({ baseSrc, revealSrc, className }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const revealImgRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        const img = new Image();
        img.src = revealSrc;
        img.onload = () => {
            revealImgRef.current = img;
            setIsLoaded(true);
        };
    }, [revealSrc]);

    useEffect(() => {
        if (!isLoaded || !canvasRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;

        const handleResize = () => {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [isLoaded]);

    const drawBrush = (x, y) => {
        const canvas = canvasRef.current;
        const img = revealImgRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext('2d');

        ctx.save();
        ctx.beginPath();

        const radius = 40;
        const scatter = 15;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * scatter + radius * 0.5;
            const r = Math.random() * radius * 0.4 + 5;
            ctx.moveTo(x + Math.cos(angle) * dist + r, y + Math.sin(angle) * dist);
            ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, r, 0, Math.PI * 2);
        }

        ctx.clip();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        ctx.restore();
    };

    const handleMouseMove = (e) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        drawBrush(x, y);
    };

    return (
        <div ref={containerRef} className={`relative select-none ${className}`} onMouseMove={handleMouseMove}>
            <img
                src={baseSrc}
                alt="Base"
                className="w-full h-full object-contain pointer-events-none"
                style={{ display: 'block' }}
            />
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />
        </div>
    );
};

export default PaintReveal;
