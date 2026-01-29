import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Settings, ShoppingBag, LayoutGrid, MapPin, Bell, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import SmokeOverlay from '../components/SmokeOverlay';
import RecordPlayer from '../components/RecordPlayer';
import PaintReveal from '../components/PaintReveal';
import { Link } from 'react-router-dom';
import ExploreSection from '../components/Home/ExploreSection';
import NavButton from '../components/Home/NavButton';
import RevealText from '../components/Home/RevealText';
import BookingCard from '../components/Home/BookingCard';
import MusicTrigger from '../components/Home/MusicTrigger';
import VolumeControl from '../components/Home/VolumeControl';

gsap.registerPlugin(ScrollTrigger);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut",
  },
};


export default function Home() {


  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(0.5);
  const [isPlayerHovered, setIsPlayerHovered] = React.useState(false);
  const audioRef = React.useRef(null);
  const [selectedYear, setSelectedYear] = React.useState('2026');

  const wrapperRef = React.useRef(null);
  const pinnedRef = React.useRef(null);
  const lyricsWrapperRef = React.useRef(null);
  const mainContentRef = React.useRef(null);
  const lyricsContainerRef = React.useRef(null);
  const lyricsContentRef = React.useRef(null);
  const linesRef = React.useRef([]);

  const heroContentRef = React.useRef(null);
  const titleRef = React.useRef(null);
  const scrollTextRef = React.useRef(null);
  const videoWrapperRef = React.useRef(null);
  const yearSelectionRef = React.useRef(null);

  React.useEffect(() => {
    audioRef.current = new Audio("/HomePage/Music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  React.useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useGSAP(() => {
    if (!wrapperRef.current || !pinnedRef.current || !lyricsContentRef.current || !lyricsWrapperRef.current || !mainContentRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    gsap.set(lyricsWrapperRef.current, { y: "120%", opacity: 0 });
    gsap.set(mainContentRef.current, { y: 100 });
    if (yearSelectionRef.current) {
      gsap.set(yearSelectionRef.current, { autoAlpha: 0, y: 50, scale: 0.9 });
    }
    const contentHeight = lyricsContentRef.current.offsetHeight;
    const containerHeight = lyricsContainerRef.current ? lyricsContainerRef.current.offsetHeight : 500;
    const lines = linesRef.current.filter(l => l);
    const lastLine = lines[lines.length - 1];
    let targetY = -(contentHeight - containerHeight);

    if (lastLine) {
      const lastLineCenter = lastLine.offsetTop + (lastLine.offsetHeight / 2);
      const containerCenter = containerHeight / 2;
      targetY = containerCenter - lastLineCenter;
    }

    tl.to(mainContentRef.current, {
      y: 0,
      duration: 2,
      ease: "power2.out"
    }, "entry");

    tl.to(lyricsWrapperRef.current, {
      y: "0%",
      opacity: 1,
      duration: 2,
      ease: "power2.out"
    }, "entry");

    tl.to(lyricsContentRef.current, {
      y: targetY,
      duration: 8,
      ease: "none"
    });

    // This one is for scaling down the hero content as we approach title
    if (titleRef.current && heroContentRef.current) {
      gsap.to(heroContentRef.current, {
        scale: 0.6,
        ease: "none",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top bottom",
          end: "top top",
          scrub: true
        }
      });
    }

    if (titleRef.current && scrollTextRef.current && videoWrapperRef.current) {
      const titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top top",
          end: "+=3000",
          scrub: 1,
          pin: true,
        }
      });

      titleTl.fromTo(scrollTextRef.current,
        {
          x: () => window.innerWidth / 2
        },
        {
          x: () => {
            const containerWidth = scrollTextRef.current.scrollWidth;
            const videoWidth = videoWrapperRef.current.offsetWidth;
            return (window.innerWidth / 2) + (videoWidth / 2) - containerWidth;
          },
          duration: 1,
          ease: "none"
        }
      );
      titleTl.to(videoWrapperRef.current, {
        scale: () => {
          const videoWidth = videoWrapperRef.current.offsetWidth;
          const videoHeight = videoWrapperRef.current.offsetHeight;
          const scaleX = window.innerWidth / videoWidth;
          const scaleY = window.innerHeight / videoHeight;
          return Math.max(scaleX, scaleY) * 1.2;
        },
        borderRadius: 0,
        duration: 1,
        ease: "power2.inOut"
      });
      if (yearSelectionRef.current) {
        titleTl.to(yearSelectionRef.current, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)"
        });
      }
    }

  }, { scope: wrapperRef });

  return (
    <>
      <div className="bg-black w-screen relative">
        <div ref={pinnedRef} className="fixed inset-0 w-screen h-screen px-6 py-6 overflow-hidden z-0">
          <SmokeOverlay variant="corners" />

          <div ref={heroContentRef} className="w-full h-full">
            <motion.div
              className='bg-[#1f1f1f] flex gap-5 py-5 px-20 w-full h-full rounded-4xl relative z-10'
              initial="hidden"
              animate={["visible", "float"]}
              variants={{
                hidden: { opacity: 0, scale: 0.95, y: 30 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: "easeOut",
                    when: "beforeChildren",
                    staggerChildren: 0.1
                  }
                },
                float: {
                  y: [0, -10, 0],
                  transition: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8
                  }
                }
              }}
            >
              <img src="/HomePage/TopBG.png" alt="" className='mx-auto absolute w-60 top-4 z-40 left-1/2 -translate-x-1/2' />
               <Link to="/" className="mx-auto absolute top-4 z-50 left-1/2 -translate-x-1/2">
                    <img
                      src="Images/AdvityaLogo.png"
                      alt="VIT Bhopal"
                      className={`w-auto transition-all duration-300 h-10 sm:h-12`}
                    />
                  </Link>
              <motion.div
                className="absolute inset-0 flex gap-5 py-5 px-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* <motion.div variants={itemVariants} className='w-32 h-full bg-black rounded-4xl flex flex-col items-center py-10 pt-30 z-20'>

                            <div className="flex flex-col gap-6 items-center w-full">
                                {[User, Settings, ShoppingBag, LayoutGrid, MapPin, Bell].map((Icon, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        className="p-3 rounded-full text-stone-400 hover:bg-white hover:text-black transition-all cursor-pointer"
                                    >
                                        <Icon size={20} />
                                    </motion.div>
                                ))}
                            </div>
                            <motion.div variants={itemVariants} className="mt-auto mb-4">
                                <div className="p-3 rounded-full text-stone-400 hover:bg-white hover:text-black transition-all cursor-pointer">
                                    <LogOut size={20} />
                                </div>
                            </motion.div>
                        </motion.div> */}

                <div className='relative w-full h-full flex' onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const pct = (x / rect.width) * 100;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-pct', `${pct}%`);
                }}>
                 
                  <div
                    className="absolute inset-0 z-20 pointer-events-none rounded-4xl opacity-40 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(1000px circle at var(--mouse-x, 50%) -20%, rgba(255,255,255,0.15), transparent 60%)`
                    }}
                  />

                  <img src="/HomePage/BG.png" alt="BG" className='w-full h-full absolute shadow-lg rounded-4xl ' />

                  <div className='w-96 h-full z-10 flex flex-col'>
                    <div className='w-full h-full max-h-[70%] flex py-6 px-4 flex-col relative'>
                      <motion.div variants={itemVariants} className='flex gap-4 text-white font-medium'>
                        <NavButton>Events</NavButton>
                        <NavButton>Sports</NavButton>
                        <NavButton>Sponsor US</NavButton>
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        className='flex justify-end w-full h-full py-4'
                        onMouseEnter={() => setIsPlayerHovered(true)}
                        onMouseLeave={() => setIsPlayerHovered(false)}
                      >
                        <RecordPlayer isPlaying={isPlaying} audioRef={audioRef} isHovered={isPlayerHovered} onTogglePlay={() => setIsPlaying(!isPlaying)} />
                      </motion.div>
                    </div>

                    <div className='w-full h-[35%] bg-[#1f1f1f] rounded-tr-3xl pt-3 pr-3 relative group'>
                      <BookingCard variants={itemVariants} />
                    </div>
                  </div>
                  <div className='w-full h-full z-10 px-10 pt-24 relative flex flex-col gap-4 overflow-hidden'>
                    <MusicTrigger isPlaying={isPlaying} onClick={() => setIsPlaying(!isPlaying)} />
                    <motion.div
                      initial={{ opacity: 0, x: 20, clipPath: 'inset(0 0 0 100%)' }}
                      animate={{
                        opacity: isPlayerHovered && !isPlaying ? 1 : 0,
                        x: isPlayerHovered && !isPlaying ? 0 : 20,
                        clipPath: isPlayerHovered && !isPlaying ? 'inset(0 0 0 0%)' : 'inset(0 0 0 100%)'
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="absolute top-10 right-20 z-50 px-4 py-2 rounded-lg text-white text-xs font-medium pointer-events-none whitespace-nowrap"
                    >
                      Turn on music for the best experience
                    </motion.div>
                    <div ref={mainContentRef} className='flex flex-col text-white z-20 relative'>
                      <motion.div variants={itemVariants} className='text-xl relative top-8 font-bold uppercase tracking-wide flex gap-3'>
                        <RevealText text="VIT Bhopal" />
                        <span className="text-purple-500">
                          <RevealText text="Presents" delay={0.5} />
                        </span>
                      </motion.div>
                      <PaintReveal
                        baseSrc="/HomePage/TitleImage.png"
                        revealSrc="/HomePage/TitleLayer.png"
                        className="my-2 w-full transition-transform duration-500 ease-out"
                      />

                      <motion.div variants={itemVariants} className='text-2xl font-bold text-right tracking-tight'>
                        <RevealText text="LOREM IMPSUM DOR" delay={0.5} />
                      </motion.div>
                    </div>
                    <div ref={lyricsWrapperRef} className='bg-neutral-800/20 border-t border-x border-white/40 backdrop-blur-xs rounded-t-4xl p-6 w-full h-full overflow-hidden flex flex-col relative z-20'>
                      <div className='text-white w-42 mx-auto border-b border-white text-center mb-4 z-10 font-semibold tracking-wider text-sm uppercase'>
                        Explore AdVITya
                      </div>
                      <ExploreSection
                        containerRef={lyricsContainerRef}
                        contentRef={lyricsContentRef}
                        linesRef={linesRef}
                        isPlaying={isPlaying}
                        audioRef={audioRef}
                      />
                    </div>
                  </div>
                </div>
                <div className='flex flex-col gap-6 h-full w-full max-w-58 z-20'>
                  <motion.div variants={itemVariants} className='w-full h-full max-h-[40%] text-white'>
                    <div className='rounded-4xl bg-black w-full h-full overflow-hidden relative border border-white/10'>
                      <video
                        src="/HomePage/Video.mp4"
                        className="w-full h-full object-cover opacity-80 mix-blend-screen"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 pointer-events-none" />
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className='w-full h-full'>
                    <VolumeControl volume={volume} setVolume={setVolume} />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div ref={wrapperRef} className="w-screen relative min-h-[300vh] pointer-events-none z-10" />

        <div ref={titleRef} className="h-screen bg-black/50 backdrop-blur-2xl relative z-20 flex items-center overflow-hidden">
          <div ref={scrollTextRef} className="flex gap-20 items-center whitespace-nowrap relative">
            <div className='text-[10vw] text-white font-fugaz font-bold leading-none'>
              Central India's Largest Fest
            </div>
            <div ref={videoWrapperRef} className='w-96 h-40 rounded-4xl transition-all duration-200 overflow-hidden shrink-0 relative z-10'>
              <video src='/HomePage/Video.mp4' autoPlay muted loop className="w-full h-full object-cover" />
            </div>
          </div>
          <motion.div
            ref={yearSelectionRef}
            className="absolute bottom-20 max-w-xl left-20 w-full  z-50 flex justify-center"
          >
            <div className="rounded-full text-white flex gap-2 w-full max-w-2xl backdrop-blur-md border border-white">
              {['2026', '2025', '2024'].map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`flex-1 py-3 rounded-full text-lg hover:bg-full font-semibold transition-all duration-300`}
                  style={selectedYear === year ? { border: 'white 2px solid', color: 'white' } : {}}
                  onMouseEnter={(e) => {
                    if (selectedYear !== year) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedYear !== year) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <div></div>
      </div>
    </>
  );
}
