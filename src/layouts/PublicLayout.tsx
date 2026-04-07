

// // export default PublicLayout;
// import { Outlet, Link, useNavigate } from 'react-router-dom';
// import { useState, useRef, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { User, LogOut, Key, ChevronDown } from 'lucide-react';
// import ChangePasswordModal from '../components/ChangePasswordModal';

// const VITE_API_BASE_URL = 'https://queuemanagement-hjaj.onrender.com/api/v1';

// const PublicLayout = () => {
//   const { user, isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const [showChangePassword, setShowChangePassword] = useState(false);
//   const [changePasswordLoading, setChangePasswordLoading] = useState(false);
// const [isChangingPassword, setIsChangingPassword] = useState(false);
//   // Close dropdown on click outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setDropdownOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     console.log("Fullname:", user?.fullName);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };
// const handleChangePassword = async (currentPassword: string, newPassword: string) => {
//   const token = localStorage.getItem('accessToken');
  
//   if (!token) {
//     throw new Error('Vui lòng đăng nhập lại');
//   }

//   try {
//     setChangePasswordLoading(true);
    
//     const response = await fetch(`${VITE_API_BASE_URL}/auth/change-password`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         OldPassword: currentPassword,
//         NewPassword: newPassword
//       })
//     });

//     console.log('Response status:', response.status);
    
//     // Nếu thành công (status 200, 201, 204)
//     if (response.ok) {
//       // Kiểm tra xem có content không trước khi parse JSON
//       const contentLength = response.headers.get('content-length');
//       const contentType = response.headers.get('content-type');
      
//       // Nếu có content và là JSON thì parse, không thì chỉ xử lý thành công
//       if (contentLength !== '0' && contentType?.includes('application/json')) {
//         const data = await response.json();
//         console.log('Change password success:', data);
//       } else {
//         console.log('Change password success (no content)');
//       }
      
//       logout();
//       navigate('/login');
//       return;
//     }

//     // Xử lý lỗi
//     const errorText = await response.text();
//     console.log('Error response:', errorText);
    
//     let errorMessage = 'Đổi mật khẩu thất bại';
    
//     // Chỉ parse JSON nếu có content
//     if (errorText && errorText.trim()) {
//       try {
//         const errorData = JSON.parse(errorText);
//         console.log('Parsed error data:', errorData);
        
//         // Xử lý validation errors
//         if (errorData.errors) {
//           const allErrors = Object.values(errorData.errors).flat();
//           errorMessage = allErrors.join('\n');
//         } else if (errorData.message) {
//           errorMessage = errorData.message;
//         } else if (errorData.title) {
//           errorMessage = errorData.title;
//         }
//       } catch (parseError) {
//         console.error('Parse error:', parseError);
//         errorMessage = errorText || errorMessage;
//       }
//     }
    
//     // Kiểm tra lỗi mật khẩu cũ
//     if (errorMessage.toLowerCase().includes('incorrect') || 
//         errorMessage.toLowerCase().includes('old password')) {
//       throw new Error('Mật khẩu hiện tại không đúng');
//     }
    
//     throw new Error(errorMessage);
    
//   } catch (error: any) {
//     console.error('Change password error:', error);
//     throw error;
//   } finally {
//     setChangePasswordLoading(false);
//   }
// };
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-vietin-lightBlue/30 to-gray-100 flex flex-col relative overflow-hidden">
//       {/* Abstract Background Decoration */}
//       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-vietin-lightBlue/50 rounded-full blur-[120px] pointer-events-none"></div>
//       <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-vietin-blue/10 rounded-full blur-[150px] pointer-events-none"></div>

//       {/* Premium Header */}
//       <header className="sticky top-0 z-50 glassmorphism-dark !bg-vietin-darkBlue/95 border-b-0 shadow-2xl">
//         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
//           <div className="flex items-center space-x-6">
//             <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
//               <Link to="/">K<span className="text-vietin-lightBlue">Smart</span></Link>
//             </h1>
//             <div className="h-8 w-px bg-white/20"></div>
//             <span className="text-lg font-medium tracking-wide text-white/90 hidden sm:inline">Hệ thống xếp hàng tự động</span>
//           </div>

//           <div className="flex items-center space-x-4">
//             {/* Hotline (Hidden on very small screens) */}
//             <div className="hidden md:flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md">
//               <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
//               <span className="text-sm font-semibold text-white tracking-wide">
//                 Hotline: 0934 378 953
//               </span>
//             </div>

//             {/* Authentication Section */}
//             {!isAuthenticated ? (
//               <div className="flex space-x-3">
//                 <Link to="/login" className="px-4 py-2 rounded-full text-white text-sm font-semibold hover:bg-white/10 transition-colors border border-transparent">
//                   Đăng nhập
//                 </Link>
//                 <Link to="/register" className="px-4 py-2 rounded-full bg-vietin-blue text-white text-sm font-semibold hover:bg-vietin-lightBlue transition-colors border border-vietin-lightBlue shadow-lg shadow-vietin-blue/30">
//                   Đăng ký
//                 </Link>
//               </div>
//             ) : (
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   onClick={() => setDropdownOpen(!dropdownOpen)}
//                   className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full border border-white/20 backdrop-blur-md transition-all text-white focus:outline-none"
//                 >
//                   <div className="w-8 h-8 rounded-full bg-vietin-blue flex items-center justify-center">
//                     <User className="w-5 h-5" />
//                   </div>
//                   <span className="text-sm font-semibold max-w-[120px] truncate">{user?.fullName || user?.email?.split('@')[0] || 'User'}</span>
//                   <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
//                 </button>

