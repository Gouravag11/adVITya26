'use client';

import { useState, useEffect } from 'react';
import { databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { useAuth } from '@/contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPlus, faTrash, faEdit, faSearch, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function CoordinatorDashboard({ clubName }) {
  const { userData } = useAuth();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    posterUrl: '',
    registrationFee: 0,
    registrationMethod: 'internal',
    registrationLink: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const itemsPerPage = 50;

  const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const CLUBS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CLUBS_COLLECTION_ID;
  const EVENTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_EVENTS_COLLECTION_ID;
  const REGISTRATIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_REGISTRATIONS_COLLECTION_ID;

  const fetchClubData = async () => {
    if (!userData?.clubName) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const clubRes = await databases.listDocuments(
        DATABASE_ID,
        CLUBS_COLLECTION_ID,
        [Query.equal('name', userData.clubName)]
      );

      if (clubRes.documents.length === 0) {
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
      setEvents(eventsRes.documents);

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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubData();
  }, [userData?.clubName]);

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (newEvent.registrationMethod === 'internal' && formFields.length === 0) {
      alert('Please add at least one form field for internal registration');
      return;
    }

    try {
      await databases.createDocument(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        ID.unique(),
        {
          clubId: club.$id,
          name: newEvent.eventName,
          poster: newEvent.posterUrl,
          registrationFee: Number(newEvent.registrationFee),
          registrationMethod: newEvent.registrationMethod,
          registrationLink: newEvent.registrationMethod === 'external' ? newEvent.registrationLink : null,
          formFields: newEvent.registrationMethod === 'internal' ? JSON.stringify(formFields) : null,
        }
      );

      setNewEvent({
        eventName: '',
        posterUrl: '',
        registrationMethod: 'internal',
        registrationLink: '',
      });
      setFormFields([]);
      setShowAddEvent(false);
      alert('Event added successfully!');
      fetchClubData(); // Refresh
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error adding event');
    }
  };

  const handleEditEvent = async (e) => {
    e.preventDefault();

    if (newEvent.registrationMethod === 'internal' && formFields.length === 0) {
      alert('Please add at least one form field for internal registration');
      return;
    }

    try {
      await databases.updateDocument(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        editingEventId,
        {
          name: newEvent.eventName,
          poster: newEvent.posterUrl,
          registrationFee: Number(newEvent.registrationFee),
          registrationMethod: newEvent.registrationMethod,
          registrationLink: newEvent.registrationMethod === 'external' ? newEvent.registrationLink : null,
          formFields: newEvent.registrationMethod === 'internal' ? JSON.stringify(formFields) : null,
        }
      );

      setEditingEventId(null);
      setNewEvent({
        eventName: '',
        posterUrl: '',
        registrationFee: 0,
        registrationMethod: 'internal',
        registrationLink: '',
      });
      setFormFields([]);
      setShowAddEvent(false);
      alert('Event updated successfully!');
      fetchClubData();
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await databases.deleteDocument(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        eventId
      );
      alert('Event deleted successfully!');
      fetchClubData();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  const startEditingEvent = (event) => {
    setEditingEventId(event.$id);

    let parsedFields = [];
    if (event.formFields) {
      try {
        parsedFields = typeof event.formFields === 'string' ? JSON.parse(event.formFields) : event.formFields;
      } catch (e) { }
    }

    setNewEvent({
      eventName: event.name,
      posterUrl: event.poster || '',
      registrationFee: event.registrationFee || 0,
      registrationMethod: event.registrationMethod,
      registrationLink: event.registrationLink || '',
    });
    setFormFields(parsedFields);
    setShowAddEvent(true);
  };

  const addFormField = () => {
    setFormFields([
      ...formFields,
      { name: '', label: '', type: 'text', required: false }
    ]);
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
      <div className="flex items-center justify-center min-h-screen">
        <FontAwesomeIcon icon={faSpinner} spin className="text-6xl text-pink-600" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-black/80 backdrop-blur-lg border border-white/10 rounded-3xl p-12 text-center max-w-2xl">
          <p className="text-3xl font-abril text-white">No club assigned or found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <h1 className="text-5xl md:text-6xl font-abril text-white mb-3">
        Coordinator Dashboard
      </h1>
      <p className="text-xl text-gray-300 mb-12">Managing: <span className="font-bold text-pink-500">{club.name}</span></p>

      <div className="bg-black/80 backdrop-blur-lg border border-white/10 rounded-2xl p-2 mb-8 flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${activeTab === 'events'
            ? 'bg-purple-600 text-white shadow-lg'
            : 'text-gray-300 hover:bg-white/10'
            }`}
        >
          Events ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          className={`px-6 py-3 rounded-xl transition-all duration-300 font-semibold ${activeTab === 'registrations'
            ? 'bg-purple-600 text-white shadow-lg'
            : 'text-gray-300 hover:bg-white/10'
            }`}
        >
          Registrations ({allRegistrations.length})
        </button>
      </div>

      {activeTab === 'events' && (
        <div>
          <button
            onClick={() => {
              setShowAddEvent(!showAddEvent);
              setEditingEventId(null);
              setNewEvent({
                eventName: '',
                posterUrl: '',
                registrationMethod: 'internal',
                registrationLink: '',
              });
              setFormFields([]);
            }}
            className="mb-8 px-8 py-4 bg-purple-600 text-white rounded-xl hover:opacity-90 hover:shadow-xl transition-all duration-300 font-semibold"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New Event
          </button>

          {showAddEvent && (
            <div className="bg-black/80 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-8">
              <h3 className="text-3xl font-abril text-white mb-6">
                {editingEventId ? 'Edit Event' : 'Add New Event'}
              </h3>
              <form onSubmit={editingEventId ? handleEditEvent : handleAddEvent} className="space-y-6">
                <div>
                  <label className="block text-white mb-2 font-semibold">Event Name *</label>
                  <input
                    type="text"
                    required
                    value={newEvent.eventName}
                    onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 text-white rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-900 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Registration Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newEvent.registrationFee}
                    onChange={(e) => setNewEvent({ ...newEvent, registrationFee: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 text-white rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-900 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Poster URL</label>
                  <input
                    type="url"
                    value={newEvent.posterUrl}
                    onChange={(e) => setNewEvent({ ...newEvent, posterUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 text-white rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-900 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Registration Method</label>
                  <select
                    value={newEvent.registrationMethod}
                    onChange={(e) => setNewEvent({ ...newEvent, registrationMethod: e.target.value })}
                    className="w-full px-4 py-3 bg-black border-2 border-white/10 text-white rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-900 outline-none transition-all"
                  >
                    <option value="internal">Use Site's Form</option>
                    <option value="external">External Link</option>
                  </select>
                </div>

                {newEvent.registrationMethod === 'external' ? (
                  <div>
                    <label className="block text-white mb-2 font-semibold">Registration Link *</label>
                    <input
                      type="url"
                      required
                      value={newEvent.registrationLink}
                      onChange={(e) => setNewEvent({ ...newEvent, registrationLink: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 text-white rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-900 outline-none transition-all"
                    />
                  </div>
                ) : (
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-4">Form Fields (At least 1 required)</h4>
                    <div className="space-y-4 mb-4">
                      {formFields.map((field, index) => (
                        <div key={index} className="border-2 border-white/10 rounded-xl p-5 bg-black/30">
                          <div className="flex justify-between items-start mb-4">
                            <h5 className="text-white font-semibold">Field {index + 1}</h5>
                            <button
                              type="button"
                              onClick={() => removeFormField(index)}
                              className="text-pink-600 hover:text-red-600 transition-colors"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <input
                              type="text"
                              placeholder="Field Label"
                              value={field.label}
                              onChange={(e) => updateFormField(index, 'label', e.target.value)}
                              className="px-4 py-2 bg-white/5 border-2 border-white/10 text-white rounded-lg outline-none focus:border-purple-600 transition-all"
                              required
                            />
                            <select
                              value={field.type}
                              onChange={(e) => updateFormField(index, 'type', e.target.value)}
                              className="px-4 py-2 bg-black border-2 border-white/10 text-white rounded-lg outline-none focus:border-purple-600 transition-all"
                            >
                              <option value="text">Text</option>
                              <option value="email">Email</option>
                              <option value="tel">Phone</option>
                              <option value="number">Number</option>
                              <option value="textarea">Textarea</option>
                              <option value="select">Select</option>
                            </select>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => updateFormField(index, 'required', e.target.checked)}
                              />
                              <span className="text-gray-300">Required</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addFormField}
                      className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-semibold"
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Add Field
                    </button>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 bg-purple-600 text-white rounded-xl hover:opacity-90 hover:shadow-lg transition-all duration-300 font-semibold"
                  >
                    {editingEventId ? 'Update Event' : 'Add Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddEvent(false);
                      setEditingEventId(null);
                      setFormFields([]);
                    }}
                    className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.$id} className="bg-black/80 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:scale-105 hover:border-purple-600/50 transition-all duration-300">
                  {event.poster && (
                    <div className="relative h-48 overflow-hidden rounded-xl mb-4">
                      <img
                        src={event.poster}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-2xl font-abril text-white mb-2">{event.name}</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Method: <span className="font-bold text-purple-400">{event.registrationMethod}</span>
                  </p>
                  {event.registrationMethod === 'internal' && (
                    <p className="text-sm text-gray-400 mb-4">
                      Form Fields: <span className="font-bold text-pink-600">
                        {event.formFields ? JSON.parse(event.formFields).length : 0}
                      </span>
                    </p>
                  )}
                  {event.registrationMethod === 'external' && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-pink-500 hover:underline mb-4 block font-semibold"
                    >
                      View Registration Link
                    </a>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEditingEvent(event)}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:opacity-90 transition-all text-sm font-semibold"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.$id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-all text-sm font-semibold"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-black/80 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center col-span-full">
                <p className="text-gray-300 text-lg">No events added yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'registrations' && (
        <div className="bg-black/80 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <div className="mb-8 grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white mb-3 font-semibold">
                <FontAwesomeIcon icon={faSearch} className="mr-2" />
                Search in form data
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search..."
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 text-white rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-900 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-white mb-3 font-semibold">Filter by Event</label>
              <select
                value={filterEvent}
                onChange={(e) => {
                  setFilterEvent(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 bg-black border-2 border-white/10 text-white rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-900 outline-none transition-all"
              >
                <option value="all">All Events</option>
                {events.map((event) => (
                  <option key={event.$id} value={event.$id}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-gray-300 mb-6 font-semibold">
            Showing {filteredRegistrations.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, filteredRegistrations.length)} of {filteredRegistrations.length} registrations
          </p>

          {paginatedRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300 text-lg">No registrations found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full border-collapse">
                <thead className="bg-purple-900/50 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold border-b border-white/20 whitespace-nowrap">Event Name</th>
                    <th className="px-4 py-4 text-left font-semibold border-b border-white/20 whitespace-nowrap">Date</th>
                    {paginatedRegistrations.length > 0 && paginatedRegistrations[0].formData &&
                      Object.keys(paginatedRegistrations[0].formData)
                        .filter(key => key !== 'eventId')
                        .map(key => (
                          <th key={key} className="px-4 py-4 text-left font-semibold border-b border-white/20 whitespace-nowrap">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </th>
                        ))
                    }
                  </tr>
                </thead>
                <tbody>
                  {paginatedRegistrations.map((reg, index) => {
                    const eventName = events.find(e => e.$id === reg.eventId)?.name || '-';
                    const formDataKeys = reg.formData ? Object.keys(reg.formData).filter(key => key !== 'eventId') : [];

                    return (
                      <tr key={startIndex + index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4 font-medium text-gray-200 whitespace-nowrap">{eventName}</td>
                        <td className="px-4 py-4 text-gray-300 whitespace-nowrap">
                          {new Date(reg.$createdAt).toLocaleDateString()}
                        </td>
                        {formDataKeys.map(key => (
                          <td key={key} className="px-4 py-4 text-gray-300">
                            {reg.formData[key] || '-'}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <span className="text-white font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
