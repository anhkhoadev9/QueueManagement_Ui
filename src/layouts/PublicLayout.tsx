import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, ChevronDown } from 'lucide-react';

const PublicLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    console.log("Fullname:", user?.fullName);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-vietin-lightBlue/30 to-gray-100 flex flex-col relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-vietin-lightBlue/50 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-vietin-blue/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Premium Header */}
      <header className="sticky top-0 z-50 glassmorphism-dark !bg-vietin-darkBlue/95 border-b-0 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
              <Link to="/">Vietin<span className="text-vietin-lightBlue">Bank</span></Link>
            </h1>
            <div className="h-8 w-px bg-white/20"></div>
            <span className="text-lg font-medium tracking-wide text-white/90 hidden sm:inline">Hệ thống xếp hàng tự động</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Hotline (Hidden on very small screens) */}
            <div className="hidden md:flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm font-semibold text-white tracking-wide">
                Hotline: 1900 558 868
              </span>
            </div>

            {/* Authentication Section */}
            {!isAuthenticated ? (
              <div className="flex space-x-3">
                <Link to="/login" className="px-4 py-2 rounded-full text-white text-sm font-semibold hover:bg-white/10 transition-colors border border-transparent">
                  Đăng nhập
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-full bg-vietin-blue text-white text-sm font-semibold hover:bg-vietin-lightBlue transition-colors border border-vietin-lightBlue shadow-lg shadow-vietin-blue/30">
                  Đăng ký
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full border border-white/20 backdrop-blur-md transition-all text-white focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-vietin-blue flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold max-w-[120px] truncate">{user?.fullName || 'User'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 border border-gray-100 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm text-gray-800 font-bold truncate">{user?.email}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Thành viên</p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2.5 text-sm text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Embedded Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 relative z-10 flex flex-col">
        <Outlet />
      </main>
      
      {/* Footer Element */}
      <footer className="py-6 text-center text-sm text-gray-400 font-medium relative z-10">
        © {new Date().getFullYear()} Ngân hàng TMCP Công Thương Việt Nam (VietinBank). All rights reserved.
      </footer>
    </div>
  );
};

export default PublicLayout;
