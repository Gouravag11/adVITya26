/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
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
            className="fixed left-0 right-0 top-0 z-40 pointer-events-none bg-[#111111]"
            style={{ height }}
            aria-hidden
        />
    );
};

/* -------------------------------------------------------------------------- */
/*                                EVENT CARD                                  */
/* -------------------------------------------------------------------------- */
const EventCard = ({ event }) => {
    const fees = Array.isArray(event.registrationFee)
        ? event.registrationFee
        : [];

    const displayValue = (value) =>
        value && value.trim() !== '' ? value : 'TBD';

    return (
        <div className="bg-[#1F1F1F] rounded-2xl p-4 border border-white/10 shadow-lg">
            <div className="rounded-xl overflow-hidden mb-4 h-40 bg-white/5">
                <img
                    src={event.poster}
                    alt={event.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <h3 className="text-lg font-semibold text-white mb-1">
                {event.name}
            </h3>

            <p className="text-xs text-purple-300 mb-1 capitalize">
                {event.eventType}
            </p>

            <p className="text-xs text-gray-400 mb-1">
                <span className="font-semibold">Venue:</span>{' '}
                {displayValue(event.venue)}
            </p>

            <p className="text-xs text-gray-400 mb-1">
                <span className="font-semibold">Date:</span>{' '}
                {displayValue(event.date)} •{' '}
                <span className="font-semibold">Time:</span>{' '}
                {displayValue(event.time)}
            </p>

            <p className="text-xs text-green-400 mb-3">
                {fees.map((f, i) => (
                <span key={i}>
                    {f.type}: ₹{f.fee}
                    {i < fees.length - 1 ? ' | ' : ''}
                </span>
                ))}
            </p>

            <button className="w-full bg-[#515151] hover:bg-[#5F5F5F] transition text-white font-medium py-2 rounded-xl">
                Read More
            </button>
        </div>
    );
};



/* ---------------------------- LOADING SKELETON ----------------------------- */
const EventSkeleton = () => (
    <div className="bg-[#1F1F1F] rounded-2xl p-4 border border-white/10 animate-pulse">
        <div className="h-40 bg-white/10 rounded-xl mb-4" />
        <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
        <div className="h-3 bg-white/10 rounded w-1/2 mb-4" />
        <div className="h-9 bg-white/10 rounded" />
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

    const [isMobile, setIsMobile] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minFee, setMinFee] = useState(0);
    const [maxFee, setMaxFee] = useState(5000);

    const [openFilter, setOpenFilter] = useState(null);
    const [loading, setLoading] = useState(true);

    const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const EVENTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_EVENTS_COLLECTION_ID;

    const fetchData = async () => {
        setLoading(true);
        try {
            const [eventsRes] = await Promise.all([
                databases.listDocuments(DATABASE_ID, EVENTS_COLLECTION_ID, [Query.limit(100)]),
            ]);
    
            let eventsData = eventsRes.documents.map(event => {
                let registrationFee = [{ type: '', fee: '' }]; // default
        
                if (event.registrationFee) {
                if (Array.isArray(event.registrationFee)) {
                    registrationFee = event.registrationFee;
                } else {
                    try {
                    registrationFee = JSON.parse(event.registrationFee);
                    } catch (err) {
                    console.warn('Failed to parse registrationFee:', event.registrationFee, err);
                    }
                }
                }
        
                return {
                ...event,
                registrationFee
                };
            });
            setEvents(eventsData);
    
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);

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
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
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

            return categoryMatch && feeMatch;
        });
    }, [events, selectedCategories, minFee, maxFee]);

    

    return (
        <>
            <HeaderSpacer onHeightChange={setTopOffset} />

            <main
                className="fixed inset-x-0 bottom-0 bg-[#111111] text-white overflow-x-hidden items-center"
                style={{ top: topOffset }}
            >
                {isMobile && isFilterOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-30"
                        onClick={() => setIsFilterOpen(false)}
                    />
                )}

                <div className="h-full px-4 sm:px-6 lg:px-8 pt-4 grid grid-cols-12 gap-6 overflow-y-auto overflow-x-hidden">
                    <aside
                        className={`
                            z-40 bg-[#111111] rounded-2xl py-4
                            transition-transform duration-300 ease-in-out
                            ${isMobile
                                ? `fixed left-0 top-1/2 -translate-y-1/2 w-80 px-6
                                max-h-[85vh] overflow-y-auto
                                ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`
                                : 'col-span-12 lg:col-span-4 sticky top-10 self-start'}
                        `}
                    >
                        <div className='flex flex-col items-center'>
                            <h1 className="text-4xl font-bold mb-6">AdVITya'26</h1>

                            <p className="text-gray-300 mb-6 leading-relaxed">
                                Dive into the heart of VIT Bhopal with Advitya'25 — an
                                electrifying blend of technology and culture.
                            </p>
                        </div>
                        
                        <div className="bg-white/5 rounded-2xl border border-white/10 divide-y divide-white/10">
                            <div className="flex justify-between items-center p-4">
                                <span className="font-semibold tracking-wide">
                                    FILTERS
                                </span>
                                <button
                                    onClick={() => {
                                        setSelectedCategories([]);
                                        setMinFee(0);
                                        setMaxFee(5000);
                                    }}
                                    className="text-sm text-purple-400 hover:text-purple-300"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* CATEGORY */}
                            <div className="p-4">
                                <button
                                    onClick={() =>
                                        setOpenFilter(openFilter === 'category' ? null : 'category')
                                    }
                                    className="w-full flex justify-between items-center font-medium"
                                >
                                    CATEGORY
                                    <span>{openFilter === 'category' ? '−' : '+'}</span>
                                </button>

                                {openFilter === 'category' && (
                                    <div className="mt-4 space-y-2 text-sm">
                                        {['technical', 'non-technical'].map((t) => (
                                            <label key={t} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(t)}
                                                    onChange={() => toggleCategory(t)}
                                                />
                                                <span className="capitalize">{t}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* PRICE RANGE */}
                            <div className="p-4">
                                <button
                                    onClick={() =>
                                        setOpenFilter(openFilter === 'price' ? null : 'price')
                                    }
                                    className="w-full flex justify-between items-center font-medium"
                                >
                                    PRICE RANGE
                                    <span>{openFilter === 'price' ? '−' : '+'}</span>
                                </button>

                                {openFilter === 'price' && (
                                    <div className="mt-6 relative">
                                        {/* Track */}
                                        <div className="relative h-2 bg-white/10 rounded">
                                            <div
                                                className="absolute h-2 bg-purple-400 rounded"
                                                style={{
                                                    left: `${(minFee / MAX_PRICE) * 100}%`,
                                                    right: `${100 - (maxFee / MAX_PRICE) * 100}%`,
                                                }}
                                            />
                                        </div>

                                        {/* Min thumb */}
                                        <input
                                            type="range"
                                            min={MIN_PRICE}
                                            max={MAX_PRICE}
                                            step={STEP}
                                            value={minFee}
                                            onChange={(e) =>
                                                setMinFee(Math.min(+e.target.value, maxFee - STEP))
                                            }
                                            className="range-slider z-20 -translate-y-9"
                                        />

                                        {/* Max thumb */}
                                        <input
                                            type="range"
                                            min={MIN_PRICE}
                                            max={MAX_PRICE}
                                            step={STEP}
                                            value={maxFee}
                                            onChange={(e) =>
                                                setMaxFee(Math.max(+e.target.value, minFee + STEP))
                                            }
                                            className="range-slider z-10 -translate-y-9"
                                        />

                                        {/* Inputs */}
                                        <div className="flex gap-3 text-sm mt-4">
                                            <input
                                                type="number"
                                                value={minFee}
                                                onChange={(e) =>
                                                    setMinFee(Math.min(+e.target.value, maxFee))
                                                }
                                                className="w-full bg-[#1F1F1F] border border-white/10 rounded px-2 py-1"
                                            />
                                            <span className="self-center">–</span>
                                            <input
                                                type="number"
                                                value={maxFee}
                                                onChange={(e) =>
                                                    setMaxFee(Math.max(+e.target.value, minFee))
                                                }
                                                className="w-full bg-[#1F1F1F] border border-white/10 rounded px-2 py-1"
                                            />
                                        </div>

                                        <p className="mt-2 text-xs text-white/60">
                                            ₹{minFee} – ₹{maxFee}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    <section className="col-span-12 lg:col-span-8 h-full overflow-y-auto">
                        {isMobile && (
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="mb-4 bg-white/10 border border-white/10 px-4 py-2 rounded-xl"
                            >
                                Open Filters
                            </button>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {loading
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <EventSkeleton key={i} />
                                ))
                                : filteredEvents.length > 0
                                ? filteredEvents.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                    />
                                ))
                                : (
                                    <p className="text-gray-400">
                                        No events match the selected filters.
                                    </p>
                                )}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
};

export default EventsPage;
