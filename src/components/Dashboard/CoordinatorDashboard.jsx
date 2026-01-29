/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner, faPlus, faTrash, faEdit, faSearch, faChevronLeft, faChevronRight,
  faCalendarAlt, faClipboardList, faTachometerAlt, faTimes, faAngleDoubleLeft, faAngleDoubleRight,
  faPaperPlane, faUpload, faBars
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImageFile } from '@/lib/storage';
import { useNotifications, NotificationItem } from './Notification';

export default function CoordinatorDashboard({ clubName }) {
  const { userData } = useAuth();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  const { notifications, addNotification, dismissNotification } = useNotifications();

  // UI State
  const [activeTab, setActiveTab] = useState('events');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

  // Edit/Suggest State
  const [showSuggestEdit, setShowSuggestEdit] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    posterFile: null,      // File object
    posterPreview: '',     // Local preview
    posterUrl: '',         // Existing/Fallback URL
    registrationFee: [{ type: '', fee: '' }],
    eventType: 'technical',
    venue: '',
    date: '',
    time: '',
    registrationMethod: 'internal',
    registrationLink: '',
  });

  // Upload State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingClub, setIsSubmittingClub] = useState(false);

  // Registration Table State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const itemsPerPage = 50;

  const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const CLUBS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CLUBS_COLLECTION_ID;
  const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;
  const EVENTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_EVENTS_COLLECTION_ID;
  const REGISTRATIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_REGISTRATIONS_COLLECTION_ID;
  const PENDING_EVENTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PENDING_EVENTS_COLLECTION_ID;

  // New Club State
  const [newClub, setNewClub] = useState({
    name: '',
    category: 'technical',
    description: '',
    logoFile: null,      // The actual file object
    logoPreview: '',     // The local preview URL
    logoUrl: ''          // The fallback URL text input
  });

  const fetchClubData = async () => {
    if (!userData?.clubName) {
      setLoading(false);
      return;
    }

    setLoadingText("Fetching Data...");
    setLoading(true);
    try {
      const clubRes = await databases.listDocuments(
        DATABASE_ID,
        CLUBS_COLLECTION_ID,
        [Query.equal('name', userData.clubName)]
      );

      if (clubRes.documents.length === 0) {
        setLoadingText("");
        setLoading(false);
        return;
      }

      const clubDoc = clubRes.documents[0];
      setClub(clubDoc);

      const eventsRes = await databases.listDocuments(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        [Query.equal('clubId', clubDoc.$id)]
      );

      let eventData = eventsRes.documents.map(event => {
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

      setEvents(eventData);

      const regsRes = await databases.listDocuments(
        DATABASE_ID,
        REGISTRATIONS_COLLECTION_ID,
        [Query.equal('clubId', clubDoc.$id), Query.limit(1000)]
      );

      const parsedRegistrations = regsRes.documents.map(reg => {
        let formData = {};
        try {
          formData = typeof reg.formData === 'string' ? JSON.parse(reg.formData) : reg.formData;
        } catch (e) { console.error("Error parsing form data", e); }
        return { ...reg, formData };
      });

      setAllRegistrations(parsedRegistrations);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingText("");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
        const mobile = window.innerWidth <= 1024;
        setIsMobile(mobile);
        setIsSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Upload Helpers (Deferred) ---
  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setNewClub(prev => ({ ...prev, logoFile: file, logoPreview: previewUrl }));
  };

  // --- Club Management ---
  const handleAddClub = async (e) => {
    e.preventDefault();
    setIsSubmittingClub(true);
    setLoadingText("Adding Club...");
    setLoading(true);
    try {
      let finalLogoUrl = newClub.logoUrl;

      if (newClub.logoFile) {
        finalLogoUrl = await uploadImageFile(newClub.logoFile);
      }

      console.log("DEBUG: Final Logo URL:", finalLogoUrl);

      await databases.createDocument(
        DATABASE_ID,
        CLUBS_COLLECTION_ID,
        ID.unique(),
        {
          name: newClub.name,
          category: newClub.category,
          description: newClub.description || '',
          logo: finalLogoUrl || '',
          createdAt: new Date().toISOString(),
        }
      );
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userData.$id,
        { clubName: newClub.name }
      );
      setNewClub({ name: '', category: 'technical', description: '', logoFile: null, logoPreview: '', logoUrl: '' });
      addNotification({
        id: Date.now(),
        type: 'success',
        message: 'Club Added Successfully!',
      });
    } catch (error) {
      console.error('Error adding club:', error);
      addNotification({
        id: Date.now(),
        type: 'error',
        message: 'Error Adding Club!',
      });
    } finally {
      fetchClubData();
      setIsSubmittingClub(false);
      setLoadingText("");
      setLoading(false);
      window.location.reload();
    }
  };


  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoadingText("Creating Event...");
    setLoading(true);
    if (!club.name) {
      addNotification({
        id: Date.now(),
        type: 'warning',
        message: 'Please Select a Club!',
      });
      setLoadingText("");
      setLoading(false);
      return;
    }
    if (newEvent.registrationMethod === 'internal' && formFields.length === 0) {
      addNotification({
        id: Date.now(),
        type: 'warning',
        message: 'Add at Least One Form Field!',
      });
      setLoadingText("");
      setLoading(false);
      return;
    }

    setIsSubmittingEvent(true);
    try {
      let finalPosterUrl = newEvent.posterUrl;

      if (newEvent.posterFile) {
        finalPosterUrl = await uploadImageFile(newEvent.posterFile);
      }

      const documentId = ID.unique();

      const proposedChanges = {
        name: newEvent.eventName,
        poster: finalPosterUrl,
        registrationFee: JSON.stringify(newEvent.registrationFee),
        eventType: newEvent.eventType,
        venue: newEvent.venue,
        date: newEvent.date,
        time: newEvent.time,
        registrationMethod: newEvent.registrationMethod,
        registrationLink: newEvent.registrationMethod === 'external' ? newEvent.registrationLink : null,
        formFields: newEvent.registrationMethod === 'internal' ? JSON.stringify(formFields) : null,
      }

      await databases.createDocument(
        DATABASE_ID,
        PENDING_EVENTS_COLLECTION_ID,
        documentId,
        {
          originalEventId: documentId,
          clubId: club.$id,
          proposedChanges: JSON.stringify(proposedChanges),
          coordinatorId: userData.$id,
          coordinatorName: userData.name,
          eventName: newEvent.eventName,
          status: 'pending'
        }
      );
      addNotification({
        id: Date.now(),
        type: 'success',
        message: 'Event Created Successfully!',
      });
      setShowAddEvent(false);
      resetEventData();
      setFormFields([]);
      // fetchData();
    } catch (error) {
      console.error("Error creating event:", error);
      addNotification({
        id: Date.now(),
        type: 'error',
        message: 'Error Creating Event!',
      });
    } finally {
      setIsSubmittingEvent(false);
      setLoadingText("");
      setLoading(false);
    }
  };

  // --- Form Field Logic (for suggestions) ---
  const addFormField = () => {
    setFormFields([...formFields, { name: '', label: '', type: 'text', required: false }]);
  };

  const removeFormField = (index) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const updateFormField = (index, field, value) => {
    const updated = [...formFields];
    updated[index][field] = value;
    if (field === 'label') {
      updated[index].name = value.toLowerCase().replace(/\s+/g, '_');
    }
    setFormFields(updated);
  };

  // --- Upload Helper (Deferred) ---
  const handlePosterSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setNewEvent(prev => ({ ...prev, posterFile: file, posterPreview: previewUrl }));
  };


  // --- Suggest Edit Logic ---
  const startSuggestEdit = (event) => {
    setSelectedEventId(event.$id);

    let parsedFields = [];
    if (event.formFields) {
      try {
        parsedFields = typeof event.formFields === 'string' ? JSON.parse(event.formFields) : event.formFields;
      } catch (e) {
        console.log(e);
      }
    }

    setNewEvent({
      eventName: event.name,
      posterFile: null,
      posterPreview: event.poster || '', // Use existing as initial preview
      posterUrl: event.poster || '',
      registrationFee: Array.isArray(event.registrationFee) ? event.registrationFee : JSON.parse(event.registrationFee) || [{ type: '', fee: '' }],
      eventType: event.eventType || '',
      venue: event.venue || '',
      date: event.date || '',
      time: event.time || '',
      registrationMethod: event.registrationMethod,
      registrationLink: event.registrationLink || '',
    });
    setFormFields(parsedFields);
    setShowSuggestEdit(true);
  };

  const handleSuggestEdit = async (e) => {
    e.preventDefault();
    setLoadingText("Suggesting Edit...");
    setLoading(true);

    if (newEvent.registrationMethod === 'internal' && formFields.length === 0) {
      addNotification({
        id: Date.now(),
        type: 'warning',
        message: 'Add at Least One Form Field!',
      });
      setLoadingText("");
      setLoading(false);
      return;
    }

    setIsSubmitting(true);
    try {
      let finalPosterUrl = newEvent.posterUrl;
      if (newEvent.posterFile) {
        finalPosterUrl = await uploadImageFile(newEvent.posterFile);
      }

      const proposedChanges = {
        name: newEvent.eventName,
        poster: finalPosterUrl,
        registrationFee: JSON.stringify(newEvent.registrationFee),
        eventType: newEvent.eventType,
        venue: newEvent.venue,
        date: newEvent.date,
        time: newEvent.time,
        registrationMethod: newEvent.registrationMethod,
        registrationLink: newEvent.registrationMethod === 'external' ? newEvent.registrationLink : null,
        formFields: newEvent.registrationMethod === 'internal' ? JSON.stringify(formFields) : null,
      };

      await databases.createDocument(
        DATABASE_ID,
        PENDING_EVENTS_COLLECTION_ID,
        ID.unique(),
        {
          originalEventId: selectedEventId,
          clubId: club.$id,
          proposedChanges: JSON.stringify(proposedChanges),
          coordinatorId: userData.$id,
          coordinatorName: userData.name,
          eventName: newEvent.eventName,
          status: 'pending'
        }
      );

      addNotification({
        id: Date.now(),
        type: 'success',
        message: 'Edit Suggestion sent to Admin for Review!',
      });
      setShowSuggestEdit(false);
      resetEventData();
      setFormFields([]);
      setSelectedEventId(null);
    } catch (error) {
      console.error('Error suggesting edit:', error);
      addNotification({
        id: Date.now(),
        type: 'error',
        message: 'Error Sending Suggestion!',
      });
    } finally {
      setIsSubmitting(false);
      setLoadingText("");
      setLoading(false);
    }
  };

  const resetEventData = (() => {
    setNewEvent({ eventName: '', posterFile: null, posterPreview: '', posterUrl: '', registrationFee: [{ type: '', fee: '' }], eventType: '', venue: '', date: '', time: '', registrationMethod: 'internal', registrationLink: '' });
  });

  const handleAddFee = () => {
    setNewEvent({
      ...newEvent,
      registrationFee: [...newEvent.registrationFee, { type: '', fee: '' }]
    });
  };

  const handleFeeChange = (index, field, value) => {
    let sanitizedValue = value;
    if (field === 'fee') {
      sanitizedValue = value.replace(/[^0-9]/g, ''); // Only allow digits (no decimal)
    }
    const updatedFees = [...newEvent.registrationFee];
    updatedFees[index] = { ...updatedFees[index], [field]: sanitizedValue };
    setNewEvent({ ...newEvent, registrationFee: updatedFees });
  };

  const handleRemoveFee = (index) => {
    if (newEvent.registrationFee.length !== 1){
      const updatedFees = newEvent.registrationFee.filter((_, i) => i !== index);
      setNewEvent({ ...newEvent, registrationFee: updatedFees });
    }
  };

  // --- Registration Filter Logic ---
  const filteredRegistrations = allRegistrations.filter(reg => {
    const matchesSearch = searchTerm === '' ||
      JSON.stringify(reg.formData).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = filterEvent === 'all' || reg.eventId === filterEvent;
    return matchesSearch && matchesEvent;
  });

  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRegistrations = filteredRegistrations.slice(startIndex, startIndex + itemsPerPage);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F0518]">
        <FontAwesomeIcon icon={faSpinner} spin className="text-6xl text-[#CDB7D9]" />
        <span className='text-white font-medium mt-2'>{loadingText}</span>
      </div>
    );
  }

  if (!club) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F0518] text-[#CDB7D9] p-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Add Your Club</h2>
          </div>

          <div className='flex w-screen mt-8'>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full mx-auto px-10 md:px-20">
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 order-first lg:order-last">
                  <div className="bg-[#B7C9D9]/5 backdrop-blur-xl border border-[#CDB7D9]/20 rounded-3xl p-8 h-full min-h-100 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-[#CDB7D9]/40 transition-colors cursor-pointer border-dashed">
                    <label className="cursor-pointer inset-0 absolute flex flex-col items-center justify-center">
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoSelect} />
                      {newClub.logoPreview ? (
                        <img src={newClub.logoPreview} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <div className="w-24 h-24 rounded-full bg-[#CDB7D9]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            <FontAwesomeIcon icon={faPlus} className="text-3xl text-[#CDB7D9]/50 group-hover:text-[#CDB7D9]" />
                          </div>
                          <h4 className="text-xl text-white mb-2">Club Logo</h4>
                          <p className="text-[#CDB7D9]/50 text-sm max-w-50">Click to upload club logo</p>
                        </>
                      )}
                    </label>
                    <div className="absolute inset-0 bg-linear-to-t from-[#CDB7D9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                </div>

                <form onSubmit={handleAddClub} className="lg:col-span-3 relative">
                  <h3 className="text-3xl font-abril text-white mb-8">New Club Details</h3>
                  <div className="space-y-6">
                    <div className="relative group">
                      <input
                        type="text"
                        required
                        value={newClub.name}
                        onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                        className="peer w-full px-6 py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-2xl focus:border-[#CDB7D9] focus:outline-none transition-all placeholder-transparent"
                        placeholder="Club Name"
                      />
                      <label className="absolute left-6 top-4 text-[#CDB7D9]/50 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#CDB7D9] peer-focus:bg-[#1A0B2E] peer-focus:px-2 pointer-events-none">
                        Club Name
                      </label>
                    </div>

                    <div className="relative group">
                      <select
                        value={newClub.category}
                        onChange={(e) => setNewClub({ ...newClub, category: e.target.value })}
                        className="w-full px-6 py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-2xl focus:border-[#CDB7D9] focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="technical" className="bg-[#1A0B2E]">Technical</option>
                        <option value="non-technical" className="bg-[#1A0B2E]">Non-Technical</option>
                        <option value="cultural" className="bg-[#1A0B2E]">Cultural</option>
                        <option value="chapter" className="bg-[#1A0B2E]">Chapter</option>
                        <option value="community" className="bg-[#1A0B2E]">Community</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#CDB7D9]/50">
                        <FontAwesomeIcon icon={faChevronRight} className="rotate-90" />
                      </div>
                    </div>

                    <div className="relative group">
                      <textarea
                        value={newClub.description}
                        onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                        className="peer w-full px-6 py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-2xl focus:border-[#CDB7D9] focus:outline-none transition-all placeholder-transparent h-40 resize-none"
                        placeholder="Description"
                      />
                      <label className="absolute left-6 top-4 text-[#CDB7D9]/50 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#CDB7D9] peer-focus:bg-[#1A0B2E] peer-focus:px-2 pointer-events-none">
                        Description
                      </label>
                    </div>

                    <button disabled={isSubmittingClub} type="submit" className="w-full py-4 bg-[#CDB7D9] text-[#280338] font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(205,183,217,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      {isSubmittingClub ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : null}
                      {isSubmittingClub ? 'Adding...' : 'Add Club'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </>
      
    );
  }

  return (
    <div className="flex min-h-screen relative text-[#CDB7D9] overflow-hidden bg-[#0F0518]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex z-0 pointer-events-none"
      >
        <img src="/Herosection_BG.svg" alt="BG" className="w-full h-full object-cover opacity-20" />
      </motion.div>

      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}


      {/* Sidebar */}
      <motion.aside
        className={`
          z-40 bg-[#1A0B2E]/90 border-r border-[#CDB7D9]/10
          flex flex-col shadow-[5px_0_30px_rgba(0,0,0,0.5)]
          ${isMobile
            ? 'fixed top-0 left-0 h-screen w-72'
            : 'sticky top-0 h-screen'}
        `}
        animate={
          isMobile
            ? { x: isSidebarOpen ? 0 : '-100%' }
            : { width: isSidebarOpen ? '18rem' : '5rem' }
        }
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        
        <div className="p-4 flex items-center justify-between">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 pl-2"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-[#CDB7D9] to-[#4E317D] flex items-center justify-center">
                  <span className="font-medium text-[#1A0B2E] text-xs">CO</span>
                </div>
                <h1 className="text-xl font-medium text-[#CDB7D9] tracking-wider">COORD</h1>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-[#CDB7D9]/10 rounded-full transition-colors">
            <FontAwesomeIcon icon={isSidebarOpen ? faAngleDoubleLeft : faAngleDoubleRight} className="text-[#CDB7D9]/50" />
          </button>
        </div>

        <nav className="flex-1 py-8 flex flex-col gap-2 px-3">
          {[
            { id: 'events', label: 'Events', icon: faCalendarAlt },
            { id: 'registrations', label: 'Registrations', icon: faClipboardList },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setShowSuggestEdit(false); setIsSidebarOpen(!isSidebarOpen)}}
              className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 font-medium group cursor-pointer ${activeTab === item.id
                ? 'bg-linear-to-r from-[#CDB7D9]/20 to-transparent text-[#CDB7D9]'
                : 'text-[#CDB7D9]/50 hover:text-[#CDB7D9] hover:bg-[#CDB7D9]/5'
                }`}
            >
              <div className="w-6 flex justify-center">
                <FontAwesomeIcon icon={item.icon} className={`text-lg transition-transform group-hover:scale-110`} />
              </div>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="ml-4 whitespace-nowrap overflow-hidden">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>
      </motion.aside>

      <div className="flex-1 pt-8 flex flex-col h-screen overflow-hidden z-10 relative">
        <header className="h-24 flex items-end px-10 justify-between z-20 sticky top-0">
          <div>
            <h2 className="text-4xl font-abril text-white tracking-wide">
              {activeTab === 'events' ? 'My Events' : 'Registrations'}
            </h2>
            <p className="text-[#CDB7D9]/50 text-sm mt-1 font-medium">Managing Club: {club.name}</p>
          </div>
        </header>

        {isMobile && (
          <div className="flex hover:bg-[#CDB7D9]/10 rounded-full transition-colors py-4 px-10">
            <FontAwesomeIcon
              onClick={() => setIsSidebarOpen(prev => !prev)}
              icon={
                isMobile
                  ? faBars
                  : isSidebarOpen
                  ? faAngleDoubleLeft
                  : faAngleDoubleRight
              }
              className="text-white text-xl bg-white/10 p-2 rounded-xl"
            />
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-10 scrollbar-thin scrollbar-thumb-[#CDB7D9]/10">
          <AnimatePresence mode="wait">

            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              >
                {!showAddEvent ? (
                  <>
                    {/* Maybe add a check if limiting number of events per club */}
                    {!showSuggestEdit && (
                      <div className="flex justify-end items-center mb-6">
                        <button
                          onClick={() => setShowAddEvent(true)}
                          className="px-6 py-2 bg-[#CDB7D9] text-[#280338] rounded-xl font-bold flex items-center gap-2 hover:-translate-y-1 transition-all"
                        >
                          <FontAwesomeIcon icon={faPlus} /> Create Event
                        </button>
                      </div>
                    )}
                    

                    {!showSuggestEdit ? (
                      <div className="bg-[#B7C9D9]/5 backdrop-blur-md border border-[#CDB7D9]/10 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 md:p-8">
                        {/* Desktop & tablet table */}
                        <div className="hidden md:block">
                          <table className="w-full text-[#CDB7D9] text-left border-collapse">
                            <thead className="bg-[#CDB7D9]/5 text-[#CDB7D9]/50 uppercase text-xs md:text-sm font-normal tracking-widest leading-loose">
                              <tr>
                                <th className="px-8 py-6">Event Name</th>
                                <th className="px-8 py-6">Reg Form</th>
                                <th className="px-8 py-6 text-right">Ticket Type : Fee</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#CDB7D9]/20">
                              {events.map((event) => {
                                const fees = Array.isArray(event.registrationFee) ? event.registrationFee : [];
                                return (
                                  <tr key={event.$id} className="hover:bg-[#CDB7D9]/5 transition-colors">
                                    <td className="px-8 py-5 text-white font-medium text-lg">{event.name}</td>
                                    <td className="px-8 py-5 capitalize">{event.registrationMethod}</td>
                                    <td className="px-8 py-5 text-right font-mono text-white">
                                      {fees.length > 0 ? (
                                        <div className="flex flex-col items-end gap-1">
                                          {fees.map((fee, index) => (
                                            <div key={index} className="grid grid-cols-[auto_auto] gap-2 text-sm">
                                              <span className="capitalize">{fee.type} :</span>
                                              <span>₹{parseFloat(fee.fee).toLocaleString()}</span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <span>N/A</span>
                                      )}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                      <button
                                        onClick={() => startSuggestEdit(event)}
                                        className="px-4 py-2 bg-[#CDB7D9]/10 border border-[#CDB7D9]/20 text-[#CDB7D9] rounded-lg hover:bg-[#CDB7D9] hover:text-[#280338] text-xs font-bold uppercase transition-all flex items-center gap-2 ml-auto"
                                      >
                                        <FontAwesomeIcon icon={faEdit} /> Suggest Edit
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile card view */}
                        <div className="md:hidden flex flex-col gap-4">
                          {events.map((event) => {
                            const fees = Array.isArray(event.registrationFee) ? event.registrationFee : [];
                            return (
                              <div key={event.$id} className="bg-[#CDB7D9]/10 p-4 rounded-2xl text-white flex flex-col gap-3 shadow-md">
                                <div className="font-bold text-lg flex justify-center">{event.name}</div>
                                <div className="capitalize"><span className='font-bold'>Reg Form:</span> {event.registrationMethod}</div>
                                <div>
                                  <span className="font-bold">Ticket Fees:</span>
                                  {fees.length > 0 ? (
                                    <div className="mt-1 flex flex-col gap-1">
                                      {fees.map((fee, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                          <span className="capitalize">{fee.type}</span>
                                          <span>: ₹{parseFloat(fee.fee).toLocaleString()}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="mt-1 text-sm">N/A</div>
                                  )}
                                </div>
                                <button
                                  onClick={() => startSuggestEdit(event)}
                                  className="mt-2 px-4 py-2 bg-[#CDB7D9]/20 border border-[#CDB7D9]/30 text-[#CDB7D9] rounded-lg hover:bg-[#CDB7D9] hover:text-[#280338] text-xs font-bold uppercase transition-all"
                                >
                                  <FontAwesomeIcon icon={faEdit} /> Suggest Edit
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Empty state */}
                        {events.length === 0 && (
                          <div className="text-center py-12 text-[#CDB7D9]/50 text-sm sm:text-base md:text-lg">
                            No events found for this club.
                          </div>
                        )}
                      </div>

                    ) : (
                      <div className="max-w-4xl mx-auto">
                        <button onClick={() => setShowSuggestEdit(false)} className="flex items-center gap-2 text-[#CDB7D9]/70 hover:text-[#CDB7D9] mb-4">
                          <FontAwesomeIcon icon={faChevronLeft} /> Back to Events
                        </button>
                        <div className="bg-[#B7C9D9]/5 backdrop-blur-xl border border-[#CDB7D9]/20 rounded-3xl p-8">
                          <div className="mb-6 border-b border-[#CDB7D9]/10 pb-4">
                            <h3 className="text-2xl text-white font-abril mb-1">Suggest Edits: {newEvent.eventName}</h3>
                            <p className="text-[#CDB7D9]/50 text-sm">Make changes below and submit for admin approval.</p>
                          </div>

                          <form onSubmit={handleSuggestEdit} className="space-y-6">
                            {/* Event Name */}
                            <div className="group">
                              <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Event Name</label>
                              <input
                                type="text" required
                                value={newEvent.eventName}
                                onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
                                className="w-full px-6 py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-2xl focus:border-[#CDB7D9] outline-none"
                              />
                            </div>

                            {/* Poster & Registration Fees */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="group">
                                <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Poster</label>
                                <div className="space-y-2">
                                  <div className="relative">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handlePosterSelect}
                                      className="hidden"
                                      id="poster-upload"
                                    />
                                    <label
                                      htmlFor="poster-upload"
                                      className="flex flex-col sm:flex-row items-center justify-center w-full px-4 py-4 bg-black/20 border border-dashed border-[#CDB7D9]/30 rounded-xl sm:rounded-2xl cursor-pointer hover:bg-[#CDB7D9]/5 transition-all text-[#CDB7D9]/70 gap-2"
                                    >
                                      {isSubmittingEvent ? (
                                        <FontAwesomeIcon icon={faSpinner} spin />
                                      ) : (
                                        <FontAwesomeIcon icon={faUpload} />
                                      )}
                                      <span>{newEvent.posterPreview ? 'Change Poster' : 'Click to Upload'}</span>
                                    </label>
                                  </div>

                                  {newEvent.posterPreview ? (
                                    <div className="relative mt-2 rounded-xl overflow-hidden border border-[#CDB7D9]/20 h-40 sm:h-32 w-full">
                                      <img
                                        src={newEvent.posterPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <input
                                      type="url"
                                      placeholder="Or paste URL"
                                      value={newEvent.posterUrl}
                                      onChange={(e) => setNewEvent({ ...newEvent, posterUrl: e.target.value })}
                                      className="w-full px-4 py-2 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl focus:border-[#CDB7D9] outline-none text-sm"
                                    />
                                  )}
                                </div>
                              </div>

                              <div className="group">
                                <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">
                                  Registration Fee
                                </label>

                                {newEvent.registrationFee.map((fee, index) => (
                                  <div
                                    key={index}
                                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2"
                                  >
                                    <input
                                      type="text"
                                      required
                                      placeholder="Ticket Type"
                                      value={fee.type}
                                      onChange={(e) => handleFeeChange(index, 'type', e.target.value)}
                                      className="w-full sm:w-2/5 px-4 py-2 bg-black/20 border border-[#CDB7D9]/20 focus:border-[#CDB7D9] outline-none text-white rounded-2xl"
                                    />

                                    <input
                                      type="text"
                                      placeholder="Fee"
                                      value={fee.fee}
                                      onChange={(e) => handleFeeChange(index, 'fee', e.target.value)}
                                      className="w-full sm:w-2/5 px-4 py-2 bg-black/20 border border-[#CDB7D9]/20 focus:border-[#CDB7D9] outline-none text-white rounded-2xl"
                                    />

                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFee(index)}
                                      className="w-full sm:w-auto px-4 py-2 bg-white/10 text-red-600 rounded-xl"
                                    >
                                      X
                                    </button>
                                  </div>
                                ))}

                                <div className="flex justify-center">
                                  <button
                                    type="button"
                                    onClick={handleAddFee}
                                    className="px-6 py-2 mt-4 bg-white/10 text-xl text-blue-500 rounded-2xl"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Event Type & Registration Method */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                              <div className="group">
                                <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Event Type</label>
                                <select
                                  value={newEvent.eventType}
                                  onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl sm:rounded-2xl focus:border-[#CDB7D9] outline-none"
                                >
                                  <option value="technical" className="bg-[#1A0B2E]">Technical</option>
                                  <option value="non-technical" className="bg-[#1A0B2E]">Non-Technical</option>
                                </select>
                              </div>

                              <div className="group">
                                <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Registration Method</label>
                                <select
                                  value={newEvent.registrationMethod}
                                  onChange={(e) => setNewEvent({ ...newEvent, registrationMethod: e.target.value })}
                                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl sm:rounded-2xl focus:border-[#CDB7D9] outline-none"
                                >
                                  <option value="internal" className="bg-[#1A0B2E]">Internal Form</option>
                                  <option value="external" className="bg-[#1A0B2E]">External Link</option>
                                </select>
                              </div>
                            </div>

                            {/* Venue, Date & Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                              <div className="group">
                                <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Venue</label>
                                <input
                                  type="text"
                                  value={newEvent.venue}
                                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl sm:rounded-2xl focus:border-[#CDB7D9] outline-none"
                                />
                              </div>

                              <div className="group">
                                <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Date</label>
                                <input
                                  type="date"
                                  value={newEvent.date}
                                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl sm:rounded-2xl focus:border-[#CDB7D9] outline-none"
                                />
                              </div>

                              <div className="group">
                                <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Time</label>
                                <input
                                  type="time"
                                  value={newEvent.time}
                                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl sm:rounded-2xl focus:border-[#CDB7D9] outline-none"
                                />
                              </div>
                            </div>

                            {/* Reg Data */}
                            {newEvent.registrationMethod === 'external' ? (
                              <div className="group">
                                <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Registration Link</label>
                                <input
                                  type="url"
                                  required
                                  value={newEvent.registrationLink}
                                  onChange={(e) => setNewEvent({ ...newEvent, registrationLink: e.target.value })}
                                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl sm:rounded-2xl focus:border-[#CDB7D9] outline-none"
                                />
                              </div>
                            ) : (
                              <div className="p-4 sm:p-6 bg-black/20 rounded-2xl border border-[#CDB7D9]/10">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="text-white font-medium">Form Fields</h4>
                                  <button
                                    type="button"
                                    onClick={addFormField}
                                    className="text-xs bg-[#CDB7D9]/10 hover:bg-[#CDB7D9] hover:text-[#280338] px-3 py-1 rounded-lg transition-colors text-[#CDB7D9]"
                                  >
                                    Add Field
                                  </button>
                                </div>

                                <div className="space-y-3">
                                  {formFields.map((field, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-2">
                                      <input
                                        placeholder="Label"
                                        value={field.label}
                                        onChange={(e) => updateFormField(idx, 'label', e.target.value)}
                                        className="flex-1 px-4 py-2 bg-[#1A0B2E] border border-[#CDB7D9]/20 rounded-xl text-sm"
                                      />
                                      <select
                                        value={field.type}
                                        onChange={(e) => updateFormField(idx, 'type', e.target.value)}
                                        className="px-4 py-2 bg-[#1A0B2E] border border-[#CDB7D9]/20 rounded-xl text-sm"
                                      >
                                        <option value="text">Text</option>
                                        <option value="number">Number</option>
                                        <option value="email">Email</option>
                                      </select>
                                      <button
                                        type="button"
                                        onClick={() => removeFormField(idx)}
                                        className="text-red-400 hover:text-red-300 px-2"
                                      >
                                        <FontAwesomeIcon icon={faTimes} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-[#CDB7D9] text-[#280338] font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(205,183,217,0.3)] hover:-translate-y-0.5 transition-all text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                              {isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPaperPlane} />}
                              {isSubmitting ? 'Sending...' : 'Send for Review'}
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="max-w-4xl mx-auto">
                    <button onClick={() => setShowAddEvent(false)} className="flex items-center gap-2 text-[#CDB7D9]/70 hover:text-[#CDB7D9] mb-4">
                      <FontAwesomeIcon icon={faChevronLeft} /> Back to Events
                    </button>
                    <div className="bg-[#B7C9D9]/5 backdrop-blur-xl border border-[#CDB7D9]/20 rounded-3xl p-8">
                      <h3 className="text-2xl text-white font-abril mb-6">Create New Event</h3>
                      <form onSubmit={handleCreateEvent} className="space-y-6">

                        {/* Club & Event Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="group">
                            <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Club</label>
                            <select
                              required
                              value={club.name}
                              disabled
                              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl sm:rounded-2xl focus:border-[#CDB7D9] outline-none"
                            >
                              <option value={club.name} className="bg-[#1A0B2E]">
                                {club.name}
                              </option>
                            </select>
                          </div>

                          <div className="group">
                            <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Event Name</label>
                            <input
                              type="text"
                              required
                              value={newEvent.eventName}
                              onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
                              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl sm:rounded-2xl focus:border-[#CDB7D9] outline-none"
                            />
                          </div>
                        </div>

                        {/* Poster & Registration Fees */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="group">
                            <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Poster</label>
                            <div className="space-y-2">
                              <div className="relative">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handlePosterSelect}
                                  className="hidden"
                                  id="poster-upload"
                                />
                                <label
                                  htmlFor="poster-upload"
                                  className="flex flex-col sm:flex-row items-center justify-center w-full px-4 py-4 bg-black/20 border border-dashed border-[#CDB7D9]/30 rounded-xl sm:rounded-2xl cursor-pointer hover:bg-[#CDB7D9]/5 transition-all text-[#CDB7D9]/70 gap-2"
                                >
                                  {isSubmittingEvent ? (
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                  ) : (
                                    <FontAwesomeIcon icon={faUpload} />
                                  )}
                                  <span>{newEvent.posterPreview ? 'Change Poster' : 'Click to Upload'}</span>
                                </label>
                              </div>

                              {newEvent.posterPreview ? (
                                <div className="relative mt-2 rounded-xl overflow-hidden border border-[#CDB7D9]/20 h-40 sm:h-32 w-full">
                                  <img
                                    src={newEvent.posterPreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <input
                                  type="url"
                                  placeholder="Or paste URL"
                                  value={newEvent.posterUrl}
                                  onChange={(e) => setNewEvent({ ...newEvent, posterUrl: e.target.value })}
                                  className="w-full px-4 py-2 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl focus:border-[#CDB7D9] outline-none text-sm"
                                />
                              )}
                            </div>
                          </div>

                          <div className="group">
                            <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">
                              Registration Fee
                            </label>

                            {newEvent.registrationFee.map((fee, index) => (
                              <div
                                key={index}
                                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2"
                              >
                                <input
                                  type="text"
                                  required
                                  placeholder="Ticket Type"
                                  value={fee.type}
                                  onChange={(e) => handleFeeChange(index, 'type', e.target.value)}
                                  className="w-full sm:w-2/5 px-4 py-2 bg-black/20 border border-[#CDB7D9]/20 focus:border-[#CDB7D9] outline-none text-white rounded-2xl"
                                />

                                <input
                                  type="text"
                                  placeholder="Fee"
                                  value={fee.fee}
                                  onChange={(e) => handleFeeChange(index, 'fee', e.target.value)}
                                  className="w-full sm:w-2/5 px-4 py-2 bg-black/20 border border-[#CDB7D9]/20 focus:border-[#CDB7D9] outline-none text-white rounded-2xl"
                                />

                                <button
                                  type="button"
                                  onClick={() => handleRemoveFee(index)}
                                  className="w-full sm:w-auto px-4 py-2 bg-white/10 text-red-600 rounded-xl"
                                >
                                  X
                                </button>
                              </div>
                            ))}

                            <div className="flex justify-center">
                              <button
                                type="button"
                                onClick={handleAddFee}
                                className="px-6 py-2 mt-4 bg-white/10 text-xl text-blue-500 rounded-2xl"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Event Type & Registration Method */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="group">
                            <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Event Type</label>
                            <select
                              value={newEvent.eventType}
                              onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl sm:rounded-2xl focus:border-[#CDB7D9] outline-none"
                            >
                              <option value="technical" className="bg-[#1A0B2E]">Technical</option>
                              <option value="non-technical" className="bg-[#1A0B2E]">Non-Technical</option>
                            </select>
                          </div>

                          <div className="group">
                            <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Registration Method</label>
                            <select
                              value={newEvent.registrationMethod}
                              onChange={(e) => setNewEvent({ ...newEvent, registrationMethod: e.target.value })}
                              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl sm:rounded-2xl focus:border-[#CDB7D9] outline-none"
                            >
                              <option value="internal" className="bg-[#1A0B2E]">Internal Form</option>
                              <option value="external" className="bg-[#1A0B2E]">External Link</option>
                            </select>
                          </div>
                        </div>

                        {/* Venue, Date & Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          <div className="group">
                            <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Venue</label>
                            <input
                              type="text"
                              value={newEvent.venue}
                              onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl sm:rounded-2xl focus:border-[#CDB7D9] outline-none"
                            />
                          </div>

                          <div className="group">
                            <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Date</label>
                            <input
                              type="date"
                              value={newEvent.eventDate}
                              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl sm:rounded-2xl focus:border-[#CDB7D9] outline-none"
                            />
                          </div>

                          <div className="group">
                            <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Time</label>
                            <input
                              type="time"
                              value={newEvent.eventTime}
                              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl sm:rounded-2xl focus:border-[#CDB7D9] outline-none"
                            />
                          </div>
                        </div>

                        {/* Reg Data */}
                        {newEvent.registrationMethod === 'external' ? (
                          <div className="group">
                            <label className="block text-[#CDB7D9]/70 text-xs uppercase tracking-wider mb-2">Registration Link</label>
                            <input
                              type="url"
                              required
                              value={newEvent.registrationLink}
                              onChange={(e) => setNewEvent({ ...newEvent, registrationLink: e.target.value })}
                              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/20 border border-[#CDB7D9]/20 text-white rounded-xl sm:rounded-2xl focus:border-[#CDB7D9] outline-none"
                            />
                          </div>
                        ) : (
                          <div className="p-4 sm:p-6 bg-black/20 rounded-2xl border border-[#CDB7D9]/10">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-white font-medium">Form Fields</h4>
                              <button
                                type="button"
                                onClick={addFormField}
                                className="text-xs bg-[#CDB7D9]/10 hover:bg-[#CDB7D9] hover:text-[#280338] px-3 py-1 rounded-lg transition-colors text-[#CDB7D9]"
                              >
                                Add Field
                              </button>
                            </div>

                            <div className="space-y-3">
                              {formFields.map((field, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row gap-2">
                                  <input
                                    placeholder="Label"
                                    value={field.label}
                                    onChange={(e) => updateFormField(idx, 'label', e.target.value)}
                                    className="flex-1 px-4 py-2 bg-[#1A0B2E] border border-[#CDB7D9]/20 rounded-xl text-sm"
                                  />
                                  <select
                                    value={field.type}
                                    onChange={(e) => updateFormField(idx, 'type', e.target.value)}
                                    className="px-4 py-2 bg-[#1A0B2E] border border-[#CDB7D9]/20 rounded-xl text-sm"
                                  >
                                    <option value="text">Text</option>
                                    <option value="number">Number</option>
                                    <option value="email">Email</option>
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => removeFormField(idx)}
                                    className="text-red-400 hover:text-red-300 px-2"
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Submit */}
                        <button
                          disabled={isSubmittingEvent}
                          type="submit"
                          className="w-full py-4 bg-[#CDB7D9] text-[#280338] font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(205,183,217,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmittingEvent ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : null}
                          {isSubmittingEvent ? 'Creating...' : 'Create Event'}
                        </button>

                      </form>
                    </div>
                  </div>
                )}

                
              </motion.div>
            )}

            {activeTab === 'registrations' && (
              <motion.div
                key="registrations"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-[#B7C9D9]/5 backdrop-blur-md border border-[#CDB7D9]/10 rounded-3xl overflow-hidden shadow-2xl p-6"
              >
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1 bg-black/20 rounded-xl overflow-hidden">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#CDB7D9]/30" />
                    <input
                      type="text"
                      placeholder="Search registrations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-transparent text-[#CDB7D9] outline-none placeholder-[#CDB7D9]/30"
                    />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={filterEvent}
                      onChange={(e) => setFilterEvent(e.target.value)}
                      className="w-full px-6 py-4 bg-black/20 text-[#CDB7D9] rounded-xl border border-transparent focus:border-[#CDB7D9]/30 outline-none cursor-pointer appearance-none"
                    >
                      <option value="all" className="bg-[#1A0B2E]">All Events</option>
                      {events.map(e => <option key={e.$id} value={e.$id} className="bg-[#1A0B2E]">{e.name}</option>)}
                    </select>
                    <FontAwesomeIcon icon={faChevronRight} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-[#CDB7D9]/50 pointer-events-none" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[#CDB7D9] text-left border-collapse">
                    <thead className="bg-[#CDB7D9]/5 text-[#CDB7D9]/50 uppercase text-xs font-normal tracking-widest leading-loose">
                      <tr>
                        <th className="px-6 py-4 whitespace-nowrap">Event</th>
                        <th className="px-6 py-4 whitespace-nowrap">Date</th>
                        {paginatedRegistrations.length > 0 && paginatedRegistrations[0].formData &&
                          Object.keys(paginatedRegistrations[0].formData)
                            .filter(key => key !== 'eventId')
                            .map(key => (
                              <th key={key} className="px-6 py-4 whitespace-nowrap capitalize">
                                {key.replace(/_/g, ' ')}
                              </th>
                            ))
                        }
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#CDB7D9]/5">
                      {paginatedRegistrations.map((reg, index) => {
                        const eventName = events.find(e => e.$id === reg.eventId)?.name || '-';
                        const formDataKeys = reg.formData ? Object.keys(reg.formData).filter(key => key !== 'eventId') : [];
                        return (
                          <tr key={index} className="hover:bg-[#CDB7D9]/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">{eventName}</td>
                            <td className="px-6 py-4">{new Date(reg.$createdAt).toLocaleDateString()}</td>
                            {formDataKeys.map(key => (
                              <td key={key} className="px-6 py-4">
                                {reg.formData[key] || '-'}
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-full border border-[#CDB7D9]/20 flex items-center justify-center text-[#CDB7D9]/50 hover:bg-[#CDB7D9] hover:text-[#280338] disabled:opacity-30 transition-all font-bold"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <span className="text-sm font-medium text-[#CDB7D9]/70">Page {currentPage} of {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-full border border-[#CDB7D9]/20 flex items-center justify-center text-[#CDB7D9]/50 hover:bg-[#CDB7D9] hover:text-[#280338] disabled:opacity-30 transition-all font-bold"
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
      {/* Notifications */}
      <div className="fixed top-36 right-6 w-80 z-50 space-y-3">
        {notifications.map(n => (
          <NotificationItem key={n.id} notification={n} onDismiss={dismissNotification} />
        ))}
      </div>
    </div>
  );
}
