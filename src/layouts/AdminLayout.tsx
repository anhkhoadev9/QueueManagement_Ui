import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
const API_BASE_URL = import.meta.env.API_BASE_URL;
  const navItems = [
    { path: '/teller', label: 'Quầy giao dịch', icon: <Users className="w-5 h-5" />, exact: true },
    { path: '/admin', label: 'Quản lý Dịch vụ', icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
    { path: '/admin/feedbacks', label: 'Đánh giá', icon: <MessageSquare className="w-5 h-5" />, exact: false },
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
        await fetch(`${API_BASE_URL}/auth/logout`, {
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-vietin-blue text-white shadow-xl flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-wider">KSmart</h1>
          <p className="text-sm text-vietin-lightBlue mt-1">Queue Management</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  active 
                    ? 'bg-vietin-darkBlue border-l-4 border-vietin-red' 
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
            <div className="w-8 h-8 rounded-full bg-white text-vietin-blue flex items-center justify-center font-bold text-sm">
              {getUserInitials()}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm truncate">{user?.fullName || 'Admin User'}</p>
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-1 text-xs text-vietin-red font-medium hover:underline mt-1 disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Đang đăng xuất...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-3 h-3" />
                    <span>Đăng xuất</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center px-8 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {getCurrentPageTitle()}
          </h2>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};


export default AdminLayout;