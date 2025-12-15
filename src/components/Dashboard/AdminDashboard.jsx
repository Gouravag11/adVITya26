import { useState, useEffect } from 'react';
import { databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faUsers, faBuilding, faSpinner, faSearch,
  faChevronLeft, faChevronRight,
  faTachometerAlt, faAngleDoubleLeft, faAngleDoubleRight,
  faTrophy, faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

import { useAuth } from '@/contexts/AuthContext';

const COLORS = ['#CDB7D9', '#9F87C4', '#765BA0', '#4E317D', '#280338'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [clubs, setClubs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);



  const [showAddClub, setShowAddClub] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userClubFilter, setUserClubFilter] = useState('all');
  const [clubCategoryFilter, setClubCategoryFilter] = useState('all');

  const [newClub, setNewClub] = useState({
    name: '',
    category: 'technical',
    description: '',
    logo: ''
  });

  const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const CLUBS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CLUBS_COLLECTION_ID;
  const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;
  const REGISTRATIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_REGISTRATIONS_COLLECTION_ID;
  const EVENTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_EVENTS_COLLECTION_ID;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clubsRes, usersRes, registrationsRes, eventsRes] = await Promise.all([
        databases.listDocuments(DATABASE_ID, CLUBS_COLLECTION_ID, [Query.limit(100)]),
        databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [Query.limit(100)]),
        databases.listDocuments(DATABASE_ID, REGISTRATIONS_COLLECTION_ID, [Query.limit(1000)]),
        databases.listDocuments(DATABASE_ID, EVENTS_COLLECTION_ID, [Query.limit(100)])
      ]);

      const events = eventsRes.documents;
      const allUsers = usersRes.documents;

      const clubsData = clubsRes.documents.map(club => {
        const clubEvents = events.filter(e => e.clubId === club.$id);
        const coordinator = allUsers.find(u => u.clubName === club.name && u.role === 'coordinator');
        return {
          ...club,
          events: clubEvents,
          coordinatorName: coordinator ? coordinator.name : 'Unassigned'
        };
      });

      setClubs(clubsData);
      setUsers(allUsers);
      setRegistrations(registrationsRes.documents);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  const handleAddClub = async (e) => {
    e.preventDefault();
    try {
      await databases.createDocument(
        DATABASE_ID,
        CLUBS_COLLECTION_ID,
        ID.unique(),
        {
          name: newClub.name,
          category: newClub.category,
          description: newClub.description || '',
        }
      );
      setNewClub({ name: '', category: 'technical', description: '' });
      setShowAddClub(false);
      alert('Club added successfully!');
      fetchData();
    } catch (error) {
      console.error('Error adding club:', error);
      alert('Error adding club');
    }
  };

  const handlePromoteToCoordinator = async (userId, currentRole) => {
    if (currentRole === 'coordinator') return;
    try {
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        { role: 'coordinator' }
      );
      alert('User promoted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error promoting user:', error);
      alert('Error promoting user');
    }
  };

  const handleAssignClub = async (userId, clubName) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        { clubName: clubName }
      );
      alert('Club assigned successfully!');
      fetchData();
    } catch (error) {
      console.error('Error assigning club:', error);
      alert('Error assigning club');
    }
  };



  const getTopClubsData = () => {
    const data = clubs.map(club => {
      const count = registrations.filter(r => r.clubId === club.$id || r.clubId === club.name).length;
      return { name: club.name, count, coordinator: club.coordinatorName };
    });
    return data.sort((a, b) => b.count - a.count);
  };

  const getEventsPieData = () => {
    const categoryCounts = {};
    clubs.forEach(club => {
      if (!categoryCounts[club.category]) categoryCounts[club.category] = 0;
      categoryCounts[club.category] += club.events?.length || 0;
    });
    return Object.keys(categoryCounts).map((cat, index) => ({
      name: cat,
      uv: categoryCounts[cat],
      fill: COLORS[index % COLORS.length]
    }));
  };




  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) || '') ||
      (user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) || '');
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
    const matchesClub = userClubFilter === 'all' || user.clubName === userClubFilter;
    return matchesSearch && matchesRole && matchesClub;
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A0B2E]/90 border border-[#CDB7D9]/20 p-4 rounded-xl backdrop-blur-md shadow-xl">
          <p className="font-abril text-[#CDB7D9] text-lg mb-1">{label}</p>
          <p className="text-white font-mono text-sm">
            {payload[0].value} <span className="text-[#CDB7D9]/60">Items</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F0518]">
        <FontAwesomeIcon icon={faSpinner} spin className="text-6xl text-[#CDB7D9]" />
      </div>
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
        <img src="/Herosection_BG.svg" alt="BG" className="w-full h-full object-cover opacity-20" />
      </motion.div>

      <motion.div
        animate={{ width: isSidebarOpen ? '18rem' : '5rem' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-[#1A0B2E]/80 border-r border-[#CDB7D9]/10 z-20 flex flex-col sticky top-0 h-screen pt-10 shadow-[5px_0_30px_rgba(0,0,0,0.5)]"
      >
        <div className="p-4 flex items-center justify-between">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 pl-2"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#CDB7D9] to-[#4E317D] flex items-center justify-center">
                  <span className="font-medium text-[#1A0B2E] text-xs">AD</span>
                </div>
                <h1 className="text-xl font-medium text-[#CDB7D9] tracking-wider">ADMIN</h1>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-[#CDB7D9]/10 rounded-full transition-colors">
            <FontAwesomeIcon icon={isSidebarOpen ? faAngleDoubleLeft : faAngleDoubleRight} className="text-[#CDB7D9]/50" />
          </button>
        </div>

        <nav className="flex-1 py-8 flex flex-col gap-2 px-3">
          {[
            { id: 'overview', label: 'Overview', icon: faTachometerAlt },
            { id: 'clubs', label: 'Clubs', icon: faBuilding },
            { id: 'users', label: 'Users', icon: faUsers },
            { id: 'registrations', label: 'Registrations', icon: faSearch },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setShowAddClub(false); }}
              className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 font-medium group cursor-pointer ${activeTab === item.id
                ? 'bg-gradient-to-r from-[#CDB7D9]/20 to-transparent text-[#CDB7D9]'
                : 'text-[#CDB7D9]/50 hover:text-[#CDB7D9] hover:bg-[#CDB7D9]/5'
                }`}
            >
              <FontAwesomeIcon icon={item.icon} className={`text-lg transition-transform group-hover:scale-110 ${isSidebarOpen ? 'mr-4' : 'mx-auto'}`} />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="whitespace-nowrap overflow-hidden">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>
      </motion.div>

      <div className="flex-1 pt-8 flex flex-col  h-screen overflow-hidden z-10 relative">
        <header className="h-24 flex items-end px-10 justify-between z-20 sticky top-0">
          <div>
            <h2 className="text-4xl font-abril text-white tracking-wide">
              {activeTab === 'overview' ? 'Overview' :
                activeTab === 'clubs' ? (showAddClub ? 'New Club' : 'Clubs') :
                  activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-[#CDB7D9]/50 text-sm mt-1 font-medium">Welcome back, {user?.name || 'Admin'}</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 scrollbar-thin scrollbar-thumb-[#CDB7D9]/10">
          <AnimatePresence mode="wait">

            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: 'Total Registrations', value: registrations.length, icon: faUsers, color: 'text-pink-400' },
                    { label: 'Active Clubs', value: clubs.length, icon: faBuilding, color: 'text-purple-400' },
                    { label: 'Total Events', value: clubs.reduce((acc, c) => acc + (c.events?.length || 0), 0), icon: faCalendarAlt, color: 'text-indigo-400' },
                  ].map((stat, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#CDB7D9]/5 to-transparent rounded-3xl blur-xl group-hover:opacity-100 opacity-50 transition-opacity"></div>
                      <div className="relative flex items-center gap-6 p-4">
                        <div className={`text-5xl font-light ${stat.color} drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
                          {stat.value}
                        </div>
                        <div>
                          <h3 className="text-[#CDB7D9]/60 uppercase text-xs font-normal tracking-widest mb-1">{stat.label}</h3>
                          <div className="h-1 w-12 bg-gradient-to-r from-[#CDB7D9]/50 to-transparent rounded-full"></div>
                        </div>
                        <FontAwesomeIcon icon={stat.icon} className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl text-white/5" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-12">

                  <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-2xl font-abril text-white flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      Top Performing Clubs
                    </h3>

                    <div className="h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#CDB7D9]/20 scrollbar-track-transparent space-y-3">
                      {getTopClubsData().map((club, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-[#B7C9D9]/5 backdrop-blur-sm border border-[#CDB7D9]/10 rounded-2xl hover:bg-[#CDB7D9]/10 transition-all group">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${index === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            index === 1 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/30' :
                              index === 2 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/30' :
                                'bg-[#CDB7D9]/10 text-[#CDB7D9] border border-[#CDB7D9]/20'
                            }`}>
                            {index + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-lg truncate">{club.name}</h4>
                            <p className="text-[#CDB7D9]/50 text-xs uppercase tracking-wide truncate">
                              Coordinator: <span className="text-[#CDB7D9]/70">{club.coordinator}</span>
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-2xl text-white font-mono">{club.count}</p>
                            <p className="text-[10px] text-[#CDB7D9]/40 uppercase tracking-widest">Regs</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-abril text-white mb-6 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Categories
                    </h3>
                    <div className="h-[400px] w-full relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getEventsPieData()}
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="uv"
                          >
                            {getEventsPieData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(255,255,255,0.05)" />
                            ))}
                          </Pie>
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            content={({ payload }) => (
                              <ul className="flex flex-wrap justify-center gap-4 mt-4">
                                {payload.map((entry, index) => (
                                  <li key={`item-${index}`} className="flex items-center gap-2 text-xs text-[#CDB7D9]/70">
                                    <span style={{ backgroundColor: entry.color }} className="w-2 h-2 rounded-full"></span>
                                    {entry.value}
                                  </li>
                                ))}
                              </ul>
                            )}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                        <div className="text-4xl text-white font-bold">{clubs.length}</div>
                        <div className="text-[#CDB7D9]/50 text-xs uppercase tracking-widest">Clubs</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'clubs' && (
              <motion.div
                key="clubs"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {!showAddClub ? (
                  <>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                      <div className="flex bg-[#B7C9D9]/5 p-1 rounded-xl backdrop-blur-md border border-[#CDB7D9]/10">
                        {['all', 'technical', 'non-technical'].map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setClubCategoryFilter(filter)}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all capitalize ${clubCategoryFilter === filter
                              ? 'bg-[#CDB7D9] text-[#280338] shadow-[0_0_15px_rgba(205,183,217,0.3)]'
                              : 'text-[#CDB7D9]/60 hover:text-[#CDB7D9]'
                              }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setShowAddClub(true)}
                        className="px-8 py-3 bg-gradient-to-r from-[#CDB7D9] to-[#9F87C4] text-[#280338] rounded-full cursor-pointer font-bold flex items-center gap-3 hover:-translate-y-1"
                      >
                        <FontAwesomeIcon icon={faPlus} /> Create New
                      </button>
                    </div>

                    <div className="grid gap-4">
                      {clubs
                        .filter(c => clubCategoryFilter === 'all' || c.category === clubCategoryFilter)
                        .map((club) => (
                          <div key={club.$id} className="group relative overflow-hidden bg-[#B7C9D9]/5 backdrop-blur-md border border-[#CDB7D9]/10 rounded-2xl p-6 hover:bg-[#CDB7D9]/10 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#CDB7D9]/10 to-[#1A0B2E]/50 flex items-center justify-center border border-[#CDB7D9]/20 group-hover:scale-105 transition-transform">
                                <FontAwesomeIcon icon={faBuilding} className="text-2xl text-[#CDB7D9]" />
                              </div>

                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="text-xl font-medium text-white">{club.name}</h3>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider ${club.category === 'technical'
                                    ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                                    : 'bg-pink-500/10 text-pink-300 border-pink-500/20'
                                    }`}>
                                    {club.category}
                                  </span>
                                </div>
                                <p className="text-[#CDB7D9]/50 text-sm flex items-center gap-2">
                                  Coordinator: <span className="text-[#CDB7D9]">{club.coordinatorName}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-12 lg:pr-12">
                              <div className="text-center">
                                <p className="text-xl font-mono text-white">{club.events?.length || 0}</p>
                                <p className="text-[10px] text-[#CDB7D9]/40 uppercase tracking-widest">Events</p>
                              </div>
                              <div className="w-10 h-10 rounded-full border border-[#CDB7D9]/20 flex items-center justify-center text-[#CDB7D9]/40 group-hover:bg-[#CDB7D9] group-hover:text-[#280338] transition-all cursor-pointer">
                                <FontAwesomeIcon icon={faChevronRight} />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
                    <button onClick={() => setShowAddClub(false)} className="mb-8 text-[#CDB7D9]/50 hover:text-[#CDB7D9] flex items-center gap-2 transition-colors group cursor-pointer">
                      <div className="p-2 rounded-full border border-[#CDB7D9]/20 group-hover:bg-[#CDB7D9] group-hover:text-[#280338] transition-all">
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </div>
                      <span className="font-medium">Back to Club List</span>
                    </button>

                    <div className="grid lg:grid-cols-5 gap-8">
                      <div className="lg:col-span-2 order-first lg:order-last">
                        <div className="bg-[#B7C9D9]/5 backdrop-blur-xl border border-[#CDB7D9]/20 rounded-3xl p-8 h-full min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-[#CDB7D9]/40 transition-colors cursor-pointer border-dashed">
                          <div className="w-24 h-24 rounded-full bg-[#CDB7D9]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            <FontAwesomeIcon icon={faPlus} className="text-3xl text-[#CDB7D9]/50 group-hover:text-[#CDB7D9]" />
                          </div>
                          <h4 className="text-xl text-white mb-2">Club Logo</h4>
                          <p className="text-[#CDB7D9]/50 text-sm max-w-[200px]">Drag and drop club logo here or click to browse</p>

                          <div className="absolute inset-0 bg-gradient-to-t from-[#CDB7D9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

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
                              className="peer w-full px-6 py-4 bg-[#000]/20 border border-[#CDB7D9]/20 text-white rounded-2xl focus:border-[#CDB7D9] focus:outline-none transition-all placeholder-transparent"
                              placeholder="Club Name"
                            />
                            <label className="absolute left-6 top-4 text-[#CDB7D9]/50 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#CDB7D9] peer-focus:bg-[#1A0B2E] peer-focus:px-2 pointer-events-none">
                              Club Name
                            </label>
                          </div>

                          <div className="relative group">
                            <select
                              value={newClub.category}
                              onChange={(e) => setNewClub({ ...newClub, category: e.target.value })}
                              className="w-full px-6 py-4 bg-[#000]/20 border border-[#CDB7D9]/20 text-white rounded-2xl focus:border-[#CDB7D9] focus:outline-none appearance-none cursor-pointer"
                            >
                              <option value="technical" className="bg-[#1A0B2E]">Technical</option>
                              <option value="non-technical" className="bg-[#1A0B2E]">Non-Technical</option>
                              <option value="pro-night" className="bg-[#1A0B2E]">Pro Night</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#CDB7D9]/50">
                              <FontAwesomeIcon icon={faChevronRight} className="rotate-90" />
                            </div>
                          </div>

                          <div className="relative group">
                            <textarea
                              value={newClub.description}
                              onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                              className="peer w-full px-6 py-4 bg-[#000]/20 border border-[#CDB7D9]/20 text-white rounded-2xl focus:border-[#CDB7D9] focus:outline-none transition-all placeholder-transparent h-40 resize-none"
                              placeholder="Description"
                            />
                            <label className="absolute left-6 top-4 text-[#CDB7D9]/50 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-[#CDB7D9] peer-focus:bg-[#1A0B2E] peer-focus:px-2 pointer-events-none">
                              Description
                            </label>
                          </div>

                          <button type="submit" className="w-full py-4 bg-[#CDB7D9] text-[#280338] font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(205,183,217,0.3)] hover:-translate-y-0.5 transition-all">
                            Add Club
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#B7C9D9]/5 backdrop-blur-md border border-[#CDB7D9]/10 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-8 border-b border-[#CDB7D9]/10 grid md:grid-cols-3 gap-6">
                  <div className="relative bg-[#000]/20 rounded-xl overflow-hidden">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#CDB7D9]/30" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-transparent text-[#CDB7D9] outline-none placeholder-[#CDB7D9]/30"
                    />
                  </div>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-6 py-4 bg-[#000]/20 text-[#CDB7D9] rounded-xl border border-transparent focus:border-[#CDB7D9]/30 outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-[#1A0B2E]">All Roles</option>
                    <option value="member" className="bg-[#1A0B2E]">Member</option>
                    <option value="coordinator" className="bg-[#1A0B2E]">Coordinator</option>
                    <option value="admin" className="bg-[#1A0B2E]">Admin</option>
                  </select>
                  <select
                    value={userClubFilter}
                    onChange={(e) => setUserClubFilter(e.target.value)}
                    className="px-6 py-4 bg-[#000]/20 text-[#CDB7D9] rounded-xl border border-transparent focus:border-[#CDB7D9]/30 outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-[#1A0B2E]">All Clubs</option>
                    {clubs.map(c => <option key={c.$id} value={c.name} className="bg-[#1A0B2E]">{c.name}</option>)}
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[#CDB7D9] text-left border-collapse">
                    <thead className="bg-[#CDB7D9]/5 text-[#CDB7D9]/50 uppercase text-xs font-normal tracking-widest leading-loose">
                      <tr>
                        <th className="px-8 py-6">User</th>
                        <th className="px-8 py-6">Role</th>
                        <th className="px-8 py-6">Club Affiliation</th>
                        <th className="px-8 py-6 text-right">Management</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#CDB7D9]/5">
                      {filteredUsers.map(user => (
                        <tr key={user.$id} className="hover:bg-[#CDB7D9]/5 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="font-medium text-white text-lg">{user.name}</div>
                            <div className="text-xs text-[#CDB7D9]/50 font-mono mt-1">{user.email}</div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`inline-flex items-center px-3 py-1 text-[10px] rounded-full font-bold uppercase tracking-widest border ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]' :
                              user.role === 'coordinator' ? 'bg-pink-500/10 text-pink-300 border-pink-500/20' :
                                'bg-white/5 text-gray-400 border-white/10'
                              }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            {user.clubName ? (
                              <span className="text-[#CDB7D9] font-medium">{user.clubName}</span>
                            ) : (
                              <span className="text-[#CDB7D9]/20 italic">Unassigned</span>
                            )}
                          </td>
                          <td className="px-8 py-5 text-right">
                            {user.role === 'member' && (
                              <button
                                onClick={() => handlePromoteToCoordinator(user.$id, user.role)}
                                className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-[#CDB7D9]/10 border border-[#CDB7D9]/20 text-[#CDB7D9] rounded-lg hover:bg-[#CDB7D9] hover:text-[#280338] text-xs font-bold uppercase transition-all"
                              >
                                Promote
                              </button>
                            )}
                            {user.role === 'coordinator' && (
                              <select
                                value={user.clubName || ''}
                                onChange={(e) => handleAssignClub(user.$id, e.target.value)}
                                className="px-3 py-2 bg-[#000]/40 border border-[#CDB7D9]/20 text-[#CDB7D9] rounded-lg text-xs outline-none focus:border-[#CDB7D9] cursor-pointer"
                              >
                                <option value="" className="bg-[#1A0B2E]">Assign Club</option>
                                {clubs.map(c => <option key={c.$id} value={c.name} className="bg-[#1A0B2E]">{c.name}</option>)}
                              </select>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'registrations' && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid gap-4"
              >
                {clubs.flatMap(club =>
                  club.events?.map(event => {
                    const count = registrations.filter(r => r.eventId === event.$id).length;
                    return (
                      <div key={event.$id} className="bg-[#B7C9D9]/5 backdrop-blur-md border border-[#CDB7D9]/10 rounded-2xl p-6 flex justify-between items-center hover:border-[#CDB7D9]/30 hover:bg-[#B7C9D9]/10 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-xl bg-[#CDB7D9]/10 flex items-center justify-center text-[#CDB7D9]">
                            <FontAwesomeIcon icon={faTrophy} />
                          </div>
                          <div>
                            <h3 className="text-xl font-medium text-white">{event.name}</h3>
                            <p className="text-[#CDB7D9]/50 text-sm">{club.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-mono text-[#CDB7D9]">{count}</div>
                          <p className="text-[10px] uppercase tracking-widest text-[#CDB7D9]/40">Registrations</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
