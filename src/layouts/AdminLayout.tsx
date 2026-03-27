import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/teller', label: 'Quầy giao dịch', icon: <Users className="w-5 h-5" /> },
    { path: '/admin', label: 'Quản lý Dịch vụ', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/admin/feedbacks', label: 'Đánh giá', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-vietin-blue text-white shadow-xl flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-wider">VietinBank</h1>
          <p className="text-sm text-vietin-lightBlue mt-1">Queue Management</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
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
            <div className="w-8 h-8 rounded-full bg-white text-vietin-blue flex items-center justify-center font-bold">
              AD
            </div>
            <div>
              <p className="font-medium text-sm">Admin User</p>
              <Link to="/login" className="text-xs text-vietin-red font-medium hover:underline">Đăng xuất</Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center px-8 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {navItems.find(i => location.pathname.startsWith(i.path))?.label || 'Dashboard'}
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
