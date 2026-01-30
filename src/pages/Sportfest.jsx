'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';

const HeaderSpacer = ({ onHeightChange }) => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const header = document.getElementById('main-header');
      if (header) {
        const h = header.offsetHeight;
        setHeight(h);
        onHeightChange(h);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [onHeightChange]);

  return (
    <div
      className="fixed left-0 right-0 top-0 z-40 pointer-events-none"
      style={{ height }}
      aria-hidden
    />
  );
};

const SportCard = ({ sport, onReadMore }) => {
  return (
    <div
      className="bg-[#1A0A28] rounded-4xl p-2 border border-white/10 shadow-lg hover:border-purple-500/50 transition-all duration-300 group"
    >
      <div className="rounded-2xl overflow-hidden mb-4 h-48 bg-white/5 relative">
        <img
          src={sport.image}
          alt={sport.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-1 font-poppins">
          {sport.name}
        </h3>

        <p className="text-xs text-purple-300 mb-2 capitalize font-poppins">
          {sport.category}
        </p>

        <p className="text-xs text-gray-400 mb-1 font-poppins">
          <span className="font-semibold">Format:</span>{' '}
          {sport.details[0].replace('Format: ', '')}
        </p>

        <p className="text-xs text-gray-400 mb-1 font-poppins">
          <span className="font-semibold">Venue:</span>{' '}
          Sports Complex
        </p>

        <p className="text-xs text-gray-400 mb-3 font-poppins">
          <span className="font-semibold">Date:</span>{' '}
          21 Feb 2025 • <span className="font-semibold">Time:</span>{' '}
          10:00 AM
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(sport.registerLink, '_blank');
          }}
          className="w-full bg-purple-400/80 hover:bg-purple-400 transition text-black font-semibold py-3 rounded-xl font-poppins"
        >
          Register Now
        </button>
      </div>
    </div>
  );
};