//                 {/* Dropdown Menu */}
//                 {dropdownOpen && (
//                   <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 border border-gray-100 z-50">
//                     <div className="p-4 border-b border-gray-100">
//                       <p className="text-sm text-gray-800 font-bold truncate">
//                         {user?.fullName || user?.email?.split('@')[0] || 'User'}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-0.5">
//                         {user?.role === 'Admin' ? 'Quản trị viên' : 'Thành viên'}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-1 truncate">
//                         {user?.email}
//                       </p>
//                     </div>
//                     <div className="p-2">
//                       {/* Nút Đổi mật khẩu */}
//                       <button
//                         onClick={() => {
//                           setDropdownOpen(false);
//                           setShowChangePassword(true);
//                         }}
//                         className="w-full flex items-center space-x-2 px-3 py-2.5 text-sm text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
//                       >
//                         <Key className="w-4 h-4" />
//                         <span>Đổi mật khẩu</span>
//                       </button>

//                       {/* Nút Đăng xuất */}
//                       <button
//                         onClick={handleLogout}
//                         className="w-full flex items-center space-x-2 px-3 py-2.5 text-sm text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors mt-1"
//                       >
//                         <LogOut className="w-4 h-4" />
//                         <span>Đăng xuất</span>
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Embedded Content */}
//       <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 relative z-10 flex flex-col">
//         <Outlet />
//       </main>

//       {/* Footer Element */}
//      <footer className="py-6 text-center text-sm text-gray-400 font-medium relative z-10">
//   <div className="space-y-1">
//     <p>© {new Date().getFullYear()} KSmart - Hệ thống quản lý xếp hàng tự động</p>
//     <p className="text-xs">Hotline hỗ trợ: 0934 378 953 | Email: huynhanhkhoa30042019@gmail.com</p>
//     <p className="text-xs">Phát triển bởi: Huỳnh Anh Khoa</p>
//   </div>
// </footer>

//       {/* Change Password Modal */}
//       <ChangePasswordModal
//         isOpen={showChangePassword}
//         onClose={() => setShowChangePassword(false)}
//         onSubmit={handleChangePassword}
//       />
//     </div>
//   );
// };

// export default PublicLayout;
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Key, ChevronDown } from 'lucide-react';
import ChangePasswordModal from '../components/ChangePasswordModal';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const VITE_API_BASE_URL = 'https://queuemanagement-hjaj.onrender.com/api/v1';

const PublicLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    try {
      setIsChangingPassword(true);
      
      const response = await fetch(`${VITE_API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          OldPassword: currentPassword,
          NewPassword: newPassword
        })
      });

      console.log('Response status:', response.status);
      
      // Nếu thành công (status 200, 201, 204)
      if (response.ok) {
        // Kiểm tra xem có content không trước khi parse JSON
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type');
        
        // Nếu có content và là JSON thì parse, không thì chỉ xử lý thành công
        if (contentLength !== '0' && contentType?.includes('application/json')) {
          const data = await response.json();
          console.log('Change password success:', data);
        } else {
          console.log('Change password success (no content)');
        }
        
        logout();
        navigate('/login');
        return;
      }

      // Xử lý lỗi
      const errorText = await response.text();
      console.log('Error response:', errorText);
      
      let errorMessage = 'Đổi mật khẩu thất bại';
      
      // Chỉ parse JSON nếu có content
      if (errorText && errorText.trim()) {
        try {
          const errorData = JSON.parse(errorText);
          console.log('Parsed error data:', errorData);
          
          // Xử lý validation errors
          if (errorData.errors) {
            const allErrors = Object.values(errorData.errors).flat();
            errorMessage = allErrors.join('\n');
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.title) {
            errorMessage = errorData.title;
          }
        } catch (parseError) {
          console.error('Parse error:', parseError);
          errorMessage = errorText || errorMessage;
        }
      }
      
      // Kiểm tra lỗi mật khẩu cũ
      if (errorMessage.toLowerCase().includes('incorrect') || 
          errorMessage.toLowerCase().includes('old password')) {
        throw new Error('Mật khẩu hiện tại không đúng');
      }
      
      throw new Error(errorMessage);
      
    } catch (error: any) {
      console.error('Change password error:', error);
      throw error;
    } finally {
      setIsChangingPassword(false);
    }
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
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              <Link to="/">K<span className="text-vietin-lightBlue">Smart</span></Link>
            </h1>
            <div className="h-8 w-px bg-white/20"></div>
            <span className="text-lg font-medium tracking-wide text-white/90 hidden sm:inline">Hệ thống xếp hàng tự động</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Hotline (Hidden on very small screens) */}
            <div className="hidden md:flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-sm font-semibold text-white tracking-wide">
                Hotline: 0934 378 953
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
                  <span className="text-sm font-semibold max-w-[120px] truncate">{user?.fullName || user?.email?.split('@')[0] || 'User'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 border border-gray-100 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm text-gray-800 font-bold truncate">
                        {user?.fullName || user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {user?.role === 'Admin' ? 'Quản trị viên' : 'Thành viên'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-2">
                      {/* Nút Đổi mật khẩu */}
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setShowChangePassword(true);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2.5 text-sm text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <Key className="w-4 h-4" />
                        <span>Đổi mật khẩu</span>
                      </button>

                      {/* Nút Đăng xuất */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-3 py-2.5 text-sm text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors mt-1"
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
        <div className="space-y-1">
          <p>© {new Date().getFullYear()} KSmart - Hệ thống quản lý xếp hàng tự động</p>
          <p className="text-xs">Hotline hỗ trợ: 0934 378 953 | Email: huynhanhkhoa30042019@gmail.com</p>
          <p className="text-xs">Phát triển bởi: Huỳnh Anh Khoa</p>
        </div>
      </footer>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSubmit={handleChangePassword}
        isLoading={isChangingPassword}
      />
    </div>
  );
};

export default PublicLayout;