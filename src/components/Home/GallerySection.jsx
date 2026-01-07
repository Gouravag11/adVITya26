import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GallerySection = () => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);

    const desktopImage1Ref = useRef(null);
    const desktopImage2Ref = useRef(null);
    const desktopImage3Ref = useRef(null);
    const desktopShadowRef = useRef(null);

    const mobileImage1Ref = useRef(null);
    const mobileImage2Ref = useRef(null);
    const mobileImage3Ref = useRef(null);
    const mobileShadowRef = useRef(null);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        const text = textRef.current;

        const image1 = isMobile ? mobileImage1Ref.current : desktopImage1Ref.current;
        const image2 = isMobile ? mobileImage2Ref.current : desktopImage2Ref.current;
        const image3 = isMobile ? mobileImage3Ref.current : desktopImage3Ref.current;
        const purpleShadow = isMobile ? mobileShadowRef.current : desktopShadowRef.current;

        if (!image1 || !image2 || !image3 || !purpleShadow) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(text,
                { x: '100%' },
                {
                    x: '-120%',
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom center',
                        scrub: 1,
                    }
                }
            );

            gsap.fromTo(image1,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: image1,
                        start: 'top 80%',
                        end: 'top 50%',
                        scrub: 1,
                    }
                }
            );

            gsap.fromTo(purpleShadow,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: image1,
                        start: 'top 80%',
                        end: 'top 50%',
                        scrub: 1,
                    }
                }
            );

            gsap.fromTo(image2,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: image2,
                        start: 'top 80%',
                        end: 'top 50%',
                        scrub: 1,
                    }
                }
            );

            gsap.fromTo(image3,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: image3,
                        start: 'top 80%',
                        end: 'top 50%',
                        scrub: 1,
                    }
                }
            );

            if (isMobile) {
                gsap.set(purpleShadow, {
                    top: 0,
                    right: '1.75rem',
                    left: 'auto',
                    x: 0,
                    y: 0
                });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 0.5,
                    }
                });

                tl.to(purpleShadow, {
                    y: '15rem',
                    x: '-5rem',
                    ease: "none"
                })
                    .to(purpleShadow, {
                        y: '30rem',
                        x: '0rem',
                        ease: "none"
                    });
            }
        }, sectionRef);

        if (!isMobile) {
            const handleImage1Hover = () => {
                gsap.to(purpleShadow, {
                    top: '0rem',
                    x: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            };

            const handleImage2Hover = () => {
                gsap.to(purpleShadow, {
                    top: '20rem',
                    x: '-60%',
                    duration: 0.5,
                    ease: "power2.out"
                });
            };

            const handleImage3Hover = () => {
                gsap.to(purpleShadow, {
                    top: '40rem',
                    x: '20%',
                    duration: 0.5,
                    ease: "power2.out"
                });
            };

            image1.addEventListener('mouseenter', handleImage1Hover);
            image2.addEventListener('mouseenter', handleImage2Hover);
            image3.addEventListener('mouseenter', handleImage3Hover);

            return () => {
                ctx.revert();
                image1.removeEventListener('mouseenter', handleImage1Hover);
                image2.removeEventListener('mouseenter', handleImage2Hover);
                image3.removeEventListener('mouseenter', handleImage3Hover);
            };
        }

        return () => {
            ctx.revert();
        };
    }, [isMobile]);

    const images = [
        "/Image1.svg",
        "/Image2.svg",
        "/Image3.svg"
    ];

    return (
        <div ref={sectionRef} className="relative z-30 w-full min-h-screen overflow-hidden py-10 sm:py-20">
            <div className="w-full mb-6 sm:mb-10 overflow-hidden whitespace-nowrap">
                <h2
                    ref={textRef}
                    className="text-5xl sm:text-6xl md:text-9xl font-bold text-[#6F00A0] opacity-50 leading-none"
                    style={{ whiteSpace: 'nowrap' }}
                >
                    GLIMPSE FROM '24 GLIMPSE FROM '24 GLIMPSE FROM '24
                </h2>
            </div>

            <div className="hidden md:block relative mt-40 z-10">
                <div className="relative flex justify-center items-center flex-col">
                    <div
                        ref={desktopImage1Ref}
                        className="w-[320px] md:w-[400px] h-[320px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20"
                    >
                        <img src={images[0]} alt="Gallery 1" className="w-full h-full object-cover" />
                    </div>
                    <div
                        ref={desktopShadowRef}
                        className="w-[320px] md:w-[400px] h-[320px] md:h-[400px] rounded-3xl bg-[#6F00A0] top-0 ml-5 mt-5 absolute -z-10"
                    >
                    </div>
                    <div
                        ref={desktopImage2Ref}
                        className="w-[320px] md:w-[400px] h-[320px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 -left-60 -top-20 relative"
                    >
                        <img src={images[2]} alt="Gallery 3" className="w-full h-full object-cover" />
                    </div>
                    <div
                        ref={desktopImage3Ref}
                        className="w-[320px] md:w-[400px] h-[320px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 -right-20 -top-40 relative"
                    >
                        <img src={images[1]} alt="Gallery 2" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            <div className="md:hidden relative mt-20 z-10">
                <div className="relative flex justify-center items-center flex-col">
                    <div
                        ref={mobileImage1Ref}
                        className="w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 relative right-1 sm:right-16"
                    >
                        <img src={images[0]} alt="Gallery 1" className="w-full h-full object-cover" />
                    </div>
                    <div
                        ref={mobileShadowRef}
                        className="w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] rounded-3xl bg-[#6F00A0] top-0 right-7 sm:right-13 mt-3 absolute -z-10"
                    >
                    </div>
                    <div
                        ref={mobileImage2Ref}
                        className="w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 -left-10 sm:-left-16 -top-10 sm:-top-12 relative"
                    >
                        <img src={images[2]} alt="Gallery 3" className="w-full h-full object-cover" />
                    </div>
                    <div
                        ref={mobileImage3Ref}
                        className="w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 -right-10 sm:-right-16 -top-20 sm:-top-24 relative"
                    >
                        <img src={images[1]} alt="Gallery 2" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GallerySection;