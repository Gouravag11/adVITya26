/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

import EventDetailModal from './EventDetailModal';

/* -------------------------------------------------------------------------- */
/*                         FIXED HEADER NO-ENTRY ZONE                          */
/* -------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------- */
/*                                EVENT CARD                                  */
/* -------------------------------------------------------------------------- */
const EventCard = ({ event, onClick }) => {
    return (
        <div className="bg-[#1A0B2E]/60 backdrop-blur-sm rounded-[1.5vw] md:rounded-[1.5vw] sm:rounded-[12px] overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group">
            {/* DESKTOP LAYOUT */}
            <div className="hidden md:block">
                <div className="relative h-[12vw] overflow-hidden">
                    <img
                        src={event.poster}
                        alt={event.name}
                        className="w-full h-full object-cover object-[50%_22%] group-hover:scale-[1.08] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B2E] via-transparent to-transparent" />
                </div>

                <div className="p-[1.2vw]">
                    <h3 className="text-[1.1vw] font-semibold text-white mb-[0.5vw] font-poppins">
                        {event.name}
                    </h3>

                    <p className="text-[0.8vw] text-gray-400 mb-[1vw] line-clamp-2 font-poppins font-normal leading-relaxed">
                        {event.desc}
                    </p>

                    <button
                        onClick={onClick}
                        className="w-full py-[0.8vw] rounded-[0.6vw] bg-[#CDB7D9] hover:bg-[#b89fc9] text-[#1A0B2E] font-semibold font-poppins transition-all duration-300 text-[0.8vw]"
                    >
                        Read More
                    </button>
                </div>
            </div>

            {/* MOBILE LAYOUT - Proper card with image on top */}
            <div className="md:hidden flex flex-col">
                <div className="relative h-[180px] overflow-hidden rounded-t-[12px]">
                    <img
                        src={event.poster}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-500"
                    />
                </div>

                {/* Content below image */}
                <div className="p-[16px] bg-[#1A0B2E]/60 backdrop-blur-sm rounded-b-[12px]">
                    <h3 className="text-[16px] font-semibold text-white mb-[8px] font-poppins">
                        {event.name}
                    </h3>

                    <p className="text-[12px] text-gray-300 mb-[12px] line-clamp-2 font-poppins font-normal leading-relaxed">
                        {event.desc}
                    </p>

                    <button
                        onClick={onClick}
                        className="w-full py-[12px] rounded-[8px] bg-[#CDB7D9] hover:bg-[#b89fc9] text-[#1A0B2E] font-semibold font-poppins transition-all duration-300 text-[14px]"
                    >
                        Read More
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ---------------------------- LOADING SKELETON ----------------------------- */
const EventSkeleton = () => (
    <div className="bg-[#1A0B2E]/60 rounded-[1.5vw] md:rounded-[1.5vw] sm:rounded-[12px] overflow-hidden border border-white/10 animate-pulse">
        {/* DESKTOP SKELETON */}
        <div className="hidden md:block">
            <div className="h-[12vw] bg-white/10" />
            <div className="p-[1.2vw]">
                <div className="h-[1.5vw] bg-white/10 rounded w-3/4 mb-[0.8vw]" />
                <div className="h-[1vw] bg-white/10 rounded w-full mb-[0.5vw]" />
                <div className="h-[1vw] bg-white/10 rounded w-2/3 mb-[1vw]" />
                <div className="h-[2.5vw] bg-white/10 rounded" />
            </div>
        </div>

        {/* MOBILE SKELETON */}
        <div className="md:hidden flex flex-col">
            <div className="h-[180px] bg-white/10 rounded-t-[12px]" />
            <div className="p-[16px] bg-[#1A0B2E]/60 rounded-b-[12px]">
                <div className="h-[20px] bg-white/10 rounded w-3/4 mb-[8px]" />
                <div className="h-[14px] bg-white/10 rounded w-full mb-[6px]" />
                <div className="h-[14px] bg-white/10 rounded w-2/3 mb-[12px]" />
                <div className="h-[40px] bg-white/10 rounded" />
            </div>
        </div>
    </div>
);

/* -------------------------------------------------------------------------- */
/*                                EVENTS PAGE                                 */
/* -------------------------------------------------------------------------- */
const MIN_PRICE = 0;
const MAX_PRICE = 5000;
const STEP = 50;

const EventsPage = () => {
    const [topOffset, setTopOffset] = useState(0);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minFee, setMinFee] = useState(0);
    const [maxFee, setMaxFee] = useState(5000);

    const [loading, setLoading] = useState(true);

    const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const EVENTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_EVENTS_COLLECTION_ID;

    const fetchData = async () => {
        setLoading(true);
        try {
            if (!DATABASE_ID || DATABASE_ID === 'your_database_id' || !EVENTS_COLLECTION_ID) {
                console.warn('Appwrite not configured. Missing variables:', {
                    DATABASE_ID,
                    EVENTS_COLLECTION_ID,
                    VITE_APPWRITE_DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    VITE_APPWRITE_EVENTS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_EVENTS_COLLECTION_ID
                });
                setEvents([]);
                setLoading(false);
                return;
            }

            console.debug("Fetching Events with:", {
                DB_ID: DATABASE_ID,
                COLLECTION_ID: EVENTS_COLLECTION_ID,
            });

            const [eventsRes] = await Promise.all([
                databases.listDocuments(DATABASE_ID, EVENTS_COLLECTION_ID, [Query.limit(100)]),
            ]);

            if (eventsRes.documents.length > 0) {
                console.log("Raw Event Data Keys:", Object.keys(eventsRes.documents[0]));
                console.log("Raw Event Data Sample:", eventsRes.documents[0]);
            }

            let eventsData = eventsRes.documents.map(events => {
                const safeArrayParse = (data) => {
                    if (!data) return [];
                    if (Array.isArray(data)) return data;
                    try {
                        const parsed = JSON.parse(data);
                        return Array.isArray(parsed) ? parsed : [];
                    } catch {
                        return [];
                    }
                };

                return {
                    ...events,
                    name: events.name || events.eventName || "Untitled Event",
                    desc: events.description || "Join us for this amazing event! More details coming soon.",
                    eventType: events.eventType || "general",
                    date: events.date || "TBA",
                    time: events.time || "TBA",
                    venue: events.venue || "TBA",
                    club: events.clubId || "General",
                    poster: events.poster
                        ? (events.poster.startsWith('http')
                            ? events.poster
                            : `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${import.meta.env.VITE_APPWRITE_BUCKET_ID}/files/${events.poster}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`)
                        : "https://placehold.co/800x600/2A1A3E/FFF?text=Coming+Soon",
                    registrationFee: safeArrayParse(events.registrationFee),
                    features: safeArrayParse(events.features),
                    facultyCoordinators: safeArrayParse(events.facultyCoordinators),
                    studentCoordinators: safeArrayParse(events.studentCoordinators),
                };
            });
            setEvents(eventsData);

        } catch (error) {
            console.error("Error fetching data from Appwrite:", error);
            if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
                setNetworkError(true);
            }
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const handleOnline = () => {
            setNetworkError(false);
            fetchData();
        };
        const handleOffline = () => setNetworkError(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const toggleCategory = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const categoryMatch =
                selectedCategories.length === 0 ||
                selectedCategories.includes(event.eventType);

            const fees = Array.isArray(event.registrationFee)
                ? event.registrationFee
                : [];

            const feeMatch =
                fees.some((f) => Number(f.fee) >= minFee && Number(f.fee) <= maxFee) ||
                fees.length === 0;

            const searchMatch =
                event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.desc.toLowerCase().includes(searchQuery.toLowerCase());

            return categoryMatch && feeMatch && searchMatch;
        });
    }, [events, selectedCategories, minFee, maxFee, searchQuery]);

    return (
        <>
            <HeaderSpacer onHeightChange={setTopOffset} />

            <main
                className="min-h-screen bg-[#0F041C] text-white"
                style={{ paddingTop: topOffset }}
            >
                {/* Network Error Alert */}
                {networkError && (
                    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-md flex items-center gap-3 animate-fadeIn">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-poppins text-sm font-medium">Unable to connect. Please check your internet connection.</span>
                        <button
                            onClick={() => { setNetworkError(false); fetchData(); }}
                            className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors ml-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Background Pattern */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <img src="/Herosection_BG.svg" alt="" className="w-full h-full object-cover opacity-20" />
                </div>

                {/* MOBILE LAYOUT */}
                <div className="relative z-10 md:hidden">
                    <div className="px-[20px] py-[24px]">
                        {/* Title and Description */}
                        <div className="mb-[20px]">
                            <h1 className="text-[32px] font-semibold text-white mb-[12px] font-poppins leading-tight">
                                EVENTS
                            </h1>
                            <p className="text-[13px] text-gray-300 font-poppins font-normal leading-relaxed">
                                Dive into the heart of VIT Bhopal with AdVITya'26 - an electrifying blend of technology and culture. Crafted by the ingenious minds of VIT Bhopal students,
                            </p>
                        </div>

                        {/* Filter Bar */}
                        <div className="flex flex-col gap-[12px] mb-[24px]">
                            <div className="flex items-center gap-[16px] bg-white/5 border border-white/10 rounded-[8px] px-[16px] py-[10px] w-full">
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
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-transparent border-none outline-none text-white w-full font-poppins text-[13px] placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Filter Dropdown */}
                            {isFilterOpen && (
                                <div className="bg-white/5 border border-white/10 rounded-[8px] p-[16px] overflow-hidden transition-all duration-300 ease-in-out animate-slideDown">
                                    {/* Category Filter */}
                                    <div>
                                        <div className="flex items-center justify-between mb-[10px]">
                                            <h4 className="text-[13px] font-semibold font-poppins text-white">CATEGORY</h4>
                                            <button
                                                onClick={() => {
                                                    setSelectedCategories([]);
                                                    setMinFee(0);
                                                    setMaxFee(5000);
                                                }}
                                                className="text-[11px] text-[#CDB7D9] hover:text-white transition-colors font-poppins font-medium"
                                            >
                                                Clear all
                                            </button>
                                        </div>
                                        <div className="space-y-[8px]">
                                            {['technical', 'non-technical', 'cultural', 'workshop'].map((t) => (
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

                        {/* Events Grid - Mobile */}
                        <div className="grid grid-cols-1 gap-[20px]">
                            {loading
                                ? Array.from({ length: 4 }).map((_, i) => <EventSkeleton key={i} />)
                                : filteredEvents.length > 0
                                    ? filteredEvents.map((event) => (
                                        <EventCard
                                            key={event.$id}
                                            event={event}
                                            onClick={() => setSelectedEvent(event)}
                                        />
                                    ))
                                    : (
                                        <div className="text-center py-[60px]">
                                            <p className="text-gray-400 font-poppins text-[14px]">No events match the selected filters.</p>
                                        </div>
                                    )}
                        </div>
                    </div>
                </div>

                {/* DESKTOP LAYOUT */}
                <div className="relative z-10 hidden md:flex items-start">
                    {/* Left Sidebar */}
                    <aside
                        className="w-[26vw] flex-shrink-0 p-[2vw] flex flex-col sticky"
                        style={{ top: topOffset }}
                    >
                        {/* Title and Description */}
                        <div className="mb-[2vw]">
                            <h1 className="text-[3.5vw] font-semibold text-[#CDB7D9] mb-[1vw] font-poppins leading-tight">
                                EVENTS
                            </h1>
                            <p className="text-[1.1vw] text-gray-300 font-poppins font-normal leading-relaxed">
                                Dive into the heart of VIT Bhopal with AdVITya'25 - an electrifying blend of technology and culture. Crafted by the ingenious minds of VIT Bhopal students,
                            </p>
                        </div>

                        {/* Filter Bar - Single Horizontal Container */}
                        <div className="flex flex-col gap-[1vw]">
                            <div className="flex items-center gap-[1vw] bg-white/5 border border-white/10 rounded-[0.8vw] px-[0.8vw] py-[0.5vw] w-full">
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
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-transparent border-none outline-none text-white w-full font-poppins text-[0.85vw] placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Filter Dropdown */}
                            {isFilterOpen && (
                                <div className="bg-white/5 border border-white/10 rounded-[0.8vw] p-[1.5vw] overflow-hidden transition-all duration-300 ease-in-out animate-slideDown">
                                    {/* Category Filter */}
                                    <div>
                                        <div className="flex items-center justify-between mb-[0.8vw]">
                                            <h4 className="text-[0.9vw] font-semibold font-poppins text-white">CATEGORY</h4>
                                            <button
                                                onClick={() => {
                                                    setSelectedCategories([]);
                                                    setMinFee(0);
                                                    setMaxFee(5000);
                                                }}
                                                className="text-[0.75vw] text-[#CDB7D9] hover:text-white transition-colors font-poppins font-medium"
                                            >
                                                Clear all
                                            </button>
                                        </div>
                                        <div className="space-y-[0.5vw]">
                                            {['technical', 'non-technical', 'cultural', 'workshop'].map((t) => (
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

                    {/* Right Content - Events Grid */}
                    <div className="flex-1 p-[2vw]">
                        <div className="grid grid-cols-2 gap-[2vw] w-full max-w-[80vw] ml-auto">
                            {loading
                                ? Array.from({ length: 4 }).map((_, i) => <EventSkeleton key={i} />)
                                : filteredEvents.length > 0
                                    ? filteredEvents.map((event) => (
                                        <EventCard
                                            key={event.$id}
                                            event={event}
                                            onClick={() => setSelectedEvent(event)}
                                        />
                                    ))
                                    : (
                                        <div className="col-span-2 text-center py-[10vh]">
                                            <p className="text-gray-400 font-poppins text-[1.1vw]">No events match the selected filters.</p>
                                        </div>
                                    )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}


        </>
    );
};

export default EventsPage;
