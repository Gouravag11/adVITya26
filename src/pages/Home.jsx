import React, { useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Settings, ShoppingBag, LayoutGrid, MapPin, Bell, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
import EventsSection from '../components/Home/EventsSection';
import { Activity } from 'lucide-react';
gsap.registerPlugin(ScrollTrigger);


const items = [
  {
    id: '01',
    title: 'Bike Stunt Show',
    description: "Hold your breath as fearless riders pull off crazy stunts, wheelies, and jaw-dropping moves that'll leave you cheering for more!",
    color: '#E0B0FF',
    image: '/Events/BikeStunt.jpg'
  },
  {
    id: '02',
    title: 'Live Caricature',
    description: "Watch personalities come to life as artist sketch playful caricatures live - quick, creative, & full of smiles!",
    color: '#FFB0E0',
    image: '/Events/LiveCaricature.jpg'
  },
  {
    id: '03',
    title: 'Mechanical Bull Ride',
    description: "Think you can stay on? Jump on the mechanical bull and see how long you can ride before gravity wins!",
    color: '#B0E0FF',
    image: '/Events/MechanicalBull.jpg'
  },
  {
    id: '04',
    title: 'Soapy Soccer',
    description: "Soccer.. but make it slippery? Slide, Slip, fall, laugh, and score in this wildly fun soapy showdown.",
    color: '#B0FFE0',
    image: '/Events/Soapy.jpeg'
  },
  {
    id: '05',
    title: 'Photo Booth',
    description: "Strike a pose, grab some props, and click away! This photo booth is your go-to-spot for fun pics and unforgettable memories.",
    color: '#FFFFB0',
    image: '/Events/PhotoBooth.jpeg'
  }
];
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
  const [hoveredYear, setHoveredYear] = React.useState(null);

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
  const heroVideoRef = React.useRef(null);
  const pulseRef = React.useRef(null);

  const [activeItem, setActiveItem] = useState(items[0]);
  React.useEffect(() => {
    audioRef.current = new Audio("/HomePage/Music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    // Preload all event images
    items.forEach(item => {
      const img = new Image();
      img.src = item.image;
    });

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
          end: "+=2500", // Reduced for tighter transition to Events
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

  useGSAP(() => {
    const pulseItems = gsap.utils.toArray('.pulse-item');
    pulseItems.forEach((item, i) => {
      ScrollTrigger.create({
        trigger: item,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveItem(items[i]),
        onEnterBack: () => setActiveItem(items[i])
      });
    });
  }, { scope: pulseRef });

  return (
    <>
      <div className="bg-[#12001A] w-screen relative">
        <div ref={pinnedRef} className="fixed inset-0 w-screen min-h-screen lg:h-screen px-4 sm:px-6 overflow-hidden z-0">
          {/* <SmokeOverlay variant="corners" /> */}

          <div ref={heroContentRef} className="w-full h-full">
            <motion.div
              className='bg-[#12001A] flex flex-col lg:flex-row gap-5 py-5 px-4 sm:px-8 lg:px-20 w-full h-full rounded-4xl relative z-10'
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
              <img src="/HomePage/TopBG.png" alt="" className='mx-auto absolute w-60 top-0 z-40 left-1/2 -translate-x-1/2' />
              <Link to="/" className="mx-auto absolute top-4 z-50 left-1/2 -translate-x-1/2">
                <img
                  src="Images/AdvityaLogo.png"
                  alt="VIT Bhopal"
                  className={`w-auto transition-all duration-300 h-10 sm:h-12`}
                />
              </Link>
              <motion.div
                className="absolute inset-0 flex flex-col lg:flex-row gap-5 py-5 px-4 sm:px-6"
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

                <div className='relative bg-[#735483]/20 border-r-2 border-l-2 border-b-2  border-[#EFD2FF] rounded-4xl backdrop-blur-xl w-full h-full flex' onMouseMove={(e) => {
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

                  {/* <img src="/HomePage/Background.png" alt="BG" className='w-full h-full absolute shadow-lg rounded-4xl opacity-60' /> */}

                  <div className='hidden lg:flex w-96 h-full z-10 flex-col'>
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

                    <div className='w-full h-[35%] -left-[2px] -bottom-[2px] border-t-2 border-r-2 border-[#EFD2FF] bg-[#12001A] rounded-tr-3xl pt-3 pr-3 relative group'>
                      <BookingCard variants={itemVariants} />
                    </div>
                  </div>
                  <div className='w-full lg:flex-1 h-full z-10 px-4 sm:px-6 lg:px-10 pt-16 sm:pt-20 lg:pt-24 relative flex flex-col gap-4 overflow-hidden'>
                    <MusicTrigger isPlaying={isPlaying} onClick={() => setIsPlaying(!isPlaying)} />
                    <motion.div
                      initial={{ opacity: 0, x: 20, clipPath: 'inset(0 0 0 100%)' }}
                      animate={{
                        opacity: isPlayerHovered && !isPlaying ? 1 : 0,
                        x: isPlayerHovered && !isPlaying ? 0 : 20,
                        clipPath: isPlayerHovered && !isPlaying ? 'inset(0 0 0 0%)' : 'inset(0 0 0 100%)'
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="absolute top-10 right-4 lg:right-20 z-50 px-4 py-2 rounded-lg text-white text-xs font-medium pointer-events-none whitespace-nowrap hidden lg:block"
                    >
                      Turn on music for the best experience
                    </motion.div>
                    <div ref={mainContentRef} className='flex flex-col text-white z-20 relative'>
                      <motion.div variants={itemVariants} className='text-base sm:text-lg lg:text-xl relative top-0 font-bold uppercase tracking-wide flex flex-wrap gap-2 sm:gap-3'>
                        <RevealText text="VIT Bhopal" />
                        <span className="text-[#EFD2FF]">
                          <RevealText text="Presents" delay={0.5} />
                        </span>
                      </motion.div>
                      <PaintReveal
                        baseSrc="/HomePage/TitleImage.png"
                        revealSrc="/HomePage/TitleLayer.png"
                        className="my-2 w-full transition-transform duration-500 ease-out"
                      />

                      <motion.div variants={itemVariants} className='text-2xl font-bold text-right tracking-tight'>
                        <RevealText text="Feel the Enigma" delay={0.5} />
                      </motion.div>
                    </div>
                    <div ref={lyricsWrapperRef} className='bg-neutral-800/20 border-t border-x border-white/40 backdrop-blur-xs rounded-t-4xl p-4 sm:p-6 w-full h-full overflow-hidden flex flex-col relative z-20'>
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
                <div className='hidden lg:flex flex-col gap-6 h-full w-full max-w-58 z-20'>
                  <motion.div ref={heroVideoRef} variants={itemVariants} className='w-full h-full max-h-[40%] text-white'>
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

        <div ref={titleRef} className="min-h-[60vh] lg:h-screen bg-[#12001A] relative z-20 flex items-center overflow-hidden">
          <img src="/HomePage/TitleVector.png" alt="Title Vector" className="w-full h-full absolute top-0" />
          <div ref={scrollTextRef} className="flex gap-8 sm:gap-12 lg:gap-20 items-center whitespace-nowrap relative">
            <img src="/HomePage/TitleStar.svg" alt="Star" className='w-12 sm:w-16 lg:w-24 absolute -left-8 sm:-left-12 lg:-left-16 -top-10 sm:-top-14 lg:-top-18 hidden sm:block' />
            <img src="/HomePage/TitleStar2.svg" alt="Star" className='w-24 sm:w-40 lg:w-56 absolute left-1/2 -translate-x-1.2 top-20 sm:top-32 lg:top-40 hidden sm:block' />
            <div className='text-[10vw] text-[#EFD2FF] font-fugaz font-bold leading-none'>
              Central India's Largest Fest
            </div>
            <div ref={videoWrapperRef} className='w-48 sm:w-64 lg:w-96 h-20 sm:h-28 lg:h-40 rounded-2xl lg:rounded-4xl transition-all duration-200 overflow-hidden shrink-0 relative z-10'>
              <video src='/HomePage/Video.mp4' autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
          </div>
          <motion.div
            ref={yearSelectionRef}
            className="absolute bottom-10 sm:bottom-16 lg:bottom-20 max-w-xs sm:max-w-sm lg:max-w-lg left-4 sm:left-10 lg:left-20 w-full z-50 flex justify-center"
          >
            <div
              className="rounded-full text-white flex w-full max-w-2xl backdrop-blur-md border border-white relative isolate overflow-hidden"
              onMouseLeave={() => setHoveredYear(null)}
            >
              <motion.div
                className={`absolute top-0 h-full -z-10 rounded-full transition-colors duration-300 ${hoveredYear && hoveredYear !== selectedYear ? 'bg-neutral-500' : 'bg-white'
                  }`}
                initial={false}
                animate={{
                  width: (() => {
                    const years = ['2026', '2025', '2024'];
                    const sIndex = years.indexOf(selectedYear);
                    const hIndex = hoveredYear ? years.indexOf(hoveredYear) : sIndex;
                    const minIndex = Math.min(sIndex, hIndex);
                    const maxIndex = Math.max(sIndex, hIndex);
                    return `${((maxIndex - minIndex + 1) / 3) * 100}%`;
                  })(),
                  left: (() => {
                    const years = ['2026', '2025', '2024'];
                    const sIndex = years.indexOf(selectedYear);
                    const hIndex = hoveredYear ? years.indexOf(hoveredYear) : sIndex;
                    const minIndex = Math.min(sIndex, hIndex);
                    return `${(minIndex / 3) * 100}%`;
                  })()
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              {['2026', '2025', '2024'].map((year) => {
                const isHoveringOther = hoveredYear && hoveredYear !== selectedYear;
                const isSelected = year === selectedYear;
                const textColor = isSelected && !isHoveringOther ? 'text-black' : 'text-white';

                return (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    onMouseEnter={() => setHoveredYear(year)}
                    className={`flex-1 py-3 rounded-full text-lg font-semibold transition-colors duration-300 ${textColor} z-10`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 right-10 md:bottom-20 md:right-20 z-50 mix-blend-difference"
          >
            <div className="w-[26px] h-[44px] border-2 border-white rounded-full flex justify-center pt-2 opacity-80">
              <motion.div
                className="w-1 h-2 bg-white rounded-full"
                animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>

        <div ref={pulseRef} className="w-full -top-1 bg-[#0d0015] text-white py-20 pb-0 px-6 md:px-20 relative z-30">
          {/* Title */}
          <div className="max-w-7xl mx-auto text-[#EFD2FF] w-full mb-16 flex items-center justify-start gap-4 md:gap-6 flex-wrap">
            <span className="text-4xl font-fugaz md:text-6xl">The Pulse</span>
            <div className="relative">
              <div className="absolute inset-0 bg-neutral-600 rounded-xl md:rounded-2xl hover:rotate-0 transition-transform duration-300 transform -rotate-12 translate-x-1 translate-y-1" />
              <div className="relative bg-[#E6D4FF] p-2 md:p-3 rounded-xl md:rounded-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-300 shadow-lg shadow-purple-500/20">
                <Activity className="text-black w-8 h-8 md:w-12 md:h-12 stroke-[3]" />
              </div>
            </div>
            <span className="text-4xl font-fugaz md:text-6xl">of Central India</span>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto w-full relative">

            {/* List */}
            <div className="w-full flex flex-col z-10 relative">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="pulse-item group relative border-b border-white/10 py-8 cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setActiveItem(item)}
                >
                  <div className="flex gap-6 md:gap-10 items-start max-w-full lg:max-w-[60%]">
                    <span className={`text-4xl md:text-5xl font-bold transition-colors duration-300 ${activeItem.id === item.id ? 'text-[#EFD2FF] opacity-100' : 'text-white/30 group-hover:text-white/60'}`}>
                      {item.id}
                    </span>
                    <div className="flex flex-col gap-2">
                      <h3 className={`text-2xl md:text-3xl font-bold transition-all duration-300 ${activeItem.id === item.id ? 'text-[#EFD2FF]' : 'text-[#EFD2FF] group-hover:text-[#EFD2FF]'}`}>
                        {item.title}
                      </h3>
                      <p className="text-[#EFD2FF]/60 text-sm md:text-base leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  {activeItem.id === item.id && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent -z-10 rounded-lg blur-xl opacity-50"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Sticky Image/Preview Card Container - Hidden on mobile */}
            <div className="hidden lg:block w-full lg:w-2/5 lg:absolute lg:top-0 lg:right-0 lg:h-full z-20 pointer-events-none">
              <div className="sticky top-20 w-full h-[500px] flex items-center justify-center pointer-events-auto">
                <div className="w-full max-w-sm aspect-[4/5] rounded-3xl shadow-2xl relative overflow-hidden">
                  {/* All images preloaded and stacked - only active one visible */}
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`absolute inset-0 transition-opacity duration-200 ease-out ${activeItem.id === item.id ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20" />

                  {/* Title overlay */}
                  <div className="absolute bottom-6 left-6 right-6 z-30">
                    <span className="text-white font-bold text-xl transition-opacity duration-200">
                      {activeItem.title}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Events Section */}
        <EventsSection />
      </div>
    </>
  );
}