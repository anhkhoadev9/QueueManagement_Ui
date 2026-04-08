
// export default LoginPage;
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

//const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const VITE_GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
// Các component nhỏ để tái sử dụng
const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Alert = ({ children, type = 'error' }: { children: React.ReactNode; type?: 'error' | 'success' | 'info' }) => {
  const colors = {
    error: 'bg-red-50 text-red-600 border-red-200',
    success: 'bg-green-50 text-green-600 border-green-200',
    info: 'bg-blue-50 text-blue-600 border-blue-200'
  };
  
  return (
    <div className={`mb-4 p-3 ${colors[type]} border rounded-lg text-sm text-center font-medium`}>
      {children}
    </div>
  );
};

// Modal component cho forgot password
const ForgotPasswordModal = ({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (email: string) => Promise<void>;
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Vui lòng nhập email' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      await onSubmit(email);
      setMessage({ type: 'success', text: 'Link đặt lại mật khẩu đã được gửi đến email của bạn!' });
      setTimeout(() => {
        onClose();
        setEmail('');
        setMessage(null);
      }, 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Gửi yêu cầu thất bại' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quên mật khẩu</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email đăng ký</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none"
                placeholder="example@email.com"
                disabled={loading}
              />
            </div>
            {message && (
              <Alert type={message.type}>{message.text}</Alert>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-vietin-blue text-white rounded-lg hover:bg-vietin-darkBlue disabled:bg-gray-400 transition-colors flex items-center justify-center"
              >
                {loading ? <LoadingSpinner /> : 'Gửi yêu cầu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Modal component cho change password
const ChangePasswordModal = ({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(currentPassword, newPassword);
      onClose();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setError(error.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Đổi mật khẩu</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            {error && <Alert type="error">{error}</Alert>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-vietin-blue text-white rounded-lg hover:bg-vietin-darkBlue disabled:bg-gray-400 transition-colors flex items-center justify-center"
              >
                {loading ? <LoadingSpinner /> : 'Đổi mật khẩu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Component chính LoginPage
const LoginPage = () => {
  const navigate = useNavigate();
  const { login, userRole, logout } = useAuth();
  const [loginInfo, setLoginInfo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && userRole) {
      // Redirect based on role
      if (userRole === 'Admin') {
        navigate('/teller');
      } else {
        navigate('/kiosk');
      }
    }
  }, [navigate, userRole]);

  // Handle login with role-based redirection
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginInfo || !password) {
      setError('Vui lòng nhập tài khoản và mật khẩu.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      
      const response = await fetch(`${VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginInfo, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        // Backend trả về dạng { "Error": "...", "Details": "..." }
        throw new Error(errorData?.Details || errorData?.message || errorData?.error || 'Đăng nhập thất bại. Sai tài khoản hoặc mật khẩu.');
      }

      const data = await response.json();
      
      const token = data.accessToken || data.AccessToken || data.token;
      const refreshToken = data.refreshToken || data.RefreshToken;
      
      if (token) {
        await login(token, refreshToken);
      }

      // Wait for role to be updated
      setTimeout(() => {
        const role = localStorage.getItem('userRole') || userRole;
        console.log("User role after login:", role);
        
        // Role-based redirection
        if (role === 'Admin') {
          navigate('/teller');
        } else {
          navigate('/kiosk');
        }
      }, 100);
      
    } catch (err: any) {
      let errorMessage = err.message || 'Lỗi kết nối máy chủ.';
      
      // Chuẩn hóa thông báo tiếng Việt
      if (errorMessage.includes('Account is locked')) {
        errorMessage = 'Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần. Vui lòng thử lại sau 2 phút.';
      } else if (errorMessage.includes('Invalid login info') || errorMessage.includes('Wrong password') || errorMessage.includes('Invalid credentials')) {
        errorMessage = 'Tên tài khoản hoặc mật khẩu không chính xác.';
      } else if (errorMessage.includes('User not found')) {
        errorMessage = 'Tài khoản không tồn tại trong hệ thống.';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
const handleGoogleLogin = () => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${VITE_GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${VITE_GOOGLE_REDIRECT_URI }` +
    `&response_type=code` +
    `&scope=openid email profile`+
    `&prompt=select_account`;

  window.location.href = url;
 
};
  // Handle forgot password
  const handleForgotPassword = async (email: string) => {
    const response = await fetch(`${VITE_API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Gửi yêu cầu thất bại');
    }

    return response.json();
  };

  // Handle change password
  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Vui lòng đăng nhập trước');
    }

    const response = await fetch(`${VITE_API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        currentPassword, 
        newPassword 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Đổi mật khẩu thất bại');
    }

    setSuccessMessage('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-vietin-blue px-8 py-6 text-center">
          <h1 className="text-3xl font-bold text-white tracking-widest">KSmart</h1>
          <p className="text-vietin-lightBlue text-sm mt-2 opacity-90">Quản lý Xếp hàng Thông minh</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Đăng nhập</h2>
          
          {error && <Alert type="error">{error}</Alert>}
          {successMessage && <Alert type="success">{successMessage}</Alert>}
          
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản / Email</label>
              <input 
                type="text" 
                value={loginInfo}
                onChange={(e) => setLoginInfo(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none transition-all"
                placeholder="Nhập tên tài khoản hoặc email"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none transition-all"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Forgot password link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-vietin-blue hover:text-vietin-darkBlue transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-vietin-blue hover:bg-vietin-darkBlue active:scale-[0.98] transition-all text-white text-center font-bold rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner />
                  Đang xử lý...
                </span>
              ) : 'Đăng nhập'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">hoặc</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google Login Button - placeholder */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all text-gray-700 font-semibold rounded-lg shadow-sm disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Đăng nhập với Google
            </button>

            <div className="text-center mt-6">
              <span className="text-gray-600 text-sm">Chưa có tài khoản? </span>
              <Link to="/register" className="text-vietin-blue hover:text-vietin-darkBlue font-semibold text-sm transition-colors">
                Đăng ký ngay
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Modals */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSubmit={handleForgotPassword}
      />

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSubmit={handleChangePassword}
      />
    </div>
  );
};

export default LoginPage;
 