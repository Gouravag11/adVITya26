import Header from '../components/Header';
import Footer from '../components/Footer';
import Background3D from '../components/Background3D';
import Team3DCard from '../components/Team/Team3DCard';
import { motion } from 'framer-motion';

const SectionTitle = ({ title }) => (
  <motion.h2
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mb-12 text-center uppercase tracking-widest drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
  >
    {title}
  </motion.h2>
);

const SectionContainer = ({ children, delay = 0 }) => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="relative z-10 w-full flex flex-col items-center"
  >
    {children}
  </motion.section>
);

function Team() {
  const chancellor = { name: "Dr. G. Vishwanathan", role: "Chancellor", image: "/Chancellor.jpg" };
  const vps = [
    { name: "Mr. Sankar Viswanathan", role: "Vice President", image: "/VP.jpg" },
    { name: "Mrs. Kadhambari S Viswanathan", role: "Assistant Vice President", image: "/AVP.jpg" },
  ];
  const others = [
    { name: "Prof. T. B. Sridharan", role: "Pro-Vice Chancellor", image: "/Pro_VC.jpg" },
    { name: "Mr. K.K. Nair", role: "Acting Registrar", image: "/Registrar.jpg" },
  ];

  const convenor = { name: "Dr. Pushpdant Jain", role: "Convener", image: null };
  const coConvenors = [
    { name: "Dr. Saurav Prasad", role: "Co-convener", image: null },
    { name: "Dr. Gunjan Ansari", role: "Co-convener", image: null },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#05010a] flex flex-col font-sans overflow-x-hidden">
      <Header />

      {/* 3D Background */}
      <Background3D />

      <main className="flex-1 w-full pt-40 pb-20 px-4 md:px-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-24">

          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center mb-16 relative"
          >
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-[0_0_25px_rgba(192,132,252,0.6)]">
              MEET <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-gradient-x">THE TEAM</span>
            </h1>
            <p className="text-purple-200/80 text-xl max-w-2xl mx-auto font-light tracking-wide">
              The architects of the future. The minds behind AdVITya 2026.
            </p>
          </motion.div>

          {/* Leadership Section - 1-2-2 Grid */}
          <SectionContainer>
            <SectionTitle title="Our Leadership" />

            {/* Row 1: Chancellor */}
            <div className="flex justify-center w-full mb-10">
              <div className="w-80"> {/* Slightly larger for Chancellor? Or keep w-64. User said "card in middle". I'll keep regular size to be safe. */}
                <Team3DCard {...chancellor} />
              </div>
            </div>

            {/* Row 2: VPs */}
            <div className="flex flex-wrap justify-center gap-20 mb-10"> {/* Increased gap for better spacing */}
              {vps.map((leader, idx) => (
                <div key={idx} className="w-64">
                  <Team3DCard {...leader} />
                </div>
              ))}
            </div>

            {/* Row 3: Others */}
            <div className="flex flex-wrap justify-center gap-20">
              {others.map((leader, idx) => (
                <div key={idx} className="w-64">
                  <Team3DCard {...leader} />
                </div>
              ))}
            </div>

          </SectionContainer>

          {/* Convenor Section */}
          <SectionContainer delay={0.1}>
            <SectionTitle title="Convener" />
            <div className="flex justify-center">
              <div className="max-w-xs w-64">
                <Team3DCard {...convenor} />
              </div>
            </div>
          </SectionContainer>

          {/* Co-Convenors Section */}
          <SectionContainer delay={0.2}>
            <SectionTitle title="Co-Conveners" />
            <div className="flex flex-wrap justify-center gap-8">
              {coConvenors.map((member, idx) => (
                <div key={idx} className="w-64">
                  <Team3DCard {...member} />
                </div>
              ))}
            </div>
          </SectionContainer>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Team;
