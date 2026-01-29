import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { databases, account } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExternalLinkAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export default function RegisterPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [club, setClub] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
    const EVENTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_EVENTS_COLLECTION_ID;
    const CLUBS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CLUBS_COLLECTION_ID;
    const REGISTRATIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_REGISTRATIONS_COLLECTION_ID;

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventDoc = await databases.getDocument(
                    DATABASE_ID,
                    EVENTS_COLLECTION_ID,
                    eventId
                );
                // Process poster URL and description fallback
                if (eventDoc.poster) {
                    if (!eventDoc.poster.startsWith('http')) {
                        eventDoc.poster = `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${import.meta.env.VITE_APPWRITE_BUCKET_ID}/files/${eventDoc.poster}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
                    }
                } else {
                    eventDoc.poster = "https://placehold.co/800x600/2A1A3E/FFF?text=Coming+Soon";
                }

                setEvent(eventDoc);

                if (eventDoc.formFields && typeof eventDoc.formFields === 'string') {
                    eventDoc.parsedFormFields = JSON.parse(eventDoc.formFields);
                    const initialData = {};
                    eventDoc.parsedFormFields.forEach(field => {
                        initialData[field.name] = '';
                    });
                    setFormData(initialData);
                }

                const clubDoc = await databases.getDocument(
                    DATABASE_ID,
                    CLUBS_COLLECTION_ID,
                    eventDoc.clubId
                );
                setClub(clubDoc);

            } catch (error) {
                console.error('Error fetching event:', error);
                setError('Event not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            // This should be handled by the UI before submit, but double check
            alert('You must be logged in to register.');
            return;
        }

        setSubmitting(true);
        try {
            await databases.createDocument(
                DATABASE_ID,
                REGISTRATIONS_COLLECTION_ID,
                ID.unique(),
                {
                    eventId: eventId,
                    clubId: event.clubId,
                    userId: user.$id,
                    userEmail: user.email,
                    formData: JSON.stringify(formData),

                }
            );

            alert('Registration successful!');
            navigate('/events');
        } catch (error) {
            console.error('Error submitting registration:', error);
            alert('Error submitting registration. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F041C] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-5xl text-[#CDB7D9]" />
                    <p className="text-[#CDB7D9] font-poppins animate-pulse">Loading Event Details...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-[#0F041C] text-white flex items-center justify-center px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/Herosection_BG.svg')] opacity-20 bg-cover bg-center pointer-events-none" />
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center max-w-2xl relative z-10 shadow-2xl">
                    <p className="text-3xl font-abril text-white mb-4">Event Not Found</p>
                    <p className="text-[#CDB7D9]/70 mb-8 font-poppins">
                        {error || `The event with ID "${eventId}" doesn't exist.`}
                    </p>
                    <Link
                        to="/events"
                        className="inline-block px-8 py-4 bg-[#CDB7D9] text-[#1A0B2E] rounded-2xl hover:bg-white transition-all duration-300 font-bold font-poppins hover:scale-105 hover:shadow-[0_0_20px_rgba(205,183,217,0.4)]"
                    >
                        Browse All Events
                    </Link>
                </div>
            </div>
        );
    }

    // External Registration View
    if (event.registrationMethod === 'external') {
        return (
            <div className="min-h-screen bg-[#0F041C] text-white relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('/Herosection_BG.svg')] opacity-20 bg-cover bg-center pointer-events-none" />

                <section className="py-20 px-4 w-full relative z-10 flex justify-center">
                    <div className="max-w-lg w-full bg-[#1A0B2E]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 text-center shadow-[0_0_50px_rgba(139,92,246,0.1)]">
                        {event.poster && (
                            <div className="relative h-52 overflow-hidden rounded-2xl mb-6 border border-white/5 shadow-lg group">
                                <img
                                    src={event.poster}
                                    alt={event.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B2E] via-transparent to-transparent opacity-60" />
                            </div>
                        )}

                        <h1 className="text-3xl font-abril text-white mb-4 leading-tight">
                            {event.name}
                        </h1>
                        <p className="text-[#CDB7D9]/80 mb-8 text-sm font-poppins mx-auto">
                            This event is hosted on an external platform. Click below to proceed to registration.
                        </p>

                        <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-[#CDB7D9] text-[#1A0B2E] text-base rounded-xl hover:bg-white hover:scale-105 transition-all duration-300 font-bold font-poppins hover:shadow-[0_0_30px_rgba(205,183,217,0.4)]"
                        >
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                            Register Now
                        </a>
                    </div>
                </section>
            </div>
        );
    }

    // Internal Registration Form
    return (
        <div className="min-h-screen bg-[#0F041C] text-white relative">
            <div className="fixed inset-0 bg-[url('/Herosection_BG.svg')] opacity-20 bg-cover bg-center pointer-events-none" />

            <section className="py-20 px-4 relative z-10 min-h-screen flex items-center justify-center">
                <div className="max-w-xl w-full mx-auto bg-[#1A0B2E]/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.5)]">

                    <div className="text-center mb-6">
                        {event.poster && (
                            <div className="w-full h-40 md:h-48 rounded-2xl overflow-hidden mb-6 border border-white/5 shadow-2xl relative group">
                                <img
                                    src={event.poster}
                                    alt={event.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] to-transparent opacity-80" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                                    <span className="px-2 py-1 bg-[#CDB7D9]/20 backdrop-blur-md border border-[#CDB7D9]/30 rounded-full text-[#CDB7D9] text-[10px] font-bold uppercase tracking-wider mb-1 inline-block">
                                        Registration
                                    </span>
                                </div>
                            </div>
                        )}
                        <h1 className="text-2xl md:text-3xl font-abril text-white mb-2">
                            Register for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CDB7D9] to-[#9F88C0]">{event.name}</span>
                        </h1>
                        <p className="text-xs font-poppins text-[#CDB7D9]/50 uppercase tracking-widest">Event ID: {event.$id}</p>
                    </div>

                    {!user ? (
                        <div className="text-center p-6 bg-red-500/10 border border-red-500/20 rounded-2xl mb-6 backdrop-blur-sm">
                            <p className="text-red-200 mb-4 font-poppins text-sm">You need to be logged in to register for this event.</p>
                            <Link
                                to="/login"
                                className="inline-block px-6 py-2 bg-red-500 hover:bg-red-400 text-white font-bold rounded-lg transition-all font-poppins shadow-lg hover:shadow-red-500/20 text-sm"
                            >
                                Login to Continue
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-4">
                                {event.parsedFormFields && event.parsedFormFields.length > 0 ? (
                                    event.parsedFormFields.map((field, index) => (
                                        <div key={index} className="group">
                                            <label className="block text-[#CDB7D9] text-xs font-bold uppercase tracking-wider mb-2 ml-1 group-focus-within:text-white transition-colors">
                                                {field.label}
                                                {field.required && <span className="text-pink-500 ml-1">*</span>}
                                            </label>

                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    required={field.required}
                                                    value={formData[field.name] || ''}
                                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl focus:border-[#CDB7D9] focus:bg-black/60 focus:ring-1 focus:ring-[#CDB7D9] outline-none transition-all duration-300 font-poppins resize-none placeholder-white/20 text-sm"
                                                    rows="3"
                                                    placeholder={`Enter ${field.label}...`}
                                                />
                                            ) : field.type === 'select' ? (
                                                <div className="relative">
                                                    <select
                                                        required={field.required}
                                                        value={formData[field.name] || ''}
                                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl focus:border-[#CDB7D9] focus:bg-black/60 focus:ring-1 focus:ring-[#CDB7D9] outline-none transition-all duration-300 font-poppins appearance-none cursor-pointer text-sm"
                                                    >
                                                        <option value="" className="bg-[#1A0B2E] text-white/50">Select an option</option>
                                                        {field.options?.map((option, i) => (
                                                            <option key={i} value={option} className="bg-[#1A0B2E] text-white py-2">{option}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                            ) : (
                                                <input
                                                    type={field.type || 'text'}
                                                    required={field.required}
                                                    value={formData[field.name] || ''}
                                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl focus:border-[#CDB7D9] focus:bg-black/60 focus:ring-1 focus:ring-[#CDB7D9] outline-none transition-all duration-300 font-poppins placeholder-white/20 text-sm"
                                                    placeholder={`Enter ${field.label}`}
                                                />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 border border-dashed border-white/10 rounded-xl bg-white/5">
                                        <p className="text-[#CDB7D9]/70 font-poppins text-sm">No additional details required.</p>
                                        <p className="text-xs text-gray-500 mt-1">Click submit to complete your registration.</p>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-[#CDB7D9] text-[#1A0B2E] text-base font-bold rounded-xl hover:bg-white hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(205,183,217,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-poppins mt-6 flex items-center justify-center gap-2 relative overflow-hidden group"
                            >
                                {submitting ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} spin />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faPaperPlane} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        <span>Confirm Registration</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
}
