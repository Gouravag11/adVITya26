import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './components/Events/EventsPage';
import CategoryEvents from './components/Events/CategoryEventsPage';
import Register from './components/Events/RegisterPage';
import Dashboard from './pages/Dashboard';
import Team from './pages/Team';
import Sponsor from './pages/Sponsor';
import Sportfest from './pages/Sportfest';
import { UIProvider, useUI } from './contexts/UIContext';

import { ReactLenis } from 'lenis/react';

function AppContent() {
  const location = useLocation();
  const { headerVisible } = useUI();
  const isHomePage = location.pathname === '/';

  // Show header: on homepage only when headerVisible is true, on other pages always show
  const shouldShowHeader = isHomePage ? headerVisible : true;

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowHeader && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:category" element={<CategoryEvents />} />
          <Route path="/register/:eventId" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/team" element={<Team />} />
          <Route path="/sponsor" element={<Sponsor />} />
          <Route path="/sportfest" element={<Sportfest />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ReactLenis root>
      <Router>
        <UIProvider>
          <AppContent />
        </UIProvider>
      </Router>
    </ReactLenis>
  );
}

export default App;
