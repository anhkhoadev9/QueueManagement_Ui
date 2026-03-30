// components/ChangePasswordModal.tsx
import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // State cho việc hiển thị mật khẩu
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Hàm validate mật khẩu theo yêu cầu backend
  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!password) {
      errors.push('Mật khẩu không được để trống');
      return { isValid: false, errors };
    }

    // 1. Kiểm tra độ dài tối thiểu 8 ký tự
    if (password.length < 8) {
      errors.push('Mật khẩu phải có ít nhất 8 ký tự');
    }

    // 2. Kiểm tra có ít nhất 1 chữ số
    if (!/\d/.test(password)) {
      errors.push('Mật khẩu phải có ít nhất 1 chữ số (0-9)');
    }

    // 3. Kiểm tra có ít nhất 1 chữ thường
    if (!/[a-z]/.test(password)) {
      errors.push('Mật khẩu phải có ít nhất 1 chữ thường (a-z)');
    }

    // 4. Kiểm tra có ít nhất 1 chữ hoa
    if (!/[A-Z]/.test(password)) {
      errors.push('Mật khẩu phải có ít nhất 1 chữ hoa (A-Z)');
    }

    // 5. Kiểm tra có ít nhất 1 ký tự đặc biệt
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*)');
    }

    return { isValid: errors.length === 0, errors };
  };

  // Tính độ mạnh của mật khẩu
  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/\d/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    const strengths = [
      { text: 'Rất yếu', color: 'bg-red-500', textColor: 'text-red-600' },
      { text: 'Yếu', color: 'bg-orange-500', textColor: 'text-orange-600' },
      { text: 'Trung bình', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
      { text: 'Khá', color: 'bg-blue-500', textColor: 'text-blue-600' },
      { text: 'Mạnh', color: 'bg-green-500', textColor: 'text-green-600' },
      { text: 'Rất mạnh', color: 'bg-green-600', textColor: 'text-green-700' }
    ];
    
    return strengths[score] || strengths[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation cơ bản
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }

    if (newPassword === currentPassword) {
      setError('Mật khẩu mới không được trùng với mật khẩu hiện tại');
      return;
    }

    // Validate mật khẩu mới
    const { isValid, errors } = validatePassword(newPassword);
    if (!isValid) {
      setError(errors.join('\n'));
      return;
    }

    try {
      setLoading(true);
      await onSubmit(currentPassword, newPassword);
      setSuccess('Đổi mật khẩu thành công!');
      setTimeout(() => {
        onClose();
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const passwordValidation = validatePassword(newPassword);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Đổi mật khẩu</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Mật khẩu hiện tại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu hiện tại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none transition-all pr-10"
                  placeholder="Nhập mật khẩu hiện tại"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none transition-all pr-10"
                  placeholder="Nhập mật khẩu mới"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${(passwordValidation.errors.length === 0 ? 100 : (5 - passwordValidation.errors.length) * 20)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${passwordStrength.textColor}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}

              {/* Password requirements list */}
              <div className="mt-2 space-y-1">
                <p className={`text-xs flex items-center gap-1 ${newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                  {newPassword.length >= 8 ? '✓' : '○'} Ít nhất 8 ký tự
                </p>
                <p className={`text-xs flex items-center gap-1 ${/\d/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                  {/\d/.test(newPassword) ? '✓' : '○'} Có ít nhất 1 chữ số (0-9)
                </p>
                <p className={`text-xs flex items-center gap-1 ${/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                  {/[a-z]/.test(newPassword) ? '✓' : '○'} Có ít nhất 1 chữ thường (a-z)
                </p>
                <p className={`text-xs flex items-center gap-1 ${/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                  {/[A-Z]/.test(newPassword) ? '✓' : '○'} Có ít nhất 1 chữ hoa (A-Z)
                </p>
                <p className={`text-xs flex items-center gap-1 ${/[^a-zA-Z0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                  {/[^a-zA-Z0-9]/.test(newPassword) ? '✓' : '○'} Có ít nhất 1 ký tự đặc biệt (!@#$%^&*)
                </p>
              </div>
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-vietin-blue focus:border-vietin-blue outline-none transition-all pr-10"
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  Mật khẩu xác nhận không khớp
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm whitespace-pre-line">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm">
                {success}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || !passwordValidation.isValid}
              className="flex-1 px-4 py-2 bg-vietin-blue text-white rounded-lg hover:bg-vietin-darkBlue disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Đổi mật khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;