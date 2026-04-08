import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, LogOut, Monitor, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navItems = [
    { path: '/teller', label: 'Quầy giao dịch', icon: <Users className="w-5 h-5" />, exact: true },
    { path: '/admin', label: 'Quản lý Dịch vụ', icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
    { path: '/feedbacks', label: 'Đánh giá', icon: <MessageSquare className="w-5 h-5" />, exact: false },
    { path: '/kiosk', label: 'Giao diện Kiosk', icon: <Monitor className="w-5 h-5" />, exact: true },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(item => isActive(item));
    return currentItem?.label || 'Dashboard';
  };

  const getUserInitials = () => {
    if (!user?.fullName) return 'AD';
    return user.fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    // 1. Hiển thị dialog xác nhận
    const confirmed = window.confirm('Bạn có chắc chắn muốn đăng xuất?');
    if (!confirmed) return;

    setIsLoggingOut(true);
    
    try {
      // 2. Gọi API logout để revoke refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      const token = localStorage.getItem('accessToken');
      
      if (refreshToken && token) {
        await fetch(`${VITE_API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ refreshToken })
        });
      }
      
      // 3. Clear local storage và context
      logout();
      
      // 4. Chuyển hướng về login
      navigate('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn logout local nếu API fail
      logout();
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-vietin-blue text-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-wider">KSmart</h1>
            <p className="text-sm text-vietin-lightBlue mt-1">Queue Management</p>
          </div>
          <button 
            className="lg:hidden p-1 hover:bg-vietin-darkBlue rounded-md"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  active 
                    ? 'bg-vietin-darkBlue border-l-4 border-vietin-red font-bold' 
                    : 'hover:bg-vietin-darkBlue/50'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-vietin-darkBlue">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-white text-vietin-blue flex items-center justify-center font-bold text-sm">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.fullName || 'Admin User'}</p>
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-1 text-xs text-vietin-red font-medium hover:underline mt-1 disabled:opacity-50"
              >
                {isLoggingOut ? '...' : <><LogOut className="w-3 h-3" /><span>Đăng xuất</span></>}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 truncate">
              {getCurrentPageTitle()}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Hệ thống KSmart</span>
                <span className="text-[10px] text-vietin-blue font-medium italic">Hotline: 0934 378 953</span>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};


export default AdminLayout;