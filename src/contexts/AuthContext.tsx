
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthUser {
  userId: string;
  email: string;
  fullName?: string; // Đổi thành fullName (viết thường) để dễ dùng trong component
  role?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple JWT decoding (base64)
const peekJwt = (token: string): any => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
};

// Hàm lấy role từ token
const getRoleFromToken = (token: string): string | null => {
  const decoded = peekJwt(token);
  
  
  if (decoded) {
    const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
                 decoded['role'] ||
                 decoded['Role'] ||
                 null;
    
    
    return role;
  }
  return null;
};

// API base URL
const VITE_API_BASE_URL =
  window.location.hostname === "localhost"
    ? "https://localhost:7164/api"
    : `${import.meta.env.VITE_API_BASE_URL}`;

// Tạo axios instance với interceptor để tự động gắn token
const apiClient = axios.create({
  baseURL: VITE_API_BASE_URL,
});

// Interceptor để tự động thêm token vào header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Hàm lấy thông tin user từ API
  const fetchUserInfo = async (userId: string, token: string): Promise<AuthUser | null> => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      const userData = response.data;
      
      // Lấy role từ token
      const role = getRoleFromToken(token);
       
      
      // Map dữ liệu từ API response (UserDto)
      return {
        userId: userData.Id || userData.id || userId, // Lấy Id (viết hoa I)
        email: userData.Email || userData.email || '', // Lấy Email (viết hoa E)
        fullName: userData.FullName || userData.fullName || '', // Lấy FullName (viết hoa F)
        phoneNumber: userData.PhoneNumber || userData.phoneNumber || '', // Lấy PhoneNumber (viết hoa P)
        role: role || userData.Role || userData.role || '',
      };
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // Nếu API fail, vẫn dùng thông tin từ JWT
      const decoded = peekJwt(token);
      const role = getRoleFromToken(token);
      
      
      return {
        userId: userId,
        email: decoded?.email || decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
        fullName: decoded?.name || decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
        role: role || '',
      };
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decoded = peekJwt(token);
        if (decoded) {
          // Lấy userId từ claim 'sub' trong token
          const userId = decoded.sub || 
                        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
                        decoded.nameid;
          
          console.log('UserId from token:', userId);
          
          if (userId) {
            const userInfo = await fetchUserInfo(userId, token);
            console.log('Final user info:', userInfo);
            setUser(userInfo);
          } else {
            console.warn('No userId found in token');
            const role = getRoleFromToken(token);
            setUser({
              userId: '',
              email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
              fullName: decoded.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
              role: role || '',
            });
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (token: string) => {
    console.log('Login - Received token:', token.substring(0, 50) + '...');
    
    localStorage.setItem('accessToken', token);
    const decoded = peekJwt(token);
    console.log('Login - Decoded JWT:', decoded);
    
    // Lấy role ngay lập tức từ token
    const role = getRoleFromToken(token);
    console.log('Login - Extracted role:', role);
    
    // Lưu role vào localStorage để dùng sau
    if (role) {
      localStorage.setItem('userRole', role);
    }
    
    // Lấy userId từ token
    const userId = decoded?.sub;
                  
    
    console.log('Login - UserId from token:', userId);
    
    if (userId) {
      // Gọi API lấy thông tin chi tiết user
      const userInfo = await fetchUserInfo(userId, token);
      console.log('Login - Final user info:', userInfo);
      setUser(userInfo);
      
      // Lưu thêm thông tin vào localStorage nếu cần
      if (userInfo) {
        localStorage.setItem('userFullName', userInfo.fullName || '');
        localStorage.setItem('userEmail', userInfo.email || '');
        localStorage.setItem('userPhone', userInfo.phoneNumber || '');
        console.log('FullName:', userInfo.fullName); // Debug log
      }
    } else {
      console.warn('No userId found in token');
      setUser({
        userId: '',
        email: decoded?.email || decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
        fullName: decoded?.name || decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
        role: role || '',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    // localStorage.removeItem('userFullName');
    // localStorage.removeItem('userEmail');
    // localStorage.removeItem('userPhone');
    setUser(null);
  };

  const userRole = user?.role || localStorage.getItem('userRole') || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};