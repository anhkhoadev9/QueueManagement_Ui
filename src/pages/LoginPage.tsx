import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = 'https://queuemanagement-hjaj.onrender.com/api/v1';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginInfo, setLoginInfo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Common login handler
  const handleLogin = async (targetPath: string) => {
    if (!loginInfo || !password) {
      setError('Vui lòng nhập tài khoản và mật khẩu.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginInfo, password }),
      });

      if (!response.ok) {
        throw new Error('Đăng nhập thất bại. Sai tài khoản hoặc mật khẩu.');
      }

      const data = await response.json();
      
      const token = data.accessToken || data.AccessToken || data.token;
      if (token) {
        login(token);
      }

      // Navigate based on selected flow
      navigate(targetPath);
      
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-vietin-blue px-8 py-6 text-center">
          <h1 className="text-3xl font-bold text-white tracking-widest">Hệ Thống</h1>
          <p className="text-vietin-lightBlue text-sm mt-2 opacity-90">Quản lý Xếp hàng Barber / Salon</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Đăng nhập</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-vietin-red border border-red-200 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản / Email</label>
              <input 
                type="text" 
                value={loginInfo}
                onChange={(e) => setLoginInfo(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none transition-all"
                placeholder="Nhập tên tài khoản"
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
              />
            </div>

            <div className="pt-4 space-y-3">
              <button 
                type="button"
                onClick={() => handleLogin('/kiosk')}
                disabled={isLoading}
                className="block w-full py-3 px-4 bg-vietin-blue hover:bg-vietin-darkBlue active:scale-[0.98] transition-all text-white text-center font-bold rounded-lg shadow-md disabled:bg-gray-400"
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập & Lấy số thứ tự'}
              </button>
              
              <button 
                type="button"
                onClick={() => handleLogin('/teller')}
                disabled={isLoading}
                className="block w-full py-3 px-4 bg-white border-2 border-vietin-blue text-vietin-blue hover:bg-gray-50 active:scale-[0.98] transition-all text-center font-bold rounded-lg disabled:opacity-50"
              >
                Đăng nhập (Dành cho Admin/Nhân viên)
              </button>
            </div>

            <div className="text-center mt-6">
               <span className="text-gray-600 text-sm">Chưa có tài khoản? </span>
               <Link to="/register" className="text-vietin-blue hover:text-vietin-darkBlue font-semibold text-sm transition-colors">Đăng ký ngay</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


