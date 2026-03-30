import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    userName: '',
    phoneNumber: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams({
        FullName: formData.fullName,
        Email: formData.email,
        UserName: formData.userName,
        PhoneNumber: formData.phoneNumber,
        DateOfBirth: formData.dateOfBirth,
        Password: formData.password,
        ConfirmPassword: formData.confirmPassword
      }).toString();

      const response = await fetch(`${VITE_API_BASE_URL}/auth/register?${queryParams}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || errData?.title || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center animate-in fade-in zoom-in duration-300">
           <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
           </div>
           <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng ký thành công!</h2>
           <p className="text-gray-600">Đang chuyển hướng về trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-vietin-blue px-8 py-5 text-center">
          <h1 className="text-2xl font-bold text-white tracking-widest">Đăng ký tài khoản</h1>
          <p className="text-vietin-lightBlue text-sm mt-1 opacity-90">Hệ Thống Xếp Hàng Barber / Salon</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-vietin-red border border-red-200 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input required name="fullName" value={formData.fullName} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none transition-all" placeholder="Nguyễn Văn A" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập <span className="text-red-500">*</span></label>
                  <input required name="userName" value={formData.userName} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none transition-all" placeholder="nguyenvana123" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none transition-all" placeholder="email@example.com" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <input required name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} type="tel" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none transition-all" placeholder="0912345678" />
               </div>
               
               <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh <span className="text-red-500">*</span></label>
                  <input required name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} type="date" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none transition-all" />
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
                  <input required name="password" value={formData.password} onChange={handleChange} type="password" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none transition-all" placeholder="••••••••" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
                  <input required name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none transition-all" placeholder="••••••••" />
               </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isLoading}
                className="block w-full py-3 px-4 bg-vietin-blue hover:bg-vietin-darkBlue active:scale-[0.98] transition-all text-white text-center font-bold rounded-lg shadow-md disabled:bg-gray-400"
              >
                {isLoading ? 'Đang xử lý...' : 'Tạo tài khoản'}
              </button>
            </div>
            
            <div className="text-center mt-4">
               <span className="text-gray-600 text-sm">Đã có tài khoản? </span>
               <Link to="/login" className="text-vietin-blue hover:text-vietin-darkBlue font-semibold text-sm transition-colors">Đăng nhập</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