const SportModal = ({ sport, onClose, isMobile }) => {
  if (!sport) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-poppins">
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      <div className={`relative bg-[#0F041C] rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto ${isMobile ? 'w-[95%] max-w-md' : 'w-[90%] max-w-4xl'}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#1A0A28] rounded-full flex items-center justify-center text-white hover:bg-[#2F2F2F] transition"
        >
          ✕
        </button>

        <div className={`${isMobile ? 'flex flex-col' : 'flex flex-row'}`}>
          <div className={`${isMobile ? 'w-full' : 'w-2/5'} p-6`}>
            <div className="bg-[#1A0A28] rounded-2xl p-4 border border-white/10">
              <div className="rounded-xl overflow-hidden mb-4 relative">
                <img
                  src={sport.image}
                  alt={sport.name}
                  className="w-full h-48 object-cover"
                />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                {sport.name}
              </h3>

              <p className="text-sm text-gray-400">
                Experience the thrill of {sport.name} at AdVITya'26. Join us for an exciting competition featuring skilled players from various colleges.
              </p>
            </div>
          </div>

          <div className={`${isMobile ? 'w-full' : 'w-3/5'} p-6`}>
            <div className={`flex flex-wrap gap-4 mb-6 text-sm text-gray-300 ${isMobile ? 'justify-start' : ''}`}>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>21 February 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>10:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Sports Complex</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-4 mb-6">
              <div className="flex gap-4 text-sm border-b border-white/10 pb-2 mb-4">
                <span className="text-purple-400 font-semibold">SPORT INFORMATION</span>
                <span className="text-gray-400">SPORTS CLUB</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-purple-400 font-semibold mb-2">EVENT FEATURES</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    {sport.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <a
                href={sport.registerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#C4A8D8] hover:bg-[#D4B8E8] text-gray-900 font-semibold px-6 py-3 rounded-xl transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                REGISTER
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SportSkeleton = () => (
  <div className="bg-[#1A0A28] rounded-2xl p-4 border border-white/10 animate-pulse">
    <div className="h-48 bg-white/10 rounded-xl mb-4" />
    <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
    <div className="h-3 bg-white/10 rounded w-1/3 mb-2" />
    <div className="h-3 bg-white/10 rounded w-1/2 mb-1" />
    <div className="h-3 bg-white/10 rounded w-2/3 mb-1" />
    <div className="h-3 bg-white/10 rounded w-1/2 mb-3" />
    <div className="h-9 bg-white/10 rounded-xl" />
  </div>
);

function Sportfest() {
  const [topOffset, setTopOffset] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock Data with Categories
  const sportsData = [
    {
      id: 1,
      name: 'Basket Ball',
      category: 'Team Sports',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb33500248607c462/view?project=695eb843003ae5a0552b&mode=admin',
      details: ['Format: Knockout format', 'Players: max. 12 players', 'Time: 4 × 10 mins'],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc-R7jPrBoVX774SYupEFzTAD2Q7rADZRoWadE8rKJ7diLP_g/viewform',
    },
    {
      id: 2,
      name: 'Football',
      category: 'Team Sports',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb32a002aaa614c1e/view?project=695eb843003ae5a0552b&mode=admin',
      details: ['Format: Knockout format', 'Players: 11 + subs', 'Time: 30 mins halves'],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSeA7Xly0LnZjcO86o6NOorO8_LhEiWHAALIYcO1Q8JLC3m0GQ/viewform',
    },
    {
      id: 3,
      name: 'Volleyball',
      category: 'Team Sports',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb54c00321a3e4544/view?project=695eb843003ae5a0552b&mode=admin',
      details: ['Format: League format', 'Players: 6', 'Time: Best of 3 sets'],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSf5AzN_Edc2IT01ylz9-SIOn8p9PiN2jXvdYCGvsEMpu-l7Dw/viewform',
    },
    {
      id: 4,
      name: 'Badminton',
      category: 'Individual Sports',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb57a00175a1de88f/view?project=695eb843003ae5a0552b&mode=admin',
      details: ['Format: Knockout', 'Singles & Doubles', 'Time: Best of 3 matches'],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSes4RT3rEs-zXZ_wizH0M6mIjiuave0URxIhLGMjnwKJqqP5w/viewform',
    },
    {
      id: 5,
      name: 'Table Tennis',
      category: 'Individual Sports',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb30e0033b253d393/view?project=695eb843003ae5a0552b&mode=admin',
      details: ['Format: Knockout', 'Singles & Doubles', 'Time: Best of 3 matches'],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSej5a1w7nq7BAGkb25Wb5L5IUyHAjpxoTiJG1JwhpNAiIykzw/viewform',
    },
    {
      id: 6,
      name: 'Cricket',
      category: 'Team Sports',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb6fb003c59f0213a/view?project=695eb843003ae5a0552b&mode=admin',
      details: ['Format: T20 League', 'Players: 11 + subs', 'Time: 20 overs'],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc5Me7mFTmHTSoq96gR5zdbOtlick7rFZXy7HMMQ4bsGMY4oA/viewform',
    },
    {
      id: 7,
      name: 'Kabaddi',
      category: 'Team Sports',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb31d00295744d0a6/view?project=695eb843003ae5a0552b&mode=admin',
      details: ['Format: Knockout', 'Players: 7 + subs', 'Time: 15 mins/half'],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc9PDeGfMUrql-1SD1dtBenwR7kBTCvjzVBZEVqTvjQJJko7w/viewform',
    },
    {
      id: 8,
      name: 'Chess',
      category: 'Individual Sports',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb6d4001524dd56a3/view?project=695eb843003ae5a0552b&mode=admin',
      details: ['Format: Individual', 'FIDE rules', 'Standard Time Control'],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc--ThbPH-pxbPjEuHAixAAUJjHEgkuf5JMCtGHzouZ1Frw-g/viewform',
    },
    {
      id: 9,
      name: 'Weightlifting',
      category: 'Individual Sports',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb301000e38f8535e/view?project=695eb843003ae5a0552b&mode=admin',
      details: ['2 attempts/lift', 'Entry fees apply', 'Strict weight cats'],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSf1CbTnSnjWObGXsZRJEwb9ZHeGM1aL9iH55f77b_94jz-8Ag/viewform',
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleCloseModal = () => {
    setSelectedSport(null);
  };

  const filteredSports = useMemo(() => {
    return sportsData.filter((sport) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(sport.category);

      const searchMatch =
        sport.name.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [selectedCategories, searchQuery]);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: 'url(/SportsFestBG.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundColor: '#0F041C'
      }}
    >
      <Header />
      <HeaderSpacer onHeightChange={setTopOffset} />

      <main
        className="min-h-screen text-white"
        style={{ paddingTop: topOffset }}
      >
        {/* MOBILE LAYOUT */}
        <div className="relative z-10 md:hidden">
          <div className="px-[20px] py-[24px]">
            {/* Title and Description */}
            <div className="mb-[20px]">
              <h1 className="text-[32px] font-semibold text-white mb-[12px] font-poppins leading-tight">
                SPORTS FEST
              </h1>
              <p className="text-[13px] text-gray-300 font-poppins font-normal leading-relaxed">
                Dive into the heart of VIT Bhopal with AdVITya'26 - an electrifying blend of sports, energy, and competition. Crafted by the Sport Department.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col gap-[12px] mb-[24px]">
              <div className="flex items-center gap-[16px] bg-[#1A0A28] border border-white/10 rounded-[8px] px-[16px] py-[10px] w-full">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`relative flex items-center gap-[6px] px-[12px] py-[6px] rounded-[6px] transition-all duration-300 font-poppins text-[13px] flex-shrink-0 ${isFilterOpen ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white'}`}
                >
                  {isFilterOpen && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#CDB7D9] rounded-full transition-all duration-300" />
                  )}
                  <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>

                <div className="flex-1 flex items-center gap-[6px] text-gray-400">
                  <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search sports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-white w-full font-poppins text-[13px] placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div className="bg-[#1A0A28] border border-white/10 rounded-[8px] p-[16px] overflow-hidden transition-all duration-300 ease-in-out animate-slideDown">
                  <div>
                    <div className="flex items-center justify-between mb-[10px]">
                      <h4 className="text-[13px] font-semibold font-poppins text-white">CATEGORY</h4>
                      <button
                        onClick={() => {
                          setSelectedCategories([]);
                        }}
                        className="text-[11px] text-[#CDB7D9] hover:text-white transition-colors font-poppins font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-[8px]">
                      {['Team Sports', 'Individual Sports'].map((t) => (
                        <label key={t} className="flex items-center gap-[8px] cursor-pointer font-poppins">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(t)}
                            onChange={() => toggleCategory(t)}
                            className="w-[16px] h-[16px] rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                          />
                          <span className="capitalize text-[13px] text-gray-300 hover:text-white transition-colors">{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Grid */}
            <div className="grid grid-cols-1 gap-[20px]">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SportSkeleton key={i} />)
                : filteredSports.length > 0
                  ? filteredSports.map((sport) => (
                    <SportCard
                      key={sport.id}
                      sport={sport}
                      onReadMore={setSelectedSport}
                    />
                  ))
                  : (
                    <div className="text-center py-[60px]">
                      <p className="text-gray-400 font-poppins text-[14px]">No sports match the selected filters.</p>
                    </div>
                  )}
            </div>
          </div>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="relative z-10 hidden md:flex items-start">
          <aside
            className="w-[26vw] flex-shrink-0 p-[2vw] flex flex-col sticky"
            style={{ top: topOffset }}
          >
            <div className="mb-[2vw]">
              <h1 className="text-[3.5vw] font-semibold text-[#CDB7D9] mb-[1vw] font-poppins leading-tight">
                SPORTS FEST
              </h1>
              <p className="text-[1.1vw] text-gray-300 font-poppins font-normal leading-relaxed">
                Dive into the heart of VIT Bhopal with AdVITya'26 - an electrifying blend of sports, energy, and competition.
              </p>
            </div>

            {/* Desktop Filter Bar */}
            <div className="flex flex-col gap-[1vw]">
              <div className="flex items-center gap-[1vw] bg-[#1A0A28] border border-white/10 rounded-[0.8vw] px-[0.8vw] py-[0.5vw] w-full">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`relative flex items-center gap-[0.3vw] px-[0.6vw] py-[0.3vw] rounded-[0.4vw] transition-all duration-300 font-poppins text-[0.85vw] flex-shrink-0 ${isFilterOpen ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white'}`}
                >
                  {isFilterOpen && (
                    <div className="absolute bottom-0 left-0 right-0 h-[0.15vw] bg-[#CDB7D9] rounded-full transition-all duration-300" />
                  )}
                  <svg className="w-[0.9vw] h-[0.9vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>

                <div className="flex-1 flex items-center gap-[0.3vw] text-gray-400">
                  <svg className="w-[0.85vw] h-[0.85vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search sports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-white w-full font-poppins text-[0.85vw] placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Desktop Filter Dropdown */}
              {isFilterOpen && (
                <div className="bg-[#1A0A28] border border-white/10 rounded-[0.8vw] p-[1.5vw] overflow-hidden transition-all duration-300 ease-in-out animate-slideDown">
                  <div>
                    <div className="flex items-center justify-between mb-[0.8vw]">
                      <h4 className="text-[0.9vw] font-semibold font-poppins text-white">CATEGORY</h4>
                      <button
                        onClick={() => {
                          setSelectedCategories([]);
                        }}
                        className="text-[0.75vw] text-[#CDB7D9] hover:text-white transition-colors font-poppins font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-[0.5vw]">
                      {['Team Sports', 'Individual Sports'].map((t) => (
                        <label key={t} className="flex items-center gap-[0.5vw] cursor-pointer font-poppins">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(t)}
                            onChange={() => toggleCategory(t)}
                            className="w-[1vw] h-[1vw] rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                          />
                          <span className="capitalize text-[0.9vw] text-gray-300 hover:text-white transition-colors">{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Right Content - Sports Grid */}
          <div className="flex-1 p-[2vw]">
            <div className="grid grid-cols-2 gap-[2vw] w-full max-w-[80vw] ml-auto">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SportSkeleton key={i} />)
                : filteredSports.length > 0
                  ? filteredSports.map((sport) => (
                    <SportCard
                      key={sport.id}
                      sport={sport}
                      onReadMore={setSelectedSport}
                    />
                  ))
                  : (
                    <div className="col-span-2 text-center py-[10vh]">
                      <p className="text-gray-400 font-poppins text-[1.1vw]">No sports match the selected filters.</p>
                    </div>
                  )}
            </div>
          </div>
        </div>
      </main>

      {selectedSport && (
        <SportModal
          sport={selectedSport}
          onClose={handleCloseModal}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}

export default Sportfest;
