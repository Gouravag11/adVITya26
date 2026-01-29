'use client';

import { useState, useEffect } from 'react';
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
    <div className="bg-[#1A0A28] rounded-4xl p-2 border border-white/10 shadow-lg hover:border-purple-500/50 transition-all duration-300">
      <div className="rounded-2xl overflow-hidden mb-4 h-48 bg-white/5">
        <img
          src={sport.image}
          alt={sport.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-1">
          {sport.name}
        </h3>

        <p className="text-xs text-purple-300 mb-2 capitalize">
          Sports Event
        </p>

        <p className="text-xs text-gray-400 mb-1">
          <span className="font-semibold">Format:</span>{' '}
          {sport.details[0].replace('Format: ', '')}
        </p>

        <p className="text-xs text-gray-400 mb-1">
          <span className="font-semibold">Venue:</span>{' '}
          Sports Complex
        </p>

        <p className="text-xs text-gray-400 mb-3">
          <span className="font-semibold">Date:</span>{' '}
          21 Feb 2025 • <span className="font-semibold">Time:</span>{' '}
          10:00 AM
        </p>

        <button
          onClick={() => onReadMore(sport)}
          className="w-full bg-purple-400/80 hover:bg-purple-400 transition text-black font-semibold py-3 rounded-xl"
        >
          Read More
        </button>
      </div>
    </div>
  );
};


