import { useEffect, useState } from 'react';
import { Query } from 'appwrite';
import { databases } from '../lib/appwrite';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Background3D from '../components/Background3D';
import TeamCardSimple from '../components/Team/TeamCardSimple';
import { motion } from 'framer-motion';

/* ---------------- UI HELPERS ---------------- */

const SectionTitle = ({ title }) => (
  <motion.h2
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text
      bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600
      mb-12 text-center uppercase tracking-widest"
  >
    {title}
  </motion.h2>
);

const SectionContainer = ({ children }) => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="relative z-10 w-full flex flex-col items-center mb-24"
  >
    {children}
  </motion.section>
);

/* ---------------- PAGE ---------------- */

function Team() {
  /* -------- STATIC LEADERSHIP -------- */

  const chancellor = {
    name: 'Dr. G. Vishwanathan',
    role: 'Chancellor',
    image: '/Chancellor.jpg',
  };

  const vps = [
    { name: 'Mr. Sankar Viswanathan', role: 'Vice President', image: 'Images/VP.jpg' },
    { name: 'Mrs. Kadhambari S Viswanathan', role: 'Assistant Vice President', image: 'Images/AVP.jpg' },
  ];

  const others = [
    { name: 'Prof. T. B. Sridharan', role: 'Pro-Vice Chancellor', image: 'Images/Pro_VC.jpg' },
    { name: 'Mr. K. K. Nair', role: 'Acting Registrar', image: 'Images/Registrar.jpg' },
  ];

  /* -------- APPWRITE DATA -------- */

  const [convenor, setConvenor] = useState(null);
  const [coConvenors, setCoConvenors] = useState([]);
  const [organizing, setOrganizing] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
        const collectionId = import.meta.env.VITE_APPWRITE_TEAM_COLLECTION_ID;

        if (!databaseId || !collectionId) {
          console.error("Appwrite Database or Team Collection ID is missing in .env");
          return;
        }

        const res = await databases.listDocuments(
          databaseId,
          collectionId,
          [Query.limit(300)]
        );

        const docs = res.documents;
        // console.log("Fetched Team Docs:", docs); // For debugging

        /* ---- HELPER ---- */
        const normalize = (str) => (str || '').toLowerCase().trim();

        /* ---- STUDENTS ---- */
        const studentDocs = docs.filter(d => normalize(d.category) === 'students' || normalize(d.category) === 'student');

        /* ---- ORGANIZING (FACULTY) ---- */
        const orgDocs = docs.filter(d => normalize(d.category) === 'organizing' || normalize(d.category) === 'faculty');

        /* ---- ROLE-BASED SPLIT ---- */
        const conv = orgDocs.find(d => normalize(d.role).includes('convener'));

        const coConvs = orgDocs.filter(d => normalize(d.role).includes('co-convener') || normalize(d.role).includes('co convener'));

        // Determine who is left in organizing (not convener or co-convener)
        const restOrganizing = orgDocs.filter(d => {
          const r = normalize(d.role);
          return !r.includes('convener') && !r.includes('co-convener') && !r.includes('co convener');
        });

        setConvenor(conv || null);
        setCoConvenors(coConvs);
        setOrganizing(restOrganizing);
        setStudents(studentDocs);
      } catch (err) {
        console.error('Failed to fetch team data:', err);
        // Fallback or alert if needed
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  /* ---------------- RENDER ---------------- */

  return (
    <div className="relative min-h-screen w-full bg-[#05010a] flex flex-col overflow-x-hidden">
      <Header />
      <Background3D />

      <main className="flex-1 w-full pt-40 pb-20 px-4 md:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* TITLE */}
          <div className="text-center mb-24">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mb-6 uppercase tracking-widest drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]">
              Meet The Team
            </h1>
            <p className="text-purple-200/80 text-xl max-w-2xl mx-auto">
              The minds behind AdVITya 2026.
            </p>
          </div>

          {/* LEADERSHIP */}
          <SectionContainer>
            <SectionTitle title="Our Leadership" />
            <div className="flex flex-wrap justify-center gap-12 mb-16">
              <div className="w-80">
                <TeamCardSimple {...chancellor} />
              </div>
              {vps.map((p, i) => (
                <div key={i} className="w-72">
                  <TeamCardSimple {...p} />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-16">
              {others.map((p, i) => (
                <div key={i} className="w-72">
                  <TeamCardSimple {...p} />
                </div>
              ))}
            </div>
          </SectionContainer>

          {/* CONVENOR */}
          {convenor && (
            <SectionContainer>
              <SectionTitle title="Convener" />
              <div className="w-72">
                <TeamCardSimple {...convenor} />
              </div>
            </SectionContainer>
          )}

          {/* CO-CONVENORS */}
          {coConvenors.length > 0 && (
            <SectionContainer>
              <SectionTitle title="Co-Conveners" />
              <div className="flex flex-wrap justify-center gap-12">
                {coConvenors.map(m => (
                  <div key={m.$id} className="w-72">
                    <TeamCardSimple {...m} />
                  </div>
                ))}
              </div>
            </SectionContainer>
          )}

          {/* ORGANIZING */}
          {organizing.length > 0 && (
            <SectionContainer>
              <SectionTitle title="Organizing Committee" />
              <div className="flex flex-wrap justify-center gap-10">
                {organizing.map(m => (
                  <div key={m.$id} className="w-64">
                    <TeamCardSimple {...m} />
                  </div>
                ))}
              </div>
            </SectionContainer>
          )}

          {/* STUDENTS */}
          {students.length > 0 && (
            <SectionContainer>
              <SectionTitle title="Student Council" />
              <div className="flex flex-wrap justify-center gap-8">
                {students.map(m => (
                  <div key={m.$id} className="w-60">
                    <TeamCardSimple {...m} />
                  </div>
                ))}
              </div>
            </SectionContainer>
          )}

          {loading && (
            <p className="text-center text-purple-300 mt-20">
              Loading team data…
            </p>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Team;