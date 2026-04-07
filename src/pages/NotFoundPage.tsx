import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, RefreshCcw } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <h1 className="text-9xl font-black text-vietin-blue/10">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCcw className="w-24 h-24 text-vietin-blue animate-spin-slow opacity-20" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-gray-800">Ối! Trang không tồn tại</h2>
          <p className="text-gray-500 font-medium">
            Có vẻ như đường dẫn bạn truy cập không đúng hoặc bạn không có quyền xem nội dung này.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-vietin-blue text-white font-bold hover:bg-vietin-darkBlue transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <Home className="w-5 h-5" />
            <span>Về trang chủ</span>
          </button>
        </div>

        <div className="pt-8 border-t border-gray-100 flex justify-center gap-8">
            <div className="flex flex-col items-center opacity-40">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400">KSmart</div>
                <div className="h-1 w-8 bg-vietin-blue mt-1"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