const SportModal = ({ sport, onClose, isMobile }) => {
  if (!sport) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
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
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>30 Left</span>
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

                <div>
                  <h4 className="text-purple-400 font-semibold mb-2">FACULTY COORDINATORS</h4>
                  <ul className="text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      Sports Department
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-purple-400 font-semibold mb-2">STUDENT COORDINATORS</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      Sports Committee
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-gray-400 font-semibold mb-3">REGISTRATION TYPE</h4>
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
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
  const [isMobile, setIsMobile] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openFilter, setOpenFilter] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const sportsData = [
    {
      id: 1,
      name: 'Basket Ball',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb33500248607c462/view?project=695eb843003ae5a0552b&mode=admin',
      details: [
        'Format: Knockout format',
        'Players: max. 12 players per team',
        'Playing time: 4 × 10 minutes (4 minutes overtime)',
      ],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc-R7jPrBoVX774SYupEFzTAD2Q7rADZRoWadE8rKJ7diLP_g/viewform',
    },
    {
      id: 2,
      name: 'Football',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb32a002aaa614c1e/view?project=695eb843003ae5a0552b&mode=admin',
      details: [
        'Format: Knockout format',
        'Players: max. 18 players & min 11 players per team',
        'Playing time: two 30 minutes halves with 10 minutes rest',
      ],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSeA7Xly0LnZjcO86o6NOorO8_LhEiWHAALIYcO1Q8JLC3m0GQ/viewform',
    },
    {
      id: 3,
      name: 'Volleyball',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb54c00321a3e4544/view?project=695eb843003ae5a0552b&mode=admin',
      details: [
        'Format: League format',
        'Players: 6 players per team',
        'Playing time: Best of 3 sets with 25 points per set',
      ],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSf5AzN_Edc2IT01ylz9-SIOn8p9PiN2jXvdYCGvsEMpu-l7Dw/viewform',
    },
    {
      id: 4,
      name: 'Badminton',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb57a00175a1de88f/view?project=695eb843003ae5a0552b&mode=admin',
      details: [
        'Format: Knockout format',
        'Categories: Singles & Doubles',
        'Playing time: Best of 3 matches, 21 points per match',
      ],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSes4RT3rEs-zXZ_wizH0M6mIjiuave0URxIhLGMjnwKJqqP5w/viewform',
    },
    {
      id: 5,
      name: 'Table Tennis',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb30e0033b253d393/view?project=695eb843003ae5a0552b&mode=admin',
      details: [
        'Format: Knockout format',
        'Categories: Singles & Doubles',
        'Playing time: Best of 3 matches, 11 points per match',
      ],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSej5a1w7nq7BAGkb25Wb5L5IUyHAjpxoTiJG1JwhpNAiIykzw/viewform',
    },
    {
      id: 6,
      name: 'Cricket',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb6fb003c59f0213a/view?project=695eb843003ae5a0552b&mode=admin',
      details: [
        'Format: T20 League format',
        'Players: max. 15 players per team',
        'Playing time: 20 overs per side',
      ],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc5Me7mFTmHTSoq96gR5zdbOtlick7rFZXy7HMMQ4bsGMY4oA/viewform',
    },
    {
      id: 7,
      name: 'Kabaddi',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb31d00295744d0a6/view?project=695eb843003ae5a0552b&mode=admin',
      details: [
        'Format: Knockout format',
        'Players: max. 12 players per team',
        'Playing time: 15 mins per half',
      ],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc9PDeGfMUrql-1SD1dtBenwR7kBTCvjzVBZEVqTvjQJJko7w/viewform',
    },
    {
      id: 8,
      name: 'Chess',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb6d4001524dd56a3/view?project=695eb843003ae5a0552b&mode=admin',
      details: [
        'Format: Individual knockout',
        'Standard FIDE rules',
        'Time control as per organizers',
      ],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc--ThbPH-pxbPjEuHAixAAUJjHEgkuf5JMCtGHzouZ1Frw-g/viewform',
    },
    {
      id: 9,
      name: 'Weightlifting',
      image: 'https://fra.cloud.appwrite.io/v1/storage/buckets/696f8e35003b8cc96b50/files/696fb301000e38f8535e/view?project=695eb843003ae5a0552b&mode=admin',
      details: [
        '2 attempts per lift',
        'Entry fees as per category',
        'Strict weight categories',
      ],
      registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSf1CbTnSnjWObGXsZRJEwb9ZHeGM1aL9iH55f77b_94jz-8Ag/viewform',
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      setIsFilterOpen(!mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredSports = sportsData.filter(sport =>
    sport.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReadMore = (sport) => {
    setSelectedSport(sport);
  };

  const handleCloseModal = () => {
    setSelectedSport(null);
  };

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
        className="relative min-h-screen text-white overflow-x-hidden"
        style={{ paddingTop: topOffset + 16 }}
      >
        {isMobile && isFilterOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30"
            onClick={() => setIsFilterOpen(false)}
          />
        )}

        <div className="px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-6">
          <aside
            className={`
                            z-40 rounded-2xl py-4
                            transition-transform duration-300 ease-in-out
                            ${isMobile
                ? `fixed left-0 top-1/2 -translate-y-1/2 w-80 px-6
                                max-h-[85vh] overflow-y-auto
                                ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`
                : 'col-span-12 lg:col-span-4 lg:sticky lg:top-24 self-start'}
                        `}
          >
            <div className='flex flex-col items-center'>
              <h1 className="text-4xl font-bold mb-6">SPORTS FEST</h1>

              <p className="text-gray-300 mb-6 leading-relaxed text-center">
                Dive into the heart of VIT Bhopal with AdVITya'26 — an electrifying blend of sports, energy, and competition. Crafted by the Sport Department of VIT Bhopal students.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 divide-y divide-white/10">
              <div className="flex justify-between items-center p-4">
                <span className="font-semibold tracking-wide">
                  FILTERS
                </span>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategories([]);
                  }}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Clear All
                </button>
              </div>

              <div className="p-4">
                <button
                  onClick={() => setOpenFilter(openFilter === 'category' ? null : 'category')}
                  className="w-full flex justify-between items-center font-medium"
                >
                  CATEGORY
                  <span>{openFilter === 'category' ? '−' : '+'}</span>
                </button>

                {openFilter === 'category' && (
                  <div className="mt-4 space-y-2 text-sm">
                    {['Team Sports', 'Individual Sports'].map((t) => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(t)}
                          onChange={() => {
                            setSelectedCategories(prev =>
                              prev.includes(t)
                                ? prev.filter(c => c !== t)
                                : [...prev, t]
                            );
                          }}
                          className="w-4 h-4 accent-purple-500"
                        />
                        <span>{t}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4">
                <button
                  onClick={() => setOpenFilter(openFilter === 'sporttype' ? null : 'sporttype')}
                  className="w-full flex justify-between items-center font-medium"
                >
                  SPORT TYPE
                  <span>{openFilter === 'sporttype' ? '−' : '+'}</span>
                </button>

                {openFilter === 'sporttype' && (
                  <div className="mt-4 space-y-2 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={true}
                        readOnly
                        className="w-4 h-4 accent-purple-500"
                      />
                      <span>All Sports</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="p-4">
                <input
                  type="text"
                  placeholder="Search sports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1A0A28] border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </aside>

          <section className="col-span-12 lg:col-span-8 h-full overflow-y-auto">
            {isMobile && (
              <div className="mb-4 flex flex-col gap-4">
                <h1 className="text-3xl font-bold">SPORTS FEST</h1>
                <p className="text-gray-400 text-sm">
                  Dive into the heart of VIT Bhopal with AdVITya'26 — an electrifying blend of sports, energy, and competition.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="bg-white/10 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                  </button>
                  <button className="bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm">
                    Clear all
                  </button>
                  <button className="bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm">
                    Search
                  </button>
                  <button className="bg-white/10 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    Sort By
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 p-25 pb-8">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <SportSkeleton key={i} />
                ))
                : filteredSports.length > 0
                  ? filteredSports.map((sport) => (
                    <SportCard
                      key={sport.id}
                      sport={sport}
                      onReadMore={handleReadMore}
                    />
                  ))
                  : (
                    <p className="text-gray-400 col-span-2">
                      No sports match the search criteria.
                    </p>
                  )}
            </div>
          </section>
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
