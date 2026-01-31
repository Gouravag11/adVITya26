import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUI } from '@/contexts/UIContext';
import { useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const { user, logout } = useAuth();
  const { openHeader } = useUI();

  if (isDashboard) return null;

  return (
    <footer className="bg-[#12001A] z-50 text-white py-16 px-8 md:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">

          {/* Left Section - QR Code */}
          <div className="flex flex-col gap-4">
            <span className="text-[#6B5B7A] text-xs font-medium tracking-[0.2em] uppercase">
              Scan to know more
            </span>
            <div className="w-40 h-40 bg-[#CDB7D9] rounded-xl p-2">
              {/* QR Code placeholder - replace with actual QR code image */}
              <img
                src="/Images/QR.png"
                alt="QR Code"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Center Section - Sitemap */}
          <div className="flex flex-col items-center gap-6">
            <span className="text-[#6B5B7A] text-xs font-medium tracking-[0.2em] uppercase">
              Sitemap
            </span>
            <nav className="flex flex-col items-center gap-3">
              <Link
                to="/"
                className="text-[#6B5B7A] text-xl md:text-2xl font-bold tracking-wide hover:text-[#CDB7D9] transition-colors uppercase"
              >
                Home
              </Link>
              <Link
                to="/events"
                className="text-[#6B5B7A] text-xl md:text-2xl font-bold tracking-wide hover:text-[#CDB7D9] transition-colors uppercase"
              >
                Events
              </Link>
              <Link
                to="/sportfest"
                className="text-[#6B5B7A] text-xl md:text-2xl font-bold tracking-wide hover:text-[#CDB7D9] transition-colors uppercase"
              >
                Sports Fest
              </Link>
              <Link
                to="/sponsor"
                className="text-[#6B5B7A] text-xl md:text-2xl font-bold tracking-wide hover:text-[#CDB7D9] transition-colors uppercase"
              >
                Sponsor Us
              </Link>
              <Link
                to="/team"
                className="text-[#6B5B7A] text-xl md:text-2xl font-bold tracking-wide hover:text-[#CDB7D9] transition-colors uppercase"
              >
                Our Team
              </Link>
            </nav>
          </div>

          {/* Right Section - Contact Us */}
          <div className="flex flex-col gap-4">
            <span className="text-[#6B5B7A] text-xs font-medium tracking-[0.2em] uppercase">
              Contact Us
            </span>
            <div className="w-64 h-32 bg-[#1E1525] rounded-2xl">
              {/* Contact form or map placeholder */}
            </div>
          </div>

        </div>

        {/* Bottom Section - Auth & Copyright */}
        <div className="mt-16 pt-8 border-t border-[#2a1f33] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 text-xs text-[#6B5B7A] font-medium tracking-wider">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-[#CDB7D9] transition-colors uppercase">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="hover:text-[#CDB7D9] transition-colors cursor-pointer uppercase"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => openHeader('login')}
                className="hover:text-[#CDB7D9] transition-colors cursor-pointer uppercase"
              >
                Login
              </button>
            )}
          </div>
          <div className="text-sm text-[#6B5B7A]">
            AdVITya © 2026. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
