/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { databases } from '@/lib/appwrite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faMapMarkerAlt, faUser, faEnvelope, faPhone, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { mockEvents } from './mockData';

const HeaderSpacer = ({ onHeightChange }) => {
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const updateHeight = () => {
            const header = document.getElementById('main-header');
            if (header) {
                const h = header.offsetHeight;
                setHeight(h);
                onHeightChange?.(h);
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

const EventDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [topOffset, setTopOffset] = useState(0);

    const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const EVENTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_EVENTS_COLLECTION_ID;

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // Check if Appwrite is configured
                if (!DATABASE_ID || DATABASE_ID === 'your_database_id' || !EVENTS_COLLECTION_ID) {
                    console.warn('Appwrite not configured, using mock data');
                    const mockEvent = mockEvents.find(e => e.$id === id);
                    if (mockEvent) {
                        setEvent(mockEvent);
                    }
                    setLoading(false);
                    return;
                }

                const eventDoc = await databases.getDocument(
                    DATABASE_ID,
                    EVENTS_COLLECTION_ID,
                    id
                );

                // Parse fees if string
                let registrationFee = [];
                if (eventDoc.registrationFee) {
                    if (Array.isArray(eventDoc.registrationFee)) {
                        registrationFee = eventDoc.registrationFee;
                    } else {
                        try {
                            registrationFee = JSON.parse(eventDoc.registrationFee);
                        } catch (e) {
                            console.error("Error parsing fees", e);
                        }
                    }
                }

                setEvent({ ...eventDoc, registrationFee });
            } catch (error) {
                console.error("Error fetching event from Appwrite, falling back to mock data:", error);
                const mockEvent = mockEvents.find(e => e.$id === id);
                if (mockEvent) {
                    setEvent(mockEvent);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEvent();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#12001A] text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-[#12001A] text-white flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Event not found</h2>
                <Link to="/events" className="text-purple-400 hover:text-purple-300">Back to Events</Link>
            </div>
        );
    }

    return (
        <>
            <HeaderSpacer onHeightChange={setTopOffset} />
            <div
                className="min-h-screen bg-[#12001A] text-white overflow-x-hidden relative"
                style={{ paddingTop: topOffset }}
            >
                {/* Background Elements */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <img src="/Herosection_BG.svg" alt="" className="w-full h-full object-cover opacity-20" />
                </div>

                <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
                    <button
                        onClick={() => navigate('/events')}
                        className="mb-8 flex items-center gap-2 text-purple-300 hover:text-white transition-colors group"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Events
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Left Column - Poster */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-24">
                                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 aspect-[3/4] relative group">
                                    <img
                                        src={event.poster}
                                        alt={event.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Details */}
                        <div className="lg:col-span-7 space-y-8">
                            <div>
                                <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium mb-4 border border-purple-500/30 capitalize">
                                    {event.eventType}
                                </span>
                                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                                    {event.name}
                                </h1>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    {event.desc}
                                </p>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4 hover:bg-white/10 transition-colors">
                                    <div className="p-3 bg-purple-500/20 rounded-xl text-purple-300">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Date</p>
                                        <p className="text-lg font-semibold">{event.date || 'TBD'}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4 hover:bg-white/10 transition-colors">
                                    <div className="p-3 bg-pink-500/20 rounded-xl text-pink-300">
                                        <FontAwesomeIcon icon={faClock} className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Time</p>
                                        <p className="text-lg font-semibold">{event.time || 'TBD'}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4 hover:bg-white/10 transition-colors">
                                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-300">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Venue</p>
                                        <p className="text-lg font-semibold">{event.venue || 'TBD'}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4 hover:bg-white/10 transition-colors">
                                    <div className="p-3 bg-green-500/20 rounded-xl text-green-300">
                                        <FontAwesomeIcon icon={faUser} className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Team Size</p>
                                        <p className="text-lg font-semibold">{event.teamSize || 'Individual'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Registration Fees */}
                            {event.registrationFee && event.registrationFee.length > 0 && (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold mb-4">Registration Fees</h3>
                                    <div className="space-y-3">
                                        {event.registrationFee.map((fee, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-black/20 rounded-xl">
                                                <span className="text-gray-300">{fee.type}</span>
                                                <span className="text-xl font-bold text-green-400">₹{fee.fee}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Coordinators */}
                            {/* Assuming coordinators are part of description or separate fields, if not present in schema, skipping for now or adding placeholder if design requires */}

                            {/* Action Buttons */}
                            <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                <Link
                                    to={`/register/${event.$id}`}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300"
                                >
                                    Register Now
                                </Link>
                                {/* Optional: Add Rulebook button if link exists */}
                                {event.rulebook && (
                                    <a
                                        href={event.rulebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-white/10 border border-white/10 text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
                                    >
                                        View Rulebook
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventDetailPage;
